---
stepsCompleted: [step-01-init, step-02-discovery, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
inputDocuments: ['product-brief-bmad-kiro-agents-2026-02-07.md', 'brainstorming-session-2026-02-07.md']
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 1
  projectDocs: 0
  projectContext: 0
classification:
  projectType: cli_tool
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - bmad-kiro-agents

**Author:** Rocket
**Date:** 2026-02-07

## Executive Summary

bmad-kiro-agents is a zero-dependency npx CLI installer that bootstraps the BMAD methodology into any project for use with Kiro CLI. It replaces a manual, error-prone process of copying multiple directories with a single command that pulls the latest BMAD agent definitions, skills, and configuration from GitHub.

**Problem:** Setting up BMAD + Kiro CLI in a new project requires executing multiple `cp` commands across three directory trees (`.kiro/agents/`, `.kiro/skills/`, `_bmad/`), with no standardized process. This creates cognitive load on every new project and risks inconsistency.

**Solution:** A single-command installer invoked via `npx github:jwnichols3/bmad-kiro-agents install` that reads a `bmad-manifest.json` from the repo, downloads the tarball, extracts only the manifest directories, and prompts before overwriting existing files.

**Key Differentiators:**
- Zero dependencies — Node.js built-ins only
- Manifest-driven — directories declared in JSON, not hardcoded
- GitHub-direct — no npm publish required; always pulls latest
- Idempotent — re-run to update, same code path as fresh install

**Target User:** Solo developer (Rocket) who uses BMAD across multiple projects via Kiro CLI, roughly weekly. Deep BMAD familiarity, low patience for manual setup.

## Success Criteria

### User Success

- One-command setup: a single `npx` command installs all BMAD files into correct locations
- Sub-60-second workflow: from command invocation to success message
- First-try reliability: works correctly on first attempt, every time
- Zero cognitive load: the installation process is a solved problem
- Clear handoff: post-install message provides the next Kiro CLI command and docs link

### Business Success

N/A — Personal tooling. Success = the developer uses it instead of manual `cp` commands for every new project.

### Technical Success

- Zero dependencies: only Node.js built-ins (`https`, `child_process`, `fs`, `path`, `readline`)
- Idempotent execution: re-running produces the same result as fresh install (with overwrite confirmation)
- Graceful error handling: clear, actionable messages when GitHub is unreachable, branch doesn't exist, or extraction fails
- Manifest-driven: adding/removing directories requires only a JSON edit, never a code change

### Measurable Outcomes

| Metric | Target |
|---|---|
| Commands to set up BMAD | 1 (down from 3+) |
| Time from command to ready | < 60 seconds |
| Dependencies | 0 |
| Success rate on first run | 100% (happy path) |
| Code changes to add a new directory | 0 (manifest only) |

## Product Scope

### MVP - Minimum Viable Product

1. `install` command — downloads tarball from GitHub, extracts manifest directories to target
2. `bmad-manifest.json` — repo-side manifest declaring directories to copy
3. Install location via positional arg or prompt (default: cwd)
4. Pre-install summary showing each directory as new or existing (will overwrite)
5. Single confirmation prompt for all conflicts
6. `--force` flag to skip all prompts
7. `--branch <name>` flag (default: `main`)
8. Post-install message with docs link + pointer to first BMAD step

### Growth Features (Post-MVP)

- Publish to npm for shorter `npx bmad-kiro-agents install` invocation
- `--dry-run` flag to preview without writing
- Version tracking to show what changed between updates

### Vision (Future)

- Additional commands beyond `install` as needs emerge
- Per-file conflict resolution or selective updates
- Config file support (`.bmadrc`) for project-specific defaults

## User Journeys

### Journey 1: Fresh Project Setup (Happy Path)

Rocket just created a new project directory and wants BMAD + Kiro CLI support immediately.

He opens the terminal in the project root and types `npx github:jwnichols3/bmad-kiro-agents install`. The installer fetches the manifest, downloads the tarball, and shows a summary: three directories, all new. He confirms, files land in seconds. The success message prints a Kiro CLI command to load the overall workflow agent and a link to the README. He runs the Kiro CLI command and is immediately productive — zero gap between install and work.

**Reveals:** Manifest fetch, tarball download/extract, directory creation, post-install messaging.

### Journey 2: Updating an Existing Project

Rocket has been using BMAD in a project for two weeks. The upstream repo has new agent definitions. He runs the same `npx github:jwnichols3/bmad-kiro-agents install` command. The installer detects all three directories already exist and shows them as "exists — will overwrite." He confirms, and the latest files replace the old ones. Done.

**Reveals:** Existing directory detection, overwrite confirmation, idempotent behavior.

### Journey 3: Quick Update with --force

Rocket is updating five projects in a row and doesn't want to confirm each time. He runs `npx github:jwnichols3/bmad-kiro-agents install --force` in each project root. No prompts, no confirmations — files land immediately.

**Reveals:** `--force` flag, prompt suppression, scriptable behavior.

### Journey 4: Branch Testing

Rocket is developing new BMAD agents on a feature branch. He wants to test them in a project before merging. He runs `npx github:jwnichols3/bmad-kiro-agents install --branch feature/new-agents`. The installer pulls from the specified branch instead of `main`.

**Reveals:** `--branch` flag, branch-specific tarball URL construction.

### Journey 5: Error Recovery

Rocket runs the installer but his WiFi is down. The installer fails to reach GitHub and prints: "Error: Unable to reach GitHub. Check your internet connection and try again." No partial files are left behind. He reconnects and re-runs — works perfectly.

**Reveals:** Network error handling, clean failure (no partial state), actionable error messages.

### Journey Requirements Summary

| Capability | Journeys |
|---|---|
| Manifest fetch from GitHub | 1, 2, 3, 4 |
| Tarball download and extraction | 1, 2, 3, 4 |
| Directory existence detection | 2, 3 |
| Overwrite confirmation prompt | 1, 2 |
| `--force` flag (skip prompts) | 3 |
| `--branch` flag | 4 |
| Post-install success message | 1, 2, 3, 4 |
| Graceful error handling | 5 |
| Clean failure (no partial state) | 5 |

## CLI-Specific Requirements

### Command Structure

**Invocation:**
```
npx github:jwnichols3/bmad-kiro-agents install [--branch <name>] [--force] [<target-dir>]
```

- `install` — explicit verb, required
- `--branch <name>` — optional, defaults to `main`
- `--force` — optional, skips all prompts
- `<target-dir>` — optional positional arg, defaults to cwd; if omitted, prompt for location

### Output Format

- Pre-install summary: table of directories with "new" or "exists — will overwrite" status
- Progress: minimal output during download/extract
- Success: confirmation message + docs link + first BMAD step command
- Error: single-line actionable message, no stack traces

### Configuration

- `bmad-manifest.json` in repo root declares directories to install
- No local config files in MVP
- All configuration via CLI flags

### Scripting Support

- `--force` enables non-interactive use
- Exit code 0 on success, non-zero on failure
- Errors written to stderr, output to stdout

## Functional Requirements

### Installation Core

- FR1: User can invoke the installer via `npx github:jwnichols3/bmad-kiro-agents install`
- FR2: Installer reads `bmad-manifest.json` from the repo to determine which directories to copy
- FR3: Installer downloads the repo tarball from GitHub for the specified branch
- FR4: Installer extracts only the directories listed in the manifest to the target location
- FR5: User can specify a target directory as a positional argument
- FR6: Installer prompts for install location when no positional argument is provided (default: cwd)

### Conflict Detection & Resolution

- FR7: Installer detects which manifest directories already exist in the target
- FR8: Installer displays a pre-install summary showing each directory as "new" or "exists — will overwrite"
- FR9: Installer prompts for confirmation before proceeding when existing directories are detected
- FR10: Installer performs full recursive overwrite of existing directories on confirmation

### CLI Flags

- FR11: User can pass `--force` to skip all confirmation prompts
- FR12: User can pass `--branch <name>` to pull from a specific branch (default: `main`)

### Post-Install Experience

- FR13: Installer prints a success message upon completion
- FR14: Success message includes a link to the repo README for documentation
- FR15: Success message includes the first BMAD step — a Kiro CLI command to load the overall workflow agent

### Error Handling

- FR16: Installer displays a clear, actionable error message when GitHub is unreachable
- FR17: Installer displays a clear error message when the specified branch does not exist
- FR18: Installer displays a clear error message when tarball extraction fails
- FR19: Installer leaves no partial files on failure (clean failure)
- FR20: Installer exits with code 0 on success and non-zero on failure
- FR21: Error messages are written to stderr; normal output to stdout

## Non-Functional Requirements

### Performance

- The installer completes the full install flow (fetch manifest, download tarball, extract) in under 60 seconds on a standard broadband connection
- Interactive prompts respond to user input in under 100ms

### Reliability

- The installer produces identical results when run multiple times on the same target (idempotent)
- No partial state is left behind on any failure path

### Portability

- The installer runs on macOS and Linux with Node.js 18+
- Windows is explicitly out of scope for MVP
- The installer uses only Node.js built-in modules — zero external dependencies

### Maintainability

- Adding or removing directories from the install requires editing only `bmad-manifest.json`
- The installer script targets ~50-100 lines of Node.js

## Assumptions & Dependencies

- Node.js 18+ is installed on the target machine
- The target machine has network access to GitHub (github.com and raw.githubusercontent.com)
- The `tar` command is available on the system PATH (standard on macOS and Linux)
- The GitHub repo `jwnichols3/bmad-kiro-agents` exists and contains a valid `bmad-manifest.json`

## Glossary

- **Manifest:** A JSON file (`bmad-manifest.json`) in the repo root that declares which directories the installer should copy
- **Tarball:** A compressed archive (.tar.gz) of the repository, downloaded from GitHub's archive API
- **Idempotent:** Running the installer multiple times produces the same result — safe to re-run without side effects
