---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['prd.md', 'prd-validation-report.md', 'product-brief-bmad-kiro-agents-2026-02-07.md', 'bmad-kiro-test-run.md', 'kiro-cli-bmad-analysis.md', 'brainstorming-session-2026-02-07.md']
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-02-08'
project_name: 'bmad-kiro-agents'
user_name: 'Rocket'
date: '2026-02-08'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
21 FRs across 5 capability areas:
- Installation Core (FR1-FR6): Manifest-driven tarball download and extraction
- Conflict Detection (FR7-FR10): Directory existence checks with overwrite confirmation
- CLI Flags (FR11-FR12): `--force` and `--branch` support
- Post-Install (FR13-FR15): Success messaging with docs link and next-step command
- Error Handling (FR16-FR21): Graceful failures with actionable messages, clean state, proper exit codes

**Non-Functional Requirements:**
- Performance: < 60s end-to-end, < 100ms prompt response
- Reliability: Idempotent execution, no partial state on failure
- Portability: macOS + Linux, Node.js 18+, zero external dependencies
- Maintainability: ~50-100 lines, manifest-only changes to add directories

**Scale & Complexity:**
- Primary domain: CLI tool / Node.js scripting
- Complexity level: Low
- Estimated architectural components: 4-5 (arg parser, manifest fetcher, tarball downloader/extractor, user I/O, error handler)

### Technical Constraints & Dependencies

- Zero npm dependencies — Node.js built-ins only (https, child_process, fs, path, readline)
- External system dependency: `tar` command on PATH (standard on macOS/Linux)
- Network dependency: GitHub (github.com for tarball, raw.githubusercontent.com for manifest)
- Runtime: Node.js 18+
- Platform: macOS and Linux only (Windows explicitly out of scope)

### Cross-Cutting Concerns Identified

- **Clean failure / no partial state**: Every stage that writes to disk must be recoverable. Extraction is the critical path — if tar fails mid-extract, partial directories may exist.
- **User I/O duality**: The tool must work both interactively (prompts) and non-interactively (`--force`), so I/O logic needs clean separation from business logic.
- **Error messaging consistency**: All failure paths (network, branch not found, extraction, filesystem) need the same pattern: actionable message to stderr, non-zero exit code, no stack traces.

## Starter Template Evaluation

### Primary Technology Domain

CLI tool / Node.js scripting — minimal single-purpose installer.

### Starter Options Considered

Traditional CLI starters (oclif, commander, yargs) were evaluated and rejected — all introduce npm dependencies, violating the zero-dependency constraint. The project's ~50-100 line scope makes any scaffolding framework unnecessary overhead.

### Selected Approach: Manual Minimal Scaffolding

**Rationale:** The zero-dependency constraint and small scope make this a "no starter" project. The architecture is a single executable script with a package.json for npm/npx distribution.

**Technical Decisions:**

- **Language:** JavaScript (no TypeScript build step — unnecessary for ~50-100 lines)
- **Module System:** ES Modules (`"type": "module"`) — Node 18+ native, modern syntax
- **Structure:** Single file (`bin/install.js`) — linear execution flow, no abstraction needed
- **Build Tooling:** None — direct execution via Node.js
- **Testing:** None in MVP — tool is small enough for manual validation
- **Linting/Formatting:** None in MVP — single file, single author

**Project Structure:**
```
bin/install.js           # Installer script (~50-100 lines)
bmad-manifest.json       # Directory manifest
package.json             # name, version, type: module, bin entry
```

**Note:** Project initialization is trivial — `npm init` + create `bin/install.js` + create `bmad-manifest.json`. This can be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Clean failure strategy (temp directory extraction)
2. Manifest fetch strategy (separate HTTP call, fail-fast)
3. Argument parsing approach (node:util parseArgs)
4. HTTP client approach (global fetch API)

**Deferred Decisions (Post-MVP):**
- npm publish distribution strategy
- `--dry-run` implementation approach
- Version tracking / diff mechanism
- Per-file conflict resolution

### Execution Flow & Clean Failure

**Decision:** Extract tarball to a temporary directory, then copy manifest directories to target.

**Rationale:** GitHub tarballs extract to a `{repo}-{branch}/` prefix directory. Extracting to a temp dir first means: (1) if extraction fails, no partial state in the target, satisfying FR19; (2) we have a clean workspace to cherry-pick only the manifest directories; (3) cleanup is a single `rm -rf` of the temp dir.

**Flow:**
1. Parse args
2. Fetch `bmad-manifest.json` via `fetch()` from `raw.githubusercontent.com`
3. Check which manifest directories exist in target (for summary display)
4. Prompt user (unless `--force`)
5. Download tarball to temp dir
6. Extract tarball in temp dir via `tar xz`
7. Copy manifest directories from `{temp}/{repo}-{branch}/` to target
8. Remove temp dir
9. Print success message

**Failure behavior:** If any step 2-8 fails, print actionable error to stderr, clean up temp dir if it exists, exit non-zero.

### Manifest Fetch Strategy

**Decision:** Fetch manifest separately before downloading tarball.

**Rationale:** Fail-fast design. If the manifest is missing or malformed, we avoid downloading the entire tarball. The manifest URL is predictable: `https://raw.githubusercontent.com/{owner}/{repo}/{branch}/bmad-manifest.json`.

### Argument Parsing

**Decision:** Use `node:util` `parseArgs` (built-in to Node 18.3+).

**Rationale:** Structured parsing with type validation for `--force` (boolean), `--branch` (string), and positional args — without manual `process.argv` slicing. Zero dependencies, handles edge cases like `--branch=main` vs `--branch main`.

### HTTP Client

**Decision:** Use global `fetch()` API (built-in to Node 18+).

**Rationale:** Handles redirects automatically (GitHub tarball URLs return 302), cleaner API than raw `https.get()`, zero dependencies. Available globally in Node 18+ without import.

**Note:** For tarball download, `fetch()` returns a Response with `.arrayBuffer()` or streaming body — write to temp file, then extract with `tar`.

### Decision Impact Analysis

**Implementation Sequence:**
1. Arg parsing (independent, first thing that runs)
2. Manifest fetch (depends on parsed `--branch` value)
3. Directory existence check (depends on manifest content + target path)
4. User prompt (depends on existence check results + `--force` flag)
5. Tarball download to temp dir (depends on `--branch`)
6. Extraction + copy (depends on tarball + manifest directories)
7. Cleanup + success message

**Cross-Component Dependencies:**
- `--branch` flag flows through to both manifest URL and tarball URL construction
- `--force` flag only affects the prompt step — all other steps are identical
- Temp directory is created before tarball download and cleaned up in all exit paths (success and failure)

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 5 areas where AI agents could make different choices for this single-file CLI tool.

### Error Handling Pattern

**Rule:** Individual functions throw errors with descriptive messages. Top-level `main()` has a single `try/catch` that formats and routes all errors.

```javascript
// Top-level pattern
async function main() {
  try {
    // sequential steps...
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}
```

- All errors exit with code 1 — no differentiated exit codes
- No stack traces in output — ever
- Error messages must be actionable: tell the user what went wrong and what to do
- `console.error` for all error output (routes to stderr)

### Output Formatting Pattern

**Rule:** Plain text, no fancy formatting. `console.log` for stdout, `console.error` for stderr.

**Pre-install summary format:**
```
  .kiro/agents/  → new
  .kiro/skills/  → new
  _bmad/         → exists (will overwrite)
```

- No `console.table`, no ANSI colors, no box-drawing characters
- Success message is plain text with docs link and next-step command
- Prompt uses `readline` interface with simple `? ` prefix

### Function Structure Pattern

**Rule:** One `async function main()` orchestrating small named helper functions. Each helper does one thing.

**Expected functions:**
- `parseArgs()` — CLI argument parsing via `node:util` parseArgs
- `fetchManifest(branch)` — fetch and parse bmad-manifest.json
- `checkExisting(dirs, target)` — check which manifest dirs exist in target
- `promptUser(summary)` — display summary and get confirmation
- `downloadAndExtract(branch, tmpDir)` — download tarball and extract to temp dir
- `copyDirectories(dirs, srcRoot, target)` — copy manifest dirs from extracted tarball to target
- `cleanup(tmpDir)` — remove temp directory

**Anti-pattern:** One monolithic function with all logic inline.

### Exit Code Convention

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Any error (network, extraction, filesystem) |

User cancellation (answering "no" to prompt) exits with code 0 — it's not an error, the user chose to stop.

### Temp Directory Pattern

**Rule:** Use `fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-'))` — OS-managed temp location, unique name prefix.

- Created just before tarball download
- Cleaned up in all exit paths (success, error, and user cancellation if created)
- Never created in the target project directory

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow the single try/catch error pattern — no nested error handling
- Use only `console.log` and `console.error` — no other output mechanisms
- Create named helper functions — no inline logic blocks in main()
- Use `os.tmpdir()` for temp files — never cwd or target directory
- Keep the entire implementation in a single `bin/install.js` file

## Project Structure & Boundaries

### Complete Project Directory Structure

```
bmad-kiro-agents/
├── bin/
│   └── install.js          # CLI installer entry point (~50-100 lines)
├── bmad-manifest.json       # Directory manifest (JSON array of directory names)
├── package.json             # npm package config (name, version, type: module, bin)
├── LICENSE                  # Project license
└── README.md                # Usage documentation
```

### Architectural Boundaries

**Network Boundary (GitHub):**
- `raw.githubusercontent.com/{owner}/{repo}/{branch}/bmad-manifest.json` — manifest fetch
- `github.com/{owner}/{repo}/archive/refs/heads/{branch}.tar.gz` — tarball download
- Both accessed via global `fetch()` — redirects handled automatically
- Failure at this boundary triggers actionable error message and clean exit

**Filesystem Boundary (Target Directory):**
- Target directory is `process.cwd()` (where the user runs the command)
- Temp directory via `os.tmpdir()` for tarball extraction staging
- Manifest directories copied from temp to target — never written directly to target during extraction

**Process Boundary (tar):**
- External `tar xz` command invoked via `child_process` for extraction
- Failure here triggers temp directory cleanup and clean exit

### Requirements to Structure Mapping

**All functional requirements map to `bin/install.js`:**

| Function | Fulfills | Purpose |
|---|---|---|
| `parseArgs()` | FR11-FR12 | `--force`, `--branch`, positional target path |
| `fetchManifest(branch)` | FR1-FR2 | Fetch and parse bmad-manifest.json from GitHub |
| `checkExisting(dirs, target)` | FR7-FR9 | Detect existing directories, build summary |
| `promptUser(summary)` | FR10, FR12 | Display summary, confirm overwrite (skip if `--force`) |
| `downloadAndExtract(branch, tmpDir)` | FR3-FR5 | Download tarball, extract to temp dir |
| `copyDirectories(dirs, srcRoot, target)` | FR6 | Copy manifest dirs from temp to target |
| `cleanup(tmpDir)` | FR19 | Remove temp directory in all exit paths |
| `main()` try/catch | FR16-FR21 | Unified error handling, actionable messages, exit codes |

**Post-install output (FR13-FR15):** Inline in `main()` after successful copy — plain text success message with docs link and next-step command.

**`bmad-manifest.json`:** Static configuration file listing directories to install. Adding new directories requires only editing this file (FR6 extensibility).

**`package.json`:** Distribution metadata — `"bin": { "bmad-install": "./bin/install.js" }` enables `npx` execution.

### Integration Points

**Internal Communication:** None — single-file linear execution. Functions call each other sequentially in `main()`.

**External Integrations:**
- GitHub raw content API (manifest fetch)
- GitHub archive API (tarball download)
- System `tar` command (extraction)

**Data Flow:**
```
CLI args → parseArgs() → branch, force, target
  → fetchManifest(branch) → directory list
  → checkExisting(dirs, target) → existence summary
  → promptUser(summary) → user confirmation
  → downloadAndExtract(branch, tmpDir) → extracted files in temp
  → copyDirectories(dirs, srcRoot, target) → installed directories
  → cleanup(tmpDir) → temp removed
  → success message to stdout
```

### File Organization Patterns

**Configuration:** `bmad-manifest.json` at repo root — single source of truth for installable directories.

**Source:** Single file at `bin/install.js` — no src directory needed, no module splitting warranted at this scale.

**Tests:** Out of scope for MVP. The tool's small size and deterministic behavior make manual validation sufficient. Future testing would live in a `test/` directory if added.

**Assets:** None — no static assets, no generated files beyond the installed directories.

### Development Workflow Integration

**Development:** `node bin/install.js [--branch main] [--force] [target-dir]` — direct execution, no build step.

**Build Process:** None — ES modules executed directly by Node.js, no transpilation or bundling.

**Deployment:** `npm publish` — users run via `npx bmad-install` or `npm exec bmad-install`. The `bin` field in `package.json` handles CLI registration.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** All technology choices target Node.js 18+ built-ins with zero conflicts. ES Modules, global `fetch()`, `node:util parseArgs`, `child_process`, and `fs/path/os` are all stable, mutually compatible APIs.

**Pattern Consistency:** Seven named helper functions follow uniform conventions — single responsibility, throw-on-error, no nested error handling. Output routing (`console.log` for stdout, `console.error` for stderr) is consistent throughout.

**Structure Alignment:** The 3-file project structure directly supports every architectural decision with no unnecessary files or missing components.

### Requirements Coverage ✅

**All 21 functional requirements** have explicit architectural support mapped to specific functions in `bin/install.js`. No gaps in FR coverage.

**All non-functional requirements** are addressed: performance is network-bound with no local bottlenecks, reliability is ensured by temp-dir extraction, portability targets macOS/Linux with Node 18+ built-ins, and maintainability is achieved through manifest-driven design in a single file.

### Implementation Readiness ✅

**Decision Completeness:** All critical decisions specify exact APIs and versions. No ambiguous choices remain for implementing agents.

**Pattern Completeness:** All identified conflict points (error handling, output formatting, function structure, exit codes, temp directory management) have explicit rules with code examples.

**Structure Completeness:** Every file, function, and data flow is documented with requirements traceability.

### Gap Analysis

**No critical or blocking gaps identified.**

**Minor clarifications for implementation stories:**
- `--branch` default value should be `main` (inferable but not explicitly stated)
- `bmad-manifest.json` format should be specified as a JSON array of directory name strings
- Success message content (docs URL, next-step command) to be defined during implementation

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (low — single-file CLI)
- [x] Technical constraints identified (zero dependencies, Node 18+, macOS/Linux)
- [x] Cross-cutting concerns mapped (clean failure, I/O duality, error consistency)

**✅ Architectural Decisions**
- [x] Critical decisions documented with specific APIs
- [x] Technology stack fully specified (Node.js 18+, ES Modules, no build tooling)
- [x] Integration patterns defined (GitHub network boundary, system tar)
- [x] Performance considerations addressed (network-bound, no local bottlenecks)

**✅ Implementation Patterns**
- [x] Function structure conventions established
- [x] Error handling pattern defined with code example
- [x] Output formatting rules specified
- [x] Exit code convention documented
- [x] Temp directory management pattern defined

**✅ Project Structure**
- [x] Complete directory structure defined (3 files + README + LICENSE)
- [x] Component boundaries established (network, filesystem, process)
- [x] Integration points mapped (GitHub APIs, system tar)
- [x] Requirements to structure mapping complete (all 21 FRs → functions)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — the project's low complexity and thorough decision documentation leave minimal room for agent interpretation divergence.

**Key Strengths:**
- Zero-dependency constraint eliminates entire categories of architectural risk
- Single-file scope means no inter-module coordination issues
- Every function is mapped to specific requirements with clear boundaries
- Temp-dir extraction pattern elegantly solves the clean-failure requirement

**Areas for Future Enhancement:**
- `--dry-run` flag (deferred post-MVP)
- Version tracking and diff mechanism for updates
- Per-file conflict resolution (currently directory-level only)
- npm publish distribution pipeline

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use the seven named helper functions — do not inline logic in `main()`
- Respect the single try/catch error pattern — no nested error handling
- Use `os.tmpdir()` for temp files — never the target directory
- Keep everything in `bin/install.js` — do not split into multiple files

**First Implementation Priority:**
Project initialization — `npm init` with correct `package.json` fields (`type: "module"`, `bin` entry), create `bin/install.js` with shebang and `main()` skeleton, create `bmad-manifest.json` with initial directory list.
