---
name: code-review
description: >-
  Adversarial code review workflow. Load when user asks to review code, find issues,
  or perform code quality assessment. Do NOT load for story implementation.
---

# Code Review Workflow

Perform adversarial code review:

1. Load `_bmad/core/tasks/workflow.xml` - this is the CORE OS
2. Read its contents and understand the workflow execution framework
3. Execute `_bmad/bmm/workflows/4-implementation/code-review/workflow.yaml`
4. Follow workflow.xml instructions EXACTLY
5. Save review findings and fixes after each section