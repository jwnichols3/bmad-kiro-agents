---
name: qa-automate
description: >-
  QA test automation workflow. Load when user asks to create E2E tests, Playwright tests,
  or automate testing for a story. Do NOT load for code review or development.
---

# QA Test Automation Workflow

Generate E2E tests for features:

1. Load `_bmad/core/tasks/workflow.xml` - this is the CORE OS
2. Read its contents and understand the workflow execution framework
3. Execute `_bmad/bmm/workflows/qa/automate/workflow.yaml`
4. Follow workflow.xml instructions EXACTLY
5. Save test automation outputs after each section