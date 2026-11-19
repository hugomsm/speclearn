# deterministic-module-verification Specification

## Purpose
Deterministic module verification executes the course-declared test command locally and exposes structured process results for the CLI and `/slx:verify` workflow.

## Requirements

### Requirement: Active module verification selection
The verification command SHALL resolve the requested module ID or fall back to the active module in progress state.

#### Scenario: Module ID is supplied
- **WHEN** the user runs `speclearn verify <module-id>`
- **THEN** the CLI SHALL verify that the module belongs to the active COURSE-SPEC and SHALL execute that module's declared test command

#### Scenario: Module ID is omitted
- **WHEN** the user runs `speclearn verify` without a module ID
- **THEN** the CLI SHALL resolve and verify the current active module

### Requirement: Deterministic subprocess execution
The verifier SHALL execute the module's `verification.test_command` locally and return its exit code, standard output, and standard error.

#### Scenario: Test command starts
- **WHEN** verification starts for a valid module
- **THEN** the CLI SHALL run the declared command in the project working directory and SHALL capture process exit code, stdout, and stderr

#### Scenario: Test command cannot start
- **WHEN** the test command is missing or the process cannot be launched
- **THEN** the CLI SHALL report a verification failure with diagnostic output and SHALL not mark the module completed

### Requirement: Verification result reporting
The CLI SHALL report test success or failure in a stable, terminal-readable format.

#### Scenario: Tests pass
- **WHEN** test execution returns exit code 0 and integrity validation passes
- **THEN** the CLI SHALL mark the module completed and SHALL display the updated progress graph

#### Scenario: Tests fail
- **WHEN** test execution returns an exit code other than 0
- **THEN** the CLI SHALL report stdout and stderr, SHALL preserve module completion state, and SHALL ask no completion claim
