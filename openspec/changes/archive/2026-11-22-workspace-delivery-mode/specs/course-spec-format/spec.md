# Spec Delta

## MODIFIED Requirements

### Requirement: COURSE-SPEC root data
The system SHALL accept course documents with a required schema version, kebab-case identifier, title, author, tier, level, estimated duration, locale metadata, and delivery mode.

#### Scenario: Valid course metadata is loaded
- **WHEN** a course document provides `schema_version: "1.0"`, a kebab-case `id`, title, author, tier, level, positive `estimated_hours`, and optional locale
- **THEN** the loader SHALL return the complete parsed course data
- **AND** an omitted locale SHALL default to `auto`

#### Scenario: Invalid course metadata is rejected
- **WHEN** a required field is missing or a field is outside its allowed value or format
- **THEN** the loader SHALL reject the document with a field-specific validation error

#### Scenario: Course delivery mode is loaded
- **WHEN** a course document specifies `mode: "workspace"` or `mode: "sandbox"`
- **THEN** the loader SHALL return the parsed course data with the specified delivery mode

#### Scenario: Omitted course delivery mode defaults to sandbox
- **WHEN** a course document omits the `mode` field
- **THEN** the loader SHALL default `mode` to `sandbox`

### Requirement: Module verification metadata
The system SHALL validate module verification definitions, including a non-empty test command, optional regression command, and optional test files and rubric checks.

#### Scenario: Module verification is complete
- **WHEN** a module provides a non-empty `test_command` and validation-compatible verification arrays
- **THEN** the loader SHALL accept the module verification metadata

#### Scenario: Empty test command is rejected
- **WHEN** a module verification test command is empty or contains only whitespace
- **THEN** the loader SHALL reject the module

#### Scenario: Regression command is loaded
- **WHEN** a module provides an optional non-empty `regression_command`
- **THEN** the loader SHALL accept and retain the regression command in verification metadata

## ADDED Requirements

### Requirement: Module target files
The system SHALL accept optional target file paths on modules to map learning directly to real repository files.

#### Scenario: Module target files are specified
- **WHEN** a module provides an optional array of non-empty `target_files`
- **THEN** the loader SHALL accept and retain `target_files` in the module structure
