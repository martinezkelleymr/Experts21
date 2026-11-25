#!/usr/bin/env python3
"""Validate the expert team: agents in .claude/agents, skills in .claude/skills.

Usage: python3 .claude/skills/agent-skill-authoring/scripts/validate_team.py
Exits with status 1 if any error is found. No third-party dependencies.
"""
import os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
AGENTS_DIR = os.path.join(ROOT, ".claude", "agents")
SKILLS_DIR = os.path.join(ROOT, ".claude", "skills")
ROUTING = os.path.join(SKILLS_DIR, "consult-experts", "SKILL.md")
ROSTER = os.path.join(ROOT, "docs", "expert-roster.md")
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
MODELS = {"opus", "sonnet", "haiku", "fable", "inherit"}
KNOWLEDGE_DIR = os.path.join(ROOT, "knowledge")
COLORS = {"red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"}
NON_ROUTED = {"expert-orchestrator", "team-architect"}

errors, warnings = [], []


def frontmatter(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None, text
    data, key = {}, None
    for i, line in enumerate(lines[1:], 1):
        if line.strip() == "---":
            return data, "\n".join(lines[i + 1:])
        m = re.match(r"^([A-Za-z_-]+):\s*(.*)$", line)
        if m:
            key, val = m.group(1), m.group(2).strip()
            data[key] = val.strip('"').strip("'") if val else []
        elif re.match(r"^\s+-\s+", line) and key and isinstance(data.get(key), list):
            data[key].append(re.sub(r"^\s+-\s+", "", line).strip())
    return None, text


# Skills
skills = {}
for d in sorted(os.listdir(SKILLS_DIR)) if os.path.isdir(SKILLS_DIR) else []:
    p = os.path.join(SKILLS_DIR, d, "SKILL.md")
    if not os.path.isfile(p):
        continue
    fm, body = frontmatter(p)
    if fm is None:
        errors.append(f"skill {d}: missing or malformed frontmatter")
        continue
    name = fm.get("name") or d
    if name != d:
        errors.append(f"skill {d}: name '{name}' doesn't match directory")
    if not NAME_RE.match(d):
        errors.append(f"skill {d}: directory name must be kebab-case")
    desc = fm.get("description") or ""
    if not desc:
        errors.append(f"skill {d}: missing description")
    elif len(desc) > 1536:
        errors.append(f"skill {d}: description over 1,536 characters")
    elif not re.search(r"\buse (when|for|before|while|as|whenever)\b", desc.lower()):
        warnings.append(f"skill {d}: description should say when to use it ('Use when ...')")
    n = len(open(p, encoding="utf-8").read().splitlines())
    if n > 500:
        errors.append(f"skill {d}: SKILL.md is {n} lines (limit 500)")
    skills[d] = fm

# Agents
agents, used = {}, {}
for root, _, files in os.walk(AGENTS_DIR):
    for f in sorted(files):
        if not f.endswith(".md"):
            continue
        p = os.path.join(root, f)
        fm, body = frontmatter(p)
        if fm is None:
            errors.append(f"agent {f}: missing or malformed frontmatter")
            continue
        name, desc = fm.get("name"), fm.get("description")
        if not name or not desc:
            errors.append(f"agent {f}: name and description are required")
            continue
        if not NAME_RE.match(name):
            errors.append(f"agent {f}: name '{name}' must be kebab-case")
        if name in agents:
            errors.append(f"agent {f}: duplicate name '{name}'")
        if fm.get("color") and fm["color"] not in COLORS:
            errors.append(f"agent {name}: invalid color '{fm['color']}'")
        sk = fm.get("skills") or []
        if isinstance(sk, str):
            sk = [s.strip() for s in sk.split(",") if s.strip()]
        if len(sk) > 32:
            errors.append(f"agent {name}: {len(sk)} skills (only the first 32 preload)")
        for s in sk:
            if s not in skills:
                errors.append(f"agent {name}: skill '{s}' not found in .claude/skills")
            used.setdefault(s, []).append(name)
        model = fm.get("model")
        if not model:
            warnings.append(f"agent {name}: no model set (inherits the session model)")
        elif model not in MODELS and not str(model).startswith("claude-"):
            errors.append(f"agent {name}: invalid model '{model}'")
        if not os.path.isfile(os.path.join(KNOWLEDGE_DIR, name, "README.md")):
            errors.append(f"agent {name}: missing knowledge/{name}/README.md")
        if f"knowledge/{name}/" not in body:
            errors.append(f"agent {name}: system prompt must tell it to read knowledge/{name}/ first")
        if "## Your personality" not in body:
            warnings.append(f"agent {name}: no '## Your personality' section")
        if len(body.strip()) < 200:
            warnings.append(f"agent {name}: system prompt looks very short")
        agents[name] = sk

if not 10 <= len(agents) <= 50:
    errors.append(f"team has {len(agents)} agents (target 10–50)")
for s in skills:
    if s not in used:
        warnings.append(f"skill {s}: not preloaded by any agent")

routing = open(ROUTING, encoding="utf-8").read() if os.path.isfile(ROUTING) else ""
roster = open(ROSTER, encoding="utf-8").read() if os.path.isfile(ROSTER) else ""
for a in agents:
    if a not in NON_ROUTED and f"`{a}`" not in routing:
        errors.append(f"agent {a}: missing from consult-experts routing table")
    if f"`{a}`" not in roster:
        warnings.append(f"agent {a}: not listed in docs/expert-roster.md")

brains = os.path.join(ROOT, "docs", "agent-brains.md")
brains_txt = open(brains, encoding="utf-8").read() if os.path.isfile(brains) else ""
for a in agents:
    if f"`{a}`" not in brains_txt:
        warnings.append(f"agent {a}: not listed in docs/agent-brains.md")

print(f"Agents: {len(agents)} | Skills: {len(skills)} | Skill links: {sum(len(v) for v in agents.values())}")
for w in warnings:
    print("WARN  ", w)
for e in errors:
    print("ERROR ", e)
print("OK" if not errors else f"FAILED with {len(errors)} error(s)")
sys.exit(1 if errors else 0)
