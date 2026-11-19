# Tasks

## 1. Verification Command

- [x] 1.1 Implement `src/commands/verify.ts` to resolve the requested or active module, load the COURSE-SPEC, and read `verification.test_command`.
- [x] 1.2 Execute the module test command locally and capture `exitCode`, `stdout`, and `stderr`, then verify process output is available in the CLI result.
- [x] 1.3 Register `speclearn verify [module-id]` and `speclearn lock-tests [module-id]` with Commander and clear non-zero failure statuses.
- [x] 1.4 Add tests for active-module selection, explicit module selection, command success, command failure, and process launch failure.

## 2. Test Integrity and Anti-Tampering

- [x] 2.1 Implement `src/security/integrity.ts` to hash declared test files with SHA-256 and reject missing or empty files.
- [x] 2.2 Implement test locking in progress state and persist `test_file_sha256` entries when a module starts or `lock-tests` runs.
- [x] 2.3 Verify locked test files on every verify run and reject deleted, empty, or modified files before completion.
- [x] 2.4 Generate a deterministic SHA-256 verification signature from course ID, module ID, test command, and exit code 0.
- [x] 2.5 Reject direct progress-state completion attempts that lack matching integrity data and verification signatures.

## 3. Progress and DAG Completion

- [x] 3.1 Extend progress state types with verification signatures and completion evidence fields, and preserve backward-readable legacy state.
- [x] 3.2 Mark modules completed only after subprocess success, integrity validation, and signature generation.
- [x] 3.3 Unlock prerequisite-valid downstream modules only after a valid completion signature exists, and verify skipped-mastered nodes remain distinct from completed nodes.
- [x] 3.4 Update `speclearn status` to show deterministic completion evidence and the updated module DAG after verification.

## 4. `/slx:verify` Socratic Review

- [x] 4.1 Update `/slx:verify` templates for all built-in adapters to run `npx speclearn verify [module-id]`.
- [x] 4.2 When tests fail, instruct the agent to analyze stdout and stderr and ask a guiding Socratic question without editing student code.
- [x] 4.3 When tests pass, instruct the agent to review `git diff` against rubric checks, ask one final conceptual question, and display the progress graph.
- [x] 4.4 Verify all adapter-native outputs contain the completed verification workflow and language-mirroring rule.

## 5. Verification

- [x] 5.1 Run lint, typecheck, build, and test commands on Node.js 24 and verify all complete successfully.
- [x] 5.2 Exercise passing, failing, missing-test, empty-test, and modified-test verification fixtures and verify completion remains blocked where integrity or exit status fails.
- [x] 5.3 Test direct progress.json completion edits and verify they do not unlock downstream modules.
- [x] 5.4 Review the change against proposal scope and all delta specs, and verify no remote verification or LLM-driven completion was introduced.

## Workflow follow-up

- Archive this change after implementation review and validation are complete.
