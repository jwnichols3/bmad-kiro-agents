# Story 3.1: Force Flag & Branch Flag Support

**Epic:** Epic 3 - Power-User CLI Flags  
**FRs Covered:** FR11, FR12  
**Story:** As a developer, I want to pass `--force` to skip all prompts and `--branch` to target a specific branch, so that I can batch-update projects and test feature branches without friction.

## Implementation Notes

Both flags are already implemented in prior stories:
- `parseArgs` configuration in Story 1.1
- `--force` behavior in Story 2.2  
- `--branch` flowing through `fetchManifest` and `downloadAndExtract` in Story 1.2

This story formalizes and verifies the behavior.

## Acceptance Criteria

### AC1: Force Flag Behavior
**Given** the user runs `npx github:jwnichols3/bmad-kiro-agents install --force`  
**When** the `--force` flag is present  
**Then** the pre-install summary and confirmation prompt are skipped entirely  
**And** the output shows only `Installing... done` followed by the success handoff  
**And** the install proceeds immediately

### AC2: Branch Flag Behavior  
**Given** the user runs `npx github:jwnichols3/bmad-kiro-agents install --branch feature/new-agents`  
**When** the `--branch` flag is provided  
**Then** the manifest is fetched from `raw.githubusercontent.com/.../feature/new-agents/bmad-manifest.json`  
**And** the tarball is downloaded from `.../archive/refs/heads/feature/new-agents.tar.gz`  
**And** the extracted directory prefix uses the branch-specific name

### AC3: Default Branch Behavior
**Given** no `--branch` flag is provided  
**When** the installer runs  
**Then** the default branch `main` is used for both manifest and tarball URLs

## Verification Tasks

1. Test `--force` flag skips all prompts and proceeds directly to installation
2. Test `--branch` flag correctly fetches from specified branch
3. Test default branch behavior when no `--branch` specified
4. Test combination of `--force` and `--branch` flags together
5. Verify error handling for non-existent branches