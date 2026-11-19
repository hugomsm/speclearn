# Spec Delta

## MODIFIED Requirements

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
