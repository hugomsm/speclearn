# Spec Delta

## ADDED Requirements

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
