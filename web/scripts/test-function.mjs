#!/usr/bin/env node
/**
 * Offline test for netlify/functions/chat.mjs. No API key or network needed.
 * Starts a mock Anthropic API server, points the SDK at it (ANTHROPIC_BASE_URL),
 * calls the function like Netlify would, and checks the requests and responses.
 * Also checks that the browser bundle contains no prompts or knowledge contents.
 *
 * Run after `npm run build`:  npm test
 */
import http from "node:http";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requests = [];
let failures = 0;
const ok = (name) => console.log(`  ✓ ${name}`);
async function test(name, fn) {
  try { await fn(); ok(name); } catch (e) { failures++; console.log(`  ✗ ${name}\n    ${e.message}`); }
}

// ---------- mock Anthropic Messages API (SSE) ----------
function sse(res, text, model) {
  res.writeHead(200, { "content-type": "text/event-stream" });
  const ev = (type, data) => res.write(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`);
  ev("message_start", { message: { id: "msg_test", type: "message", role: "assistant", model, content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 0 } } });
  ev("content_block_start", { index: 0, content_block: { type: "text", text: "" } });
  for (const chunk of text.match(/.{1,12}/gs)) ev("content_block_delta", { index: 0, delta: { type: "text_delta", text: chunk } });
  ev("content_block_stop", { index: 0 });
  ev("message_delta", { delta: { stop_reason: "end_turn", stop_sequence: null }, usage: { output_tokens: 20 } });
  ev("message_stop", {});
  res.end();
}
const server = http.createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    const body = JSON.parse(raw || "{}");
    requests.push({ url: req.url, headers: req.headers, body });
    const isPlan = body.output_config?.format?.type === "json_schema";
    const text = isPlan
      ? JSON.stringify({ plan: "Underwriting plus renovation.", experts: [{ agent: "underwriting-analyst", brief: "Run the numbers." }] })
      : "Hello from the mock. | a | b |";
    sse(res, text, body.model);
  });
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${server.address().port}`;
process.env.ANTHROPIC_API_KEY = "test-key";
delete process.env.ANTHROPIC_AUTH_TOKEN;

const { default: handler, _internal } = await import("../netlify/functions/chat.mjs");
const call = (body, headers = {}) => handler(new Request("http://localhost/api/chat", {
  method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body),
}));

console.log("Netlify Function: /api/chat");

await test("expert mode streams the answer and sends the right request", async () => {
  const res = await call({ mode: "expert", agent: "real-estate-investment-analyst", messages: [{ role: "user", content: "Is this a deal?" }] });
  assert.equal(res.status, 200);
  assert.equal(await res.text(), "Hello from the mock. | a | b |");
  const r = requests.at(-1);
  assert.match(r.url, /^\/v1\/messages/);
  // SDK 1.x sends the key as "Authorization: Bearer"; older versions used "x-api-key".
  assert.ok(r.headers.authorization === "Bearer test-key" || r.headers["x-api-key"] === "test-key", "API key header missing");
  assert.equal(r.body.model, "claude-opus-5-5");
  assert.equal(r.body.stream, true);
  assert.equal(r.body.system[0].cache_control.type, "ephemeral");
  assert.match(r.body.system[0].text, /Olivia/);
  assert.match(r.body.system[0].text, /<skill name="investment-verdict-report">/);
  assert.match(r.body.system[0].text, /knowledge\/real-estate-investment-analyst\/README\.md/);
  assert.match(r.body.system[0].text, /<research_file path="docs\/01-local-market\.md">/);
  assert.equal(r.body.output_config.effort, "medium");
  assert.equal(r.body.fallbacks, "default");
  assert.match(String(r.headers["anthropic-beta"]), /server-side-fallback-2026-07-01/);
});

await test("each agent uses its own model (haiku, sonnet) and haiku gets no fallbacks", async () => {
  await (await call({ mode: "expert", agent: "transaction-coordinator", messages: [{ role: "user", content: "hi" }] })).text();
  assert.equal(requests.at(-1).body.model, "claude-haiku-5-5");
  assert.equal(requests.at(-1).body.fallbacks, undefined);
  await (await call({ mode: "expert", agent: "renovation-project-manager", messages: [{ role: "user", content: "hi" }] })).text();
  assert.equal(requests.at(-1).body.model, "claude-sonnet-5-5");
  assert.match(requests.at(-1).body.system[0].text, /ABC Home Renovations/, "Dominic's knowledge file should be in his prompt");
});

await test("plan mode asks the orchestrator for structured JSON", async () => {
  const res = await call({ mode: "plan", question: "Should we buy 123 Main St?" });
  const plan = JSON.parse(await res.text());
  assert.equal(plan.experts[0].agent, "underwriting-analyst");
  const r = requests.at(-1).body;
  assert.equal(r.model, "claude-opus-5-5");
  assert.equal(r.output_config.format.type, "json_schema");
  assert.match(r.system[0].text, /Experts available in this web app/);
  assert.match(r.messages[0].content, /PLAN ONLY/);
});

await test("synthesize mode includes every expert answer", async () => {
  const res = await call({ mode: "synthesize", question: "Q?", plan: "p", answers: [{ agent: "underwriting-analyst", answer: "MAO is $400K" }] });
  assert.equal(res.status, 200);
  await res.text();
  const r = requests.at(-1).body;
  assert.match(r.messages[0].content, /<expert_answer agent="underwriting-analyst" name="Ethan">\nMAO is \$400K/);
  assert.match(r.messages[0].content, /SYNTHESIZE NOW/);
});

await test("orchestrator and plan/synthesize share one cacheable system prompt", async () => {
  const sys = requests.filter((r) => r.body.messages?.[0]?.content?.match(/PLAN ONLY|SYNTHESIZE NOW/)).map((r) => r.body.system[0].text);
  assert.equal(new Set(sys).size, 1);
});

await test("rejects bad input without calling the API", async () => {
  const before = requests.length;
  assert.equal((await call({ mode: "expert", agent: "nobody", messages: [{ role: "user", content: "x" }] })).status, 400);
  assert.equal((await call({ mode: "expert", agent: "expert-orchestrator", messages: [{ role: "user", content: "x" }] })).status, 400);
  assert.equal((await call({ mode: "expert", agent: "property-manager", messages: [] })).status, 400);
  assert.equal((await call({ mode: "plan" })).status, 400);
  assert.equal((await call({ mode: "bogus", question: "x" })).status, 400);
  assert.equal((await handler(new Request("http://localhost/api/chat"))).status, 405);
  assert.equal(requests.length, before);
});

await test("APP_ACCESS_CODE is enforced when set", async () => {
  process.env.APP_ACCESS_CODE = "s3cret";
  const body = { mode: "expert", agent: "property-manager", messages: [{ role: "user", content: "x" }] };
  assert.equal((await call(body)).status, 401);
  assert.equal((await call(body, { "x-access-code": "wrong" })).status, 401);
  const res = await call(body, { "x-access-code": "s3cret" });
  assert.equal(res.status, 200);
  await res.text();
  delete process.env.APP_ACCESS_CODE;
});

await test("missing ANTHROPIC_API_KEY returns a clear 500", async () => {
  const key = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  const res = await call({ mode: "expert", agent: "property-manager", messages: [{ role: "user", content: "x" }] });
  assert.equal(res.status, 500);
  assert.match((await res.json()).error, /ANTHROPIC_API_KEY/);
  process.env.ANTHROPIC_API_KEY = key;
});

console.log("Browser bundle");
await test("dist/ has no system prompts, knowledge contents or API keys", async () => {
  const assets = join(WEB, "dist", "assets");
  assert.ok(existsSync(assets), "run `npm run build` first");
  const js = readdirSync(assets).filter((f) => f.endsWith(".js")).map((f) => readFileSync(join(assets, f), "utf8")).join("\n");
  assert.ok(js.includes("Olivia"), "sidebar data should be present");
  for (const secret of ["ABC Home Renovations", "<skill name=", "Runtime note: web chat", "ANTHROPIC_API_KEY", "sk-ant-"]) {
    assert.ok(!js.includes(secret), `bundle contains "${secret}"`);
  }
});

server.close();
console.log(failures ? `\n${failures} test(s) failed` : "\nAll tests passed");
process.exit(failures ? 1 : 0);
