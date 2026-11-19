# Spec Delta

## ADDED Requirements

### Requirement: Verify command
The CLI SHALL expose `verify [module-id]` for deterministic module verification.

#### Scenario: Verify command runs
- **WHEN** the user runs `speclearn verify [module-id]`
- **THEN** the CLI SHALL execute the module test command and integrity checks and SHALL set a non-zero process status on failure

### Requirement: Lock-tests command
The CLI SHALL expose `lock-tests [module-id]` for sealing declared test files.

#### Scenario: Lock-tests command runs
- **WHEN** the user runs `speclearn lock-tests [module-id]`
- **THEN** the CLI SHALL compute and store SHA-256 hashes for the selected module's test files
