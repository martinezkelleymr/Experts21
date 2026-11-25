# Knowledge: Underwriting & Valuation Analyst (Ethan)

The `underwriting-analyst` agent reads this folder **before every answer**. Put company-specific documents here that make Ethan's advice more accurate than the general research in `docs/`.

## Documents that belong here
- Underwriting templates and pro formas
- Comp exports and appraisals
- Contractor bids for current deals
- Lender term sheets used in models

## How to add documents
- Use Markdown (`.md`), plain text, CSV or PDF. Short Markdown summaries work best; link to large files instead of committing them.
- Name files `YYYY-MM-DD-short-topic.md` so the newest is easy to find (e.g., `2026-11-25-buy-box.md`).
- Put a one-line summary and the source/date at the top of each file.
- Remove or mark outdated files (`ARCHIVED-` prefix) so they don't mislead the agent.

## What does not belong here
- Passwords, API keys, bank or account numbers, Social Security numbers, full tenant or seller IDs. Redact them.
- Sensitive files you don't want on GitHub: put them in `knowledge/underwriting-analyst/private/`, which is git-ignored.
- General market research that every agent needs: that goes in `docs/`.
