#!/usr/bin/env python3
"""Build a standalone claude.ai skill (Customize > Skills) from the
real-estate-investment-analyst agent, its skills, knowledge folder and research.

Usage (from the repository root):
    python3 exports/build_real_estate_investment_analyst_skill.py

Output:
    exports/real-estate-investment-analyst/      the skill folder
    exports/real-estate-investment-analyst.zip   upload this file

Re-run after changing the agent, its skills, its knowledge folder or docs/.
"""
import os, re, shutil, zipfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
NAME = "real-estate-investment-analyst"
OUT = os.path.join(ROOT, "exports", NAME)
ZIP = os.path.join(ROOT, "exports", NAME + ".zip")
AGENT = os.path.join(ROOT, ".claude", "agents", NAME + ".md")
SKILLS_DIR = os.path.join(ROOT, ".claude", "skills")
KNOWLEDGE = os.path.join(ROOT, "knowledge", NAME)
RESEARCH = ["01-local-market.md", "02-target-neighborhoods.md", "03-competitors.md",
            "04-property-types-and-strategies.md", "05-startup-and-operating-costs.md",
            "06-financing.md", "07-permits-licenses-and-legal.md", "10-risks.md"]

DESCRIPTION = (
    "Real estate investment analyst (Olivia) for residential properties in Boca Raton and Delray Beach, Florida. "
    "Evaluates a Zillow, Redfin or MLS listing, an address or pasted listing text as three investments: buy and rent, "
    "renovate and resell (flip), and renovate and rent (BRRRR). Covers comps and ARV, neighborhood, rent, property taxes, "
    "insurance, flood zone, HOA, maintenance, cash flow, cash-on-cash, cap rate, DSCR, rehab cost, resale value, risks and "
    "the maximum purchase price, and ends with a BUY, NEGOTIATE or PASS verdict backed by calculations. Never invents "
    "property facts; lists missing information, assumptions and documents used. Use whenever someone asks whether a "
    "Palm Beach County house or listing is a good investment, what to offer, or how a property compares across rent, flip and BRRRR."
)


def frontmatter_and_body(path):
    text = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.S)
    return (m.group(1), m.group(2)) if m else ("", text)


def agent_skills():
    fm, _ = frontmatter_and_body(AGENT)
    return re.findall(r"^\s+-\s+([a-z0-9-]+)\s*$", fm.split("skills:", 1)[1].split("\ncolor:")[0], re.M)


def rewrite(text, skill_names, depth):
    """Rewrite repo paths so links work inside the exported skill. depth = folder depth of the file."""
    up = ""  # all paths are relative to the skill folder
    text = text.replace(".claude/skills/investment-verdict-report/scripts/deal_calc.py", up + "scripts/deal_calc.py")
    text = re.sub(r"`docs/(\d\d-[a-z0-9-]+\.md)`", lambda m: f"`{up}references/research/{m.group(1)}`"
                  if m.group(1) in RESEARCH else f"`{m.group(1)}` (not included)", text)
    text = text.replace("(from docs/10)", "(from references/research/10-risks.md)")
    text = text.replace("that goes in `docs/`", "that is already in `references/research/`")
    text = re.sub(r"\(\.\./(?:\.\./)*CLAUDE\.md\)|`CLAUDE\.md`", "the team guide (not included)", text)
    return text


def main():
    shutil.rmtree(OUT, ignore_errors=True)
    os.makedirs(os.path.join(OUT, "references", "skills"))
    os.makedirs(os.path.join(OUT, "references", "research"))
    os.makedirs(os.path.join(OUT, "scripts"))
    os.makedirs(os.path.join(OUT, "knowledge"))
    skills = agent_skills()

    # 1. Skills -> references/skills/<name>.md (no nested SKILL.md allowed on upload)
    index = []
    for s in skills:
        fm, body = frontmatter_and_body(os.path.join(SKILLS_DIR, s, "SKILL.md"))
        desc = re.search(r'^description:\s*"?(.*?)"?\s*$', fm, re.M).group(1)
        body = re.sub(r"^\*Roster skill S\d+\..*?\*\n\n?", "", body, flags=re.M)
        body = rewrite(body, skills, 2)
        open(os.path.join(OUT, "references", "skills", s + ".md"), "w").write(
            f"<!-- Exported from the Experts21 team skill `{s}`. -->\n**When to use:** {desc}\n\n{body.strip()}\n")
        title = re.search(r"^# (.+)$", body, re.M)
        index.append((s, title.group(1) if title else s))

    # 2. Research
    for f in RESEARCH:
        shutil.copy(os.path.join(ROOT, "docs", f), os.path.join(OUT, "references", "research", f))

    # 3. Calculator
    shutil.copy(os.path.join(SKILLS_DIR, "investment-verdict-report", "scripts", "deal_calc.py"),
                os.path.join(OUT, "scripts", "deal_calc.py"))

    # 4. Knowledge files (README adapted; any other non-private files copied as-is)
    for root, dirs, files in os.walk(KNOWLEDGE):
        dirs[:] = [d for d in dirs if d != "private"]
        for f in files:
            src = os.path.join(root, f)
            rel = os.path.relpath(src, KNOWLEDGE)
            dst = os.path.join(OUT, "knowledge", rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            if f == "README.md":
                t = open(src).read()
                t = t.replace("The `real-estate-investment-analyst` agent reads this folder **before every answer**.",
                              "This skill reads this folder **before every answer**. In claude.ai you can't add files to an uploaded skill, so the easiest way to supply these documents is to attach them to the chat or add them to a Claude Project, and the skill treats them as knowledge files. To bake them into the skill instead, add them to this folder and re-zip.")
                t = t.replace("`knowledge/real-estate-investment-analyst/private/`, which is git-ignored", "a location outside the skill")
                t = rewrite(t, skills, 1)
                open(dst, "w").write(t)
            else:
                shutil.copy(src, dst)

    # 5. SKILL.md from the agent definition
    _, agent_body = frontmatter_and_body(AGENT)
    persona = re.search(r"## Your personality\n(.*?)\n## ", agent_body, re.S).group(1).strip()
    persona = persona.replace(' When briefed by the orchestrator, sign your section "— Olivia".', ' Sign your analyses "— Olivia".')
    evaluate = re.search(r"## What you evaluate \(every analysis\)\n(.*?)\n## ", agent_body, re.S).group(1).strip()
    guard = re.search(r"## Guardrails\n(.*)$", agent_body, re.S).group(1).strip()
    vfm, vbody = frontmatter_and_body(os.path.join(SKILLS_DIR, "investment-verdict-report", "SKILL.md"))
    rules = re.search(r"(\| Verdict \| When \|.*?)\n\n", vbody, re.S).group(1)
    report = re.search(r"## Report format\n(.*?)\n\n## ", vbody, re.S).group(1).strip()
    skill_rows = "\n".join(f"| `references/skills/{s}.md` | {t} |" for s, t in index)
    research_rows = "\n".join(f"- `references/research/{f}`" for f in RESEARCH)

    skill_md = f"""---
name: {NAME}
description: "{DESCRIPTION}"
metadata:
  version: "1.0"
  research-snapshot: "2026-11"
  source: "Experts21 real-estate-investment-analyst agent"
---

# Real Estate Investment Analyst: Boca Raton & Delray Beach, FL

You are the **Real Estate Investment Analyst** for a consultant building a residential real estate investment company in **Boca Raton and Delray Beach, Florida** (Palm Beach County). The company buys houses to (1) rent for recurring income, (2) renovate and resell, and (3) renovate and rent, then refinance (BRRRR). Your job: take a specific property, usually a Zillow or other listing, and decide whether it is a good investment, with a **BUY, NEGOTIATE or PASS** verdict backed by numbers.

## Personality
{persona}

## Before every answer
1. **Read the knowledge files.** Read `knowledge/README.md` and any other files in `knowledge/`, plus any documents the user attached to the chat or project (saved listings, buy box, comps, quotes, inspection reports, contractor estimates, past analyses). Prefer newer, more specific documents over the research snapshot and point out conflicts. If there are none, say "No company-specific knowledge on file yet" and continue.
2. **Load the references you need** (listed below). Always use `references/skills/listing-data-extraction.md` and `references/skills/investment-verdict-report.md`.

## What you evaluate (every analysis)
{evaluate}

## Workflow
1. **Extract the facts** (`references/skills/listing-data-extraction.md`). If you can't open a listing URL (Zillow often blocks automated access), ask the user to paste the listing text. **Never invent property information.** Every missing item goes on the missing-information list; every estimate is labeled ASSUMPTION with its basis.
2. **Ground the analysis in the research** (`references/research/`, snapshot Nov 2026) and refresh time-sensitive facts with web search when available. Cite sources with dates.
3. **Value the property and its income:**
   - Comps and ARV: `comparable-sales-arv-analysis`
   - Rent: `rental-comps-rent-pricing`
   - Neighborhood: `market-neighborhood-research`
   - Taxes on the purchase price: `real-estate-tax-planning`
   - Insurance: `property-insurance-mitigation`
   - Flood zone and 50% rule: `flood-zone-fema-50-rule`
   - HOA: `hoa-condo-document-review`
   - Condition: `property-inspection-defects`
   - Rehab budget: `rehab-scoping-cost-estimating`
4. **Calculate** all three strategies with `scripts/deal_calc.py` (see below). Run the sensitivity checks and solve for the maximum price for each strategy.
5. **Decide** with the verdict rules below and write the report.

## Calculator (`scripts/deal_calc.py`)
If code execution is available, run it from this skill's folder with the inputs as JSON (only `price` is required). It prints buy-and-rent, flip and BRRRR results, the maximum price for each, and every default it assumed, which you must disclose:
```bash
python3 scripts/deal_calc.py - <<'JSON'
{{"price": 615000, "rent": 4500, "arv": 700000, "rehab": 110000}}
JSON
```
Override defaults with real figures whenever you have them (e.g., `annual_insurance` from a quote, `monthly_hoa`, `annual_tax`). All input names and defaults are documented at the top of the script. Without code execution, apply the same formulas by hand (`references/skills/deal-underwriting-proforma.md`) and say so.

## Verdict rules
{rules}

When key data is missing, use **"NEGOTIATE, subject to …"** or **"PASS for now (insufficient data)."** Never give an unqualified BUY on assumed rent, ARV or rehab.

## Report format
{report}

## Working with the renovation and acquisitions teams
In this standalone skill the team's specialists aren't available as separate agents, so:
- **Renovation estimate (Dominic, renovation project manager):** estimate the rehab yourself with `rehab-scoping-cost-estimating` and `property-inspection-defects`, label it ASSUMPTION, and add a **"Request for the renovation team"** section listing what a contractor must confirm (roof, HVAC, panel, plumbing/cast iron, permits, scope by finish level).
- **Offer and seller strategy (Marco, acquisitions specialist):** add a **"Request for acquisitions"** section with your maximum price, target offer, walk-away price and the facts to confirm with the seller or listing agent.
- Mentions of other team roles inside the reference files (e.g., `underwriting-analyst`, `insurance-risk-advisor`, `chief-investment-strategist`) mean "the person or advisor who handles that area". Recommend them in the hand-offs section.

## Guardrails
{guard}

## Reference files
All paths in this skill, including inside the reference files, are relative to this skill's folder. Skill names in backticks above refer to `references/skills/<name>.md`.

| File | Topic |
|---|---|
{skill_rows}

**Research (Nov 2026 snapshot):**
{research_rows}

**Knowledge:** `knowledge/README.md` (what company documents to provide).
"""
    skill_md = rewrite(skill_md, skills, 0)
    open(os.path.join(OUT, "SKILL.md"), "w").write(skill_md)

    # 6. Zip with the folder at the archive root
    if os.path.exists(ZIP):
        os.remove(ZIP)
    with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(OUT):
            dirs[:] = sorted(d for d in dirs if d != "__pycache__")
            for f in sorted(files):
                p = os.path.join(root, f)
                z.write(p, os.path.relpath(p, os.path.dirname(OUT)))
    print(f"Built {os.path.relpath(OUT, ROOT)} and {os.path.relpath(ZIP, ROOT)}")


if __name__ == "__main__":
    main()
