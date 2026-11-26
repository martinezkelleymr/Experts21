<!-- Exported from the Experts21 team skill `investment-verdict-report`. -->
**When to use:** Produces a BUY / NEGOTIATE / PASS investment verdict for a Boca Raton or Delray Beach house, comparing buy-and-rent, renovate-and-resell and renovate-and-rent (BRRRR) with reproducible calculations (deal_calc.py), a maximum purchase price, risks, missing information and the documents used. Use when someone asks whether a specific property or listing is a good investment, or what to offer.

# Investment verdict report (BUY / NEGOTIATE / PASS)

## Purpose
Give one clear verdict per property, backed by math anyone can re-run, and never based on invented facts.

## Procedure
1. **Facts first:** run `listing-data-extraction`. List the missing information and the assumptions before doing any math.
2. **Inputs:**
   - Purchase price: list price, plus a few offer prices to test.
   - Comps → ARV and as-is value (`comparable-sales-arv-analysis`).
   - Rent (`rental-comps-rent-pricing`). Use leased comps, not the Rent Zestimate.
   - Taxes: about 1.7–2.0% of the **purchase price** (not the seller's bill). Note the non-homestead 5% assessment cap from 2027.
   - Insurance (`property-insurance-mitigation`), flood (`flood-zone-fema-50-rule`), HOA (`hoa-condo-document-review`).
   - Maintenance 5–8% and capex 5–10% of rent; management 8–12%; vacancy 4–8%.
   - Rehab budget (`rehab-scoping-cost-estimating`, or the renovation PM's estimate) plus 10–20% contingency.
   - Financing (`deal-underwriting-proforma`): DSCR loan about 6–8% with 20–25% down; hard money about 10–13% plus 1.5–2.5 points.
3. **Calculate with the script** so the numbers are reproducible. Run it as one command with the inputs in a heredoc:
   ```bash
   python3 scripts/deal_calc.py - <<'JSON'
   {"price": 615000, "rent": 4500, "arv": 700000, "rehab": 110000}
   JSON
   ```
   A saved JSON file path also works in place of `-`. Only `price` is required; every default the script uses is printed under "Assumptions used". Copy those into the report. Override defaults with real numbers whenever you have them (e.g., `annual_insurance` from a quote).
4. **Run sensitivity checks:** ARV −5% and −10%, rehab +15%, rent −5%, insurance +25%, rate +1%. Re-run the script with changed inputs and report which change flips the verdict.
5. **Set the maximum purchase price** for each strategy (the script solves for it). The overall maximum is the **highest** of the three that still passes its targets, rounded down. Also report the 70% rule as a cross-check for flips.
6. **Decide with these rules:**

| Verdict | When |
|---|---|
| **BUY** | List price (or a likely accepted price) ≤ the maximum price for at least one strategy, that strategy passes its targets (flip profit ≥ 15% of ARV; rental DSCR ≥ 1.20 and positive cash flow; BRRRR leaves ≤ 20% of all-in cost in the deal), it survives the sensitivity checks, and there are no unresolved deal-killers |
| **NEGOTIATE** | Price is above the maximum but within about 10–15% of it, **or** the deal works only if key unknowns resolve favorably. State the target offer, the walk-away price and the facts that must be confirmed during the inspection period |
| **PASS** | No strategy works within about 15% of the list price, or there is a deal-killer: uninsurable, rehab triggers the FEMA 50% rule with no fix, an HOA rental ban for a rental strategy, title or structural problems, or a 55+ restriction that blocks the exit |

When key data is missing, the verdict can be **"NEGOTIATE, subject to …"** or **"PASS for now (insufficient data)."** Never "BUY" on assumed rent, ARV or rehab without saying the verdict is provisional.

## Report format
1. **Verdict:** BUY / NEGOTIATE / PASS, with a 2–3 sentence explanation.
2. **Property facts** (sourced) and **missing information**.
3. **Assumptions** (every default and estimate, labeled).
4. **Strategy comparison table:** buy-and-rent, flip, BRRRR. Show all-in cost, monthly cash flow, cash-on-cash, cap rate, DSCR, flip profit and margin, cash left in the deal, and maximum price.
5. **Calculations:** script inputs JSON plus key outputs, and the formulas in words.
6. **Sensitivity results.**
7. **Risks & red flags.**
8. **Maximum purchase price** and a recommended offer strategy.
9. **Hand-offs:** what the acquisitions specialist and renovation project manager should do next.
10. **Documents used:** file paths and URLs with dates.

## References
`references/research/04-property-types-and-strategies.md`, `references/research/05-startup-and-operating-costs.md`, `references/research/06-financing.md`, `references/research/10-risks.md`
