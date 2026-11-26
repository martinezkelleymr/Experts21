---
name: deal-underwriting-proforma
description: "Builds flip, buy-and-hold and BRRRR pro formas (maximum allowable offer, holding costs, cash-on-cash, cap rate, DSCR, IRR) with stress tests for South Florida insurance and tax costs. Use whenever a property needs a numeric go/no-go, an offer price, or a comparison of exits."
---

# Deal underwriting & pro-forma modeling

*Roster skill S03. Used by: `underwriting-analyst` (owner), `chief-investment-strategist`, `cfo-financial-planner`, `capital-markets-advisor`, `acquisitions-specialist`, `real-estate-investment-analyst`. Market facts are a Nov 2026 snapshot from `docs/`; refresh before relying on them.*

## Purpose
Turn ARV, rent, rehab and financing inputs into a decision and a **maximum allowable offer (MAO)** for each exit.

## Core formulas
- **Flip MAO** = ARV × (0.70–0.75) − rehab − (extra discount if days-to-contract > 60).
- **Flip profit** = ARV − purchase − rehab − buy closing (≈ 1.5–2.5% + lender points) − holding (≈ 1–1.5% of price/month × months) − selling (≈ 6–7% incl. commission, 0.70% deed doc stamps and closing).
- **NOI** = rent × (1 − vacancy) − taxes − insurance − flood − HOA − management (8–12%) − maintenance (5–8%) − capex (5–10%) − lawn/pool/pest.
- **DSCR** = rent ÷ PITIA. Target ≥ 1.20.
- **Cash-on-cash** = annual pre-tax cash flow ÷ total cash invested. **Cap rate** = NOI ÷ all-in cost.
- **BRRRR:** refi loan = new appraised value × 70–75% LTV; cash left in deal = all-in cost − refi proceeds (target ≤ 20% of all-in).

## Florida inputs to never skip
- Property tax ≈ 1.7–2.0% of **purchase price** (reassessed on sale; non-homestead cap 5%/yr from 2027).
- Insurance: quote it; planning value $4K–$9K+/yr; add flood if AE zone.
- Mortgage doc stamps 0.35% of loan + intangible tax 0.2% of loan.
- Hard money 10–13% + 1.5–2.5 pts; DSCR 6–8%.

## Stress tests (always show)
ARV −5% and −10%; rehab +15%; timeline +3 months; insurance +25%; rate +1%. Report which test breaks the deal.

## Output
A table per exit (flip / rent / BRRRR): price, all-in cost, profit or cash flow, ROI, DSCR, cash left in deal, MAO. Then a recommendation and the stress-test result. For multi-step math, use Bash/Python if available and show the inputs.

## References
`docs/04-property-types-and-strategies.md`, `docs/05-startup-and-operating-costs.md`, `docs/06-financing.md`
