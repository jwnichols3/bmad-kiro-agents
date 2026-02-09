---
name: create-story
description: >-
  Story creation workflow. Load when user asks to create the next story, prepare a story
  for development, or generate a story from epics. Do NOT load for story implementation.
---

# Create Story Workflow

Create development-ready story:

1. Load `_bmad/core/tasks/workflow.xml` - this is the CORE OS
2. Read its contents and understand the workflow execution framework
3. Execute `_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
4. Follow workflow.xml instructions EXACTLY
5. Save story outputs after each section