# Spec Delta

## ADDED Requirements

### Requirement: Init command
The CLI SHALL expose `init` as an interactive or explicit non-interactive workspace bootstrap command.

#### Scenario: Init is requested
- **WHEN** the user runs `speclearn init` or `speclearn init --agents <agents> --yes`
- **THEN** the CLI SHALL create or update the SpecLearn workspace and selected adapter integrations

#### Scenario: Init is interrupted
- **WHEN** prompting or workspace writes fail
- **THEN** the CLI SHALL report the failure and SHALL not claim initialization succeeded

### Requirement: Status command
The CLI SHALL expose `status` to read and render local learning progress.

#### Scenario: Status is requested
- **WHEN** the user runs `speclearn status`
- **THEN** the CLI SHALL render the local progress state and return successfully

#### Scenario: Progress state is unavailable or invalid
- **WHEN** the progress file is missing or malformed
- **THEN** the CLI SHALL explain whether initialization is required or state integrity is invalid
