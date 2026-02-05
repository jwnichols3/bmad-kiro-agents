---
name: run-epic
description: Autonomously execute all remaining stories in an Epic through the full BMAD pipeline (create-story → dev-story → code-review → e2e-tests → PR)
---

# Run Epic - Autonomous Story Pipeline

Execute the complete BMAD development pipeline for all remaining stories in the specified Epic.

## Prerequisites
- Epic file exists in `_bmad-output/planning-artifacts/`
- Git repository initialized with remote
- GitHub CLI (`gh`) authenticated

## Pipeline Per Story

1. **Branch**: Create feature branch from main
2. **SM Agent**: Create story via `bmad-sm` subagent
3. **Dev Agent**: Implement story via `bmad-dev` subagent  
4. **Review Agent**: Code review + auto-fix via `bmad-reviewer` subagent
5. **QA Agent**: E2E tests (if frontend) via `bmad-qa` subagent
6. **Git**: Commit, push, create PR, merge

## Usage

Provide the Epic identifier or file path:
```
Run the epic pipeline for Epic-001
```

## Subagent Invocation Pattern

Each phase spawns a specialized subagent:
```
use_subagent with agent_name="bmad-{role}" and autonomous instructions
```

## Risk Acknowledgment

This runs autonomously without confirmations. Ensure:
- Tests are comprehensive
- CI/CD will catch issues
- You can revert if needed
