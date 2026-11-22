# Spec Delta

## MODIFIED Requirements

### Requirement: Progress state model
The system SHALL persist active course, sandbox location, session delivery mode override, module states, test-file hashes, and completion timestamps in `.speclearn/state/progress.json`.

#### Scenario: Progress state is initialized
- **WHEN** a SpecLearn workspace is bootstrapped without an existing progress file
- **THEN** the state manager SHALL create a valid progress structure with no active course or modules

#### Scenario: Course progress is recorded
- **WHEN** a course and module state are available
- **THEN** each module SHALL have one of `locked`, `available`, `in_progress`, `skipped_mastered`, or `completed`, an optional sandbox path or branch, test-file SHA-256 hashes, and an optional completion timestamp

#### Scenario: Session delivery mode override is recorded
- **WHEN** a course is started with an explicit delivery mode override or the student switches modes for their session
- **THEN** progress state SHALL record the effective `mode` in `.speclearn/state/progress.json`
- **AND** the active COURSE-SPEC file SHALL remain unmodified
