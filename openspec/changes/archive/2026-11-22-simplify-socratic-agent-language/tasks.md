# Tasks

## 1. Socratic Prompt Templates (`src/adapters/templates.ts`)

- [x] 1.1 In `SLX_COMMAND_TEMPLATES.propose`: replace `harness_rules` prose reference to "pedagogical harness" with "Socratic mentor rules"; replace "invariants or edge cases" with "business rules and edge cases"; replace "pedagogical guide" with "tutor guidance"; verify the template string no longer contains the old terms.
- [x] 1.2 In `SLX_COMMAND_TEMPLATES.start`: replace "Show the prerequisite-aware module path" with "Show the prerequisite-aware learning path"; replace "Only deterministic test success with test-file integrity may mark a module completed" with "Only a passing verification run with tamper-proof test checks may mark a module completed"; verify the updated string.
- [x] 1.3 In `SLX_COMMAND_TEMPLATES.verify`: replace "Display the updated progress graph" with "Show the updated learning path"; replace "all test-file SHA-256 hashes match" with "tamper-proof test verification passes"; replace "you are at the deterministic verification boundary" with "you are at the verification checkpoint"; verify the full template renders without old terms.
- [x] 1.4 In `SLX_COMMAND_TEMPLATES.explain`: audit for academic phrasing; confirm "Socratic loop" is retained as it's a named, meaningful term; verify no new jargon was introduced.
- [x] 1.5 In `guardedContent()`: replace "Only deterministic verification may mark modules completed" with "Only a passing verification run may mark modules completed"; verify `managedSection()` output.

## 2. Agent Adapter Descriptions (`src/adapters/builtins.ts`)

- [x] 2.1 In `genericAdapter`: update `slx-propose` description from "Propose a new SpecLearn course based on repository architecture and ADRs" to "Propose a new SpecLearn course grounded in your repository's real stack and ADRs"; update `slx-start` description from "Activate an isolated SpecLearn course module environment" to "Start a course module in an isolated learning environment"; update `slx-verify` description from "Run deterministic verification for the active course module" to "Check your work: run tests and record module completion"; verify descriptions appear in generated AGENTS.md on `speclearn init`.

## 3. CLI Command Strings (`src/cli.ts`)

- [x] 3.1 Update `init` spinner start message from `"Bootstrapping agent skills and guardrails..."` to `"Setting up skills and guardrails..."`; update spinner stop message from `"Bootstrapped ${agentIds.join(', ')} skills and guardrails"` to `"Set up ${agentIds.join(', ')} skills and guardrails"`; verify message appears on `speclearn init --yes`.
- [x] 3.2 Update `lock-tests` command description from `"Lock SHA-256 hashes for a module's test files"` to `"Snapshot test files so tampering is caught during verification"`; verify `speclearn lock-tests --help` displays the new description.
- [x] 3.3 Update `verify` command description from `"Run deterministic verification for a course module"` to `"Run your tests and record module completion if they pass"`; verify `speclearn verify --help` displays the new description.
- [x] 3.4 Update `status` command description from `"Display local SpecLearn learning progress"` to `"Show your current learning progress"`; verify `speclearn status --help` displays the new description.

## 4. Progress State Display (`src/state/progress.ts`)

- [x] 4.1 Update the `renderDagStatus` no-active-course message from `"No active course. Run speclearn init and activate a course."` to `"No course is active. Run speclearn init and start a course."`; verify output via `speclearn status` with no course.
- [x] 4.2 Update the status command's `No progress state found` warning message from `"No progress state found. Run speclearn init first."` to `"No learning progress found. Run speclearn init first."`; verify the warning appears correctly.

## 5. Verify Command Error Messages (`src/commands/verify.ts`)

- [x] 5.1 Update the `verifyTestFiles` error message `"Test files are not locked. Run speclearn lock-tests before verification."` to `"Test files haven't been snapshotted yet. Run speclearn lock-tests before verifying."`; verify the message is returned in `integrityErrors` on first verify without locking.
- [x] 5.2 Update the `verifyTestFiles` per-file error from `"Test file integrity mismatch: ${key}"` to `"Test file has changed since it was snapshotted: ${key}"`; verify this string appears in the error list when a test file is modified after locking.
- [x] 5.3 Update `cli.ts` verify handler: change the user-facing integrity failure heading from `"Test integrity verification failed"` to `"Test files have changed — verification stopped"`; verify the message appears on a failed integrity check.

## 6. Example Courses

- [x] 6.1 In `examples/typescript-clean-architecture.course.md` rubric checks: replace `"Entity maintains internal consistency invariants"` with `"Entity enforces its own business rules without relying on external validation"`; replace the pedagogical guide sentence "challenge the learner to identify invariants before writing constructors" with "challenge the learner to identify the business rules and edge cases before writing constructors"; verify `npx speclearn validate examples/typescript-clean-architecture.course.md` exits 0.
- [x] 6.2 Audit the guide section for "pedagogical" standalone usage; replace `"# Pedagogical Guide: ..."` heading with `"# Tutor Guide: ..."`; verify file remains valid after the change.

## 7. README and Documentation

- [x] 7.1 In `README.md`: replace `"executable pedagogical curriculums"` with `"executable learning curriculums"`; replace `"strict pedagogical harness"` with `"Socratic mentor rules"`; replace `"as an approving rubber stamp"` aside stays — it's plain language already; replace `"progress graph"` wherever it appears with `"learning path"`; verify the file has no remaining instances of `pedagogical harness` or `progress graph`.
- [x] 7.2 In `README.md` AI Engineering Paradox callout: replace `"engineers become passive code reviewers who lose intuition for system invariants, edge-case resilience"` with `"engineers become passive code reviewers who lose intuition for business rules, edge cases"`; verify the sentence reads naturally.
- [x] 7.3 In `README.md` What is a Socratic Agent table: replace `"Asks what invariants or edge cases the developer has considered"` with `"Asks what business rules and edge cases the developer has considered"`; verify table renders correctly.
- [x] 7.4 In `README.md` CLI reference table: update `speclearn verify` description from `"Execute deterministic tests and record completion with SHA-256 integrity"` to `"Run your tests and record completion with tamper-proof verification"`; update `speclearn lock-tests` row (if present) similarly; verify the table is complete.
- [x] 7.5 In `README.md` mermaid diagram: replace `"Passes (Exit Code 0 + SHA-256 Valid)"` edge label with `"Passes (Exit Code 0 + Tests Verified)"`; verify the mermaid block renders without syntax errors.
- [x] 7.6 Audit `README.md` for remaining DAG references in prose (not code); replace `"DAG"` in display text with `"learning path tree"` or `"module tree"`; verify the sentence reads naturally.

## 8. OpenSpec Main Specs (apply delta requirements)

- [x] 8.1 Sync `openspec/specs/sdl-pedagogy-skills/spec.md` with the delta: apply MODIFIED requirements updating `progress graph` → `learning path`, `pedagogical harness` → `Socratic mentor rules`, `invariants` → `business rules and edge cases`, `deterministic verification boundary` → `verification checkpoint`; run `openspec validate --all` and confirm no errors.
- [x] 8.2 Sync `openspec/specs/agent-adapter-system/spec.md` with the delta: apply MODIFIED and new ADDED "Consistent mentor tone" requirement; run `openspec validate --all`.
- [x] 8.3 Sync `openspec/specs/anti-tampering-verification/spec.md` with the delta: apply MODIFIED requirements updating SHA-256 framing to tamper-proof test verification; run `openspec validate --all`.
- [x] 8.4 Sync `openspec/specs/deterministic-module-verification/spec.md` with the delta: update `progress graph` → `learning path` in result-reporting requirement; run `openspec validate --all`.
- [x] 8.5 Sync `openspec/specs/cli-entrypoint/spec.md` with the delta: add new CLI description tone and lock-tests description requirements; run `openspec validate --all`.

## 9. Test Assertions

- [x] 9.1 In `tests/cli.test.ts`: search for assertions on old CLI description strings (`"Lock SHA-256 hashes"`, `"Run deterministic verification"`, `"Display local SpecLearn"`, `"Bootstrapping"`); update each to match the new strings from tasks 3.1–3.4; run `pnpm test tests/cli.test.ts` and confirm it passes.
- [x] 9.2 In `tests/adapters.test.ts`: search for assertions on old adapter description strings or old guardrail wording; update each to match the new strings from tasks 1–2; run `pnpm test tests/adapters.test.ts` and confirm it passes.
- [x] 9.3 In `tests/verify.test.ts`: update any assertions on old integrity error messages from tasks 5.1–5.2; run `pnpm test tests/verify.test.ts` and confirm it passes.

## 10. Final Integration Check

- [x] 10.1 Run `pnpm test` from the project root and confirm all tests pass with no old-string failures.
- [x] 10.2 Run `npx speclearn validate examples/typescript-clean-architecture.course.md` and confirm it exits 0.
- [x] 10.3 Run `npx speclearn init --agents claude,copilot,antigravity,cursor,generic --yes` in a temporary directory and confirm all five adapter files contain `Socratic mentor rules`, `learning path`, `business rules and edge cases`, and `tamper-proof test verification` and do not contain `pedagogical harness`, `progress graph`, or `system invariants`.
- [x] 10.4 Spot-check `README.md` to confirm `Spec-Driven Learning (SDL)` and `COURSE-SPEC` are still present unchanged as the immutable framework terms.

## Workflow follow-up

- Archive the change after the implementation tasks are complete and all tests pass.
