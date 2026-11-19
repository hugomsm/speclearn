# learning-sandbox-isolation Specification

## Purpose
Learning sandbox isolation protects production work while activating a course and allows safe training branch or directory workflows.

## Requirements

### Requirement: Git safety check
The CLI SHALL inspect repository cleanliness before creating a learning sandbox.

#### Scenario: Working tree is clean
- **WHEN** the user runs `speclearn start <course>` in a clean Git working tree
- **THEN** the CLI SHALL create or select an isolated sandbox and SHALL record it in progress state

#### Scenario: Working tree has unrelated changes
- **WHEN** Git status reports uncommitted changes
- **THEN** the CLI SHALL warn the user and SHALL require an explicit safe strategy before modifying the workspace

#### Scenario: Repository is not Git-enabled
- **WHEN** the project does not contain a Git repository
- **THEN** the CLI SHALL fall back to `.speclearn/sandbox/` isolation and SHALL record the sandbox path

### Requirement: Sandbox isolation strategy
The CLI SHALL isolate learning work using a `speclearn/` Git branch or `.speclearn/sandbox/` directory.

#### Scenario: Git branch isolation is available
- **WHEN** the workspace is a Git repository and branch isolation is chosen or available
- **THEN** the CLI SHALL create or reuse a branch for the active course without changing unrelated production branches

#### Scenario: Directory isolation is available
- **WHEN** branch isolation is unavailable or explicitly rejected
- **THEN** the CLI SHALL use `.speclearn/sandbox/` as the isolated training location

### Requirement: Skip mastered module
The CLI SHALL provide `speclearn skip <module>` for demonstrated mastery and SHALL unlock only prerequisite-valid downstream nodes.

#### Scenario: Module mastery is confirmed
- **WHEN** the student demonstrates mastery and invokes `speclearn skip <module>`
- **THEN** the CLI SHALL set the module to `skipped_mastered` and SHALL update only nodes whose prerequisites become satisfied

#### Scenario: Module is not mastered
- **WHEN** the module is skipped before mastery evidence is accepted
- **THEN** the CLI SHALL leave module state unchanged and explain the deterministic mastery boundary
