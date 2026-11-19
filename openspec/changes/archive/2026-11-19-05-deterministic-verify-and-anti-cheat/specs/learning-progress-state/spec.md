# Spec Delta

## ADDED Requirements

### Requirement: Verification evidence in progress state
Progress state SHALL store locked test hashes and a deterministic verification signature alongside successful module completion.

#### Scenario: Verification evidence is persisted
- **WHEN** a module passes test execution and integrity validation
- **THEN** progress state SHALL store test hashes, verification signature, completion timestamp, and completed module status

#### Scenario: Verification evidence is missing or invalid
- **WHEN** completion is requested without a matching deterministic signature
- **THEN** progress state SHALL remain incomplete and eligible downstream modules SHALL remain locked
