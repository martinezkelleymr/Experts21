---
name: comparable-sales-arv-analysis
description: "Selects and adjusts recent sold comparables to estimate after-repair value (ARV) and as-is value for houses in Boca Raton and Delray Beach, FL. Use when pricing an acquisition, setting a flip list price, checking an appraisal, or sanity-checking a seller's or agent's valuation."
---

# Comparable sales & ARV analysis

*Roster skill S01. Used by: `underwriting-analyst` (owner), `acquisitions-specialist`, `dispositions-specialist`, `chief-investment-strategist`, `market-research-analyst`, `real-estate-investment-analyst`. Market facts are a Nov 2026 snapshot from `docs/`; refresh before relying on them.*

## Purpose
Produce a defensible ARV (and as-is value) from **sold** comps, not list prices or portal estimates.

## Procedure
1. **Pin down the subject:** jurisdiction (city vs. unincorporated Palm Beach County), sub-market (east of US-1 / US-1 to I-95 / I-95 to Military / west), beds, baths, living sq ft (from Property Appraiser), lot size, year built, pool, garage, waterfront, HOA, flood zone.
2. **Comp search rules (in order of relaxation):**
   - Sold in the last **6 months** (extend to 12 only if fewer than 3 comps, and time-adjust).
   - Same subdivision, then within 0.5 mi; never cross I-95, US-1/Federal Hwy, or the Intracoastal without saying so.
   - Living area within ±20%; same build type (CBS vs. frame), same condition level as the *planned* renovation.
   - Don't mix: 55+ vs. all-ages, HOA vs. no-HOA, waterfront vs. dry lot, historic district vs. not.
3. **Adjust** for living area ($/sq ft from paired sales), pool (+$25K–$60K typical), garage, lot/waterfront, impact windows and newer roof (insurability premium in 2026), condition.
4. **Reconcile:** weight the 3 closest comps most; report a low / likely / high range.
5. **Cross-check:** months of supply and days to contract for the segment (SFH ≈ 4 months supply countywide; condos much higher). Discount ARV 2–5% if the comp set is slow or > 60 days to contract.

## Local notes
- Portal medians vary widely ($552K–$855K for Boca) because of property mix. Never use a city median as an ARV.
- "Boca Raton" mailing addresses include large unincorporated areas (33428, 33433, 33434, 33496, 33498) with different comps and permit offices.
- Seasonality: Nov–Apr sales are stronger; time-adjust summer comps if listing in season and vice versa.

## Output
A comp grid table (address, sale date, price, sq ft, $/sq ft, beds/baths, key differences, adjustments, adjusted value), followed by an ARV range, confidence (high/med/low) and the main assumptions.

## References
- `docs/01-local-market.md`, `docs/02-target-neighborhoods.md`, `docs/04-property-types-and-strategies.md`
