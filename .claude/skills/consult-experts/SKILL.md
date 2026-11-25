---
name: consult-experts
description: "Routes a question about the Boca Raton/Delray Beach real estate investment company to the right expert agents, coordinates their work and merges it into one answer. Use when a question spans several specialties, when unsure which expert to ask, or when the user types /consult-experts <question>."
argument-hint: "[question]"
---

# Consult the expert team

**Question:** $ARGUMENTS
(If this is empty, use the question you were given in the conversation or delegation message.)

## Step 1. Classify the question
Note the strategy (flip / rent / BRRRR / company-level), the stage (strategy, sourcing, underwriting, diligence, financing, closing, renovation, exit, operations, compliance) and whether money or legal exposure is involved.

## Step 2. Pick experts with the routing table
| Topic signals | Lead expert | Usually add |
|---|---|---|
| Should we buy / which strategy / portfolio | `chief-investment-strategist` | `underwriting-analyst`, `due-diligence-specialist`, `insurance-risk-advisor` |
| Prices, rents, neighborhoods, trends | `market-research-analyst` | `data-analytics-engineer` |
| Finding deals, sellers, offers | `acquisitions-specialist` | `lead-generation-marketer`, `underwriting-analyst` |
| Selling a flip, wholesale, exit timing | `dispositions-specialist` | `brand-content-marketer`, `interior-design-staging-specialist` |
| ARV, comps, pro forma, DSCR, MAO | `underwriting-analyst` | `renovation-project-manager`, `capital-markets-advisor` |
| Inspections, HOA docs, title, liens | `due-diligence-specialist` | `real-estate-attorney`, `permitting-code-specialist` |
| Insurance, flood, hurricanes, risk | `insurance-risk-advisor` | `due-diligence-specialist` |
| Loans, refinancing, private money | `capital-markets-advisor` | `cfo-financial-planner`, `investor-relations-manager` |
| Budget, cash flow, reporting | `cfo-financial-planner` | `tax-strategist` |
| Taxes (income, property, TDT) | `tax-strategist` | `entity-securities-counsel`, `compliance-officer` |
| Investors, partners, networking | `investor-relations-manager` | `entity-securities-counsel` |
| Rehab scope, cost, contractors, schedule | `renovation-project-manager` | `permitting-code-specialist`, `interior-design-staging-specialist` |
| Permits, code, historic, 50% rule | `permitting-code-specialist` | `renovation-project-manager` |
| Finishes, design, staging | `interior-design-staging-specialist` | `dispositions-specialist` |
| Processes, KPIs, hiring, vendors | `operations-director` | `cfo-financial-planner`, `proptech-architect` |
| Tenants, leasing, maintenance, PMs | `property-manager` | `landlord-tenant-counsel` |
| Closing logistics, deadlines, wires | `transaction-coordinator` | `real-estate-attorney` |
| Contracts, title, assignments | `real-estate-attorney` | `compliance-officer` |
| Leases, evictions, deposits, fair housing | `landlord-tenant-counsel` | `property-manager` |
| LLCs, partners, raising capital | `entity-securities-counsel` | `tax-strategist` |
| Licenses, registrations, TCPA, new laws | `compliance-officer` | the relevant counsel |
| Seller marketing, lists, campaigns | `lead-generation-marketer` | `compliance-officer`, `data-analytics-engineer` |
| Brand, listings copy, social | `brand-content-marketer` | `compliance-officer` |
| Data, dashboards, lead scoring | `data-analytics-engineer` | `market-research-analyst` |
| Software, automation, security, the agent team | `proptech-architect` | `team-architect` (for agent/skill changes) |
| "Start the company" / business plan | `chief-investment-strategist` | `cfo-financial-planner`, `entity-securities-counsel`, `operations-director`, `compliance-officer`, `lead-generation-marketer` |

Usually choose 2–6 experts. When money is committed, always include at least one risk voice (`insurance-risk-advisor`, `due-diligence-specialist` or `compliance-officer`).

## Step 3. Plan the collaboration
- **Parallel** for independent views (e.g., market + legal + insurance).
- **Chained** when one needs another's output. Common chains:
  - acquisitions → underwriting → (due diligence ∥ insurance ∥ financing) → strategist decision
  - renovation scope → permits → underwriting update
  - lead gen plan → compliance review → final plan
- Write the plan in a short list before you start.

## Step 4. Brief each expert
Delegate with the Agent tool (subagent_type = the expert's name). Each brief must stand alone:
```
Context: [company: Boca Raton/Delray Beach residential investor — flip / rent / BRRRR]
Question from the consultant: ...
Facts provided: ...
Earlier expert findings (if chained): ...
Your task: ... (specific)
Return: your deliverable in your standard format, key numbers, assumptions, risks, items needing licensed sign-off, and questions for other experts.
```
If you can't delegate (no Agent tool in this context), play each expert in turn: read `.claude/agents/<name>.md`, load its skills with the Skill tool, and write that expert's section.

## Step 5. Cross-check and reconcile
- Do the numbers agree (ARV, rehab, rent, rates, insurance) across experts? If not, find out why and pick, or show both with the reason.
- Did anyone raise a deal-killer (flood/50% rule, uninsurable, title, HOA lease ban, licensing)? Make sure it reaches the bottom line.
- If an expert asked another a question, route it and include the answer.

## Step 6. Synthesize one answer
1. **Bottom line** (2–4 sentences, a clear recommendation).
2. **Details by topic** with tables and numbers.
3. **Where experts disagreed** and the resolution.
4. **Risks & licensed sign-off items.**
5. **Next steps** (owner → action → when).
6. **Experts consulted** (name: contribution).

Base facts on `docs/` (snapshot Nov 2026). Flag any data that needs refreshing, and never present estimates as verified facts.
