# CLAUDE.md: Real Estate Expert Team (Boca Raton & Delray Beach, FL)

This repository is an **AI advisory team** for a consultant building a residential real estate investment company in **Boca Raton and Delray Beach, Florida**. The company buys houses to:

1. **Rent** them for recurring income (buy and hold).
2. **Renovate and resell** them for a profit (fix and flip).
3. **Renovate and rent** them, then refinance (BRRRR).

The team is **28 Claude Code project subagents** (26 domain experts plus an orchestrator and a meta agent) that share **42 project skills**. Everything is grounded in the research in `docs/` (snapshot: November 2026).

## Repository layout
```
docs/                     Research knowledge base (one file per topic), expert-roster.md, agent-brains.md
knowledge/<agent-name>/   Company-specific documents each agent reads before every answer
.claude/agents/           28 subagents (one .md file each, with model + personality)
.claude/skills/<name>/    42 skills (SKILL.md each); shared across agents
  consult-experts/        Orchestration procedure + routing table (also /consult-experts)
  agent-skill-authoring/  Formats, templates and scripts/validate_team.py
web/                      React web app + Netlify Function: chat with any expert or the whole team (netlify.toml at the root)
sdk/                      Node.js Agent SDK script: ask the real-estate-investment-analyst from the command line
exports/                  Standalone claude.ai skill packages (e.g., real-estate-investment-analyst.zip)
CLAUDE.md                 This guide
```

## How to use the team
**Ask the whole team (recommended).** The orchestrator picks the experts, runs them in parallel or in sequence, reconciles disagreements and returns one answer.
```bash
claude --agent expert-orchestrator
```
Running the orchestrator as the main agent is the most reliable way to let it delegate to the experts. Inside a normal session you can also use:
- `/consult-experts Should we buy 123 NE 5th Ave, Delray Beach, for $650K as a flip or a rental?`. The main session follows the same orchestration procedure and delegates to the experts.
- `@"expert-orchestrator (agent)" <question>`, or just ask: "Use the expert-orchestrator to …".

**Ask one expert directly** when the question is narrow:
- `@"real-estate-investment-analyst (agent)" Is this Zillow listing a good investment? <paste listing>`. Olivia returns BUY / NEGOTIATE / PASS with the math.
- `@"underwriting-analyst (agent)" Run a flip and BRRRR pro forma for …`
- "Use the permitting-code-specialist to tell me whether this rehab triggers the FEMA 50% rule."
- `claude --agent compliance-officer` for a whole session with one expert.

For ready-made example prompts, see [`docs/how-to-talk-to-your-experts.md`](docs/how-to-talk-to-your-experts.md).

**In the browser:** the React app in `web/` (deployed on Netlify) lists every agent with name, personality and model, and has an "Ask the whole team" mode through the orchestrator. See [`web/README.md`](web/README.md).

**From code (Agent SDK):** `cd sdk && npm install && node ask-analyst.mjs "<question>"` asks Olivia (`real-estate-investment-analyst`) with her knowledge folder loaded. See [`sdk/README.md`](sdk/README.md).

**Change the team.** Ask the meta agent: "Use the team-architect to add a short-term-rental revenue manager agent," or "…to improve the insurance skill with the 2027 rate filings."

## The team
| Domain | Agent | Name | Model | Role | Skills |
|---|---|---|---|---|---|
| Team coordination | `expert-orchestrator` | Morgan | `opus` | Routes any question to the right experts, coordinates them, returns one combined answer | 1 |
| Team coordination | `team-architect` | Quinn | `opus` | Meta agent: creates new agents and skills and improves existing ones | 1 |
| Real Estate Investment | `acquisitions-specialist` | Marco | `sonnet` | Acquisitions & Deal Sourcing Specialist | 10 |
| Real Estate Investment | `chief-investment-strategist` | Victoria | `opus` | Chief Investment Strategist | 11 |
| Real Estate Investment | `dispositions-specialist` | Jasmine | `sonnet` | Dispositions & Exit Specialist | 9 |
| Real Estate Investment | `real-estate-investment-analyst` | Olivia | `opus` | Real Estate Investment Analyst: listing → BUY / NEGOTIATE / PASS | 15 |
| Real Estate Investment | `market-research-analyst` | Priya | `sonnet` | Market Research Analyst | 5 |
| Property Analysis | `due-diligence-specialist` | Ruth | `sonnet` | Due Diligence & Inspection Specialist | 6 |
| Property Analysis | `insurance-risk-advisor` | Hank | `sonnet` | Insurance & Catastrophe Risk Advisor | 4 |
| Property Analysis | `underwriting-analyst` | Ethan | `sonnet` | Underwriting & Valuation Analyst | 9 |
| Finance | `capital-markets-advisor` | Rafael | `opus` | Capital Markets & Lending Advisor | 5 |
| Finance | `cfo-financial-planner` | Eleanor | `opus` | Chief Financial Officer / FP&A | 11 |
| Finance | `investor-relations-manager` | Camila | `sonnet` | Investor Relations & Partnerships Manager | 3 |
| Finance | `tax-strategist` | Simon | `opus` | Real Estate Tax Strategist (CPA) | 4 |
| Renovation | `interior-design-staging-specialist` | Luna | `haiku` | Interior Design & Staging Specialist | 4 |
| Renovation | `permitting-code-specialist` | Gloria | `sonnet` | Permitting & Code Specialist | 4 |
| Renovation | `renovation-project-manager` | Dominic | `sonnet` | Renovation Project Manager & Estimator | 9 |
| Operations | `operations-director` | Grace | `sonnet` | Operations Director | 8 |
| Operations | `property-manager` | Tony | `sonnet` | Property Manager & Leasing Specialist | 12 |
| Operations | `transaction-coordinator` | Penny | `haiku` | Transaction Coordinator / Closing Manager | 6 |
| Legal | `compliance-officer` | Diane | `opus` | Regulatory Compliance Officer | 7 |
| Legal | `entity-securities-counsel` | Benjamin | `opus` | Corporate Entity & Securities Counsel | 2 |
| Legal | `landlord-tenant-counsel` | Sofia | `opus` | Landlord-Tenant & Fair Housing Counsel | 4 |
| Legal | `real-estate-attorney` | Nathaniel | `opus` | Real Estate Transaction Attorney | 8 |
| Marketing | `brand-content-marketer` | Maya | `sonnet` | Brand & Content Marketer | 4 |
| Marketing | `lead-generation-marketer` | Jax | `sonnet` | Lead Generation Marketer | 7 |
| Technology | `data-analytics-engineer` | Arjun | `sonnet` | Data & Analytics Engineer | 4 |
| Technology | `proptech-architect` | Kenji | `sonnet` | PropTech Systems Architect | 6 |

Full job descriptions, the skill matrix (which agents use each skill) and the code→file map are in [`docs/expert-roster.md`](docs/expert-roster.md).

## Knowledge folders, brains and personalities
- **Knowledge folders:** each agent reads `knowledge/<agent-name>/` **before every answer**. Each folder's `README.md` lists the documents that belong there (e.g., the strategist's buy box, the underwriter's term sheets, the property manager's approved lease forms). Name files `YYYY-MM-DD-topic.md`. Sensitive files go in `knowledge/<agent-name>/private/` (git-ignored). Never store passwords, account numbers or personal IDs.
- **Brains:** each agent file sets `model:`. `opus` for deep strategy, legal and finance judgment (11 agents, including the orchestrator and team architect); `sonnet` for most specialist work (15); `haiku` for fast checklist and lookup work (2). The reasons are in [`docs/agent-brains.md`](docs/agent-brains.md).
- **Personalities:** every agent has a first name, a voice and a working style (e.g., Morgan the orchestrator, Victoria the strategist, Ethan the underwriter, Penny the transaction coordinator). Experts sign their sections with their name. Personality changes tone only, never accuracy or guardrails.

## How skills work here
- Each skill in `.claude/skills/<name>/SKILL.md` holds one area of knowledge or one procedure (e.g., `flood-zone-fema-50-rule`, `deal-underwriting-proforma`).
- Skills are **shared**: each agent's `skills:` frontmatter preloads the full text of every skill it uses, so several experts apply the same rules and benchmarks. For example, `public-records-research` is used by 6 agents.
- All skills are also available on demand through the Skill tool and as `/skill-name` commands.

## Conventions for every agent
- **Ground answers in `docs/`**, and refresh time-sensitive facts (prices, rents, rates, premiums, laws) before relying on them. Cite sources with dates; mark unverified items with ⚠️.
- **Show numbers and assumptions** so other experts can build on them; end with key assumptions, risks and questions for other experts.
- **Licensed sign-off:** legal, tax, insurance binding, brokerage and contracting outputs are advisory. A licensed Florida professional must approve them before anyone acts.
- **Privacy:** don't put personal data about sellers, tenants or investors into the repo or external services beyond business need. Never put secrets in the repo.
- **Risk voice:** any recommendation that commits money must cover insurance, flood/50% rule, title and legal checks.

## Maintaining the team
- Use the `team-architect` agent (it preloads `agent-skill-authoring`) to add or improve agents and skills. It also updates the routing table in `consult-experts`, `docs/expert-roster.md` and this file.
- After any change, run the validator. It checks frontmatter, names, skill wiring, routing coverage and team size (10–50 agents):
```bash
python3 .claude/skills/agent-skill-authoring/scripts/validate_team.py
```
- When `docs/` research is refreshed, have the team-architect update the affected skills (each skill lists its source docs under **References**).
- Web app: it reads agents, skills, knowledge folders and research at build time, so a push to `main` redeploys it with the current team. Run `cd web && npm run build && npm test` to check it.
- Standalone export: after changing the real-estate-investment-analyst agent, its skills, knowledge or `docs/`, rebuild the claude.ai skill with `python3 exports/build_real_estate_investment_analyst_skill.py` (see `exports/README.md`).
- Format references: [subagents](https://code.claude.com/docs/en/sub-agents) · [skills](https://code.claude.com/docs/en/skills).
