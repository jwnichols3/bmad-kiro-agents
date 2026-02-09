# BMAD-Kiro Test Run: npx @jwnichols3/bmad-kiro-agents Installer

## The Idea

`npx @jwnichols3/bmad-kiro-agents` — an installer CLI that copies the `.kiro/agents/`, `.kiro/skills/`, and `_bmad/` directories into a target project, similar to how the BMAD method installer works for Claude Code/Cursor.

---

## Full BMAD-Kiro Pipeline: Command by Command

### Phase 1: Analysis (Idea → Brief)

```bash
# Start with the Analyst agent
kiro-cli chat --agent bmad-analyst --trust-all-tools

# Step 1: Brainstorm the idea (optional, good for exploring scope)
> "Let's brainstorm the npx installer for bmad-kiro-agents.
   It should copy .kiro/agents/, .kiro/skills/, and _bmad/ into a target project.
   Similar to create-react-app but for BMAD method files."

# Step 2: Create the product brief
> "Create a product brief for this idea"
# Agent runs the create-product-brief workflow
# Output: _bmad-output/planning-artifacts/product-brief.md
```

### Phase 2: Planning (Brief → PRD)

```bash
# Switch to PM agent (or start fresh session)
kiro-cli chat --agent bmad-pm --trust-all-tools

# Step 3: Create the PRD from the brief
> "Create a PRD from the product brief"
# Agent runs create-prd workflow — interactive, will ask questions
# Output: _bmad-output/planning-artifacts/prd.md

# Step 4: Validate the PRD
> "Validate the PRD"
# Agent runs validate-prd workflow
# Output: validation report with any gaps
```

### Phase 3: Solutioning (PRD → Architecture → Epics)

```bash
# Switch to Architect
kiro-cli chat --agent bmad-architect --trust-all-tools

# Step 5: Create architecture
> "Create the architecture document based on the PRD"
# Agent runs create-architecture workflow
# Output: _bmad-output/planning-artifacts/architecture.md

# Switch to UX (optional for CLI, but exercises the process)
kiro-cli chat --agent bmad-ux --trust-all-tools

# Step 6: Create UX design (CLI UX — prompts, output formatting, error messages)
> "Create a UX design for the CLI installer experience"
# Output: _bmad-output/planning-artifacts/ux-design.md

# Switch back to PM
kiro-cli chat --agent bmad-pm --trust-all-tools

# Step 7: Create epics and stories
> "Create epics and stories from the PRD and architecture"
# Agent runs create-epics-and-stories workflow
# Output: _bmad-output/planning-artifacts/epics.md

# Step 8: Check implementation readiness
> "Check implementation readiness"
# Agent validates alignment across PRD, architecture, UX, epics
# Output: readiness report
```

### Phase 4: Implementation (Stories → Code → PR)

```bash
# Switch to Scrum Master
kiro-cli chat --agent bmad-sm --trust-all-tools

# Step 9: Sprint planning
> "Run sprint planning for Epic-001"
# Output: sprint status file

# Step 10: Create first story
> "Create the next story from Epic-001"
# Agent runs create-story workflow
# Output: _bmad-output/implementation-artifacts/story-001.md

# Switch to Dev
kiro-cli chat --agent bmad-dev --trust-all-tools

# Step 11: Implement the story
> "Develop the story at _bmad-output/implementation-artifacts/story-001.md"
# Agent runs dev-story workflow — writes code, runs tests
# This is where the actual npx package code gets written

# Switch to Reviewer
kiro-cli chat --agent bmad-reviewer --trust-all-tools

# Step 12: Code review
> "Run code review for the story at _bmad-output/implementation-artifacts/story-001.md"
# Agent finds 3-10 issues, auto-fixes them

# Switch to QA (if there's any interactive CLI testing)
kiro-cli chat --agent bmad-qa --trust-all-tools

# Step 13: Create tests
> "Create E2E tests for story-001"
# Agent creates test suite

# Repeat steps 10-13 for remaining stories...
```

### Phase 4b: Autonomous Mode (Alternative)

Instead of manually cycling through each story, use the orchestrator:

```bash
kiro-cli chat --agent bmad-orchestrator --trust-all-tools

# Step 10-13 automated for ALL stories:
> "Run the full pipeline for all remaining stories in Epic-001.
   For each story: create branch, implement, review, test, PR, merge."
# Orchestrator spawns subagents for each phase per story
# Each subagent gets its own context window
```

### Phase 5: Deploy

```bash
# After all stories are merged, publish the package
npm publish --access public
# Users can then run:
npx @jwnichols3/bmad-kiro-agents
```

---

## Quick Reference: Session Flow

| Step  | Agent             | Shortcut | What Happens                    |
| ----- | ----------------- | -------- | ------------------------------- |
| 1     | bmad-analyst      | `ctrl+1` | Brainstorm idea                 |
| 2     | bmad-analyst      | `ctrl+1` | Create product brief            |
| 3     | bmad-pm           | `ctrl+2` | Create PRD                      |
| 4     | bmad-pm           | `ctrl+2` | Validate PRD                    |
| 5     | bmad-architect    | `ctrl+3` | Create architecture             |
| 6     | bmad-ux           | `ctrl+4` | Create UX design                |
| 7     | bmad-pm           | `ctrl+2` | Create epics & stories          |
| 8     | bmad-pm           | `ctrl+2` | Check readiness                 |
| 9     | bmad-sm           | `ctrl+5` | Sprint planning                 |
| 10    | bmad-sm           | `ctrl+5` | Create story                    |
| 11    | bmad-dev          | `ctrl+6` | Implement story                 |
| 12    | bmad-reviewer     | `ctrl+7` | Code review + fix               |
| 13    | bmad-qa           | `ctrl+8` | E2E tests                       |
| 10-13 | bmad-orchestrator | `ctrl+0` | Or run all stories autonomously |

---

## Tips for the Test Run

- Between agents, use `/compact` if context is getting heavy
- For a fresh start between phases, just open a new `kiro-cli chat` session with the next agent
- The orchestrator is the most interesting test — it exercises subagent spawning with `trustedAgents: ["bmad-*"]` so it won't prompt for permission
- The product brief and PRD phases are interactive (the agent will ask you questions) — the implementation phases can run autonomously
- All artifacts land in `_bmad-output/` which is gitignored, so your planning docs won't clutter the repo
