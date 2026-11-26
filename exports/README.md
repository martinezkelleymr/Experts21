# Exports: standalone Claude skills

## `real-estate-investment-analyst.zip`
A standalone version of the `real-estate-investment-analyst` agent (Olivia) for **claude.ai → Customize → Skills**. It evaluates Boca Raton and Delray Beach listings as buy-and-rent, flip and BRRRR investments and returns **BUY, NEGOTIATE or PASS** with calculations.

**What's inside** (`real-estate-investment-analyst/`)
| Path | Contents |
|---|---|
| `SKILL.md` | Name and description frontmatter; Olivia's personality, workflow, verdict rules, report format and guardrails |
| `references/skills/` | The 15 team skills the agent uses (listing extraction, verdict report, comps/ARV, rent, underwriting, exit strategy, market research, public records, insurance, flood/50% rule, HOA review, rehab estimating, inspection defects, tax, risk) |
| `references/research/` | Research snapshot (Nov 2026): local market, neighborhoods, competitors, property types, costs, financing, permits/legal, risks |
| `knowledge/` | The agent's knowledge folder (README describing what company documents to provide) |
| `scripts/deal_calc.py` | Calculator for all three strategies and the maximum purchase price |

**Upload**
1. In claude.ai, open **Customize → Skills** and choose to upload a skill.
2. Upload `exports/real-estate-investment-analyst.zip`. The zip contains the `real-estate-investment-analyst/` folder at its root.
3. Turn on code execution so Claude can run `scripts/deal_calc.py`. Without it, the skill applies the same formulas by hand.
4. Ask, e.g., "Is this Zillow listing a good investment? <paste listing>". Attach your buy box, comps, quotes or contractor estimates to the chat or Project; the skill reads them as knowledge files.

**Rebuild after changes** to the agent, its skills, its knowledge folder or `docs/`:
```bash
python3 exports/build_real_estate_investment_analyst_skill.py
```
Check it with the skill-creator validator if available (`quick_validate.py exports/real-estate-investment-analyst`). It must contain exactly one `SKILL.md`, and the description must be at most 1,024 characters with no angle brackets.
