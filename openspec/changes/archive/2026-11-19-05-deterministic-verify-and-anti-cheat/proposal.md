# Proposal

## Why

SpecLearn needs a trustworthy verification boundary before students can complete modules or unlock dependent nodes. Storing course state alone does not prove that tests ran successfully or that test assertions remained intact, so the CLI must own test execution, integrity checks, and deterministic completion evidence.

## What Changes

- Add `speclearn verify [module-id]` to execute the active or selected module's declared test command locally and capture exit code, stdout, and stderr.
- Add `speclearn lock-tests [module-id]` to compute and store SHA-256 hashes for the module's declared test files when a module starts or when tests are intentionally locked.
- Add test integrity validation that rejects missing, deleted, empty, or modified test files before a successful verification can complete a module.
- Generate a deterministic verification signature from course ID, module ID, test command, and successful exit code before unlocking dependent DAG nodes.
- Prevent direct edits to `progress.json` from completing modules or producing a valid verification signature.
- Integrate `/slx:verify` with Socratic failure guidance, passing-state rubric review, one final conceptual question, and progress graph rendering.

## Capabilities

### New Capabilities
- `deterministic-module-verification`: Defines local test subprocess execution, captured output, test integrity checks, and deterministic completion evidence.
- `anti-tampering-verification`: Defines test locking, SHA-256 integrity validation, verification signatures, and prevention of progress-file-only completion.

### Modified Capabilities
- `cli-entrypoint`: Adds `verify [module-id]` and `lock-tests [module-id]` commands.
- `learning-progress-state`: Verification completion and downstream unlocking depend on deterministic verification signatures and integrity state rather than manual state edits.
- `sdl-pedagogy-skills`: `/slx:verify` gains failure guidance, rubric review, final Socratic consolidation, and progress graph behavior.

## Impact

- Adds `src/commands/verify.ts` and `src/security/integrity.ts`.
- Extends progress state with locked test hashes and deterministic verification signatures.
- Uses Node.js local subprocess execution and SHA-256 hashing.
- Updates `speclearn` command registration and `/slx:verify` prompt content.
- Does not add cloud verification, remote grading, or LLM-driven completion decisions.
