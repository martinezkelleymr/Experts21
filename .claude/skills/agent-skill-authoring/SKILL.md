---
name: agent-skill-authoring
description: "File formats, naming rules, templates and a validator for creating and improving Claude Code subagents (.claude/agents) and skills (.claude/skills) in this real estate expert team. Use when creating a new agent or skill, editing one, wiring skills to agents, updating the orchestrator routing table, or auditing the team."
---

# Authoring agents and skills for this team

Based on the official Claude Code docs: https://code.claude.com/docs/en/sub-agents and https://code.claude.com/docs/en/skills (re-read them if behavior seems off; the formats change).

## Subagent file: `.claude/agents/<name>.md`
```markdown
---
name: kebab-case-name            # required; unique; no ':'; can't start with '-'
description: <Role>. Use proactively for <when to delegate>.   # required; brief, trigger-focused
tools: Read, Grep, Glob, WebSearch, WebFetch, Skill   # optional; omit = inherit all; least privilege
skills:                          # optional; full skill content preloaded at startup (max 32)
  - skill-name-one
  - skill-name-two
color: green                     # optional: red, blue, green, yellow, purple, orange, pink, cyan
---

System prompt in Markdown: role, company context, responsibilities, how you work, deliverable format, hand-offs, guardrails.
```
Other supported fields (use only when needed): `disallowedTools`, `model` (sonnet/opus/haiku/inherit/full ID), `permissionMode`, `maxTurns`, `mcpServers`, `hooks`, `memory` (user/project/local), `background`, `effort`, `isolation: worktree`, `initialPrompt`. Field names must match exactly; unknown fields are silently ignored.

Notes:
- Skills with `disable-model-invocation: true` can't be preloaded.
- `Agent(type1, type2)` allowlists only work when the agent runs as the main thread (`claude --agent <name>`).
- Keep descriptions short: Claude Code warns when all descriptions combined pass ~15K tokens.

## Skill file: `.claude/skills/<skill-name>/SKILL.md`
```markdown
---
name: skill-name                 # matches the directory name
description: <What it does>. Use when <triggers>.   # with when_to_use, ≤ 1,536 chars shown
---

# Title
## Purpose
## Procedure (numbered steps)
## Local facts / benchmarks (Boca Raton & Delray Beach; cite docs/)
## Output (format of the deliverable)
## References (docs/ files)
```
- Keep `SKILL.md` under 500 lines; put long reference material in `reference.md` next to it and link it.
- Optional fields: `allowed-tools`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `context: fork` + `agent`, `model`, `effort`, `paths`. `$ARGUMENTS` expands to the arguments of `/skill-name ...`.
- `context: fork` only for skills that are a self-contained task; knowledge skills stay inline so agents can preload them.

## Team conventions
- Domain skills are **shared**: one skill, many agents. The first agent listed in the roster's skill matrix is its owner.
- Every agent must: say when to use it in `description`, list its skills, define its deliverable, hand-offs and guardrails, and point to the relevant `docs/` files.
- Licensed areas (legal, tax, insurance, brokerage, contracting) must say a licensed human signs off.
- Team size: 10–50 agents. Today: 25 roster experts + `expert-orchestrator` + `team-architect`.
- Mark unverified facts with ⚠️ and give the as-of date for market data.

## Checklist when adding or changing an agent or skill
1. Create or edit the file(s).
2. Update the agent `skills:` lists that should use a new skill.
3. Add the agent to the routing table in `.claude/skills/consult-experts/SKILL.md`.
4. Update `docs/expert-roster.md` (agents table, skill matrix, implementation map) and `CLAUDE.md`.
5. Run the validator and fix the errors:
```bash
python3 .claude/skills/agent-skill-authoring/scripts/validate_team.py
```
