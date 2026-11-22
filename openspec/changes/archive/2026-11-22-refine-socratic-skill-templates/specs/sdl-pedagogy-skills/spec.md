# Spec Delta

## MODIFIED Requirements

### Requirement: Start skill Socratic loop
The `/slx:start` skill SHALL guide learning through measurement, planning, scaffolded teaching stages, and disciplined Socratic pacing.

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

#### Scenario: Socratic pacing and turn-taking
- **WHEN** the agent guides a learner through a module
- **THEN** it SHALL ask only one focused question at a time and SHALL wait for the learner's response before providing additional hints or scaffolding

#### Scenario: Gradual hint escalation
- **WHEN** the learner asks for assistance or appears stuck
- **THEN** the agent SHALL escalate hints gradually in small tiers (conceptual question → architectural pointer → partial scaffold) rather than revealing complete code

#### Scenario: Direct code generation request refused
- **WHEN** the learner requests full solution code or asks the agent to implement the module
- **THEN** the agent SHALL refuse the direct solution request and SHALL redirect the learner to active TODO markers, business rules and edge cases, or test diagnostics

### Requirement: Explain skill workflow
The `/slx:explain [concept]` skill SHALL pause the project lab and teach a concept in an isolated scratchpad before returning.

#### Scenario: Scratchpad example is requested
- **WHEN** the student invokes `/slx:explain` with a concept
- **THEN** the skill SHALL create a minimal runnable example under `.speclearn/scratchpad/`
- **AND** SHALL keep the main lab unchanged
- **AND** SHALL never write temporary or scratchpad files inside production folders or target files

#### Scenario: Micro-example Socratic iteration
- **WHEN** explaining a concept
- **THEN** the skill SHALL demonstrate the idea using short, interactive micro-examples instead of long lecture text
- **AND** SHALL pose a check-for-understanding question before concluding the explanation

#### Scenario: Scratchpad concept is understood
- **WHEN** the isolated example is understood and the understanding check is confirmed
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
- **THEN** the agent SHALL analyze stdout and stderr and SHALL ask exactly one guiding diagnostic Socratic question
- **AND** SHALL strictly refuse to patch the student's code or mark the module completed

#### Scenario: Integrity verification fails
- **WHEN** a test file is deleted, empty, or differs from its locked hash
- **THEN** the agent SHALL explain that the test files appear to have been changed and SHALL request restoration or re-locking through explicit project-authorized action

#### Scenario: Regression command execution in workspace mode
- **WHEN** a module defines `regression_command` and targeted feature tests pass with tamper-proof verification
- **THEN** verification SHALL run the regression command before marking the module completed
- **AND** SHALL report regression failure without advancing the learning path if the regression command fails
