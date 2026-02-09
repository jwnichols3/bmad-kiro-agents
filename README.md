# BMAD Agents for Kiro CLI

Autonomous BMAD Method agents for Kiro CLI. Enables the full product development lifecycle from idea to deployed code.

## Installation

Run a single command from your project root:

```bash
npx github:jwnichols3/bmad-kiro-agents install
```

This installs three directories into your project:

- `.kiro/agents/` — Agent definitions and prompts
- `.kiro/skills/` — Workflow skill definitions
- `_bmad/` — BMAD core methodology files

The installer shows a summary of what will be created or overwritten, then asks for confirmation before writing anything.

### Options

```bash
# Install to a specific directory
npx github:jwnichols3/bmad-kiro-agents install ./my-project

# Skip confirmation prompt (useful for scripting)
npx github:jwnichols3/bmad-kiro-agents install --force

# Install from a specific branch
npx github:jwnichols3/bmad-kiro-agents install --branch feature/new-agents
```

### Updating

Re-run the same install command. Existing directories will be overwritten with the latest versions.

### Requirements

- Node.js 18+
- `tar` (standard on macOS and Linux)

---

## BMAD Workflow Phases

### Phase 1: Analysis (Idea → Brief)

| Agent      | Command                                                | Workflow           | Description                                        |
| ---------- | ------------------------------------------------------ | ------------------ | -------------------------------------------------- |
| 📊 Analyst | `kiro-cli chat --trust-all-tools --agent bmad-analyst` | Brainstorm Project | Guided facilitation through creative techniques    |
| 📊 Analyst |                                                        | Research           | Market, domain, competitive, or technical research |
| 📊 Analyst |                                                        | Create Brief       | Nail down product idea into executive brief        |

### Phase 2: Planning (Brief → PRD)

| Agent | Command                                           | Workflow     | Description                                      |
| ----- | ------------------------------------------------- | ------------ | ------------------------------------------------ |
| 📋 PM | `kiro-cli chat --trust-all-tools --agent bmad-pm` | Create PRD   | Expert-led facilitation for Product Requirements |
| 📋 PM |                                                   | Validate PRD | Check PRD is comprehensive and cohesive          |
| 📋 PM |                                                   | Edit PRD     | Update existing PRD                              |

### Phase 3: Solutioning (PRD → Architecture → Epics)

| Agent                | Command                                                  | Workflow                 | Description                              |
| -------------------- | -------------------------------------------------------- | ------------------------ | ---------------------------------------- |
| 🏗️ Architect         | `kiro-cli chat --trust-all-tools --agent bmad-architect` | Create Architecture      | Document technical decisions             |
| 🎨 UX Designer       | `kiro-cli chat --trust-all-tools --agent bmad-ux`        | Create UX Design         | Plan UX patterns and look/feel           |
| 📋 PM                | `kiro-cli chat --trust-all-tools --agent bmad-pm`        | Create Epics & Stories   | Transform PRD into implementation specs  |
| 📋 PM / 🏗️ Architect |                                                          | Implementation Readiness | Validate PRD, UX, Architecture alignment |

### Phase 4: Implementation (Stories → Code → PR)

| Agent  | Command                                            | Workflow        | Description                             |
| ------ | -------------------------------------------------- | --------------- | --------------------------------------- |
| 🏃 SM  | `kiro-cli chat --trust-all-tools --agent bmad-sm`  | Sprint Planning | Generate sprint status tracking         |
| 🏃 SM  |                                                    | Create Story    | Prepare story with full context for dev |
| 💻 Dev | `kiro-cli chat --trust-all-tools --agent bmad-dev` | Dev Story       | Implement story with tests              |
| 💻 Dev |                                                    | Code Review     | Adversarial review finding 3-10 issues  |
| 🧪 QA  | `kiro-cli chat --trust-all-tools --agent bmad-qa`  | QA Automate     | Generate E2E tests for features         |

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
| Analysis       | 📊 Analyst             | brainstorm, research, create-brief                 |
| Planning       | 📋 PM                  | create-prd, validate-prd, edit-prd                 |
| Solutioning    | 🏗️ Architect           | create-architecture                                |
| Solutioning    | 🎨 UX Designer         | create-ux-design                                   |
| Solutioning    | 📋 PM                  | create-epics-and-stories, implementation-readiness |
| Implementation | 🏃 SM                  | sprint-planning, create-story                      |
| Implementation | 💻 Dev                 | dev-story, code-review                             |
| Implementation | 🧪 QA                  | qa-automate                                        |
| Any            | 🧙 BMad Master         | orchestration, help                                |

---

## Agent Switching

```bash
# Start with a specific agent
kiro-cli chat --trust-all-tools --agent bmad-pm

# Or switch during a session
> /agent swap
> Choose: bmad-analyst, bmad-pm, bmad-architect, bmad-dev, bmad-sm, bmad-qa
```

---

## File Structure

After installation, your project will contain:

```
.kiro/
├── agents/
│   ├── bmad-analyst.json + prompt.md
│   ├── bmad-pm.json + prompt.md
│   ├── bmad-architect.json + prompt.md
│   ├── bmad-ux.json + prompt.md
│   ├── bmad-sm.json + prompt.md
│   ├── bmad-dev.json + prompt.md
│   ├── bmad-reviewer.json + prompt.md
│   ├── bmad-qa.json + prompt.md
│   ├── bmad-orchestrator.json + prompt.md
│   └── bmad-core-bmad-master.json + prompt.md
└── skills/
    ├── brainstorm/
    ├── research/
    ├── create-brief/
    ├── create-prd/
    ├── validate-prd/
    ├── edit-prd/
    ├── create-architecture/
    ├── create-ux-design/
    ├── create-epics/
    ├── sprint-planning/
    ├── create-story/
    ├── dev-story/
    ├── code-review/
    ├── qa-automate/
    └── check-readiness/
_bmad/
├── core/        # Core BMAD methodology
├── bmm/         # BMAD Module Manager
├── _config/     # Agent and workflow manifests
└── _memory/     # Persistent context
```

---

## Working on the Source

To contribute or modify the installer and BMAD agents:

```bash
# Clone the repo
git clone https://github.com/jwnichols3/bmad-kiro-agents.git
cd bmad-kiro-agents

# Test the installer locally against a target directory
node bin/install.js /path/to/test-project

# Test with flags
node bin/install.js --force /path/to/test-project
node bin/install.js --branch my-feature /path/to/test-project
```

### Project Structure

```
bin/install.js         # CLI installer (~140 lines, zero dependencies)
bmad-manifest.json     # Declares which directories the installer copies
package.json           # npm package config (type: module, bin entry)
.kiro/agents/          # Agent definitions (installed to target projects)
.kiro/skills/          # Skill workflows (installed to target projects)
_bmad/                 # BMAD core files (installed to target projects)
_bmad-output/          # Planning and implementation artifacts
```

### Adding or Removing Installed Directories

Edit `bmad-manifest.json` — it's a JSON array of directory paths. The installer copies exactly these directories and nothing else. No code changes needed.

### How the Installer Works

1. Fetches `bmad-manifest.json` from the repo via `raw.githubusercontent.com`
2. Checks which manifest directories already exist in the target
3. Shows a summary and asks for confirmation (unless `--force`)
4. Downloads the repo tarball to a temp directory
5. Extracts and copies only the manifest directories to the target
6. Cleans up the temp directory

Zero npm dependencies — uses only Node.js 18+ built-ins.
