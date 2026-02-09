# BMAD Agents for Kiro CLI

Autonomous BMAD Method agents for Kiro CLI. Enables the full product development lifecycle from idea to deployed code.

## Installation

Copy the `agents/` and `skills/` directories to your project's `.kiro/` folder:

```bash
cp -r agents/ skills/ /path/to/your/project/.kiro/
```

**Prerequisite**: Your project needs the BMAD core files in `_bmad/`. Install from [bmad-method](https://github.com/bmad-code-org/bmad-method).

---

## BMAD Workflow Phases

### Phase 1: Analysis (Idea → Brief)

| Agent      | Command                                                | Workflow           | Description                                        |
| ---------- | ------------------------------------------------------ | ------------------ | -------------------------------------------------- |
| 📊 Analyst | `kiro-cli chat --trust-all-tools --agent bmad-analyst` | Brainstorm Project | Guided facilitation through creative techniques    |
| 📊 Analyst |                                                        | Research           | Market, domain, competitive, or technical research |
| 📊 Analyst |                                                        | Create Brief       | Nail down product idea into executive brief        |

**Example:**

```
> /agent swap → bmad-analyst
> "Let's brainstorm a new project idea"
> "Create a product brief for a task management app"
```

### Phase 2: Planning (Brief → PRD)

| Agent | Command                                           | Workflow     | Description                                      |
| ----- | ------------------------------------------------- | ------------ | ------------------------------------------------ |
| 📋 PM | `kiro-cli chat --trust-all-tools --agent bmad-pm` | Create PRD   | Expert-led facilitation for Product Requirements |
| 📋 PM |                                                   | Validate PRD | Check PRD is comprehensive and cohesive          |
| 📋 PM |                                                   | Edit PRD     | Update existing PRD                              |

**Example:**

```
> /agent swap → bmad-pm
> "Create a PRD from the product brief"
> "Validate the PRD for completeness"
```

### Phase 3: Solutioning (PRD → Architecture → Epics)

| Agent                | Command                                                  | Workflow                 | Description                              |
| -------------------- | -------------------------------------------------------- | ------------------------ | ---------------------------------------- |
| 🏗️ Architect         | `kiro-cli chat --trust-all-tools --agent bmad-architect` | Create Architecture      | Document technical decisions             |
| 🎨 UX Designer       | `kiro-cli chat --trust-all-tools --agent bmad-ux`        | Create UX Design         | Plan UX patterns and look/feel           |
| 📋 PM                | `kiro-cli chat --trust-all-tools --agent bmad-pm`        | Create Epics & Stories   | Transform PRD into implementation specs  |
| 📋 PM / 🏗️ Architect |                                                          | Implementation Readiness | Validate PRD, UX, Architecture alignment |

**Example:**

```
> /agent swap → bmad-architect
> "Create the architecture document based on the PRD"

> /agent swap → bmad-pm
> "Create epics and stories from the PRD and architecture"
> "Check implementation readiness"
```

### Phase 4: Implementation (Stories → Code → PR)

| Agent  | Command                                            | Workflow        | Description                             |
| ------ | -------------------------------------------------- | --------------- | --------------------------------------- |
| 🏃 SM  | `kiro-cli chat --trust-all-tools --agent bmad-sm`  | Sprint Planning | Generate sprint status tracking         |
| 🏃 SM  |                                                    | Create Story    | Prepare story with full context for dev |
| 💻 Dev | `kiro-cli chat --trust-all-tools --agent bmad-dev` | Dev Story       | Implement story with tests              |
| 💻 Dev |                                                    | Code Review     | Adversarial review finding 3-10 issues  |
| 🧪 QA  | `kiro-cli chat --trust-all-tools --agent bmad-qa`  | QA Automate     | Generate E2E tests for features         |

**Example:**

```
> /agent swap → bmad-sm
> "Create the next story from Epic-001"

> /agent swap → bmad-dev
> "Develop the story we just created"
> "Run code review and auto-fix issues"
```

---

## Autonomous Epic Execution

Run the full pipeline without manual intervention:

```bash
kiro-cli chat --agent bmad-orchestrator --trust-all-tools
```

Then:

```
Run the epic pipeline for all remaining stories in the current Epic.
```

### Manual Orchestration Prompt

If you prefer more control, send this prompt directly to the orchestrator or default agent:

```
Please run the following flow for all stories in the current Epic. Each task should
be delegated to the indicated agent via subagent.

**Task 1:** Invoke a subagent with `bmad-sm` and run the create-story workflow for
the next story in the epic. If the story already exists, confirm completeness and
update as needed.

**Task 2:** When the story is created, invoke a subagent with `bmad-dev` and run
the dev-story workflow for the created story.

**Task 3:** When development is complete, invoke a subagent with `bmad-reviewer`
and run the code-review workflow. Automatically fix all issues found.

**Task 4:** If this is a front-end change, invoke a subagent with `bmad-qa` and
create a Playwright test suite to validate the story.

**Task 5:** When complete, commit and push the changes, then create a PR using
`gh pr create`.

Loop through this workflow for all stories in the Epic until complete.
```

### Pipeline Per Story

1. Branch: `git checkout -b feature/story-{id}`
2. SM Agent (`bmad-sm`): Create story via subagent
3. Dev Agent (`bmad-dev`): Implement via subagent
4. Reviewer (`bmad-reviewer`): Code review + auto-fix via subagent
5. QA Agent (`bmad-qa`): E2E tests (if frontend) via subagent
6. Git: Commit, push, create PR, merge

---

## Quick Reference

| Phase          | Agent                  | Key Workflows                                      |
| -------------- | ---------------------- | -------------------------------------------------- |
| Analysis       | 📊 Analyst (Mary)      | brainstorm, research, create-brief                 |
| Planning       | 📋 PM (John)           | create-prd, validate-prd, edit-prd                 |
| Solutioning    | 🏗️ Architect (Winston) | create-architecture                                |
| Solutioning    | 🎨 UX Designer (Sally) | create-ux-design                                   |
| Solutioning    | 📋 PM                  | create-epics-and-stories, implementation-readiness |
| Implementation | 🏃 SM (Bob)            | sprint-planning, create-story                      |
| Implementation | 💻 Dev (Amelia)        | dev-story, code-review                             |
| Implementation | 🧪 QA (Quinn)          | qa-automate                                        |
| Any            | 🧙 BMad Master         | orchestration, help                                |

---

## Agent Switching

```bash
# Start with specific agent
kiro-cli chat --trust-all-tools --agent bmad-pm

# Or switch during session
> /agent swap
> Choose: bmad-analyst, bmad-pm, bmad-architect, bmad-dev, bmad-sm, bmad-qa
```

---

## File Structure

```
.kiro/
├── agents/
│   ├── bmad-analyst.json + prompt.md
│   ├── bmad-pm.json + prompt.md
│   ├── bmad-architect.json + prompt.md
│   ├── bmad-ux.json + prompt.md
│   ├── bmad-sm.json + prompt.md
│   ├── bmad-dev.json + prompt.md
│   ├── bmad-qa.json + prompt.md
│   └── bmad-orchestrator.json + prompt.md
└── skills/
    └── run-epic/SKILL.md
```

---

## Progress Tracking

See [bmad-for-kiro.md](./bmad-for-kiro.md) for development progress and decisions.
