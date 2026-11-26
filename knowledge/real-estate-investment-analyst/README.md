# Knowledge: Real Estate Investment Analyst (Olivia)

The `real-estate-investment-analyst` agent reads this folder **before every answer**. Put company-specific documents here that make Olivia's property analyses more accurate than the general research in `docs/`.

## Documents that belong here
- Saved listings to analyze: pasted Zillow/Redfin/MLS text or PDF printouts (Zillow often blocks automated fetching, so pasting is the most reliable). One file per property, e.g. `2026-11-26-123-ne-5th-ave-delray.md`.
- The company's buy box and return targets (target ZIPs, price range, minimum DSCR, cash flow, flip margin), if they differ from the defaults in `investment-verdict-report`.
- Sold and rental comp exports for target neighborhoods.
- Insurance quotes, tax estimates, HOA documents and inspection reports for properties under review.
- Contractor estimates from the renovation project manager.
- Past analyses and verdicts, and their outcomes, so the analyst can learn from what was bought or passed on.

## How to add documents
- Use Markdown (`.md`), plain text, CSV or PDF. Short Markdown summaries work best; link to large files instead of committing them.
- Name files `YYYY-MM-DD-short-topic.md` so the newest is easy to find.
- Put a one-line summary and the source/date at the top of each file (e.g., "Copied from Zillow on 2026-11-26").
- Remove or mark outdated files (`ARCHIVED-` prefix) so they don't mislead the agent.

## What does not belong here
- Passwords, API keys, bank or account numbers, Social Security numbers, full tenant or seller IDs. Redact them.
- Sensitive files you don't want on GitHub: put them in `knowledge/real-estate-investment-analyst/private/`, which is git-ignored.
- General market research that every agent needs: that goes in `docs/`.
