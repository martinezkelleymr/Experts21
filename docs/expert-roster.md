# Expert Roster: Boca Raton & Delray Beach Real Estate Investment Company

This is the advisory team for a consultant to a company that buys houses in Boca Raton and Delray Beach, FL, to **rent**, **renovate and resell**, or **renovate and rent (BRRRR)**. Each role below will become an AI agent. The roster is built on the research in this folder (see [README.md](README.md)); the "Key docs" column lists the research files each agent relies on most.

**25 agents · 38 skills · 8 domains.** Agent codes (e.g., `UND`) are used in the skill tables.

> Licensed roles (attorneys, CPA, real-estate broker, contractors, insurance agent) need a licensed human to sign off. Their agents advise and draft; they don't replace the professional.

## 1. Expert agents


### Real Estate Investment

| # | Code | Role | One-line job description | Key docs |
|---|---|---|---|---|
| 1 | `CIS` | **Chief Investment Strategist** | Sets the buy box, picks rent, flip or BRRRR for each deal, and makes the final go/no-go call on capital. | 01, 04, 10 |
| 2 | `MRA` | **Market Research Analyst** | Tracks Boca and Delray prices, rents, inventory, investor activity and policy shifts such as Amendment 3, down to the ZIP code. | 01, 02 |
| 3 | `ACQ` | **Acquisitions & Deal Sourcing Specialist** | Works motivated-seller and off-market leads, runs seller appointments and makes offers inside the buy box. | 02, 03, 09 |
| 4 | `DISP` | **Dispositions & Exit Specialist** | Sells finished flips during the Nov–Apr season, wholesales or assigns deals that don't fit, and manages the cash-buyer list. | 04, 09 |

### Property Analysis

| # | Code | Role | One-line job description | Key docs |
|---|---|---|---|---|
| 5 | `UND` | **Underwriting & Valuation Analyst** | Builds ARV from sold comps, rent comps, rehab budgets and DSCR math to set the maximum allowable offer for every exit. | 04, 05, 06 |
| 6 | `DD` | **Due Diligence & Inspection Specialist** | Checks jurisdiction, flood zone, permit history, liens, HOA documents and physical defects before the inspection period ends. | 02, 07, 10 |
| 7 | `INS` | **Insurance & Catastrophe Risk Advisor** | Gets landlord, flood and builder's-risk quotes before contract and plans roof, wind and hurricane mitigation. | 05, 07, 10 |

### Finance

| # | Code | Role | One-line job description | Key docs |
|---|---|---|---|---|
| 8 | `CAP` | **Capital Markets & Lending Advisor** | Sources and structures hard-money, DSCR, bank and private-money financing, plus BRRRR cash-out refinances. | 06 |
| 9 | `CFO` | **Chief Financial Officer / FP&A** | Owns the company budget, deal and portfolio cash flow, reserves, bookkeeping oversight and investor reporting. | 05, 06 |
| 10 | `TAX` | **Real Estate Tax Strategist (CPA)** | Plans entity tax elections, dealer vs. investor treatment, depreciation, 1031 exchanges and property-tax appeals under Florida's new caps. | 01, 05, 07 |
| 11 | `IR` | **Investor Relations & Partnerships Manager** | Builds and keeps relationships with private lenders, JV partners, referral attorneys and agents. | 06, 09 |

### Renovation

| # | Code | Role | One-line job description | Key docs |
|---|---|---|---|---|
| 12 | `REN` | **Renovation Project Manager & Estimator** | Writes rehab scopes and bids, schedules licensed contractors, and controls budget, timeline, draws and quality. | 04, 05, 10 |
| 13 | `PERM` | **Permitting & Code Specialist** | Gets building permits from Boca Raton, Delray Beach or Palm Beach County, including FEMA 50% rule and historic review. | 07 |
| 14 | `DES` | **Interior Design & Staging Specialist** | Chooses durable, buyer-appealing finishes for each price point and stages flips for photos and showings. | 04, 09 |

### Operations

| # | Code | Role | One-line job description | Key docs |
|---|---|---|---|---|
| 15 | `COO` | **Operations Director** | Designs processes, KPIs, staffing and vendor management so deals move from lead to closing to stabilization. | 08, 10 |
| 16 | `PM` | **Property Manager & Leasing Specialist** | Prices, markets and leases rentals, screens tenants, handles maintenance, and oversees any third-party manager. | 04, 05, 07 |
| 17 | `TC` | **Transaction Coordinator / Closing Manager** | Runs every purchase and sale from contract to close: deadlines, title, escrow, lender conditions and documents. | 05, 07 |

### Legal

| # | Code | Role | One-line job description | Key docs |
|---|---|---|---|---|
| 18 | `ATTY` | **Real Estate Transaction Attorney** | Drafts and reviews purchase, assignment and sale contracts and handles title, closing and contract disputes under Florida law. | 07 |
| 19 | `LT` | **Landlord-Tenant & Fair Housing Counsel** | Keeps leases, deposits, notices and evictions within Chapter 83 and federal, state and county fair-housing law. | 07 |
| 20 | `ENT` | **Corporate Entity & Securities Counsel** | Structures the holding and property LLCs, operating agreements, FinCEN reporting and Reg D offerings for raising capital. | 05, 06, 07 |
| 21 | `COMP` | **Regulatory Compliance Officer** | Tracks licenses, BTRs, tourist and sales tax, Chapter 475 brokerage limits, TCPA/FTSA rules and new legislation. | 07, 09, 10 |

### Marketing

| # | Code | Role | One-line job description | Key docs |
|---|---|---|---|---|
| 22 | `LEAD` | **Lead Generation Marketer** | Runs direct mail, PPC, SEO, SMS and calling campaigns aimed at motivated sellers and reports cost per deal. | 09 |
| 23 | `BRAND` | **Brand & Content Marketer** | Builds a trustworthy local brand, before-and-after content, flip listing marketing and rental ads. | 09 |

### Technology

| # | Code | Role | One-line job description | Key docs |
|---|---|---|---|---|
| 24 | `DATA` | **Data & Analytics Engineer** | Builds data pipelines from property data tools, MLS, the Property Appraiser and the Clerk into lead lists, comps and KPI dashboards. | 01, 03, 09 |
| 25 | `TECH` | **PropTech Systems Architect** | Chooses and integrates CRM, property-management and accounting software, automates workflows, coordinates the agent team and secures systems. | 05, 08 |

## 2. Skills, and which agents use them

Each skill is defined once and shared by every agent listed. The **first agent listed is the skill's owner**: it maintains that skill's knowledge and keeps it current.

| # | Skill | What it covers | Used by (owner first) | # agents |
|---|---|---|---|---|
| S01 | **Comparable sales & ARV analysis** | Pick and adjust recent sold comps (6 months or less) to estimate after-repair value. | `UND`, `ACQ`, `DISP`, `CIS`, `MRA` | 5 |
| S02 | **Rental comps & rent pricing** | Estimate market rent by bedroom count, school zone and season; long-term vs. seasonal furnished. | `MRA`, `UND`, `PM`, `CIS` | 4 |
| S03 | **Deal underwriting & pro-forma modeling** | Flip, rental and BRRRR models: max offer (70–75% of ARV minus rehab), holding costs, cash-on-cash return, cap rate, DSCR stress tests. | `UND`, `CIS`, `CFO`, `CAP`, `ACQ` | 5 |
| S04 | **Exit strategy analysis** | Compare sell, rent, refinance and wholesale exits for each property, including seasonal timing. | `CIS`, `UND`, `DISP`, `CFO` | 4 |
| S05 | **Market & neighborhood research** | ZIP and neighborhood trends, city vs. unincorporated, schools, demand drivers, investor activity. | `MRA`, `CIS`, `ACQ`, `UND`, `DATA` | 5 |
| S06 | **Public records research** | Palm Beach County Property Appraiser and Clerk: ownership, sales, liens, lis pendens, probate, permit history, code cases. | `DD`, `ACQ`, `ATTY`, `PERM`, `DATA`, `TC` | 6 |
| S07 | **Flood zone & FEMA 50% rule assessment** | Find the FEMA zone, estimate structure value and check whether the rehab scope triggers substantial improvement. | `DD`, `PERM`, `INS`, `UND`, `REN` | 5 |
| S08 | **Property insurance quoting & mitigation** | 4-point and wind-mitigation reports, roof-age rules (§627.7011), DP-3, flood and builder's-risk quotes, mitigation credits. | `INS`, `DD`, `UND`, `PM`, `CFO` | 5 |
| S09 | **Property inspection & defect identification** | Spot cast-iron drains, old electrical panels, polybutylene/galvanized pipe, Chinese drywall, lead paint, termites, mold and roof condition. | `DD`, `REN`, `PM` | 3 |
| S10 | **HOA & condo document review** | Leasing restrictions, approvals, estoppels, special assessments, milestone inspection/SIRS status, 55+ rules. | `DD`, `ATTY`, `UND`, `PM` | 4 |
| S11 | **Rehab scoping & cost estimating** | Line-item scopes and budgets using South Florida cost benchmarks, with a 10–20% contingency. | `REN`, `UND`, `DD`, `DES` | 4 |
| S12 | **Florida building permits & code** | City vs. county permit offices, Florida Building Code, notices of commencement, lien law, verifying contractor licenses. | `PERM`, `REN`, `COMP`, `ATTY` | 4 |
| S13 | **Historic preservation review** | Delray Certificates of Appropriateness and Boca historic overlays: design limits and approval timelines. | `PERM`, `REN`, `DES` | 3 |
| S14 | **Construction project & draw management** | Schedules, inspections, lender draw requests, change orders, lien releases. | `REN`, `CAP`, `COO`, `CFO` | 4 |
| S15 | **Contractor & vendor management** | Bid, vet (license, insurance, references), contract and review GCs, trades, title, inspectors and property managers. | `REN`, `COO`, `PM`, `TC` | 4 |
| S16 | **Interior design, finish selection & staging** | Finish packages by price point and tenant vs. buyer use; staging and photo prep. | `DES`, `REN`, `DISP`, `BRAND` | 4 |
| S17 | **Seller negotiation & offer strategy** | Find what the seller needs, structure offers (cash, terms, seller financing) and handle objections. | `ACQ`, `DISP`, `CIS` | 3 |
| S18 | **Lending & capital stack structuring** | Hard money, DSCR, conventional, portfolio, private money, HELOC; leverage, refi seasoning, prepayment penalties. | `CAP`, `CFO`, `CIS`, `IR` | 4 |
| S19 | **Financial planning, budgeting & cash management** | Company budget, reserves, deal cash flow, portfolio reporting, bookkeeping oversight. | `CFO`, `CIS`, `CAP`, `COO` | 4 |
| S20 | **Real estate tax planning** | Amendment 3 caps, millage, reassessment on sale, depreciation and cost segregation, 1031 exchanges, dealer status, entity elections. | `TAX`, `CFO`, `CIS`, `ENT` | 4 |
| S21 | **Entity structuring & securities** | LLC hierarchy, operating agreements, FinCEN reporting, Reg D 506(b)/(c) offerings. | `ENT`, `CFO`, `TAX`, `IR` | 4 |
| S22 | **Florida contract & closing law** | FAR/BAR contracts, assignments, double closings, doc stamps and intangible tax, title insurance, disclosures. | `ATTY`, `TC`, `ACQ`, `DISP` | 4 |
| S23 | **Real estate licensing compliance (Ch. 475)** | What unlicensed people may and may not do: wholesaling marketing, brokerage, managing property for others. | `COMP`, `ATTY`, `ACQ`, `DISP`, `LEAD` | 5 |
| S24 | **Florida landlord-tenant law (Ch. 83)** | Leases, security deposits, notices, evictions, squatter removal, state preemption of local rules. | `LT`, `PM`, `COMP` | 3 |
| S25 | **Fair housing compliance** | Federal, Florida and Palm Beach County protected classes; advertising, screening and accommodation requests. | `LT`, `PM`, `COMP`, `BRAND`, `LEAD` | 5 |
| S26 | **Business tax & rental tax registrations** | City and county BTRs, county tourist tax (TDT) and state sales tax on rentals of 6 months or less, DBPR vacation-rental license. | `COMP`, `TAX`, `PM`, `COO` | 4 |
| S27 | **Regulatory & legislative monitoring** | Track changes to insurance, condo, property-tax, landlord-tenant and short-term rental laws and local ordinances. | `COMP`, `ATTY`, `LT`, `TAX`, `INS`, `MRA` | 6 |
| S28 | **Marketing compliance (TCPA / FTSA / DNC)** | Consent, call-time and autodialer rules, do-not-call scrubbing, CAN-SPAM, avoiding predatory or elder-targeting tactics. | `COMP`, `LEAD`, `BRAND`, `TECH` | 4 |
| S29 | **Lead generation & direct-response marketing** | List building (absentee, probate, pre-foreclosure, tax delinquent), mail, PPC, SEO, SMS, cost-per-deal tracking. | `LEAD`, `ACQ`, `DATA` | 3 |
| S30 | **Brand, content & listing marketing** | Local brand, reviews, before-and-after content, MLS listing copy, photo and video, rental ads. | `BRAND`, `DISP`, `DES`, `PM` | 4 |
| S31 | **Relationship & network management** | Private lenders, cash buyers, agents, wholesalers, probate/divorce attorneys, lenders. | `IR`, `DISP`, `ACQ`, `CAP`, `LEAD` | 5 |
| S32 | **Tenant screening, leasing & rental operations** | Screening criteria (income 3x rent, credit, eviction history, HUD criminal-history guidance), move-in/out, maintenance, renewals. | `PM`, `LT`, `COO` | 3 |
| S33 | **Transaction coordination & closing management** | Contract timelines, inspection and financing deadlines, title and escrow, closing checklists. | `TC`, `ATTY`, `ACQ`, `DISP` | 4 |
| S34 | **Risk assessment & hurricane preparedness** | Risk register, storm plans for vacant rehabs and rentals, reserves, concentration risk. | `INS`, `COO`, `REN`, `PM`, `CIS` | 5 |
| S35 | **Process design, KPIs & staffing** | Workflows, SOPs, scorecards, hiring plans, in-house vs. outsourced decisions. | `COO`, `CIS`, `CFO`, `TECH` | 4 |
| S36 | **Real estate data engineering & analytics** | Pipelines from data tools, MLS and public records; dashboards; lead scoring; competitor tracking. | `DATA`, `MRA`, `LEAD`, `CFO`, `TECH` | 5 |
| S37 | **CRM, PropTech & workflow automation** | CRM, property-management, accounting and e-signature tools; integrations; multi-agent orchestration. | `TECH`, `COO`, `LEAD`, `PM`, `TC` | 5 |
| S38 | **Cybersecurity & wire-fraud prevention** | Verify wiring instructions, protect PII and tenant data, manage access, recognize phishing. | `TECH`, `TC`, `CFO`, `ATTY` | 4 |

## 3. Skills by agent

The same mapping as section 2, viewed from each agent. Use it as the skill list when building each agent.

| Code | Role | Skills |
|---|---|---|
| `CIS` | Chief Investment Strategist | S01 Comparable sales & ARV analysis; S02 Rental comps & rent pricing; S03 Deal underwriting & pro-forma modeling; S04 Exit strategy analysis; S05 Market & neighborhood research; S17 Seller negotiation & offer strategy; S18 Lending & capital stack structuring; S19 Financial planning, budgeting & cash management; S20 Real estate tax planning; S34 Risk assessment & hurricane preparedness; S35 Process design, KPIs & staffing (11) |
| `MRA` | Market Research Analyst | S01 Comparable sales & ARV analysis; S02 Rental comps & rent pricing; S05 Market & neighborhood research; S27 Regulatory & legislative monitoring; S36 Real estate data engineering & analytics (5) |
| `ACQ` | Acquisitions & Deal Sourcing Specialist | S01 Comparable sales & ARV analysis; S03 Deal underwriting & pro-forma modeling; S05 Market & neighborhood research; S06 Public records research; S17 Seller negotiation & offer strategy; S22 Florida contract & closing law; S23 Real estate licensing compliance (Ch. 475); S29 Lead generation & direct-response marketing; S31 Relationship & network management; S33 Transaction coordination & closing management (10) |
| `DISP` | Dispositions & Exit Specialist | S01 Comparable sales & ARV analysis; S04 Exit strategy analysis; S16 Interior design, finish selection & staging; S17 Seller negotiation & offer strategy; S22 Florida contract & closing law; S23 Real estate licensing compliance (Ch. 475); S30 Brand, content & listing marketing; S31 Relationship & network management; S33 Transaction coordination & closing management (9) |
| `UND` | Underwriting & Valuation Analyst | S01 Comparable sales & ARV analysis; S02 Rental comps & rent pricing; S03 Deal underwriting & pro-forma modeling; S04 Exit strategy analysis; S05 Market & neighborhood research; S07 Flood zone & FEMA 50% rule assessment; S08 Property insurance quoting & mitigation; S10 HOA & condo document review; S11 Rehab scoping & cost estimating (9) |
| `DD` | Due Diligence & Inspection Specialist | S06 Public records research; S07 Flood zone & FEMA 50% rule assessment; S08 Property insurance quoting & mitigation; S09 Property inspection & defect identification; S10 HOA & condo document review; S11 Rehab scoping & cost estimating (6) |
| `INS` | Insurance & Catastrophe Risk Advisor | S07 Flood zone & FEMA 50% rule assessment; S08 Property insurance quoting & mitigation; S27 Regulatory & legislative monitoring; S34 Risk assessment & hurricane preparedness (4) |
| `CAP` | Capital Markets & Lending Advisor | S03 Deal underwriting & pro-forma modeling; S14 Construction project & draw management; S18 Lending & capital stack structuring; S19 Financial planning, budgeting & cash management; S31 Relationship & network management (5) |
| `CFO` | Chief Financial Officer / FP&A | S03 Deal underwriting & pro-forma modeling; S04 Exit strategy analysis; S08 Property insurance quoting & mitigation; S14 Construction project & draw management; S18 Lending & capital stack structuring; S19 Financial planning, budgeting & cash management; S20 Real estate tax planning; S21 Entity structuring & securities; S35 Process design, KPIs & staffing; S36 Real estate data engineering & analytics; S38 Cybersecurity & wire-fraud prevention (11) |
| `TAX` | Real Estate Tax Strategist (CPA) | S20 Real estate tax planning; S21 Entity structuring & securities; S26 Business tax & rental tax registrations; S27 Regulatory & legislative monitoring (4) |
| `IR` | Investor Relations & Partnerships Manager | S18 Lending & capital stack structuring; S21 Entity structuring & securities; S31 Relationship & network management (3) |
| `REN` | Renovation Project Manager & Estimator | S07 Flood zone & FEMA 50% rule assessment; S09 Property inspection & defect identification; S11 Rehab scoping & cost estimating; S12 Florida building permits & code; S13 Historic preservation review; S14 Construction project & draw management; S15 Contractor & vendor management; S16 Interior design, finish selection & staging; S34 Risk assessment & hurricane preparedness (9) |
| `PERM` | Permitting & Code Specialist | S06 Public records research; S07 Flood zone & FEMA 50% rule assessment; S12 Florida building permits & code; S13 Historic preservation review (4) |
| `DES` | Interior Design & Staging Specialist | S11 Rehab scoping & cost estimating; S13 Historic preservation review; S16 Interior design, finish selection & staging; S30 Brand, content & listing marketing (4) |
| `COO` | Operations Director | S14 Construction project & draw management; S15 Contractor & vendor management; S19 Financial planning, budgeting & cash management; S26 Business tax & rental tax registrations; S32 Tenant screening, leasing & rental operations; S34 Risk assessment & hurricane preparedness; S35 Process design, KPIs & staffing; S37 CRM, PropTech & workflow automation (8) |
| `PM` | Property Manager & Leasing Specialist | S02 Rental comps & rent pricing; S08 Property insurance quoting & mitigation; S09 Property inspection & defect identification; S10 HOA & condo document review; S15 Contractor & vendor management; S24 Florida landlord-tenant law (Ch. 83); S25 Fair housing compliance; S26 Business tax & rental tax registrations; S30 Brand, content & listing marketing; S32 Tenant screening, leasing & rental operations; S34 Risk assessment & hurricane preparedness; S37 CRM, PropTech & workflow automation (12) |
| `TC` | Transaction Coordinator / Closing Manager | S06 Public records research; S15 Contractor & vendor management; S22 Florida contract & closing law; S33 Transaction coordination & closing management; S37 CRM, PropTech & workflow automation; S38 Cybersecurity & wire-fraud prevention (6) |
| `ATTY` | Real Estate Transaction Attorney | S06 Public records research; S10 HOA & condo document review; S12 Florida building permits & code; S22 Florida contract & closing law; S23 Real estate licensing compliance (Ch. 475); S27 Regulatory & legislative monitoring; S33 Transaction coordination & closing management; S38 Cybersecurity & wire-fraud prevention (8) |
| `LT` | Landlord-Tenant & Fair Housing Counsel | S24 Florida landlord-tenant law (Ch. 83); S25 Fair housing compliance; S27 Regulatory & legislative monitoring; S32 Tenant screening, leasing & rental operations (4) |
| `ENT` | Corporate Entity & Securities Counsel | S20 Real estate tax planning; S21 Entity structuring & securities (2) |
| `COMP` | Regulatory Compliance Officer | S12 Florida building permits & code; S23 Real estate licensing compliance (Ch. 475); S24 Florida landlord-tenant law (Ch. 83); S25 Fair housing compliance; S26 Business tax & rental tax registrations; S27 Regulatory & legislative monitoring; S28 Marketing compliance (TCPA / FTSA / DNC) (7) |
| `LEAD` | Lead Generation Marketer | S23 Real estate licensing compliance (Ch. 475); S25 Fair housing compliance; S28 Marketing compliance (TCPA / FTSA / DNC); S29 Lead generation & direct-response marketing; S31 Relationship & network management; S36 Real estate data engineering & analytics; S37 CRM, PropTech & workflow automation (7) |
| `BRAND` | Brand & Content Marketer | S16 Interior design, finish selection & staging; S25 Fair housing compliance; S28 Marketing compliance (TCPA / FTSA / DNC); S30 Brand, content & listing marketing (4) |
| `DATA` | Data & Analytics Engineer | S05 Market & neighborhood research; S06 Public records research; S29 Lead generation & direct-response marketing; S36 Real estate data engineering & analytics (4) |
| `TECH` | PropTech Systems Architect | S28 Marketing compliance (TCPA / FTSA / DNC); S35 Process design, KPIs & staffing; S36 Real estate data engineering & analytics; S37 CRM, PropTech & workflow automation; S38 Cybersecurity & wire-fraud prevention (5) |

## 4. Most-shared skills

Build these first, because the most agents depend on them:

- **S06 Public records research**: 6 agents
- **S27 Regulatory & legislative monitoring**: 6 agents
- **S01 Comparable sales & ARV analysis**: 5 agents
- **S03 Deal underwriting & pro-forma modeling**: 5 agents
- **S05 Market & neighborhood research**: 5 agents
- **S07 Flood zone & FEMA 50% rule assessment**: 5 agents
- **S08 Property insurance quoting & mitigation**: 5 agents
- **S23 Real estate licensing compliance (Ch. 475)**: 5 agents

## 5. How the agents work together on a deal

1. `MRA` + `DATA` → target ZIPs and lead lists → `LEAD` runs campaigns (with compliance checks from `COMP`).
2. `ACQ` qualifies the seller → `UND` underwrites all three exits → `DD`, `INS` and `PERM` check flood zone, insurance, permits and HOA rules → `CIS` approves.
3. `ATTY` + `TC` handle the contract and closing → `CAP` lines up financing → `CFO` books it.
4. `REN` + `DES` renovate, with permits from `PERM` → exit through `DISP` + `BRAND` (sell) or `PM` + `LT` (rent) → BRRRR refinance through `CAP`.
5. `COO`, `TECH`, `TAX`, `ENT` and `IR` support every stage; `COMP` and `INS` monitor ongoing risk.

## 6. Implementation map

The roster is implemented as Claude Code project subagents and skills. See [`CLAUDE.md`](../CLAUDE.md) for how to use the team.

### Agents (`.claude/agents/`)

| Code | Role | Agent file |
|---|---|---|
| `CIS` | Chief Investment Strategist | `chief-investment-strategist` |
| `MRA` | Market Research Analyst | `market-research-analyst` |
| `ACQ` | Acquisitions & Deal Sourcing Specialist | `acquisitions-specialist` |
| `DISP` | Dispositions & Exit Specialist | `dispositions-specialist` |
| `UND` | Underwriting & Valuation Analyst | `underwriting-analyst` |
| `DD` | Due Diligence & Inspection Specialist | `due-diligence-specialist` |
| `INS` | Insurance & Catastrophe Risk Advisor | `insurance-risk-advisor` |
| `CAP` | Capital Markets & Lending Advisor | `capital-markets-advisor` |
| `CFO` | Chief Financial Officer / FP&A | `cfo-financial-planner` |
| `TAX` | Real Estate Tax Strategist (CPA) | `tax-strategist` |
| `IR` | Investor Relations & Partnerships Manager | `investor-relations-manager` |
| `REN` | Renovation Project Manager & Estimator | `renovation-project-manager` |
| `PERM` | Permitting & Code Specialist | `permitting-code-specialist` |
| `DES` | Interior Design & Staging Specialist | `interior-design-staging-specialist` |
| `COO` | Operations Director | `operations-director` |
| `PM` | Property Manager & Leasing Specialist | `property-manager` |
| `TC` | Transaction Coordinator / Closing Manager | `transaction-coordinator` |
| `ATTY` | Real Estate Transaction Attorney | `real-estate-attorney` |
| `LT` | Landlord-Tenant & Fair Housing Counsel | `landlord-tenant-counsel` |
| `ENT` | Corporate Entity & Securities Counsel | `entity-securities-counsel` |
| `COMP` | Regulatory Compliance Officer | `compliance-officer` |
| `LEAD` | Lead Generation Marketer | `lead-generation-marketer` |
| `BRAND` | Brand & Content Marketer | `brand-content-marketer` |
| `DATA` | Data & Analytics Engineer | `data-analytics-engineer` |
| `TECH` | PropTech Systems Architect | `proptech-architect` |
| — | Orchestrator: routes questions, coordinates experts, merges one answer | `expert-orchestrator` |
| — | Meta agent: creates and improves agents and skills | `team-architect` |

### Skills (`.claude/skills/<name>/SKILL.md`)

| # | Skill | Directory |
|---|---|---|
| S01 | Comparable sales & ARV analysis | `comparable-sales-arv-analysis` |
| S02 | Rental comps & rent pricing | `rental-comps-rent-pricing` |
| S03 | Deal underwriting & pro-forma modeling | `deal-underwriting-proforma` |
| S04 | Exit strategy analysis | `exit-strategy-analysis` |
| S05 | Market & neighborhood research | `market-neighborhood-research` |
| S06 | Public records research | `public-records-research` |
| S07 | Flood zone & FEMA 50% rule assessment | `flood-zone-fema-50-rule` |
| S08 | Property insurance quoting & mitigation | `property-insurance-mitigation` |
| S09 | Property inspection & defect identification | `property-inspection-defects` |
| S10 | HOA & condo document review | `hoa-condo-document-review` |
| S11 | Rehab scoping & cost estimating | `rehab-scoping-cost-estimating` |
| S12 | Florida building permits & code | `florida-building-permits-code` |
| S13 | Historic preservation review | `historic-preservation-review` |
| S14 | Construction project & draw management | `construction-draw-management` |
| S15 | Contractor & vendor management | `contractor-vendor-management` |
| S16 | Interior design, finish selection & staging | `interior-design-staging` |
| S17 | Seller negotiation & offer strategy | `seller-negotiation-offers` |
| S18 | Lending & capital stack structuring | `lending-capital-stack` |
| S19 | Financial planning, budgeting & cash management | `financial-planning-cash-management` |
| S20 | Real estate tax planning | `real-estate-tax-planning` |
| S21 | Entity structuring & securities | `entity-structuring-securities` |
| S22 | Florida contract & closing law | `florida-contract-closing-law` |
| S23 | Real estate licensing compliance (Ch. 475) | `real-estate-licensing-compliance` |
| S24 | Florida landlord-tenant law (Ch. 83) | `florida-landlord-tenant-law` |
| S25 | Fair housing compliance | `fair-housing-compliance` |
| S26 | Business tax & rental tax registrations | `business-rental-tax-registrations` |
| S27 | Regulatory & legislative monitoring | `regulatory-legislative-monitoring` |
| S28 | Marketing compliance (TCPA / FTSA / DNC) | `marketing-compliance-tcpa-ftsa` |
| S29 | Lead generation & direct-response marketing | `lead-generation-direct-response` |
| S30 | Brand, content & listing marketing | `brand-content-listing-marketing` |
| S31 | Relationship & network management | `relationship-network-management` |
| S32 | Tenant screening, leasing & rental operations | `tenant-screening-leasing-operations` |
| S33 | Transaction coordination & closing management | `transaction-coordination-closing` |
| S34 | Risk assessment & hurricane preparedness | `risk-hurricane-preparedness` |
| S35 | Process design, KPIs & staffing | `process-kpis-staffing` |
| S36 | Real estate data engineering & analytics | `real-estate-data-analytics` |
| S37 | CRM, PropTech & workflow automation | `crm-proptech-automation` |
| S38 | Cybersecurity & wire-fraud prevention | `cybersecurity-wire-fraud-prevention` |
| S39 | Expert routing & collaboration (used by `expert-orchestrator`; also `/consult-experts`) | `consult-experts` |
| S40 | Agent & skill authoring + validator (used by `team-architect`, `proptech-architect`) | `agent-skill-authoring` |
