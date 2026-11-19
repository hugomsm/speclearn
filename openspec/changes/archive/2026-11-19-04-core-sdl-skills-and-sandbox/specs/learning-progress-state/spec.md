# Spec Delta

## ADDED Requirements

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