# Spec Delta

## MODIFIED Requirements

### Requirement: Test file locking
SpecLearn SHALL compute and store hashes for a module's declared `verification.test_files` when tests are locked or the module starts, providing tamper-proof test verification.

#### Scenario: Lock tests command is run
- **WHEN** the user runs `speclearn lock-tests [module-id]`
- **THEN** the CLI SHALL hash every declared test file and SHALL store the hashes in progress state

#### Scenario: Test file is missing or empty
- **WHEN** a declared test file is missing or contains no assertion-bearing content
- **THEN** the CLI SHALL reject the lock operation and SHALL store no success hash for that file

### Requirement: Integrity validation before verification
The verifier SHALL compare current test-file hashes with their locked values before accepting test success, ensuring tamper-proof test verification.

#### Scenario: Test file is unchanged
- **WHEN** the file exists, is non-empty, and matches its locked hash
- **THEN** tamper-proof test verification SHALL pass

#### Scenario: Test file is deleted, emptied, or modified
- **WHEN** a declared test file differs from its locked hash or cannot be read
- **THEN** verification SHALL fail before module completion with a plain explanation that the test files appear to have changed

### Requirement: Deterministic verification signature
Successful verification SHALL generate a deterministic signature from course ID, module ID, test command, and exit code 0 before unlocking dependent modules.

#### Scenario: Signature is generated
- **WHEN** subprocess execution and tamper-proof test verification both succeed
- **THEN** the CLI SHALL generate the deterministic signature and SHALL persist completion evidence only from that result

#### Scenario: Progress state is edited directly
- **WHEN** `progress.json` is changed to add `completed` or a signature without a successful verification
- **THEN** the CLI SHALL reject the missing or invalid verification evidence and SHALL not unlock downstream modules

### Requirement: User-facing integrity messaging
CLI messages about test file integrity SHALL describe the user benefit rather than raw cryptographic implementation details.

#### Scenario: Integrity failure is reported
- **WHEN** tamper-proof test verification fails
- **THEN** the CLI SHALL report that the test files appear to have been changed and SHALL not expose SHA-256 hash values in the primary error message

#### Scenario: Hash details are available for diagnostics
- **WHEN** the user runs the CLI in verbose or error-diagnostic context
- **THEN** detailed hash information MAY be shown to assist in debugging
