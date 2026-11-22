# Spec Delta

## MODIFIED Requirements

### Requirement: Propose skill workflow
The `/slx:propose` skill SHALL inspect the repository, ask no more than three calibration questions, generate a COURSE-SPEC in the selected format, and validate the exact output file.

#### Scenario: Repository author proposes a course
- **WHEN** the agent receives `/slx:propose`
- **THEN** it SHALL inspect the repository stack, structure, and configured MCP resources
- **AND** SHALL ask no more than three concise questions for missing target level, learning outcome, delivery mode (`sandbox` vs `workspace` if not specified via flag or prompt), or Markdown versus YAML preference
- **AND** SHALL not invent repository resources, test files, or verification commands

#### Scenario: Course spec is generated
- **WHEN** repository context and calibration answers are available
- **THEN** the agent SHALL generate `.speclearn/specs/<id>.course.md` or `.speclearn/specs/<id>.course.yaml`, using a kebab-case course ID as the filename
- **AND** SHALL separate universal concepts from architecture-specific context
- **AND** SHALL include all required COURSE-SPEC metadata, at least one valid module, and a non-empty tutor guidance section for Markdown courses

#### Scenario: Generated spec is validated
- **WHEN** the course file has been generated
- **THEN** the skill SHALL run `npx speclearn validate <path>` or its equivalent package invocation
- **AND** SHALL fix reported issues and rerun validation before declaring the proposal ready
- **AND** SHALL report validation failures or an unavailable validator instead of claiming success

#### Scenario: Existing course path is selected
- **WHEN** the generated course ID maps to an existing output file
- **THEN** the skill SHALL ask whether to update that course or choose another ID before writing

#### Scenario: Workspace delivery mode is proposed via flag or intent
- **WHEN** `/slx:propose` receives `--workspace` or detects feature-delivery intent from prompt context or existing architecture decisions
- **THEN** the skill SHALL generate a `mode: workspace` COURSE-SPEC mapping module work directly to real repository `target_files`

### Requirement: Start skill Socratic loop
The `/slx:start` skill SHALL guide learning through measurement, planning, and scaffolded teaching stages.

#### Scenario: Diagnostic measurement begins
- **WHEN** the student starts a module
- **THEN** the skill SHALL present a three-minute diagnostic challenge
- **AND** SHALL recommend `npx speclearn skip <module>` only when mastery is demonstrated

#### Scenario: Tailored path is planned
- **WHEN** a module is measured
- **THEN** the skill SHALL display the remaining prerequisite-aware learning path

#### Scenario: Teaching begins
- **WHEN** the student is ready to learn
- **THEN** the skill SHALL connect universal concepts to architecture context
- **AND** SHALL use MCP or repository documentation only when configured

#### Scenario: Exercise is scaffolded
- **WHEN** the skill prepares a lab exercise
- **THEN** it SHALL insert `# TODO(speclearn)` markers and failing tests instead of full solution code
- **AND** SHALL withhold complete solution code until the verification checkpoint is reached

#### Scenario: Delivery mode announcement and session override
- **WHEN** the student starts a module in `/slx:start`
- **THEN** the skill SHALL announce the course's configured delivery mode (`sandbox` or `workspace`) before scaffolding
- **AND** SHALL offer the student a quick confirmation or option to switch modes for their session
- **AND** SHALL persist any session mode override in local progress state without modifying the COURSE-SPEC file

#### Scenario: Workspace mode guides edits in target files
- **WHEN** a student begins a module in a `mode: workspace` course or active workspace session
- **THEN** the skill SHALL guide edits directly within declared `target_files` without full implementation spoilers and SHALL keep git diffs PR-ready

### Requirement: Explain skill workflow
The `/slx:explain [concept]` skill SHALL pause the project lab and teach a concept in an isolated scratchpad before returning.

#### Scenario: Scratchpad example is requested
- **WHEN** the student invokes `/slx:explain` with a concept
- **THEN** the skill SHALL create a minimal runnable example under `.speclearn/scratchpad/`
- **AND** SHALL keep the main lab unchanged
- **AND** SHALL never write temporary or scratchpad files inside production folders or target files

#### Scenario: Scratchpad concept is understood
- **WHEN** the isolated example is understood
- **THEN** the skill SHALL summarize the concept and return smoothly to the main lab context

### Requirement: Verify skill boundary
The `/slx:verify` skill SHALL invoke deterministic verification and SHALL provide Socratic feedback based on process results.

#### Scenario: Verification succeeds
- **WHEN** `npx speclearn verify [module-id]` exits successfully and tamper-proof test verification passes
- **THEN** the agent SHALL review the git diff against the module's rubric checks
- **AND** SHALL ask one final conceptual consolidation question
- **AND** SHALL display the updated learning path

#### Scenario: Verification is inconclusive
- **WHEN** tests fail or tamper-proof test verification cannot be confirmed
- **THEN** the skill SHALL not mark the module completed

#### Scenario: Verification fails
- **WHEN** `npx speclearn verify [module-id]` exits with a non-zero status
- **THEN** the agent SHALL analyze stdout and stderr and SHALL ask a guiding Socratic question
- **AND** SHALL not edit the student's code or mark the module completed

#### Scenario: Integrity verification fails
- **WHEN** a test file is deleted, empty, or differs from its locked hash
- **THEN** the agent SHALL explain that the test files appear to have been changed and SHALL request restoration or re-locking through explicit project-authorized action

#### Scenario: Regression command execution in workspace mode
- **WHEN** a module defines `regression_command` and targeted feature tests pass with tamper-proof verification
- **THEN** verification SHALL run the regression command before marking the module completed
- **AND** SHALL report regression failure without advancing the learning path if the regression command fails
