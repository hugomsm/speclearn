# Spec Delta

## MODIFIED Requirements

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

#### Scenario: Workspace delivery mode bypasses sandbox creation
- **WHEN** the user runs `speclearn start <course>` and the effective session mode is `workspace`
- **THEN** the CLI SHALL track progress directly in the workspace without creating a sandbox branch or directory

### Requirement: Sandbox isolation strategy
The CLI SHALL isolate learning work using a `speclearn/` Git branch or `.speclearn/sandbox/` directory.

#### Scenario: Git branch isolation is available
- **WHEN** the workspace is a Git repository and branch isolation is chosen or available
- **THEN** the CLI SHALL create or reuse a branch for the active course without changing unrelated production branches

#### Scenario: Directory isolation is available
- **WHEN** branch isolation is unavailable or explicitly rejected
- **THEN** the CLI SHALL use `.speclearn/sandbox/` as the isolated training location

#### Scenario: Workspace mode operates in place
- **WHEN** the active course has effective session mode `workspace`
- **THEN** the CLI SHALL leave workspace files in place and SHALL not switch branches or redirect to `.speclearn/sandbox/`
