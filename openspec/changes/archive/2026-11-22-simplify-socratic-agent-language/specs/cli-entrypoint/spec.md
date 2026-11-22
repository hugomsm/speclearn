# Spec Delta

## ADDED Requirements

### Requirement: CLI command descriptions
Every CLI subcommand SHALL provide a clear, concise description that uses plain, benefit-first language accessible to junior-to-mid developers.

#### Scenario: Command descriptions are displayed
- **WHEN** the user runs `speclearn --help` or `speclearn <command> --help`
- **THEN** every command description SHALL use plain language that describes what the command does for the user, avoiding unnecessary academic or infrastructure-heavy jargon

#### Scenario: Spinner and progress messages
- **WHEN** the CLI runs an operation with a spinner or progress indicator
- **THEN** status messages SHALL be written in plain, conversational language (e.g., "Setting up skills and guardrails..." rather than "Bootstrapping agent skills and guardrails...")

## MODIFIED Requirements

### Requirement: Lock-tests command
The CLI SHALL expose `lock-tests [module-id]` for recording a snapshot of declared test files to provide tamper-proof verification.

#### Scenario: Lock-tests command runs
- **WHEN** the user runs `speclearn lock-tests [module-id]`
- **THEN** the CLI SHALL compute and store hashes for the selected module's test files to snapshot them for verification

#### Scenario: Lock-tests help text
- **WHEN** the user runs `speclearn lock-tests --help`
- **THEN** the description SHALL communicate that the command records a snapshot of test files to detect tampering during verification, without exposing SHA-256 as the primary framing
