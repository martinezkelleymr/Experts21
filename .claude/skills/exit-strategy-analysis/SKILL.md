---
name: exit-strategy-analysis
description: "Compares sell (flip), hold (rent), BRRRR refinance and wholesale/assignment exits for a property, including season timing and the post-Amendment 3 tax environment. Use when deciding what to do with a property before purchase, mid-renovation, or when a flip isn't selling."
---

# Exit strategy analysis

*Roster skill S04. Used by: `chief-investment-strategist` (owner), `underwriting-analyst`, `dispositions-specialist`, `cfo-financial-planner`. Market facts are a Nov 2026 snapshot from `docs/`; refresh before relying on them.*

## Purpose
Pick the exit with the best risk-adjusted return and keep a fallback.

## Decision factors
| Factor | Favors flip | Favors hold/BRRRR | Favors wholesale |
|---|---|---|---|
| Spread ARV − all-in | ≥ 15–20% | Thin spread, strong rent | Spread exists but outside our buy box |
| Rent/price | Weak | DSCR ≥ 1.2 after refi | — |
| Location | East of I-95, Nov–Apr listing window | Near schools/FAU/hospital | Tear-downs/luxury (builders pay more) |
| Capital | Need to recycle cash | Long-term equity available | No capital or bandwidth |
| Tax | Dealer income (ordinary) | Depreciation, 1031, 5% assessment cap from 2027 | Assignment fee (ordinary) |

## Procedure
1. Get underwriting for every exit from `deal-underwriting-proforma`.
2. Check timing: listing date vs. season (Nov–Apr peak), hurricane season (Jun–Nov) risk for vacant properties.
3. Check constraints: HOA lease rules, flood zone, refi seasoning (3–6 months), Chapter 475 rules for wholesaling.
4. Rank exits by risk-adjusted return and say what would change the ranking (trigger points, e.g., "if no contract in 45 days, cut price 3% or convert to rental").

## Output
A ranked exit list with numbers, a recommended plan with dated decision triggers, and a fallback exit.

## References
`docs/04-property-types-and-strategies.md`, `docs/01-local-market.md`, `docs/06-financing.md`
