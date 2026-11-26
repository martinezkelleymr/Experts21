# Real Estate Investment Company — Boca Raton & Delray Beach, FL

Research knowledge base (snapshot: **November 2026**) for a residential real estate investment company that buys houses in Boca Raton and Delray Beach, Florida, to:

1. **Buy & hold**: rent them out for recurring income.
2. **Fix & flip**: renovate and resell them for a profit.
3. **BRRRR**: renovate, rent and refinance.

These docs are the shared context for a team of AI expert agents. Each file covers one topic and ends with its sources.

## Index
| # | Topic | File | Primary agent consumer |
|---|---|---|---|
| 01 | Local market: prices, rents, demand drivers, Amendment 3 | [01-local-market.md](01-local-market.md) | Market analyst |
| 02 | Target neighborhoods & screening criteria | [02-target-neighborhoods.md](02-target-neighborhoods.md) | Acquisitions / deal finder |
| 03 | Competitors | [03-competitors.md](03-competitors.md) | Strategy / marketing |
| 04 | Property types & the three strategies | [04-property-types-and-strategies.md](04-property-types-and-strategies.md) | Underwriting |
| 05 | Startup & operating costs | [05-startup-and-operating-costs.md](05-startup-and-operating-costs.md) | Finance / underwriting / construction |
| 06 | Financing | [06-financing.md](06-financing.md) | Capital / finance |
| 07 | Permits, licenses & legal | [07-permits-licenses-and-legal.md](07-permits-licenses-and-legal.md) | Compliance / construction |
| 08 | Staffing & organization | [08-staffing.md](08-staffing.md) | Operations |
| 09 | Marketing & deal sourcing | [09-marketing.md](09-marketing.md) | Marketing / lead gen |
| 10 | Biggest risks & mitigations | [10-risks.md](10-risks.md) | Risk / all agents |
| — | **Expert roster: 26 agent roles and 40 shared skills** | [expert-roster.md](expert-roster.md) | Agent builders |
| — | **Agent brains & personalities: model choice, names, voices, knowledge folders** | [agent-brains.md](agent-brains.md) | Agent builders / users |
| — | **How to talk to your experts: example prompts and how to ask one agent or the whole team** | [how-to-talk-to-your-experts.md](how-to-talk-to-your-experts.md) | Consultant / users |

## Key takeaways
- **Prices are high and rents are flat.** Typical Boca value is about $577K. Single-family homes east of I-95 usually sell for $600K to $2M or more. Boca houses rent for about $5.5K a month on average. Rentals only cash-flow when bought at a real discount, so **value-add strategies (flip/BRRRR) fit this market better than buying retail rentals.**
- **Single-family homes and condos are two different markets.** Single-family is roughly balanced (about 4 months of supply countywide). Condos and 55+ communities are a buyer's market and carry heavy SIRS and assessment risk, so avoid them.
- **Insurance, flood and the FEMA 50% rule** decide many deals. Get quotes and flood-zone checks before signing a contract.
- **Amendment 3 (passed Nov 2026)** cuts the yearly cap on assessment increases for non-homestead property from 10% to 5%, starting 2027. That helps rental holders. Larger homestead exemptions should support owner-occupant demand for flips. Local millage rates may rise to make up the lost revenue.
- **The market is fragmented.** Investors buy about 20% of homes in Palm Beach County, but institutional landlords own only about 4% of single-family homes. The competition is local cash buyers and flippers.
- Key compliance items: a licensed broker on the team (wholesaling and Chapter 475), licensed contractors (the owner-builder exemption does not cover homes built or improved for sale or lease), TCPA and Florida telemarketing rules (FTSA), the 6% county tourist tax (TDT) plus sales tax on rentals of 6 months or less, and fair housing.

## Data caveats
- Public sources disagree widely: medians differ by property mix, geography (city vs. "Boca" mailing addresses in unincorporated county land) and date. Re-pull MLS data before any decision.
- Items marked ⚠️ in file 07 are unverified and need confirmation from the city or county or an attorney.
- Nothing here is legal, tax or investment advice.

## Expert-agent roster
See [expert-roster.md](expert-roster.md) for the full list of 25 expert agents across 8 domains, the skills they share, and how they work together on a deal. The team is built as Claude Code subagents in `.claude/agents/` and skills in `.claude/skills/`, plus an orchestrator and a meta agent. See [`../CLAUDE.md`](../CLAUDE.md) for how to use it.
