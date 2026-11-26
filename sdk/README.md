# Ask Olivia from the command line (Claude Agent SDK)

`ask-analyst.mjs` is a small Node.js script built on the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview). It:

1. Loads the **`real-estate-investment-analyst`** agent (Olivia) from `.claude/agents/real-estate-investment-analyst.md`: its prompt, model (`opus`), tools and 15 skills.
2. Loads its **knowledge folder** `knowledge/real-estate-investment-analyst/` (text files; `private/` is skipped) and adds the contents to the agent's prompt.
3. Runs the agent as the main thread of an SDK session in this repo, so the project's skills, `CLAUDE.md` and the other agents are available. See [subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents).
4. Asks your command-line question and prints the answer, with turns and cost on stderr.

## Requirements
- Node.js **18.14 or newer** (`node --version`).
- An Anthropic API key from the [Claude Console](https://platform.claude.com/), or Bedrock/Vertex/Foundry credentials. A claude.ai login does not work with the SDK.
- Python 3, only if you allow the deal calculator (`--allow-calculator`).

The SDK bundles the Claude Code binary, so you don't need to install the `claude` CLI separately.

## Install
From the repository root:
```bash
cd sdk
```
```bash
npm install
```

## Set your API key
macOS / Linux (current terminal session):
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```
Windows PowerShell:
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-your-key-here"
```
Never commit your key. The SDK does not read `.env` files automatically.

## Check that the agent loads (no API call, no key needed)
```bash
node ask-analyst.mjs --check
```
This also starts the SDK and confirms it registers the agent and all its skills (no key needed):
```bash
node ask-analyst.mjs --sdk-check
```

## Ask a question
```bash
node ask-analyst.mjs "Is a 3/2, 1,480 sq ft 1962 pool home in Boca Square listed at \$615,000, sold as-is, a good investment? Compare rent, flip and BRRRR and give me a max price."
```
Analyze a listing you saved to a file (paste the Zillow text into `listing.txt`), and allow the calculator and web research:
```bash
node ask-analyst.mjs --file listing.txt --allow-calculator --web "Evaluate this listing: BUY, NEGOTIATE or PASS?"
```
Let Olivia bring in Dominic (renovation) and Marco (acquisitions):
```bash
node ask-analyst.mjs --team --allow-calculator --file listing.txt "Evaluate this listing and get a rehab estimate and an offer plan."
```
Or with npm:
```bash
npm run ask -- "Is this a good investment? ..."
```

## Options
| Flag | Effect |
|---|---|
| `--file <path>` | Append a file (e.g., pasted listing text) to the question |
| `--allow-calculator` | Pre-approve `python3 .claude/skills/investment-verdict-report/scripts/deal_calc.py` |
| `--web` | Pre-approve web search and fetch |
| `--team` | Pre-approve delegation to subagents (renovation PM, acquisitions specialist) |
| `--max-turns <n>` | Turn limit (default 30) |
| `--budget <usd>` | Stop at this estimated cost (default $5) |
| `--model <name>` | Override the agent's model (`opus`, `sonnet`, `haiku` or a full ID) |
| `--verbose` | Print the loaded agent summary and each tool call to stderr |
| `--check` / `--sdk-check` | Validate loading without asking a question |

## Safety defaults
- The script runs in `dontAsk` permission mode. Only read-only tools (`Read`, `Glob`, `Grep`, `Skill`) are pre-approved; everything else is denied unless you pass a flag. Denied calls are listed on stderr.
- `Write`, `Edit` and `NotebookEdit` are always disabled, so the agent can't change repo files.
- Only project settings are loaded (`settingSources: ["project"]`); your personal `~/.claude` settings are ignored.
- Without `--allow-calculator`, Olivia does the calculator math by hand and says so. Allow it for reproducible numbers.
