# Experts21 web app: talk to your expert team

A React web app for chatting with the Boca Raton & Delray Beach real estate expert team in this repository.

- **Sidebar:** every agent with its first name, role, model (opus / sonnet / haiku) and voice. Hover a card to see the working style; the chat header shows both, plus the agent's skills and knowledge files.
- **Chat window:** a separate conversation with each expert, saved in your browser.
- **Ask the whole team:** Morgan (the orchestrator) picks the experts and writes a brief for each. The experts answer in parallel, and Morgan combines their work into one answer. You can expand each expert's work in the chat.

## How it works
```
repo (.claude/agents, .claude/skills, knowledge/, docs/, CLAUDE.md)
        │  build time: web/scripts/build-agents.mjs
        ├──► web/src/generated/agents-public.json        sidebar data (names, models, personalities) → browser
        └──► web/netlify/generated/agents-server.mjs     full system prompts (agent + skills + knowledge + research) → function only

browser ──POST /api/chat──► Netlify Function (web/netlify/functions/chat.mjs) ──► Claude API
                            (uses ANTHROPIC_API_KEY from Netlify; streams the answer back)
```
- **The API key stays on the server.** The browser only calls `/api/chat` on your own site.
- **Knowledge files stay on the server too.** Their contents and the system prompts are bundled into the function, not into the website. The test suite checks this.
- **Each function call makes exactly one streamed Claude request**, which keeps every call inside Netlify's function time limit. For "Ask the whole team" the browser makes the calls in turn: plan, then experts in parallel, then the combined answer.
- **Each agent uses the model from its own file:** `opus` → `claude-opus-5-5`, `sonnet` → `claude-sonnet-5-5`, `haiku` → `claude-haiku-5-5`.
- **The system prompt is cached between calls** (prompt caching), so repeated questions to the same expert cost less.
- **Refusal fallbacks are on for Opus and Sonnet:** if the model declines a request, the API retries it on a fallback model.
- **Agents in the app don't run tools.** There's no file, shell or web access; their knowledge, skills and research are already in their prompts. The `team-architect` agent is left out, since its job is editing repo files.

## Deploy to Netlify (step by step)
You need a GitHub account with access to this repository, a free [Netlify](https://www.netlify.com/) account, and an Anthropic API key from the [Claude Console](https://platform.claude.com/).

1. **Log in to Netlify** and go to **Add new site → Import an existing project** (it may be labeled "Add new project").
2. **Choose GitHub**, authorize Netlify if asked, and pick the **Experts21** repository.
3. **Leave the build settings as Netlify fills them in.** `netlify.toml` at the root of the repo sets everything:
   - base directory `web`
   - build command `npm run build`
   - publish directory `dist`
   - functions directory `netlify/functions`
   - Node 22

   Branch to deploy: `main`.
4. **Add your API key before the first deploy.** On the same screen, click **Add environment variables**, or after creating the site go to **Site configuration → Environment variables → Add a variable**:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key (starts with `sk-ant-`)
   - Scope: at least **Functions**. Mark it as a secret if offered.
5. **Recommended: add an access code** so strangers can't spend your API credits. Add another variable:
   - Key: `APP_ACCESS_CODE`
   - Value: any passphrase

   Then enter the same passphrase in the **Access code** box at the bottom of the app's sidebar. It's saved in your browser.
6. **Click Deploy.** When the deploy finishes, open the site URL (`https://<name>.netlify.app`).
7. **Test it:** pick an expert (e.g., Olivia) and ask a question, then try **Ask the whole team**.
8. **If you add or change environment variables later**, go to **Deploys → Trigger deploy → Deploy site** so the function picks them up.

**Updating the team:** every push to `main` triggers a new deploy. That rebuilds the sidebar and system prompts from the current agents, skills, knowledge folders and research, so new knowledge files show up after the next deploy.

## Optional settings (environment variables)
| Variable | Default | Effect |
|---|---|---|
| `ANTHROPIC_API_KEY` | (required) | Your Anthropic API key |
| `APP_ACCESS_CODE` | not set | Require this code (sent by the app) on every request |
| `EFFORT` | `medium` | Reasoning effort for expert answers and team synthesis: `low`, `medium`, `high`, `xhigh`, `max`. Higher effort is slower; see the limits below |
| `MAX_TOKENS` | `8000` | Max output tokens per answer |
| `MODEL_OPUS` / `MODEL_SONNET` / `MODEL_HAIKU` | `claude-opus-5-5` / `claude-sonnet-5-5` / `claude-haiku-5-5` | Model IDs behind each alias. For example, set `MODEL_OPUS=claude-sonnet-5-5` to make every opus agent cheaper and faster |

## Limits and costs
- **Time limit:** Netlify documents a 60-second limit for streaming functions, and some accounts report a 30-second cutoff. Long answers can be cut off; the app shows how far the answer got. If that happens, lower `EFFORT` or `MAX_TOKENS`, or point `MODEL_OPUS` at Sonnet.
- **Cost:** every message calls the Claude API on your account. "Ask the whole team" uses one planning call, one call per expert (usually 2–5) and one combining call. System prompts are large (about 18K–78K characters) but cached for 5 minutes between calls. See [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing).
- **Privacy:** chats are stored only in your browser (localStorage). Anyone with the site URL can use it unless you set `APP_ACCESS_CODE`.

## Run locally
From the repository root:
```bash
cd web
```
```bash
npm install
```
Build and run the offline tests (no API key needed; a mock Claude API is used):
```bash
npm run build
```
```bash
npm test
```
To try it with the real API locally, use the [Netlify CLI](https://docs.netlify.com/cli/get-started/), which runs Vite and the function together:
```bash
npm install -g netlify-cli
```
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```
```bash
netlify dev
```
Run `netlify dev` from the repository root so it picks up `netlify.toml`, then open the URL it prints (usually http://localhost:8888). `npm run dev` alone shows the UI, but `/api/chat` won't exist.
