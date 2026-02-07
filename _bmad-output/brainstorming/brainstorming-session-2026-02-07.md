---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'npx installer for jwnichols3/bmad-kiro-agents - copies .kiro/agents/, .kiro/skills/, _bmad/ into target project'
session_goals: 'Simple zero-dependency npx tool pulling from GitHub, prompts before overwriting existing files'
selected_approach: 'ai-recommended'
techniques_used: ['Question Storming', 'SCAMPER Method', 'Constraint Mapping']
ideas_generated: [25]
context_file: ''
session_active: false
workflow_completed: true
---

# Brainstorming Session Results

**Facilitator:** Rocket
**Date:** 2026-02-07

## Session Overview

**Topic:** npx installer for `jwnichols3/bmad-kiro-agents` that copies `.kiro/agents/`, `.kiro/skills/`, and `_bmad/` into a target project
**Goals:** Simple, zero-dependency npx tool that pulls from GitHub and prompts before overwriting existing files

### Constraints
- Zero dependencies (Node.js built-ins only: `https`, `child_process`, `fs`, `path`, `readline`)
- Prompt user if target files/dirs already exist
- Pull source files directly from GitHub repo (`jwnichols3/bmad-kiro-agents`)
- Mac/Linux only

## Technique Selection

**Approach:** AI-Recommended Techniques
- **Question Storming:** Surface hidden design decisions
- **SCAMPER Method:** Stress-test design through seven lenses
- **Constraint Mapping:** Validate implementation path

## Design Decisions

### Distribution & Invocation
- GitHub-direct: `npx github:jwnichols3/bmad-kiro-agents install`
- Migrate to npm publish once stable
- Explicit `install` verb — good CLI hygiene, room for future commands
- Flags: `--branch <name>` (default: `main`), `--force`
- Optional positional arg: `[target-dir]`

### Fetch & Extract Mechanism
- Download GitHub tarball via Node `https` built-in
- Pipe to `tar xz` via `child_process` (Mac/Linux safe)
- Single HTTP call, no rate limits, scales with directory size
- Validated by degit pattern (same approach used by Rich Harris's tool)

### Manifest-Driven Architecture
- `bmad-manifest.json` in repo root declares directories to copy
- Installer reads manifest first, then acts — never hardcodes directories
- Future-proofs the tool as directories evolve

### User Experience Flow
- Prompt for install location (default: cwd), or accept as positional arg to skip prompt
- Pre-install summary showing each directory as "new" or "exists — will overwrite"
- Single confirmation prompt for all conflicts
- `--force` skips all prompts
- Minimal output — success message + docs link to repo README

### Update & Idempotency
- Re-running = same code path as fresh install
- Full recursive overwrite, no merge
- Zero additional complexity for updates

## Final Design

**Invocation:**
```
npx github:jwnichols3/bmad-kiro-agents install [--branch <name>] [--force] [<target-dir>]
```

**Manifest (bmad-manifest.json):**
```json
{
  "directories": [
    ".kiro/agents",
    ".kiro/skills",
    "_bmad"
  ]
}
```

**Execution Flow:**
1. Parse args (`--branch`, `--force`, optional target dir)
2. Prompt for install location (default: cwd) — skip if target dir provided
3. Download `bmad-manifest.json` from repo via raw.githubusercontent.com
4. Check which manifest directories already exist in target
5. Show summary (new vs. overwrite for each dir)
6. Prompt to proceed (skip if `--force`)
7. Download tarball for the branch
8. Extract only the manifest directories via `tar`
9. Print success + docs link

**Constraint Validation:**

| Constraint | Solution | Status |
|---|---|---|
| Zero dependencies | Node built-ins only | ✅ |
| Pull from GitHub | Tarball download via `https` | ✅ |
| Mac/Linux only | Shell out to `tar` | ✅ |
| Prompt on existing | Check manifest dirs, one combined prompt | ✅ |
| --force skips prompt | Manual CLI arg parsing | ✅ |
| --branch support | Default `main`, pass to tarball URL | ✅ |
| Future-proof dirs | `bmad-manifest.json` | ✅ |
| Re-runnable updates | Same code path, overwrite on confirm | ✅ |
| Post-install guidance | Print docs link | ✅ |

## Implementation Plan

1. **Scaffold npm package** — `package.json` with `"bin"` entry pointing to installer script
2. **Create `bmad-manifest.json`** in repo root
3. **Build installer** (~30-50 lines of Node): arg parsing → manifest fetch → tarball download → tar extract → done
4. **Test** with `npx github:jwnichols3/bmad-kiro-agents install`
5. **Later:** `npm publish` for shorter invocation

## Session Insights

**Key Breakthrough:** The manifest file idea — transforms a hardcoded installer into a future-proof, self-describing tool. Update what gets installed by editing JSON, not code.

**Architecture Validation:** The tarball + tar approach mirrors degit (the gold standard for this pattern), confirming the design is battle-tested.

**Phased Distribution:** GitHub-direct first, npm publish later — keeps iteration fast during development without sacrificing the end-goal UX.
