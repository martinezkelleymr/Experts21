---
name: real-estate-data-analytics
description: "Designs and runs data pipelines and analyses for the company: property and owner data (PBC Property Appraiser exports, Clerk records, PropStream, BatchData, ATTOM, MLS feeds), lead scoring, comp pulls, competitor and flip tracking, market dashboards and KPI reporting. Use when building lists or dashboards, analyzing a dataset, or automating data refreshes."
---

# Real estate data engineering & analytics

*Roster skill S36. Used by: `data-analytics-engineer` (owner), `market-research-analyst`, `lead-generation-marketer`, `cfo-financial-planner`, `proptech-architect`. Market facts are a Nov 2026 snapshot from `docs/`; refresh before relying on them.*

## Purpose
Turn raw property data into ranked leads, faster comps and decision dashboards.

## Data sources
- **Palm Beach County Property Appraiser:** parcels, owners, mailing addresses, values, sales, building characteristics, homestead flags, municipality.
- **Clerk:** lis pendens, probate, liens, deeds (owner changes; LLC buyers = investor activity).
- **Tax Collector:** delinquencies.
- **Commercial:** PropStream, BatchData/BatchLeads, ATTOM (comps, equity, skip tracing, flip history).
- **MLS:** sold and active listings, rentals (licensee access and the MLS license terms apply).
- **FEMA NFHL** flood zones; school ratings; city permit and code data.

## Typical builds
1. **Lead scoring:** stack motivation signals (absentee, years owned, equity, tax delinquency, probate, code cases, vacancy) → score → monthly mail and call lists by target ZIP.
2. **Competitor tracking:** LLC buyers and quick resales (< 12 months) by ZIP; top active flippers.
3. **Market dashboard:** median $/sq ft, DOM, months of supply, rents, by ZIP and segment (SFH vs. condo).
4. **KPI dashboard:** marketing funnel, deal pipeline, project status, portfolio metrics.

## Practices
Document each field's source and refresh date; dedupe by parcel ID; keep personal data access-controlled; respect data-license and MLS rules; scripts reproducible (Python/SQL, saved in the repo when appropriate).

## Output
A dataset or dashboard spec, the analysis results with method and caveats, or a pipeline design.

## References
`docs/01-local-market.md`, `docs/03-competitors.md`, `docs/09-marketing.md`
