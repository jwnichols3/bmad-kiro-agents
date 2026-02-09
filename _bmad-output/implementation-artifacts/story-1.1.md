# Story 1.1: Project Initialization & CLI Entry Point

**Epic:** Epic 1 - Project Scaffolding & Manifest-Driven Install  
**FRs Covered:** FR1, FR2, FR5, FR6  
**Project:** bmad-kiro-agents  
**User:** Rocket  

## User Story

As a developer,
I want to run `npx github:jwnichols3/bmad-kiro-agents install` and have the tool parse my arguments and determine the target directory,
So that I can invoke the installer with a single command.

## Acceptance Criteria

### AC1: No Positional Argument Handling
**Given** the user runs `npx github:jwnichols3/bmad-kiro-agents install`  
**When** no positional argument is provided  
**Then** the installer prompts for install location with cwd as default  
**And** the user can confirm or provide an alternative path  

### AC2: Positional Argument Handling
**Given** the user runs `npx github:jwnichols3/bmad-kiro-agents install ./my-project`  
**When** a positional argument is provided  
**Then** the installer uses that path as the target directory without prompting  

### AC3: Project Structure Requirements
**Given** the project repository  
**When** a developer clones it  
**Then** `package.json` exists with `"type": "module"` and a `"bin"` entry pointing to `bin/install.js`  
**And** `bmad-manifest.json` exists with an array of directory names to install  
**And** `bin/install.js` has a shebang line, imports `parseArgs` from `node:util`, and defines the `main()` async function with a single top-level try/catch  
**And** `parseArgs` is configured for `--force` (boolean), `--branch` (string, default `main`), and positional args  

## Implementation Tasks

### Task 1: Create package.json
- Set `"type": "module"`
- Add `"bin"` entry pointing to `bin/install.js`
- Configure for Node.js 18+ compatibility

### Task 2: Create bmad-manifest.json
- Define array of directory names to install
- Keep structure simple and maintainable

### Task 3: Create bin/install.js
- Add shebang line for executable
- Import `parseArgs` from `node:util`
- Configure argument parsing:
  - `--force` (boolean)
  - `--branch` (string, default: "main")
  - Positional arguments for target directory
- Implement `main()` async function with single top-level try/catch
- Handle target directory determination logic

## Definition of Done

- [ ] `package.json` created with correct module type and bin entry
- [ ] `bmad-manifest.json` created with directory array
- [ ] `bin/install.js` created with shebang and proper imports
- [ ] Argument parsing configured for all required flags and positional args
- [ ] `main()` function structure implemented with try/catch
- [ ] Target directory logic handles both prompted and positional scenarios
- [ ] All acceptance criteria verified through testing