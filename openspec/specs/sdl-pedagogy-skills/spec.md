# sdl-pedagogy-skills Specification

## Purpose
The core SDL skills define consistent multilingual, Socratic, course-authoring, and skill behavior across all supported coding-agent harnesses.

## Requirements

### Requirement: Universal language mirroring
Every core skill template SHALL instruct the agent to conduct mentoring in the language used by the student or active COURSE-SPEC while keeping framework internals and schema keys in English.

#### Scenario: Student prompt uses Portuguese
- **WHEN** the student prompt or active course content establishes Portuguese as the learning language
- **THEN** the agent SHALL use Portuguese for explanations, questions, feedback, and code reviews
- **AND** SHALL keep framework identifiers and schema keys English

#### Scenario: Course language differs from interface language
- **WHEN** the active COURSE-SPEC specifies a locale or uses non-English pedagogical content
- **THEN** the agent SHALL mirror that active course language unless the student explicitly selects another language

### Requirement: Propose skill workflow
The `/slx:propose` skill SHALL inspect the repository, ask no more than three calibration questions, generate a valid course spec, and validate it.

#### Scenario: Repository author proposes a course
- **WHEN** the agent receives `/slx:propose`
- **THEN** it SHALL inspect the repository stack, structure, and configured MCP resources
- **AND** SHALL ask at most one short question for target seniority, learning goal, and Markdown versus YAML preference

#### Scenario: Course spec is generated
- **WHEN** repository context and calibration answers are available
- **THEN** the agent SHALL generate `.speclearn/specs/.course.md` or the selected YAML equivalent
- **AND** SHALL separate universal concepts from architecture-specific context

#### Scenario: Generated spec is validated
- **WHEN** the course file has been generated
- **THEN** the skill SHALL run `npx speclearn validate <path>` or its equivalent package invocation
- **AND** SHALL report validation failures before declaring the proposal ready

### Requirement: Start skill Socratic loop
The `/slx:start` skill SHALL guide learning through measurement, planning, and scaffolded teaching stages.

#### Scenario: Diagnostic measurement begins
- **WHEN** the student starts a module
- **THEN** the skill SHALL present a three-minute diagnostic challenge
- **AND** SHALL recommend `npx speclearn skip <module>` only when mastery is demonstrated

#### Scenario: Tailored path is planned
- **WHEN** a module is measured
- **THEN** the skill SHALL display the remaining prerequisite-aware module path

#### Scenario: Teaching begins
- **WHEN** the student is ready to learn
- **THEN** the skill SHALL connect universal concepts to architecture context
- **AND** SHALL use MCP or repository documentation only when configured

#### Scenario: Exercise is scaffolded
- **WHEN** the skill prepares a lab exercise
- **THEN** it SHALL insert `# TODO(speclearn)` markers and failing tests instead of full solution code
- **AND** SHALL withhold complete solution code until the verification boundary is reached

### Requirement: Explain skill workflow
The `/slx:explain [concept]` skill SHALL pause the project lab and teach a concept in an isolated scratchpad before returning.

#### Scenario: Scratchpad example is requested
- **WHEN** the student invokes `/slx:explain` with a concept
- **THEN** the skill SHALL create a minimal runnable example under `.speclearn/scratchpad/`
- **AND** SHALL keep the main lab unchanged

#### Scenario: Scratchpad concept is understood
- **WHEN** the isolated example is understood
- **THEN** the skill SHALL summarize the concept and return smoothly to the main lab context

### Requirement: Verify skill boundary
The `/slx:verify` skill SHALL invoke deterministic verification and SHALL provide Socratic feedback based on process results.

#### Scenario: Verification succeeds
- **WHEN** `npx speclearn verify [module-id]` exits successfully and test-file integrity passes
- **THEN** the agent SHALL review the git diff against the module's rubric checks
- **AND** SHALL ask one final conceptual consolidation question
- **AND** SHALL display the updated progress graph

#### Scenario: Verification is inconclusive
- **WHEN** tests fail or test-file integrity cannot be verified
- **THEN** the skill SHALL not mark the module completed

#### Scenario: Verification fails
- **WHEN** `npx speclearn verify [module-id]` exits with a non-zero status
- **THEN** the agent SHALL analyze stdout and stderr and SHALL ask a guiding Socratic question
- **AND** SHALL not edit the student's code or mark the module completed

#### Scenario: Integrity verification fails
- **WHEN** a test file is deleted, empty, or differs from its locked SHA-256 hash
- **THEN** the agent SHALL explain the integrity failure and SHALL request restoration or re-locking through explicit project-authorized action
