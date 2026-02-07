---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: ['brainstorming-session-2026-02-07.md']
date: 2026-02-07
author: Rocket
---

# Product Brief: bmad-kiro-agents

## Executive Summary

The bmad-kiro-agents installer is a zero-dependency npx CLI tool that bootstraps the BMAD methodology into any project for use with Kiro CLI. It replaces a manual, error-prone process of copying multiple directories with a single command that pulls the latest BMAD agent definitions, skills, and configuration from GitHub.

This is a personal productivity tool — built to eliminate the cognitive load of remembering which files to copy and where they go every time a new project needs BMAD + Kiro CLI support.

---

## Core Vision

### Problem Statement

The BMAD methodology has been adapted for Kiro CLI, but the setup process for new projects is entirely manual. Getting BMAD into a project requires executing multiple `cp` commands across three directory trees (`.kiro/agents/`, `.kiro/skills/`, `_bmad/`), with no standardized process. This creates unnecessary cognitive load on every new project, and the BMAD Kiro CLI support is still incomplete and undocumented — making the manual process even harder to get right.

### Problem Impact

Every new project that needs BMAD + Kiro CLI requires the developer to remember the correct source paths, directory structure, and which files to copy. This friction discourages starting new projects and risks inconsistency across the project portfolio.

### Why Existing Solutions Fall Short

There is no existing solution. The current process is ad-hoc `cp` commands from a local clone of the bmad-kiro-agents repo. There's no versioning, no conflict detection, and no way to update previously installed files.

### Proposed Solution

A single-command installer invoked via `npx github:jwnichols3/bmad-kiro-agents install` that:
- Reads a `bmad-manifest.json` from the repo to determine which directories to copy
- Downloads the repo tarball from GitHub and extracts only the manifest directories
- Prompts before overwriting existing files
- Supports `--branch`, `--force`, and optional target directory arguments

### Key Differentiators

- **Zero dependencies** — Node.js built-ins only, no package bloat
- **Manifest-driven** — directories to install are declared in JSON, not hardcoded
- **GitHub-direct** — no npm publish required during development; always pulls latest from repo
- **Idempotent** — re-run to update, same code path as fresh install

---

## Target Users

### Primary Users

**Rocket — Solo Developer, BMAD Practitioner**

A developer who uses the BMAD methodology across multiple projects via Kiro CLI. Works on both greenfield projects and adding BMAD to existing codebases, roughly weekly. Deep familiarity with BMAD concepts but low patience for manual setup — wants to go from "new project" to "running BMAD workflows" with minimal friction.

**Current Experience:**
- Manually runs multiple `cp` commands from a local clone of bmad-kiro-agents
- Has to remember which directories go where every time
- No standardized process — relies on memory and habit
- Cognitive load of setup detracts from the actual work

**Success Vision:**
- One command, files in place, ready to work
- Clear pointer to the first BMAD step (e.g., a Kiro CLI command that loads the overall workflow agent)
- Link to docs for reference
- Never thinks about the installation process again

### Secondary Users

N/A — This is personal tooling with no current audience beyond the primary user.

### User Journey

1. **Trigger:** Rocket starts a new project or decides an existing project needs BMAD
2. **Install:** Runs `npx github:jwnichols3/bmad-kiro-agents install` from the project root
3. **Confirm:** Reviews the summary (new dirs vs. overwrites), confirms
4. **Handoff:** Installer prints success message with:
   - Link to docs (repo README)
   - The first BMAD step — a Kiro CLI command to load the overall workflow agent
5. **Work:** Immediately begins BMAD workflow in Kiro CLI — zero gap between install and productivity


---

## Success Metrics

- **It works:** Running the installer copies the correct directories into the target project without errors
- **It's faster than manual:** One command replaces multiple `cp` commands
- **It's re-runnable:** Can update an existing project's BMAD files without issues

### Business Objectives

N/A — Personal tooling.

### Key Performance Indicators

N/A — Personal tooling.


---

## MVP Scope

### Core Features

1. `install` command — downloads tarball from GitHub, extracts manifest directories to target
2. `bmad-manifest.json` — read from repo to determine which directories to copy
3. Install location prompt (default: cwd) or accept as positional arg
4. Pre-install summary showing each directory as new or existing (will overwrite)
5. Single conflict prompt with full overwrite behavior
6. `--force` flag to skip all prompts
7. `--branch <name>` flag (default: `main`)
8. Post-install message with docs link + pointer to first BMAD step (Kiro CLI command)

### Out of Scope for MVP

- npm publish (GitHub-direct distribution only)
- Windows support
- Per-file conflict resolution or merge
- Version tracking
- Config files / `.bmadrc`
- `--dry-run` flag
- Uninstall command

### MVP Success Criteria

N/A — Personal tooling. It works or it doesn't.

### Future Vision

- Publish to npm for shorter `npx bmad-kiro-agents install` invocation
- Additional commands as needed
