# BMAD for Kiro CLI — Analysis & Options

## Claude Code → Kiro CLI Feature Mapping

| Claude Code Concept | Kiro CLI Equivalent | Notes |
|---|---|---|
| `/clear` (reset context) | `/compact` | Kiro compacts (summarizes) rather than clears. No true `/clear` exists. Start a new `kiro-cli chat` session for a hard reset. |
| Slash commands (`.claude/commands/`) | Custom agents (`.kiro/agents/`) | Claude commands are prompt files triggered by `/name`. Kiro uses agents switched via `/agent swap`, `kiro-cli --agent name`, or keyboard shortcuts. |
| Subagents (`@agent-name` or Task tool) | `use_subagent` tool with `agent_name` | Both spawn isolated context windows. Kiro subagents currently lack `grep`, `glob`, `web_search`, `web_fetch`, and `use_aws` tools. |
| Skills (`.claude/skills/`, auto-invoked) | Skills (`skill://` resources, on-demand) | Both use YAML frontmatter with name/description. Both load full content on demand. Kiro skills declared in agent JSON `resources` field. |
| CLAUDE.md (always-loaded context) | Agent `prompt` field + `file://` resources | CLAUDE.md loads automatically. In Kiro, the agent prompt + file resources serve the same purpose. |
| Hooks (pre/post tool, lifecycle) | Hooks (identical concept) | Both support `agentSpawn`, `preToolUse`, `postToolUse`, `stop`. Kiro also has `userPromptSubmit`. |
| Plugins (bundled distribution) | No equivalent | Kiro has no plugin/marketplace. Distribute by copying `.kiro/agents/` and `skills/` directories. |
| `/clear` then `/command` (fresh context + workflow) | `/agent swap` to agent | Switching agents resets persona/prompt but keeps conversation history. Combined with `/compact` for a semi-fresh start. |

## Core Gaps

1. **No slash commands as workflow triggers** — In Claude Code, `/bmad-bmm-create-prd` fires a prompt that loads and executes a workflow. In Kiro, each workflow must be baked into an agent's prompt or triggered via natural language.

2. **No true context reset** — Claude Code's `/clear` gives a blank slate. Kiro's `/compact` summarizes. Starting a new `kiro-cli chat` session is the closest equivalent.

---

## Top 3 Options

### Option 1: Role-Based Agents (Current Approach, Refined)

Keep dedicated agents per role (bmad-pm, bmad-dev, bmad-sm, etc.). Each agent's prompt contains all workflow instructions for that role.

- Use `/agent swap` as the equivalent of switching context
- Use `/compact` before switching when context is bloated
- Configure orchestrator with `trustedAgents: ["bmad-*"]`

**Pros**: Already mostly built. Clean role separation. Each agent has focused context.
**Cons**: Can't trigger a specific workflow within a multi-workflow agent without natural language. No hard context boundary between workflows within the same agent.

### Option 2: Granular Workflow Agents

Split multi-workflow agents into single-purpose agents. One agent = one workflow.

Examples:
- `bmad-create-prd` — only PRD creation
- `bmad-validate-prd` — only PRD validation
- `bmad-create-epics` — only epic/story creation
- `bmad-create-story` — only story creation
- `bmad-dev-story` — only story implementation
- `bmad-code-review` — only code review

Each gets a keyboard shortcut for fast switching.

**Pros**: Closest to Claude Code `/command` experience. Minimal ambiguity. Orchestrator can target exact agents.
**Cons**: ~20+ agent files to maintain. Agent list gets long.

### Option 3: Skills-Based Workflow Loading (Hybrid)

Keep role-based agents but convert each workflow into a Kiro skill. Agent loads workflow instructions on-demand based on conversation context.

```
.kiro/skills/
├── create-prd/SKILL.md
├── validate-prd/SKILL.md
├── create-epics/SKILL.md
├── create-story/SKILL.md
├── dev-story/SKILL.md
├── code-review/SKILL.md
└── ...
```

Each SKILL.md has descriptive frontmatter for on-demand loading.

**Pros**: Fewest agents to maintain. Progressive context loading. Natural language triggers feel like slash commands.
**Cons**: Relies on description quality for correct skill invocation. No hard context boundary between workflows.

### Recommended Approach

**Option 2 for implementation workflows + Option 3 for planning workflows.**

Planning workflows (brainstorm, research, create-brief, create-prd) are interactive — skills work well.
Implementation workflows (create-story, dev-story, code-review, qa-automate) are autonomous — dedicated single-purpose agents work better for orchestrator delegation.

---

## Model Configuration

All agents use `claude-opus-4.6` via the `"model"` field in each agent JSON.

- 2.2x credit multiplier
- Available to Pro, Pro+, and Power tier subscribers
- Subagents inherit the model from their agent configuration
- Also set the global default: `kiro-cli settings chat.defaultModel claude-opus-4.6`
- Or in-session: `/model` → select Opus 4.5 → `/model set-current-as-default`

**Note**: Opus 4.6 (released Feb 5, 2026) has experimental Kiro support but the `model` field may not yet recognize it. Use `claude-opus-4.6` until 4.6 is fully integrated.

---

## Date

Analysis performed: 2026-02-07
