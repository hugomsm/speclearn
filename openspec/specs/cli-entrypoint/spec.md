# cli-entrypoint Specification

## Purpose

The CLI entrypoint establishes a reliable executable interface for SpecLearn on supported Node.js runtimes and provides discoverable basic help information.

## Requirements

### Requirement: ESM executable package

The package SHALL expose an executable named `speclearn` that resolves to `dist/cli.js` and SHALL support Node.js 24 or newer.

#### Scenario: Installed executable starts

- **WHEN** a caller invokes `speclearn` after package installation
- **THEN** Node.js SHALL execute the built ESM entrypoint
- **AND** the entrypoint SHALL have a valid Node.js shebang

### Requirement: CLI identity and help

The CLI SHALL display the SpecLearn ASCII banner and package version, and SHALL provide Commander-based help output.

#### Scenario: User requests help

- **WHEN** the user invokes `speclearn --help`
- **THEN** the CLI SHALL print available command information and usage without executing unrelated application behavior

#### Scenario: User starts the CLI

- **WHEN** the user invokes `speclearn` without arguments
- **THEN** the CLI SHALL present the banner and an actionable help-oriented status

### Requirement: CLI smoke coverage

The foundation SHALL include an automated smoke test for the CLI entrypoint.

#### Scenario: Smoke test runs

- **WHEN** the test suite executes
- **THEN** the CLI smoke test SHALL validate that the entrypoint can be loaded or invoked and SHALL verify a stable basic output contract

### Requirement: Course validation command

The CLI SHALL provide a `validate` command that loads and validates a COURSE-SPEC file and reports readable success or failure information.

#### Scenario: Valid course is validated

- **WHEN** the user runs `speclearn validate <path>` for a valid `.course.md`, `.md`, `.course.yaml`, or `.yml` course
- **THEN** the CLI SHALL report successful validation and exit with a successful status

#### Scenario: Invalid course is rejected

- **WHEN** the course file is missing, unreadable, has malformed frontmatter or YAML, or fails COURSE-SPEC validation
- **THEN** the CLI SHALL format the relevant path and error details for terminal users and exit with a non-zero status

#### Scenario: Cyclic course graph is rejected

- **WHEN** the course modules contain a prerequisite cycle
- **THEN** the validation command SHALL identify the DAG integrity failure instead of reporting only a generic parse error

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

### Requirement: Skip mastered module command

The CLI SHALL provide `speclearn skip <module>` to mark demonstrated mastery and unlock downstream nodes.

#### Scenario: Mastery skip is accepted

- **WHEN** the student has demonstrated mastery accepted by the `/slx:start` diagnostic boundary
- **THEN** the CLI SHALL mark the module `skipped_mastered` and update prerequisite-aware availability

#### Scenario: Mastery evidence is absent

- **WHEN** no mastery evidence is supplied
- **THEN** the CLI SHALL leave module state unchanged and report the requirement

### Requirement: Verify command

The CLI SHALL expose `verify [module-id]` for deterministic module verification.

#### Scenario: Verify command runs

- **WHEN** the user runs `speclearn verify [module-id]`
- **THEN** the CLI SHALL execute the module test command and integrity checks and SHALL set a non-zero process status on failure

#### Scenario: Regression command runs on feature test success

- **WHEN** the module declares a `regression_command` and feature tests pass
- **THEN** the CLI SHALL run the regression command and require exit code 0 before marking the module completed

### Requirement: Lock-tests command

The CLI SHALL expose `lock-tests [module-id]` for recording a snapshot of declared test files to provide tamper-proof verification.

#### Scenario: Lock-tests command runs

- **WHEN** the user runs `speclearn lock-tests [module-id]`
- **THEN** the CLI SHALL compute and store hashes for the selected module's test files to snapshot them for verification

#### Scenario: Lock-tests help text

- **WHEN** the user runs `speclearn lock-tests --help`
- **THEN** the description SHALL communicate that the command records a snapshot of test files to detect tampering during verification, without exposing SHA-256 as the primary framing

### Requirement: CLI command descriptions

Every CLI subcommand SHALL provide a clear, concise description that uses plain, benefit-first language accessible to junior-to-mid developers.

#### Scenario: Command descriptions are displayed

- **WHEN** the user runs `speclearn --help` or `speclearn <command> --help`
- **THEN** every command description SHALL use plain language that describes what the command does for the user, avoiding unnecessary academic or infrastructure-heavy jargon

#### Scenario: Spinner and progress messages

- **WHEN** the CLI runs an operation with a spinner or progress indicator
- **THEN** status messages SHALL be written in plain, conversational language (e.g., "Setting up skills and guardrails..." rather than "Bootstrapping agent skills and guardrails...")
