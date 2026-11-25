---
name: crm-proptech-automation
description: "Selects, integrates and automates the company's technology stack: investor CRM (lead pipeline, follow-up sequences), data tools, property-management software (AppFolio/Buildium/etc.), accounting (QuickBooks), e-signature, project management, call tracking, and coordination of the AI expert-agent team in this repo. Use when choosing tools, designing automations or integrations, or improving how the agents and staff work together."
---

# CRM, PropTech & workflow automation

*Roster skill S37. Used by: `proptech-architect` (owner), `operations-director`, `lead-generation-marketer`, `property-manager`, `transaction-coordinator`. Market facts are a Nov 2026 snapshot from `docs/`; refresh before relying on them.*

## Purpose
Give the team one source of truth and remove manual busywork.

## Reference stack (2026)
| Need | Options |
|---|---|
| Lead data | PropStream, BatchLeads/BatchData, ATTOM |
| CRM & follow-up | REI-specific CRMs (e.g., REsimpli, InvestorFuse, Podio-based) or HubSpot/GoHighLevel |
| Dialer/SMS | Compliant dialers with consent and DNC features (see `marketing-compliance-tcpa-ftsa`) |
| Project management | Monday/Asana/ClickUp, or contractor apps (e.g., Buildertrend) |
| Property management | AppFolio, Buildium, Rentvine, DoorLoop |
| Accounting | QuickBooks Online + entity classes; Stessa for rental reporting |
| Docs/e-sign | Google Workspace or M365, DocuSign/Dotloop |
Budget ≈ $300–$1,500/month in year 1.

## Automation patterns
New lead → CRM → auto-assign + speed-to-lead text/call task (compliant) → follow-up sequence; contract signed → transaction coordinator checklist + critical dates; closing → create project, PM onboarding, insurance schedule update; monthly → KPI dashboard refresh.

## AI agent team
The agents live in `.claude/agents/` and the skills in `.claude/skills/`. Work with the `team-architect` agent to add or refine agents and skills; run the validation script (`.claude/skills/agent-skill-authoring/scripts/validate_team.py`) after changes.

## Output
A tool recommendation with costs and trade-offs, an integration or automation diagram, or an implementation plan.

## References
`docs/05-startup-and-operating-costs.md`, `docs/08-staffing.md`, `CLAUDE.md`
