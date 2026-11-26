// Browser side: talks only to our Netlify Function (/api/chat). No API key here.
const ACCESS_KEY = "experts21.accessCode";

export function getAccessCode() {
  try { return localStorage.getItem(ACCESS_KEY) || ""; } catch { return ""; }
}
export function setAccessCode(code) {
  try { code ? localStorage.setItem(ACCESS_KEY, code) : localStorage.removeItem(ACCESS_KEY); } catch { /* storage unavailable */ }
}

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

/** POST to /api/chat and stream the text response. onText receives the full text so far. */
export async function streamChat(body, onText, signal) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "x-access-code": getAccessCode() },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try { msg = (await res.json()).error || msg; } catch { /* not JSON */ }
    if (res.status === 404) msg = "The /api/chat function isn't available. Run `netlify dev` locally or deploy to Netlify.";
    throw new ApiError(msg, res.status);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    onText(text);
  }
  text += decoder.decode();
  onText(text);
  return text;
}

/** Pull the JSON object out of the orchestrator's plan response. */
export function parsePlan(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("The orchestrator didn't return a plan.");
  const plan = JSON.parse(text.slice(start, end + 1));
  if (!Array.isArray(plan.experts) || !plan.experts.length) throw new Error("The orchestrator didn't pick any experts.");
  return plan;
}
