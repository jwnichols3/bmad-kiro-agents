# Story 1.2: Manifest Fetch & Tarball Install

## Overview
Implements the core install pipeline functions: fetchManifest(), downloadAndExtract(), copyDirectories(), cleanup().

## Functional Requirements Covered
- FR1: User can invoke the installer via `npx github:jwnichols3/bmad-kiro-agents install`
- FR2: Installer reads `bmad-manifest.json` from the repo to determine which directories to copy
- FR3: Installer downloads the repo tarball from GitHub for the specified branch
- FR4: Installer extracts only the directories listed in the manifest to the target location

## Acceptance Criteria

### Manifest Fetch
**Given** the installer has a valid target directory
**When** it executes the install flow
**Then** `fetchManifest(branch)` fetches `bmad-manifest.json` from `https://raw.githubusercontent.com/jwnichols3/bmad-kiro-agents/{branch}/bmad-manifest.json` using global `fetch()`
**And** it parses the JSON response into an array of directory names

### Tarball Download & Extract
**Given** a valid manifest is fetched
**When** the installer proceeds to download
**Then** `downloadAndExtract(branch, tmpDir)` creates a temp directory via `fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-'))`
**And** downloads the tarball from `https://github.com/jwnichols3/bmad-kiro-agents/archive/refs/heads/{branch}.tar.gz` using `fetch()`
**And** writes the tarball to the temp directory
**And** extracts it using `tar xz` via `child_process`

### Directory Copy
**Given** the tarball is extracted in the temp directory
**When** `copyDirectories(dirs, srcRoot, target)` runs
**Then** only the directories listed in the manifest are copied from `{tmpDir}/bmad-kiro-agents-{branch}/` to the target directory
**And** directories not in the manifest are ignored

### Cleanup
**Given** the install completes (success or failure)
**When** `cleanup(tmpDir)` runs
**Then** the temp directory is removed
**And** no temp files remain on disk

### Action Output
**Given** the full install pipeline succeeds
**When** the action line is printed
**Then** stdout shows `Installing... done`

## Implementation Functions

### fetchManifest(branch)
- Fetch manifest from GitHub raw URL
- Parse JSON response
- Return array of directory names

### downloadAndExtract(branch, tmpDir)
- Create temp directory with `fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-'))`
- Download tarball using `fetch()`
- Write to temp directory
- Extract using `tar xz` command

### copyDirectories(dirs, srcRoot, target)
- Copy only manifest-listed directories
- Source: `{tmpDir}/bmad-kiro-agents-{branch}/`
- Target: user-specified directory

### cleanup(tmpDir)
- Remove temp directory
- Ensure no temp files remain