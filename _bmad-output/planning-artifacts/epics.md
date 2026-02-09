---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments: ['prd.md', 'architecture.md', 'ux-design-specification.md']
---

# bmad-kiro-agents - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for bmad-kiro-agents, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1: User can invoke the installer via `npx github:jwnichols3/bmad-kiro-agents install`
- FR2: Installer reads `bmad-manifest.json` from the repo to determine which directories to copy
- FR3: Installer downloads the repo tarball from GitHub for the specified branch
- FR4: Installer extracts only the directories listed in the manifest to the target location
- FR5: User can specify a target directory as a positional argument
- FR6: Installer prompts for install location when no positional argument is provided (default: cwd)
- FR7: Installer detects which manifest directories already exist in the target
- FR8: Installer displays a pre-install summary showing each directory as "new" or "exists — will overwrite"
- FR9: Installer prompts for confirmation before proceeding when existing directories are detected
- FR10: Installer performs full recursive overwrite of existing directories on confirmation
- FR11: User can pass `--force` to skip all confirmation prompts
- FR12: User can pass `--branch <name>` to pull from a specific branch (default: `main`)
- FR13: Installer prints a success message upon completion
- FR14: Success message includes a link to the repo README for documentation
- FR15: Success message includes the first BMAD step — a Kiro CLI command to load the overall workflow agent
- FR16: Installer displays a clear, actionable error message when GitHub is unreachable
- FR17: Installer displays a clear error message when the specified branch does not exist
- FR18: Installer displays a clear error message when tarball extraction fails
- FR19: Installer leaves no partial files on failure (clean failure)
- FR20: Installer exits with code 0 on success and non-zero on failure
- FR21: Error messages are written to stderr; normal output to stdout

### NonFunctional Requirements

- NFR1: Full install flow completes in under 60 seconds on standard broadband connection
- NFR2: Idempotent execution — identical results when run multiple times on the same target
- NFR3: Runs on macOS and Linux with Node.js 18+, zero external dependencies (Node.js built-ins only)
- NFR4: Adding or removing directories requires editing only `bmad-manifest.json` (~50-100 lines target)

### Additional Requirements

**From Architecture:**
- No starter template — manual minimal scaffolding (single `bin/install.js` file)
- ES Modules (`"type": "module"`) — Node 18+ native
- `node:util` `parseArgs` for argument parsing (built-in Node 18.3+)
- Global `fetch()` API for HTTP requests (built-in Node 18+)
- Temp directory extraction pattern via `fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-'))` for clean failure guarantee
- Seven named helper functions: `parseArgs()`, `fetchManifest()`, `checkExisting()`, `promptUser()`, `downloadAndExtract()`, `copyDirectories()`, `cleanup()`
- Single `try/catch` in `main()` — no nested error handling
- External `tar xz` command via `child_process`
- User cancellation exits code 0 (not an error)

**From UX Design:**
- Plain text output only — no ANSI colors, no box-drawing, no `console.table`
- Heroku-inspired "Confident Guide" output style
- Four-beat output rhythm: Summary → Prompt → Action → Handoff
- `--force` collapses to Action → Handoff only
- Directory status list: 2-space indent, → arrow, padded alignment
- Prompt format: `Install to /path? (y/N)` with N as safe default
- Action line: `Installing... done` (single line)
- Success handoff: `BMAD installed. Next step:` + indented command + docs link
- Error format: `Error: {what happened}. {what to do}.` — single line to stderr
- Six specific error messages defined (network, 404, parse, download, extract, filesystem)
- No progress bars, no step narration, no version banners
- All output under 80 characters per line

### FR Coverage Map

| FR | Epic | Description |
|---|---|---|
| FR1 | Epic 1 | npx invocation |
| FR2 | Epic 1 | Manifest reading |
| FR3 | Epic 1 | Tarball download |
| FR4 | Epic 1 | Manifest-only extraction |
| FR5 | Epic 1 | Positional target dir arg |
| FR6 | Epic 1 | Prompt for install location |
| FR7 | Epic 2 | Detect existing directories |
| FR8 | Epic 2 | Display new/overwrite summary |
| FR9 | Epic 2 | Confirmation prompt |
| FR10 | Epic 2 | Recursive overwrite |
| FR11 | Epic 3 | --force flag |
| FR12 | Epic 3 | --branch flag |
| FR13 | Epic 4 | Success message |
| FR14 | Epic 4 | Docs link in success |
| FR15 | Epic 4 | Kiro CLI command in success |
| FR16 | Epic 4 | GitHub unreachable error |
| FR17 | Epic 4 | Branch not found error |
| FR18 | Epic 4 | Extraction failure error |
| FR19 | Epic 4 | Clean failure / no partial state |
| FR20 | Epic 4 | Exit codes |
| FR21 | Epic 4 | stderr/stdout separation |

## Epic List

### Epic 1: Project Scaffolding & Manifest-Driven Install
The user can run a single command and have all BMAD directories installed into their project from a manifest-defined source.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6

### Epic 2: Conflict Detection & User Confirmation
The user sees a clear summary of what's new vs. what will be overwritten, and confirms before anything changes.
**FRs covered:** FR7, FR8, FR9, FR10

### Epic 3: Power-User CLI Flags
The user can skip prompts with `--force` and target specific branches with `--branch`, enabling scriptable and development workflows.
**FRs covered:** FR11, FR12

### Epic 4: Post-Install Experience & Error Handling
The user gets a clear success handoff with their next action, or a single-line actionable error message with no partial state left behind.
**FRs covered:** FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21

## Epic 1: Project Scaffolding & Manifest-Driven Install

The user can run a single command and have all BMAD directories installed into their project from a manifest-defined source.

### Story 1.1: Project Initialization & CLI Entry Point

As a developer,
I want to run `npx github:jwnichols3/bmad-kiro-agents install` and have the tool parse my arguments and determine the target directory,
So that I can invoke the installer with a single command.

**Acceptance Criteria:**

**Given** the user runs `npx github:jwnichols3/bmad-kiro-agents install`
**When** no positional argument is provided
**Then** the installer prompts for install location with cwd as default
**And** the user can confirm or provide an alternative path

**Given** the user runs `npx github:jwnichols3/bmad-kiro-agents install ./my-project`
**When** a positional argument is provided
**Then** the installer uses that path as the target directory without prompting

**Given** the project repository
**When** a developer clones it
**Then** `package.json` exists with `"type": "module"` and a `"bin"` entry pointing to `bin/install.js`
**And** `bmad-manifest.json` exists with an array of directory names to install
**And** `bin/install.js` has a shebang line, imports `parseArgs` from `node:util`, and defines the `main()` async function with a single top-level try/catch
**And** `parseArgs` is configured for `--force` (boolean), `--branch` (string, default `main`), and positional args

### Story 1.2: Manifest Fetch & Tarball Install

As a developer,
I want the installer to fetch the manifest, download the repo tarball, and copy only the declared directories into my project,
So that all BMAD files are installed correctly from a single command.

**Acceptance Criteria:**

**Given** the installer has a valid target directory
**When** it executes the install flow
**Then** `fetchManifest(branch)` fetches `bmad-manifest.json` from `https://raw.githubusercontent.com/jwnichols3/bmad-kiro-agents/{branch}/bmad-manifest.json` using global `fetch()`
**And** it parses the JSON response into an array of directory names

**Given** a valid manifest is fetched
**When** the installer proceeds to download
**Then** `downloadAndExtract(branch, tmpDir)` creates a temp directory via `fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-'))`
**And** downloads the tarball from `https://github.com/jwnichols3/bmad-kiro-agents/archive/refs/heads/{branch}.tar.gz` using `fetch()`
**And** writes the tarball to the temp directory
**And** extracts it using `tar xz` via `child_process`

**Given** the tarball is extracted in the temp directory
**When** `copyDirectories(dirs, srcRoot, target)` runs
**Then** only the directories listed in the manifest are copied from `{tmpDir}/bmad-kiro-agents-{branch}/` to the target directory
**And** directories not in the manifest are ignored

**Given** the install completes (success or failure)
**When** `cleanup(tmpDir)` runs
**Then** the temp directory is removed
**And** no temp files remain on disk

**Given** the full install pipeline succeeds
**When** the action line is printed
**Then** stdout shows `Installing... done`

## Epic 2: Conflict Detection & User Confirmation

The user sees a clear summary of what's new vs. what will be overwritten, and confirms before anything changes.

### Story 2.1: Directory Existence Detection & Summary Display

As a developer,
I want to see which BMAD directories are new and which already exist before the install proceeds,
So that I know exactly what will change in my project.

**Acceptance Criteria:**

**Given** the manifest has been fetched with a list of directories
**When** `checkExisting(dirs, target)` runs
**Then** each directory is checked for existence in the target path
**And** the result is returned as a list of `{ name, exists }` entries

**Given** the existence check is complete
**When** the pre-install summary is displayed
**Then** each directory is shown with 2-space indent, padded name, and `→ new` or `→ exists (will overwrite)` status
**And** the arrows are vertically aligned across all lines

### Story 2.2: Confirmation Prompt & Overwrite Execution

As a developer,
I want to confirm the install before any files are written, with a safe default of "no",
So that I don't accidentally overwrite files.

**Acceptance Criteria:**

**Given** the pre-install summary has been displayed
**When** `promptUser(summary)` presents the confirmation
**Then** the prompt reads `Install to {target_path}? (y/N) ` with a trailing space
**And** the default is N (no action on Enter)

**Given** the user enters `y` or `Y`
**When** the install proceeds
**Then** existing directories are fully recursively overwritten with the new content
**And** new directories are created

**Given** the user enters `n`, `N`, or presses Enter
**When** the prompt is answered
**Then** the installer exits with code 0
**And** no output is printed after the prompt (silent cancellation)

**Given** the user enters any other input
**When** the prompt receives it
**Then** the prompt is re-displayed

## Epic 3: Power-User CLI Flags

The user can skip prompts with `--force` and target specific branches with `--branch`, enabling scriptable and development workflows.

### Story 3.1: Force Flag & Branch Flag Support

As a developer,
I want to pass `--force` to skip all prompts and `--branch` to target a specific branch,
So that I can batch-update projects and test feature branches without friction.

**Acceptance Criteria:**

**Given** the user runs `npx github:jwnichols3/bmad-kiro-agents install --force`
**When** the `--force` flag is present
**Then** the pre-install summary and confirmation prompt are skipped entirely
**And** the output shows only `Installing... done` followed by the success handoff
**And** the install proceeds immediately

**Given** the user runs `npx github:jwnichols3/bmad-kiro-agents install --branch feature/new-agents`
**When** the `--branch` flag is provided
**Then** the manifest is fetched from `raw.githubusercontent.com/.../feature/new-agents/bmad-manifest.json`
**And** the tarball is downloaded from `.../archive/refs/heads/feature/new-agents.tar.gz`
**And** the extracted directory prefix uses the branch-specific name

**Given** no `--branch` flag is provided
**When** the installer runs
**Then** the default branch `main` is used for both manifest and tarball URLs

## Epic 4: Post-Install Experience & Error Handling

The user gets a clear success handoff with their next action, or a single-line actionable error message with no partial state left behind.

### Story 4.1: Success Handoff Message

As a developer,
I want to see a clear success message with my exact next command after install completes,
So that I can immediately start using BMAD without consulting docs.

**Acceptance Criteria:**

**Given** the install completes successfully
**When** the success handoff is printed
**Then** stdout displays:
```
BMAD installed. Next step:
  kiro-cli chat --agent bmad-analyst --trust-all-tools

Docs: https://github.com/jwnichols3/bmad-kiro-agents#readme
```
**And** "BMAD installed." and "Next step:" are on the same line
**And** the Kiro CLI command is indented 2 spaces (copy-paste ready)
**And** a blank line separates the command from the docs link
**And** the docs link is bare text, not wrapped in markdown

### Story 4.2: Error Handling & Clean Failure

As a developer,
I want clear, actionable error messages and no partial files left behind when something goes wrong,
So that I can fix the issue and re-run confidently.

**Acceptance Criteria:**

**Given** GitHub is unreachable during manifest fetch or tarball download
**When** the network request fails
**Then** stderr displays `Error: Unable to reach GitHub. Check your connection and try again.`
**And** the installer exits with code 1

**Given** the specified branch does not exist
**When** the manifest fetch returns 404
**Then** stderr displays `Error: Branch '{name}' not found. Check the branch name and try again.`
**And** the installer exits with code 1

**Given** the manifest JSON is malformed
**When** JSON parsing fails
**Then** stderr displays `Error: Invalid manifest file. The repository may be corrupted.`
**And** the installer exits with code 1

**Given** tarball extraction fails
**When** the `tar` command returns a non-zero exit code
**Then** stderr displays `Error: Failed to extract archive. Ensure 'tar' is installed and try again.`
**And** the installer exits with code 1

**Given** filesystem write fails during directory copy
**When** a permission or disk error occurs
**Then** stderr displays `Error: Failed to write files. Check directory permissions and try again.`
**And** the installer exits with code 1

**Given** any error occurs after the temp directory has been created
**When** the error is caught by the top-level try/catch in `main()`
**Then** `cleanup(tmpDir)` removes the temp directory before exiting
**And** no partial files remain in the target directory or temp location

**Given** any error occurs
**When** the error message is printed
**Then** no stack traces are shown
**And** errors go to stderr via `console.error`
**And** normal output goes to stdout via `console.log`
