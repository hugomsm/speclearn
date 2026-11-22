# Spec Delta

## MODIFIED Requirements

### Requirement: Start course command

The CLI SHALL provide `speclearn start <course>` with optional `--sandbox` or `--workspace` flags to activate course progress, establish the effective delivery mode, and initialize a safe sandbox when operating in sandbox mode.

#### Scenario: Course starts safely

- **WHEN** the user starts a valid course
- **THEN** the CLI SHALL validate the course, inspect Git status, initialize progress, and record the sandbox location or branch

#### Scenario: Course cannot start safely

- **WHEN** Git has unrelated changes and no safe isolation choice is accepted
- **THEN** the CLI SHALL not modify the production workspace or active progress

#### Scenario: Delivery mode override is provided

- **WHEN** the user runs `speclearn start <course> --workspace` or `speclearn start <course> --sandbox`
- **THEN** the CLI SHALL record the specified delivery mode in progress state as the session override
- **AND** SHALL not mutate the source COURSE-SPEC file

### Requirement: Verify command

The CLI SHALL expose `verify [module-id]` for deterministic module verification.

#### Scenario: Verify command runs

- **WHEN** the user runs `speclearn verify [module-id]`
- **THEN** the CLI SHALL execute the module test command and integrity checks and SHALL set a non-zero process status on failure

#### Scenario: Regression command runs on feature test success

- **WHEN** the module declares a `regression_command` and feature tests pass
- **THEN** the CLI SHALL run the regression command and require exit code 0 before marking the module completed
