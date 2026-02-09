# Story 4.2: Error Handling & Clean Failure

**Epic:** Epic 4: Post-Install Experience & Error Handling  
**FRs Covered:** FR16, FR17, FR18, FR19, FR20, FR21

## Story Description

As a developer,
I want clear, actionable error messages and no partial files left behind when something goes wrong,
So that I can fix the issue and re-run confidently.

## Acceptance Criteria

### Network Failure Error
**Given** GitHub is unreachable during manifest fetch or tarball download  
**When** the network request fails  
**Then** stderr displays `Error: Unable to reach GitHub. Check your connection and try again.`  
**And** the installer exits with code 1

### Branch Not Found Error
**Given** the specified branch does not exist  
**When** the manifest fetch returns 404  
**Then** stderr displays `Error: Branch '{name}' not found. Check the branch name and try again.`  
**And** the installer exits with code 1

### Manifest Parse Error
**Given** the manifest JSON is malformed  
**When** JSON parsing fails  
**Then** stderr displays `Error: Invalid manifest file. The repository may be corrupted.`  
**And** the installer exits with code 1

### Download Failure Error
**Given** tarball download fails  
**When** the download request fails  
**Then** stderr displays `Error: Failed to download archive. Check your connection and try again.`  
**And** the installer exits with code 1

### Extraction Failure Error
**Given** tarball extraction fails  
**When** the `tar` command returns a non-zero exit code  
**Then** stderr displays `Error: Failed to extract archive. Ensure tar is installed and try again.`  
**And** the installer exits with code 1

### Filesystem Write Error
**Given** filesystem write fails during directory copy  
**When** a permission or disk error occurs  
**Then** stderr displays `Error: Failed to write files. Check directory permissions and try again.`  
**And** the installer exits with code 1

### Clean Failure Guarantee
**Given** any error occurs after the temp directory has been created  
**When** the error is caught by the top-level try/catch in `main()`  
**Then** `cleanup(tmpDir)` removes the temp directory before exiting  
**And** no partial files remain in the target directory or temp location

### Error Output Standards
**Given** any error occurs  
**When** the error message is printed  
**Then** no stack traces are shown  
**And** errors go to stderr via `console.error`  
**And** normal output goes to stdout via `console.log`

## Implementation Notes

- All error messages follow the format: `Error: {what happened}. {what to do}.`
- Six specific error messages are defined per UX specification
- Single try/catch in `main()` handles all errors
- Temp directory cleanup is guaranteed on any failure
- Exit code 1 for all errors, code 0 for success or user cancellation