# BMAD Agents for Kiro CLI

Autonomous BMAD Method agents for Kiro CLI. Enables epic-to-PR pipeline without manual intervention.

## Installation

Copy the `agents/` and `skills/` directories to your project's `.kiro/` folder:

```bash
cp -r agents/ skills/ /path/to/your/project/.kiro/
```

## Usage

```bash
# Start the orchestrator for autonomous epic execution
kiro-cli --agent bmad-orchestrator

# Or use individual agents
kiro-cli --agent bmad-sm      # Story creation
kiro-cli --agent bmad-dev     # Development
kiro-cli --agent bmad-reviewer # Code review
kiro-cli --agent bmad-qa      # E2E testing
```

## Target Workflow
Autonomous epic execution: create-story → dev-story → code-review → e2e-tests → PR/merge, looping through all stories.

---

## Progress

### ✅ Completed

**2026-02-04: Agent Setup**
- Created `bmad-sm.json` - Scrum Master agent for story creation
- Created `bmad-dev.json` - Developer agent for implementation
- Created `bmad-reviewer.json` - Code reviewer with auto-fix
- Created `bmad-qa.json` - QA agent for Playwright E2E tests
- Created `bmad-orchestrator.json` - Master orchestrator for the full pipeline
- Created `run-epic` skill in `.kiro/skills/`

### 🔄 In Progress

- Testing subagent invocation with custom agents
- Validating workflow.xml integration

### 📋 TODO

- [ ] Test full pipeline on a sample epic
- [ ] Verify git branch/PR automation works
- [ ] Add error recovery mechanisms
- [ ] Consider parallel subagent execution for independent tasks

---

## Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Use subagents for agent isolation | Mirrors Claude Code's "new context window" pattern | 2026-02-04 |
| Single orchestrator agent | Simpler than chained skills; can manage state | 2026-02-04 |
| Agents reference workflow.xml | Reuse existing BMAD workflow engine | 2026-02-04 |
| Auto-fix in reviewer | Matches Claude Code autonomous behavior | 2026-02-04 |

---

## Architecture

```
bmad-orchestrator (main loop)
    ├── bmad-sm (subagent) → create-story workflow
    ├── bmad-dev (subagent) → dev-story workflow
    ├── bmad-reviewer (subagent) → code-review workflow
    └── bmad-qa (subagent) → playwright tests (conditional)
```

---

## File Structure

```
.kiro/
├── agents/
│   ├── bmad-orchestrator.json + prompt.md
│   ├── bmad-sm.json + prompt.md
│   ├── bmad-dev.json + prompt.md
│   ├── bmad-reviewer.json + prompt.md
│   └── bmad-qa.json + prompt.md
└── skills/
    └── run-epic/SKILL.md
```

---

## Claude Code → Kiro Mapping

| Claude Code | Kiro CLI |
|-------------|----------|
| New context window | Subagent with `agent_name` |
| `/agent switch` | `/agent swap` or subagent |
| `.claude/commands/` | `.kiro/skills/` |
| Slash command workflows | Skills (on-demand loading) |
| Swarm mode | Parallel subagents (max 4) |

---

## Open Questions

1. How to pass story file path between subagent phases?
2. Best way to detect "frontend story" for QA phase?
3. Error handling when subagent fails mid-pipeline?

---

## Notes

- Kiro subagents have isolated context (good for BMAD's fresh-context-per-agent pattern)
- Skills use YAML frontmatter with `name` and `description`
- Orchestrator can spawn up to 4 parallel subagents if tasks are independent
