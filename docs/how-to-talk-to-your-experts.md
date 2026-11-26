# How to Talk to Your Experts

This repo has an AI advisory team for the Boca Raton & Delray Beach real estate investment company: **26 expert agents**, an **orchestrator** (`expert-orchestrator`) that coordinates them, and a **meta agent** (`team-architect`) that maintains the team. See [`../CLAUDE.md`](../CLAUDE.md) for the full team list and [`expert-roster.md`](expert-roster.md) for each role.

Run these commands from the repository root so Claude Code loads the agents in `.claude/agents/` and the skills in `.claude/skills/`.

---

## 1. Ask the whole team (one combined answer)

### Option A: start a session with the orchestrator (recommended)
```bash
claude --agent expert-orchestrator
```
Every question you type in that session goes to the orchestrator. It picks the experts, runs them, reconciles their views and returns **one** answer. This is the most reliable way to let it delegate to the experts.

For a single question without an interactive session:
```bash
claude --agent expert-orchestrator -p "Should we flip or rent a 3/2 in Boca Square bought at \$520K?"
```

### Option B: use the `/consult-experts` command in any session
```text
/consult-experts Should we flip or rent a 3/2 in Boca Square bought at $520K?
```
Your current session follows the orchestration procedure (routing table, then experts, then cross-check, then synthesis).

### Option C: ask in plain language or @-mention the orchestrator
```text
Use the expert-orchestrator to answer this: ...
@"expert-orchestrator (agent)" ...
```

**What you get back:** a bottom line, details by topic, where experts disagreed, risks and items that need licensed sign-off, next steps, and the list of experts consulted.

---

## 2. Ask one specific expert

Use this for narrow questions in a single specialty. It's faster and cheaper than the whole team.

**@-mention** (type `@` and pick the agent, or type it out):
```text
@"underwriting-analyst (agent)" Run a flip and a BRRRR pro forma: purchase $480K, rehab $85K, ARV $690K, rent $4,600/mo.
```

**Evaluate a listing (BUY / NEGOTIATE / PASS):**
```text
@"real-estate-investment-analyst (agent)" Is this a good investment? <paste the Zillow listing text or URL>. Compare rent, flip and BRRRR and give me a maximum price.
```
Zillow often blocks automated fetching, so pasting the listing text (or saving it in `knowledge/real-estate-investment-analyst/`) works best.

**Plain language:**
```text
Use the permitting-code-specialist to tell me whether a $95K rehab on a house with a $170K structure value in an AE zone triggers the FEMA 50% rule.
```

**A whole session with one expert:**
```bash
claude --agent landlord-tenant-counsel
```

Useful agent names to start with: `real-estate-investment-analyst`, `chief-investment-strategist`, `market-research-analyst`, `acquisitions-specialist`, `underwriting-analyst`, `due-diligence-specialist`, `insurance-risk-advisor`, `capital-markets-advisor`, `renovation-project-manager`, `permitting-code-specialist`, `property-manager`, `real-estate-attorney`, `compliance-officer`, `lead-generation-marketer`.

---

## 3. Example prompts that bring several experts together

Paste any of these into an orchestrator session (`claude --agent expert-orchestrator`) or after `/consult-experts`. Replace the details with your real deal. The expected experts and flow show roughly how the orchestrator will route each one; it may add or drop experts based on what it finds.

### Example 1: Should we buy this house, and as a flip or a rental?
```text
We have a lead on a 1965 3-bed/2-bath CBS house in Lake Ida, Delray Beach (33444), about 1,550 sq ft, with a pool, a 19-year-old roof and original cast-iron drains. The seller, who inherited it, wants $560K and to close in 30 days. Our contractor guesses $110K to renovate. Should we buy it? If so, should we flip it, rent it, or renovate and refinance (BRRRR)? What is our maximum offer, and what could kill the deal?
```
**Expected experts:** `acquisitions-specialist` → `underwriting-analyst` (ARV, rent, all three exits, maximum offer) → `due-diligence-specialist` + `insurance-risk-advisor` + `permitting-code-specialist` (roof and insurability, cast iron, flood zone and the 50% rule, historic-district check) → `capital-markets-advisor` (hard money vs. DSCR refi) → `chief-investment-strategist` (decision).

### Example 2: Launch plan for our first 12 months
```text
We're starting the company with $1.2M of founder capital. Give us a 12-month launch plan: the legal entity structure, licenses and registrations, which neighborhoods to target first, how many flips and rentals to aim for, how to finance them, who to hire first, the marketing budget for finding sellers, and the biggest risks to plan for before hurricane season.
```
**Expected experts:** `chief-investment-strategist` (lead), `entity-securities-counsel`, `compliance-officer`, `tax-strategist`, `market-research-analyst`, `cfo-financial-planner`, `capital-markets-advisor`, `operations-director`, `lead-generation-marketer`, `insurance-risk-advisor`.

### Example 3: Seller marketing campaign that stays legal
```text
Design a 6-month campaign to find off-market sellers in Boca Raton (33431, 33432, 33486) and Delray Beach (33444, 33445) using direct mail, text messages, cold calls and Google Ads, with a $12,000/month budget. Which lists should we build and how? What should the messages say? Which software should we use? And what do we need to do to comply with the TCPA, Florida's telemarketing law (FTSA), the Do Not Call lists, fair housing rules and Florida's real estate licensing law if we assign some contracts to other investors?
```
**Expected experts:** `lead-generation-marketer` (lead) + `data-analytics-engineer` (lists and lead scoring) + `brand-content-marketer` (messages) + `proptech-architect` (software) → `compliance-officer` + `real-estate-attorney` (TCPA/FTSA and Chapter 475 review) → final plan.

### Example 4: Rental portfolio check-up after Amendment 3
```text
We own 6 single-family rentals in west Boca and Delray, financed with DSCR loans at 7.25%. Two insurance policies renew next month with 30% increases, and one tenant is 45 days behind on rent. How does Amendment 3 change our property taxes from 2027? Should we refinance, sell or keep each property? How should we handle the late tenant under Florida law? And what should we fix to bring insurance costs down?
```
**Expected experts:** `cfo-financial-planner` (portfolio numbers) + `tax-strategist` (Amendment 3, 5% cap, millage) + `insurance-risk-advisor` (renewals, mitigation upgrades) + `capital-markets-advisor` (refinance) + `landlord-tenant-counsel` + `property-manager` (3-day notice and eviction steps) → `chief-investment-strategist` (hold, sell or refi for each property).

---

## 4. Tips for better answers
- **Give facts:** address or ZIP, price, beds/baths/sq ft, year built, flood zone, HOA, rehab estimate, rents, loan terms. The experts state their assumptions when facts are missing.
- **Say what you need back:** "a go/no-go and maximum offer," "a 1-page plan," "a table by property."
- **Ask for a saved report:** "Save the answer to `reports/`." The orchestrator writes `reports/<date>-<topic>.md`.
- **Push back:** "The underwriting assumes $650K for the after-repair value; re-run it at $610K." The orchestrator re-briefs the experts concerned.
- **Remember the limits:** legal, tax, insurance binding, brokerage and contracting answers are advisory. A licensed Florida professional signs off. Market figures come from the Nov 2026 research snapshot unless the experts refresh them.
- **To change the team:** "Use the team-architect to add an agent for …" or "…to update the insurance skill with …".
