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

The CLI SHALL provide `speclearn start <course>` to activate course progress and initialize a safe sandbox.

#### Scenario: Course starts safely

- **WHEN** the user starts a valid course
- **THEN** the CLI SHALL validate the course, inspect Git status, initialize progress, and record the sandbox location or branch

#### Scenario: Course cannot start safely

- **WHEN** Git has unrelated changes and no safe isolation choice is accepted
- **THEN** the CLI SHALL not modify the production workspace or active progress

### Requirement: Skip mastered module command

The CLI SHALL provide `speclearn skip <module>` to mark demonstrated mastery and unlock downstream nodes.

#### Scenario: Mastery skip is accepted

- **WHEN** the student has demonstrated mastery accepted by the `/slx:start` diagnostic boundary
- **THEN** the CLI SHALL mark the module `skipped_mastered` and update prerequisite-aware availability

#### Scenario: Mastery evidence is absent

- **WHEN** no mastery evidence is supplied
- **THEN** the CLI SHALL leave module state unchanged and report the requirement
