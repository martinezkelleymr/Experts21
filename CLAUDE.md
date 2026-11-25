# CLAUDE.md: Real Estate Expert Team (Boca Raton & Delray Beach, FL)

This repository is an **AI advisory team** for a consultant building a residential real estate investment company in **Boca Raton and Delray Beach, Florida**. The company buys houses to:

1. **Rent** them for recurring income (buy and hold).
2. **Renovate and resell** them for a profit (fix and flip).
3. **Renovate and rent** them, then refinance (BRRRR).

The team is **27 Claude Code project subagents** (25 domain experts plus an orchestrator and a meta agent) that share **40 project skills**. Everything is grounded in the research in `docs/` (snapshot: November 2026).

## Repository layout
```
docs/                     Research knowledge base (one file per topic) + expert-roster.md
.claude/agents/           27 subagents (one .md file each)
.claude/skills/<name>/    40 skills (SKILL.md each); shared across agents
  consult-experts/        Orchestration procedure + routing table (also /consult-experts)
  agent-skill-authoring/  Formats, templates and scripts/validate_team.py
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
- `@"underwriting-analyst (agent)" Run a flip and BRRRR pro forma for …`
- "Use the permitting-code-specialist to tell me whether this rehab triggers the FEMA 50% rule."
- `claude --agent compliance-officer` for a whole session with one expert.

For ready-made example prompts, see [`docs/how-to-talk-to-your-experts.md`](docs/how-to-talk-to-your-experts.md).

**Change the team.** Ask the meta agent: "Use the team-architect to add a short-term-rental revenue manager agent," or "…to improve the insurance skill with the 2027 rate filings."

## The team
| Domain | Agent | Role | Skills |
|---|---|---|---|
| Team coordination | `expert-orchestrator` | Routes any question to the right experts, coordinates them, returns one combined answer | 1 |
| Team coordination | `team-architect` | Meta agent: creates new agents and skills and improves existing ones | 1 |
| Real Estate Investment | `acquisitions-specialist` | Acquisitions & Deal Sourcing Specialist | 10 |
| Real Estate Investment | `chief-investment-strategist` | Chief Investment Strategist | 11 |
| Real Estate Investment | `dispositions-specialist` | Dispositions & Exit Specialist | 9 |
| Real Estate Investment | `market-research-analyst` | Market Research Analyst | 5 |
| Property Analysis | `due-diligence-specialist` | Due Diligence & Inspection Specialist | 6 |
| Property Analysis | `insurance-risk-advisor` | Insurance & Catastrophe Risk Advisor | 4 |
| Property Analysis | `underwriting-analyst` | Underwriting & Valuation Analyst | 9 |
| Finance | `capital-markets-advisor` | Capital Markets & Lending Advisor | 5 |
| Finance | `cfo-financial-planner` | Chief Financial Officer / FP&A | 11 |
| Finance | `investor-relations-manager` | Investor Relations & Partnerships Manager | 3 |
| Finance | `tax-strategist` | Real Estate Tax Strategist (CPA) | 4 |
| Renovation | `interior-design-staging-specialist` | Interior Design & Staging Specialist | 4 |
| Renovation | `permitting-code-specialist` | Permitting & Code Specialist | 4 |
| Renovation | `renovation-project-manager` | Renovation Project Manager & Estimator | 9 |
| Operations | `operations-director` | Operations Director | 8 |
| Operations | `property-manager` | Property Manager & Leasing Specialist | 12 |
| Operations | `transaction-coordinator` | Transaction Coordinator / Closing Manager | 6 |
| Legal | `compliance-officer` | Regulatory Compliance Officer | 7 |
| Legal | `entity-securities-counsel` | Corporate Entity & Securities Counsel | 2 |
| Legal | `landlord-tenant-counsel` | Landlord-Tenant & Fair Housing Counsel | 4 |
| Legal | `real-estate-attorney` | Real Estate Transaction Attorney | 8 |
| Marketing | `brand-content-marketer` | Brand & Content Marketer | 4 |
| Marketing | `lead-generation-marketer` | Lead Generation Marketer | 7 |
| Technology | `data-analytics-engineer` | Data & Analytics Engineer | 4 |
| Technology | `proptech-architect` | PropTech Systems Architect | 6 |

Full job descriptions, the skill matrix (which agents use each skill) and the code→file map are in [`docs/expert-roster.md`](docs/expert-roster.md).

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
- Format references: [subagents](https://code.claude.com/docs/en/sub-agents) · [skills](https://code.claude.com/docs/en/skills).
