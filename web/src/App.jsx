import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import data from "./generated/agents-public.json";
import { streamChat, parsePlan, getAccessCode, setAccessCode, ApiError } from "./api.js";

const TEAM = "__team__";
const ORCHESTRATOR = "expert-orchestrator";
const STORE_KEY = "experts21.chats.v1";
const MAX_PARALLEL = 3;

const agents = data.agents;
const byName = Object.fromEntries(agents.map((a) => [a.name, a]));
const experts = agents.filter((a) => a.name !== ORCHESTRATOR);
const domains = [...new Set(experts.map((a) => a.domain))];

function loadChats() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function saveChats(chats) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(chats)); } catch { /* storage full or blocked */ }
}

function Markdown({ text }) {
  return <div className="md"><ReactMarkdown remarkPlugins={[remarkGfm]}>{text || ""}</ReactMarkdown></div>;
}

function ModelBadge({ model }) {
  return <span className={`badge badge-${model}`} title={`Model: ${model}`}>{model}</span>;
}

function Avatar({ agent, size = "md" }) {
  const team = !agent;
  return (
    <span className={`avatar avatar-${size} ${team ? "avatar-team" : `avatar-${agent.model}`}`} aria-hidden="true">
      {team ? "★" : agent.firstName[0]}
    </span>
  );
}

/** Run promises with a concurrency limit. */
async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const idx = i++; results[idx] = await fn(items[idx], idx); }
  });
  await Promise.all(workers);
  return results;
}

export default function App() {
  const [selected, setSelected] = useState(TEAM);
  const [chats, setChats] = useState(loadChats);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [code, setCode] = useState(getAccessCode());
  const abortRef = useRef(null);
  const endRef = useRef(null);

  const agent = selected === TEAM ? null : byName[selected];
  const thread = chats[selected] || [];

  useEffect(() => { saveChats(chats); }, [chats]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [thread.length, busy]);

  const visibleDomains = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return domains.map((d) => ({
      domain: d,
      list: experts.filter((a) => a.domain === d && (!q || `${a.firstName} ${a.role} ${a.name} ${a.voice}`.toLowerCase().includes(q))),
    })).filter((g) => g.list.length);
  }, [filter]);

  function update(key, fn) {
    setChats((prev) => ({ ...prev, [key]: fn(prev[key] || []) }));
  }
  function patchLast(key, patch) {
    update(key, (t) => { const copy = t.slice(); copy[copy.length - 1] = { ...copy[copy.length - 1], ...patch(copy[copy.length - 1]) }; return copy; });
  }

  function select(name) { setSelected(name); setSidebarOpen(false); setError(""); }

  async function askExpert(key, question) {
    const history = (chats[key] || []).filter((m) => m.role === "user" || (m.role === "assistant" && m.content && !m.failed))
      .map((m) => ({ role: m.role, content: m.content }));
    update(key, (t) => [...t, { role: "user", content: question }, { role: "assistant", content: "", pending: true }]);
    await streamChat({ mode: "expert", agent: key, messages: [...history, { role: "user", content: question }] },
      (text) => patchLast(key, () => ({ content: text })), abortRef.current.signal);
    patchLast(key, () => ({ pending: false }));
  }

  async function askTeam(question) {
    const key = TEAM;
    const history = (chats[key] || []).flatMap((m) => m.role === "user" ? [{ role: "user", content: m.content }]
      : m.final ? [{ role: "assistant", content: m.final }] : []);
    update(key, (t) => [...t, { role: "user", content: question },
      { role: "team", stage: "planning", plan: "", experts: [], final: "", pending: true }]);
    const signal = abortRef.current.signal;

    // 1. Orchestrator plans
    const planText = await streamChat({ mode: "plan", question, history }, () => {}, signal);
    const plan = parsePlan(planText);
    const chosen = plan.experts.filter((e) => byName[e.agent] && e.agent !== ORCHESTRATOR).slice(0, 6);
    if (!chosen.length) throw new Error("The orchestrator didn't pick any known experts.");
    patchLast(key, () => ({ stage: "experts", plan: plan.plan, experts: chosen.map((e) => ({ ...e, answer: "", status: "waiting" })) }));

    // 2. Experts answer in parallel (each is its own function call)
    const answers = await pool(chosen, MAX_PARALLEL, async (e, idx) => {
      const setExpert = (p) => patchLast(key, (last) => ({ experts: last.experts.map((x, i) => i === idx ? { ...x, ...p } : x) }));
      setExpert({ status: "working" });
      try {
        const brief = `${e.brief}\n\n(Original question from the consultant: ${question})`;
        const answer = await streamChat({ mode: "expert", agent: e.agent, messages: [{ role: "user", content: brief }] },
          (text) => setExpert({ answer: text }), signal);
        setExpert({ status: "done", answer });
        return { agent: e.agent, answer };
      } catch (err) {
        if (err.name === "AbortError") throw err;
        setExpert({ status: "failed", answer: `[error] ${err.message}` });
        return null;
      }
    });
    const good = answers.filter(Boolean);
    if (!good.length) throw new Error("No expert was able to answer.");

    // 3. Orchestrator synthesizes one answer
    patchLast(key, () => ({ stage: "synthesizing" }));
    await streamChat({ mode: "synthesize", question, plan: plan.plan, answers: good, history },
      (text) => patchLast(key, () => ({ final: text })), signal);
    patchLast(key, () => ({ stage: "done", pending: false }));
  }

  async function send(e) {
    e?.preventDefault();
    const question = input.trim();
    if (!question || busy) return;
    setInput(""); setError(""); setBusy(true);
    abortRef.current = new AbortController();
    try {
      if (selected === TEAM) await askTeam(question); else await askExpert(selected, question);
    } catch (err) {
      const msg = err.name === "AbortError" ? "Stopped." : err.message;
      setError(err instanceof ApiError && err.status === 401 ? `${msg}. Enter the access code in the sidebar.` : msg);
      patchLast(selected, () => ({ pending: false, failed: true, stage: "failed" }));
    } finally {
      setBusy(false);
    }
  }

  function clearChat() {
    if (busy) return;
    setChats((prev) => { const copy = { ...prev }; delete copy[selected]; return copy; });
    setError("");
  }

  const placeholder = agent
    ? `Ask ${agent.firstName} (${agent.role})…`
    : "Ask the whole team. Morgan picks the experts and combines their answers…";

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-title">Experts21</div>
          <div className="brand-sub">Boca Raton &amp; Delray Beach real estate advisory team</div>
        </div>

        <button className={`agent-card team-card ${selected === TEAM ? "active" : ""}`} onClick={() => select(TEAM)}>
          <Avatar />
          <span className="agent-text">
            <span className="agent-name">Ask the whole team</span>
            <span className="agent-role">Routed through Morgan, the orchestrator</span>
          </span>
          <ModelBadge model={byName[ORCHESTRATOR]?.model || "opus"} />
        </button>

        <input className="filter" type="search" placeholder="Filter experts…" value={filter}
          onChange={(e) => setFilter(e.target.value)} aria-label="Filter experts" />

        <nav className="agent-list" aria-label="Experts">
          {visibleDomains.map(({ domain, list }) => (
            <div key={domain} className="domain">
              <div className="domain-title">{domain}</div>
              {list.map((a) => (
                <button key={a.name} className={`agent-card ${selected === a.name ? "active" : ""}`}
                  onClick={() => select(a.name)} title={`${a.voice}\n\nWorking style: ${a.style}`}>
                  <Avatar agent={a} />
                  <span className="agent-text">
                    <span className="agent-name">{a.firstName} <span className="agent-role-inline">· {a.role}</span></span>
                    <span className="agent-voice">{a.voice}</span>
                  </span>
                  <ModelBadge model={a.model} />
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <label className="code-label">Access code
            <input type="password" value={code} placeholder="if your site requires one"
              onChange={(e) => { setCode(e.target.value); setAccessCode(e.target.value); }} />
          </label>
          <div className="footnote">{agents.length - 1} experts · built {new Date(data.generatedAt).toLocaleDateString()}</div>
        </div>
      </aside>

      <main className="main">
        <header className="chat-header">
          <button className="menu" onClick={() => setSidebarOpen((v) => !v)} aria-label="Show experts">☰</button>
          <Avatar agent={agent} size="lg" />
          <div className="header-text">
            {agent ? (
              <>
                <h1>{agent.firstName} <span className="muted">· {agent.role}</span> <ModelBadge model={agent.model} /></h1>
                <p className="persona"><strong>Voice:</strong> {agent.voice}</p>
                <p className="persona"><strong>Working style:</strong> {agent.style}</p>
                <p className="meta">{agent.skills.length} skills · knowledge folder: {agent.knowledgeFiles.join(", ") || "empty"}</p>
              </>
            ) : (
              <>
                <h1>Ask the whole team <ModelBadge model={byName[ORCHESTRATOR]?.model || "opus"} /></h1>
                <p className="persona">Morgan picks the right experts, they answer in parallel, and Morgan reconciles them into one answer.</p>
                <p className="meta">{byName[ORCHESTRATOR]?.voice}</p>
              </>
            )}
          </div>
          {thread.length > 0 && <button className="ghost" onClick={clearChat} disabled={busy}>Clear</button>}
        </header>

        <section className="messages" aria-live="polite">
          {thread.length === 0 && (
            <div className="empty">
              <p>{agent ? agent.description : "Ask anything about the company: a deal, a launch plan, a campaign, a portfolio question."}</p>
              {!agent && <ul className="examples">
                <li>We have a lead on a 1965 3/2 in Lake Ida listed at $560K needing about $110K of work. Should we buy it as a flip or a rental, and what's our max offer?</li>
                <li>Give us a 12-month launch plan with $1.2M of founder capital.</li>
              </ul>}
            </div>
          )}
          {thread.map((m, i) => {
            if (m.role === "user") return <div key={i} className="msg user"><div className="bubble">{m.content}</div></div>;
            if (m.role === "team") return <TeamTurn key={i} turn={m} />;
            return (
              <div key={i} className="msg assistant">
                <Avatar agent={agent} />
                <div className="bubble">
                  {m.content ? <Markdown text={m.content} /> : <Thinking label={`${agent?.firstName || "The expert"} is thinking…`} />}
                </div>
              </div>
            );
          })}
          {error && <div className="error" role="alert">{error}</div>}
          <div ref={endRef} />
        </section>

        <form className="composer" onSubmit={send}>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} rows={3}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) send(e); }} disabled={busy} />
          {busy
            ? <button type="button" className="stop" onClick={() => abortRef.current?.abort()}>Stop</button>
            : <button type="submit" disabled={!input.trim()}>Send</button>}
        </form>
      </main>
    </div>
  );
}

function Thinking({ label }) {
  return <span className="thinking"><span className="dot" /><span className="dot" /><span className="dot" /> {label}</span>;
}

function TeamTurn({ turn }) {
  const stageLabel = {
    planning: "Morgan is choosing the experts…",
    experts: "The experts are working…",
    synthesizing: "Morgan is combining the answers…",
    done: "", failed: "",
  }[turn.stage];
  return (
    <div className="msg assistant team">
      <Avatar />
      <div className="bubble">
        {turn.plan && <p className="plan"><strong>Plan:</strong> {turn.plan}</p>}
        {turn.experts.length > 0 && (
          <div className="expert-runs">
            {turn.experts.map((e, i) => {
              const a = byName[e.agent];
              return (
                <details key={i} className={`expert-run ${e.status}`}>
                  <summary>
                    <Avatar agent={a} size="sm" />
                    <span>{a.firstName} · {a.role}</span>
                    <ModelBadge model={a.model} />
                    <span className="status">{e.status}</span>
                  </summary>
                  <p className="brief"><strong>Brief:</strong> {e.brief}</p>
                  {e.answer ? <Markdown text={e.answer} /> : <Thinking label="waiting…" />}
                </details>
              );
            })}
          </div>
        )}
        {turn.final ? <div className="final"><Markdown text={turn.final} /></div> : stageLabel && <Thinking label={stageLabel} />}
      </div>
    </div>
  );
}
