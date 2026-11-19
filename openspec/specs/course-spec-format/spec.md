# course-spec-format Specification

## Purpose
The course specification format defines the canonical, validated structure for SpecLearn course documents and supports deterministic loading from Markdown or YAML sources.

## Requirements

### Requirement: COURSE-SPEC root data
The system SHALL accept course documents with a required schema version, kebab-case identifier, title, author, tier, level, estimated duration, and locale metadata.

#### Scenario: Valid course metadata is loaded
- **WHEN** a course document provides `schema_version: "1.0"`, a kebab-case `id`, title, author, tier, level, positive `estimated_hours`, and optional locale
- **THEN** the loader SHALL return the complete parsed course data
- **AND** an omitted locale SHALL default to `auto`

#### Scenario: Invalid course metadata is rejected
- **WHEN** a required field is missing or a field is outside its allowed value or format
- **THEN** the loader SHALL reject the document with a field-specific validation error

### Requirement: Harness and context configuration
The system SHALL support optional context sources and SHALL apply default harness behavior when harness rules are omitted.

#### Scenario: Harness defaults are applied
- **WHEN** a course omits `harness_rules`
- **THEN** `socratic_mode` SHALL default to `true`, `allow_full_code_spoiler` SHALL default to `false`, and `scratchpad_enabled` SHALL default to `true`

#### Scenario: Context resources are provided
- **WHEN** a course provides MCP resources, mandatory ADR paths, or a reference repository
- **THEN** the loader SHALL retain those values for downstream course compilation

### Requirement: Module graph integrity
The system SHALL require at least one module and SHALL reject prerequisite references that do not exist or create circular dependencies.

#### Scenario: Valid module graph is accepted
- **WHEN** every prerequisite references an existing module and no module dependency cycle exists
- **THEN** the course SHALL be accepted

#### Scenario: Unknown prerequisite is rejected
- **WHEN** a module names a prerequisite that is not present in the course module list
- **THEN** the loader SHALL return a structural validation error naming the unknown prerequisite

#### Scenario: Circular dependency is rejected
- **WHEN** module prerequisites form a direct or indirect cycle
- **THEN** the loader SHALL reject the course as an invalid directed acyclic graph

### Requirement: Module verification metadata
The system SHALL validate module verification definitions, including a non-empty test command and optional test files and rubric checks.

#### Scenario: Module verification is complete
- **WHEN** a module provides a non-empty `test_command` and validation-compatible verification arrays
- **THEN** the loader SHALL accept the module verification metadata

#### Scenario: Empty test command is rejected
- **WHEN** a module verification test command is empty or contains only whitespace
- **THEN** the loader SHALL reject the module

### Requirement: Dual-format course loading
The system SHALL load Markdown course documents with YAML frontmatter and pure YAML documents through the same Zod validation pipeline.

#### Scenario: Markdown course is loaded
- **WHEN** the input path ends in `.course.md` or `.md` and contains YAML frontmatter
- **THEN** the loader SHALL parse the frontmatter as course metadata and the Markdown body as `pedagogical_guide`

#### Scenario: YAML course is loaded
- **WHEN** the input path ends in `.course.yaml` or `.yml`
- **THEN** the loader SHALL parse the YAML data and validate it using the same course model

### Requirement: Exported course JSON Schema
The system SHALL generate and publish a versioned JSON Schema for COURSE-SPEC.

#### Scenario: IDE opens the JSON Schema
- **WHEN** the course JSON Schema is requested or discovered through the package
- **THEN** it SHALL describe the supported fields, enum values, defaults, and array constraints for IDE autocomplete
