# Story 2.1: Directory Existence Detection & Summary Display

**Epic:** Epic 2 - Conflict Detection & User Confirmation  
**FRs Covered:** FR7, FR8

## User Story

As a developer,
I want to see which BMAD directories are new and which already exist before the install proceeds,
So that I know exactly what will change in my project.

## Acceptance Criteria

**Given** the manifest has been fetched with a list of directories
**When** `checkExisting(dirs, target)` runs
**Then** each directory is checked for existence in the target path
**And** the result is returned as a list of `{ name, exists }` entries

**Given** the existence check is complete
**When** the pre-install summary is displayed
**Then** each directory is shown with 2-space indent, padded name, and `→ new` or `→ exists (will overwrite)` status
**And** the arrows are vertically aligned across all lines

## Implementation Notes

- Implement `checkExisting(dirs, target)` function
- Return format: `{name, exists}` entries
- Display format: 2-space indent, padded directory names, → arrow aligned
- Status text: 'new' or 'exists (will overwrite)'
- Example output:
  ```
    .kiro/agents/  → new
    .kiro/skills/  → new
    _bmad/         → exists (will overwrite)
  ```
- Blank line before and after the summary block

## Technical Requirements

- Use Node.js built-in `fs` module for directory existence checks
- Minimal implementation - only check directory existence, no file-level analysis
- Align arrows vertically across all directory entries
- Follow UX specification for plain text output (no ANSI colors, no box-drawing)