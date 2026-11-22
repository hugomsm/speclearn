# Tasks

## 1. Schema and State Updates

- [x] 1.1 Update `src/schema/course-spec.ts` with `mode?: "sandbox" | "workspace"` (defaulting to `"sandbox"`), `target_files?: string[]` on `courseModuleSchema`, and `regression_command?: string` on `moduleVerificationSchema`; update `src/state/progress.ts` to support optional session `mode` in `progressStateSchema`; verify with unit tests in `tests/schema.test.ts` and `tests/progress.test.ts`
- [x] 1.2 Regenerate JSON schema files (`schemas/course-spec.v1.schema.json` and `.speclearn/course-spec.v1.schema.json`) via `pnpm build` and verify schema properties for `mode`, `target_files`, and `regression_command`

## 2. Sandbox, Start, and Verification Command Updates

- [x] 2.1 Update `src/sandbox/start.ts` and `src/cli.ts` to support `--sandbox` and `--workspace` flags, record session mode override in progress state without mutating course files, and bypass sandbox branch and directory isolation when effective mode is `"workspace"`, verifying with unit tests in `tests/start.test.ts`
- [x] 2.2 Update `src/commands/verify.ts` to execute the optional `regression_command` after feature tests pass, blocking module completion on non-zero exit, and verify with unit tests in `tests/verify.test.ts`

## 3. Socratic Mentor Prompt and Adapter Templates

- [x] 3.1 Update `SLX_COMMAND_TEMPLATES` in `src/adapters/templates.ts` to ask delivery mode in calibration if unspecified in `propose`, announce configured mode upfront with a quick switch option in `start`, direct edits within `target_files` in workspace mode, enforce `.speclearn/scratchpad/` isolation in `explain`, and run regression checks in `verify`
- [x] 3.2 Update `guardedContent()` and built-in adapter configurations in `src/adapters/builtins.ts` to include scratchpad isolation, mode announcements, and session mode overrides across all adapters, and verify with unit tests in `tests/adapters.test.ts`

## 4. Documentation and Examples

- [x] 4.1 Update `README.md` and docs to explain `sandbox` and `workspace` delivery modes, calibration choices, and session overrides for external or team-shared courses using plain developer terminology with practical examples
- [x] 4.2 Verify existing starter course examples in `examples/` validate cleanly against the updated schema in `tests/examples.test.ts`

## 5. Integration and Quality Verification

- [x] 5.1 Run full test suite (`pnpm test`) and build bundle (`pnpm build`) to confirm end-to-end type safety and deterministic execution
- [x] 5.2 Run OpenSpec validation (`openspec validate --all`) to confirm all delta specs and change artifacts pass validation
