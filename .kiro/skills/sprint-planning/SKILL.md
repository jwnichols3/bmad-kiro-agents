---
name: sprint-planning
description: >-
  Sprint planning workflow. Load when user asks to plan a sprint, create sprint backlog,
  or generate sprint status. Do NOT load for story creation or development.
---

# Sprint Planning Workflow

Plan sprint and generate status tracking:

1. Load `_bmad/core/tasks/workflow.xml` - this is the CORE OS
2. Read its contents and understand the workflow execution framework
3. Execute `_bmad/bmm/workflows/4-implementation/sprint-planning/workflow.yaml`
4. Follow workflow.xml instructions EXACTLY
5. Save sprint planning outputs after each section