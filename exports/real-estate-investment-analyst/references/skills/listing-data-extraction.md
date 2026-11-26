<!-- Exported from the Experts21 team skill `listing-data-extraction`. -->
**When to use:** Extracts and verifies property facts from Zillow, Redfin, Realtor.com, MLS or other listing pages (or pasted listing text) for Boca Raton and Delray Beach houses, separates verified facts from listing claims, and produces a missing-information checklist without inventing any data. Use whenever a listing URL, screenshot or pasted listing is the starting point of an analysis.

# Listing data extraction & data-gap check

## Purpose
Turn a listing into a clean, sourced fact sheet. **Never invent a fact.** Anything not found is recorded as *missing* or as a clearly labeled *assumption*.

## Procedure
1. **Get the listing.**
   - If you have a URL, try to fetch it. Zillow and some portals block automated access. If the fetch fails or returns partial data, say so and ask the user to paste the listing text (or the key fields below). Don't guess from memory or from similar listings.
   - If the user pasted text, use only that text.
   - Record the source, the URL and the retrieval date for every fact.
2. **Extract these fields** (record "not stated" when absent):

| Group | Fields |
|---|---|
| Identity | Address, ZIP, parcel ID (PCN), city vs. unincorporated, subdivision/HOA name |
| Price | List price, price history (cuts, relists), days on market, last sale price/date |
| Physical | Beds, baths, living sq ft, lot size, year built, construction (CBS/frame), stories, garage, pool, waterfront |
| Systems | Roof age/type, HVAC age, water heater, electrical panel, plumbing type, windows (impact?), shutters |
| Costs | Annual tax (seller's bill), HOA dues and what they cover, special assessments, flood zone, insurance claims |
| Rental | Current lease/rent, tenant occupancy, rental restrictions |
| Condition | Description keywords ("as-is", "TLC", "investor special", "cash only", "updated"), photo observations |
| Agent remarks | Concessions, offer deadlines, inspections allowed |

3. **Separate facts from claims.** The listing's "Zestimate", "Rent Zestimate", estimated payment or "ideal for investors" are **not** facts; label them *portal estimate* or *marketing claim*. The seller's current tax bill is **not** our future tax (Florida reassesses after a sale; homestead savings don't transfer).
4. **Cross-check what you can** with public records (`public-records-research`): Property Appraiser sq ft, year built, owner, sales history, municipality, homestead, and FEMA flood zone. Flag every mismatch (e.g., listing says 1,800 sq ft, appraiser says 1,520 → possible unpermitted addition).
5. **Read the photos and description for red flags:** "cash only" or "no FHA/conventional" (often roof, insurability or structural issues), "as-is", sale by an estate, short sale, tenant-occupied, water stains, old panels, a 55+ or HOA approval note, flood/elevation mentions, a stale DOM with repeated cuts.
6. **Build the missing-information list**, ranked by impact on the decision: rent comps, sold comps, rehab scope/inspection, insurance quote, flood zone/elevation certificate, HOA docs, roof/HVAC age, permits history.

## Output
1. **Fact sheet table**: field, value, source (listing / Property Appraiser / user), as-of date.
2. **Claims and portal estimates** (not relied on without verification).
3. **Mismatches and red flags.**
4. **Missing information** (ranked) and the **assumptions** you will use until it arrives, each labeled ASSUMPTION.

## References
`references/research/02-target-neighborhoods.md` (screening criteria), `references/research/07-permits-licenses-and-legal.md`, `references/research/10-risks.md`
