# Story 4.1: Success Handoff Message

**Epic:** Epic 4: Post-Install Experience & Error Handling  
**Story:** Success Handoff Message  
**FRs Covered:** FR13, FR14, FR15

## Story Description

As a developer,
I want to see a clear success message with my exact next command after install completes,
So that I can immediately start using BMAD without consulting docs.

## Acceptance Criteria

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

## Implementation Notes

- Output must go to stdout using `console.log`
- Exact formatting is critical for UX consistency
- Message serves as handoff to guide user to next action
- No additional formatting or styling beyond specified layout