# Story 2.2: Confirmation Prompt & Overwrite Execution

**Epic:** Epic 2: Conflict Detection & User Confirmation  
**FRs Covered:** FR9, FR10

## Story Description

As a developer,
I want to confirm the install before any files are written, with a safe default of "no",
So that I don't accidentally overwrite files.

## Acceptance Criteria

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

## Implementation Notes

- Implements `promptUser()` function using readline
- Prompt format: `Install to {target_path}? (y/N) ` with trailing space
- Default is N (safe default)
- y/Y proceeds, n/N/Enter cancels with exit 0 and no output
- Any other input re-prompts
- --force skips prompt entirely
- Existing directories are fully recursively overwritten

## Technical Requirements

- Use Node.js built-in `readline` module
- Handle user input validation and re-prompting
- Implement safe default behavior (N)
- Ensure clean exit on cancellation (code 0, no output)
- Support recursive directory overwriting on confirmation