/**
 * Netlify Function (v2): POST /api/chat
 *
 * The only place the Claude API is called. The API key comes from the ANTHROPIC_API_KEY
 * environment variable set in Netlify, so it never reaches the browser. Every call makes
 * exactly ONE streamed Claude request, so each invocation stays inside Netlify's
 * function time limit. The browser drives multi-step "Ask the whole team" flows.
 *
 * Request body (JSON):
 *   { mode: "expert", agent: "<agent-name>", messages: [{role, content}, ...] }
 *       → streams the expert's answer (text/plain)
 *   { mode: "plan", question: "...", history?: [{role, content}] }
 *       → streams the orchestrator's JSON plan: {"plan": "...", "experts": [{"agent","brief"}]}
 *   { mode: "synthesize", question: "...", plan: "...", answers: [{agent, answer}], history?: [...] }
 *       → streams the orchestrator's combined answer (text/plain)
 *
 * Optional env vars:
 *   APP_ACCESS_CODE  if set, requests must send header "x-access-code" with this value
 *   MODEL_OPUS / MODEL_SONNET / MODEL_HAIKU  override the model IDs behind the aliases
 *   EFFORT           effort for expert and synthesis calls (default "medium")
 *   MAX_TOKENS       per-call output cap (default 8000)
 */
import Anthropic from "@anthropic-ai/sdk";
import AGENTS from "../generated/agents-server.mjs";

export const config = { path: "/api/chat" };

const ORCHESTRATOR = "expert-orchestrator";
const MODEL_IDS = {
  opus: process.env.MODEL_OPUS || "claude-opus-5-5",
  sonnet: process.env.MODEL_SONNET || "claude-sonnet-5-5",
  haiku: process.env.MODEL_HAIKU || "claude-haiku-5-5",
};
// Server-side refusal fallbacks are supported on Opus 5.5 / Sonnet 5.5, not on Haiku.
const FALLBACK_MODELS = new Set(["claude-opus-5-5", "claude-sonnet-5-5"]);
const EFFORTS = new Set(["low", "medium", "high", "xhigh", "max"]);
const MAX_MESSAGES = 40;
const MAX_CHARS = 200_000;
const MAX_EXPERTS = 6;

const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["plan", "experts"],
  properties: {
    plan: { type: "string", description: "One or two sentences: which experts and why, parallel vs. chained." },
    experts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["agent", "brief"],
        properties: {
          agent: { type: "string", description: "Exact agent name from the roster" },
          brief: { type: "string", description: "Self-contained brief: the question, relevant facts, the exact task, what to return" },
        },
      },
    },
  },
};

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function modelFor(agent) {
  return MODEL_IDS[agent.model] || agent.model; // alias or a full model ID
}

function cleanMessages(list) {
  if (!Array.isArray(list)) return null;
  const msgs = list.slice(-MAX_MESSAGES)
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content }));
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return null;
  const total = msgs.reduce((n, m) => n + m.content.length, 0);
  return total > MAX_CHARS ? null : msgs;
}

function historyText(history) {
  const h = cleanMessages([...(Array.isArray(history) ? history : []), { role: "user", content: "." }]) || [];
  const prior = h.slice(0, -1).slice(-6);
  return prior.length ? `Earlier in this team conversation:\n${prior.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n")}\n\n` : "";
}

function buildRequest(body) {
  const effort = EFFORTS.has(process.env.EFFORT) ? process.env.EFFORT : "medium";
  const maxTokens = Number(process.env.MAX_TOKENS) || 8000;

  if (body.mode === "expert") {
    const agent = AGENTS[body.agent];
    if (!agent || body.agent === ORCHESTRATOR) return { error: `Unknown expert: ${body.agent}` };
    const messages = cleanMessages(body.messages);
    if (!messages) return { error: "messages must be a non-empty user/assistant list ending with a user message" };
    return { agent, messages, effort, maxTokens };
  }

  const orch = AGENTS[ORCHESTRATOR];
  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question || question.length > MAX_CHARS) return { error: "question is required" };

  if (body.mode === "plan") {
    const roster = Object.keys(AGENTS).filter((n) => n !== ORCHESTRATOR).join(", ");
    return {
      agent: orch, effort: "low", maxTokens: 4000, format: PLAN_SCHEMA,
      messages: [{
        role: "user",
        content: `${historyText(body.history)}New question from the consultant:\n${question}\n\n` +
          `PLAN ONLY. Follow your consult-experts procedure (steps 1–4) and choose the smallest set of experts that can answer well ` +
          `(usually 2–5, at most ${MAX_EXPERTS}; include a risk voice when money is committed). For each, write a self-contained brief ` +
          `that includes the consultant's question and all facts given. Use exact agent names from this list: ${roster}. ` +
          `Return only the JSON object.`,
      }],
    };
  }

  if (body.mode === "synthesize") {
    const answers = Array.isArray(body.answers) ? body.answers.filter((a) => a && AGENTS[a.agent] && typeof a.answer === "string") : [];
    if (!answers.length) return { error: "answers are required" };
    const block = answers.map((a) => `<expert_answer agent="${a.agent}" name="${AGENTS[a.agent].firstName}">\n${a.answer}\n</expert_answer>`).join("\n\n");
    const content = `${historyText(body.history)}Question from the consultant:\n${question}\n\nYour plan was: ${String(body.plan || "").slice(0, 2000)}\n\n` +
      `The experts answered:\n\n${block}\n\nSYNTHESIZE NOW. Follow steps 5–6 of consult-experts: cross-check the numbers, surface deal-killers and disagreements, ` +
      `and write ONE combined answer in your final answer format (bottom line, details, disagreements, risks and licensed sign-off items, ` +
      `next steps, experts consulted with first names).`;
    if (content.length > MAX_CHARS * 2) return { error: "expert answers are too long" };
    return { agent: orch, effort, maxTokens, messages: [{ role: "user", content }] };
  }

  return { error: `Unknown mode: ${body.mode}` };
}

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Use POST" });
  const accessCode = process.env.APP_ACCESS_CODE;
  if (accessCode && req.headers.get("x-access-code") !== accessCode) return json(401, { error: "Invalid or missing access code" });
  if (!process.env.ANTHROPIC_API_KEY) return json(500, { error: "ANTHROPIC_API_KEY is not set in the Netlify environment" });

  let body;
  try { body = await req.json(); } catch { return json(400, { error: "Body must be JSON" }); }
  const r = buildRequest(body || {});
  if (r.error) return json(400, { error: r.error });

  const model = modelFor(r.agent);
  const params = {
    model,
    max_tokens: r.maxTokens,
    // Large, stable system prompt (agent + skills + knowledge + research): cache it.
    system: [{ type: "text", text: r.agent.system, cache_control: { type: "ephemeral" } }],
    messages: r.messages,
    output_config: { effort: r.effort, ...(r.format ? { format: { type: "json_schema", schema: r.format } } : {}) },
  };
  if (FALLBACK_MODELS.has(model)) {
    params.betas = ["server-side-fallback-2026-07-01"];
    params.fallbacks = "default"; // re-run on a fallback model if this one declines
  }

  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (t) => controller.enqueue(encoder.encode(t));
      try {
        const s = client.beta.messages.stream(params, { signal: req.signal });
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") send(event.delta.text);
        }
        const final = await s.finalMessage();
        if (final.stop_reason === "max_tokens") send("\n\n[notice] The answer hit the length limit and may be cut off.");
        if (final.stop_reason === "refusal") send("\n\n[notice] The model declined to answer this request.");
      } catch (err) {
        const msg = err instanceof Anthropic.AuthenticationError ? "The Anthropic API key was rejected."
          : err instanceof Anthropic.RateLimitError ? "Rate limited by the Anthropic API. Try again shortly."
          : err instanceof Anthropic.BadRequestError ? `Bad request: ${err.message}`
          : err instanceof Anthropic.APIError ? `Anthropic API error ${err.status}: ${err.message}`
          : `Error: ${err?.message || err}`;
        send(`\n\n[error] ${msg}`);
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-model": model },
  });
};

// Exported for local tests (scripts/test-function.mjs)
export const _internal = { buildRequest, cleanMessages, MODEL_IDS };
