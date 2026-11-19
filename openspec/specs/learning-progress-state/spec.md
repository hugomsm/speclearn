# learning-progress-state Specification

## Purpose
Local progress state records active learning context and module DAG status while keeping volatile progress and scratchpad data outside source control.

## Requirements

### Requirement: Progress state model
The system SHALL persist active course, sandbox location, module states, test-file hashes, and completion timestamps in `.speclearn/state/progress.json`.

#### Scenario: Progress state is initialized
- **WHEN** a SpecLearn workspace is bootstrapped without an existing progress file
- **THEN** the state manager SHALL create a valid progress structure with no active course or modules

#### Scenario: Course progress is recorded
- **WHEN** a course and module state are available
- **THEN** each module SHALL have one of `locked`, `available`, `in_progress`, `skipped_mastered`, or `completed`, an optional sandbox path or branch, test-file SHA-256 hashes, and an optional completion timestamp

### Requirement: State read and write integrity
The state manager SHALL validate state reads and writes and SHALL avoid overwriting unrelated user or course data.

#### Scenario: State file is malformed
- **WHEN** `progress.json` cannot be parsed or violates the state schema
- **THEN** the state manager SHALL report a clear integrity error and SHALL not silently replace the file

#### Scenario: State is updated
- **WHEN** a valid state change is requested
- **THEN** the state manager SHALL serialize the complete state atomically and SHALL preserve fields not changed by the operation

### Requirement: Status display
The `speclearn status` command SHALL render a visual progress bar and a DAG-oriented module tree.

#### Scenario: Active course has module progress
- **WHEN** the user runs `speclearn status`
- **THEN** the CLI SHALL display the active course, a progress percentage or completed-module bar, and each module in dependency-aware terminal output

#### Scenario: No active course exists
- **WHEN** progress state contains no active course
- **THEN** the CLI SHALL report that initialization or course activation is required instead of showing an empty course as active

### Requirement: Sandbox and mastery state transitions

Progress state SHALL record sandbox activation and accepted mastery skips without allowing testless completion.

#### Scenario: Sandbox is activated

- **WHEN** `speclearn start <course>` creates or selects an isolated workspace
- **THEN** progress state SHALL store the active course, sandbox branch or path, and prerequisite-valid module states

#### Scenario: Module is skipped as mastered

- **WHEN** `speclearn skip <module>` is accepted
- **THEN** progress state SHALL set that module to `skipped_mastered` and SHALL unlock eligible downstream modules

#### Scenario: Module remains incomplete

- **WHEN** no successful deterministic verification exists
- **THEN** the module SHALL remain non-completed even if skip status is used
