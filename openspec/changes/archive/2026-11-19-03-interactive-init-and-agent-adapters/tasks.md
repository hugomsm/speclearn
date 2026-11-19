# Tasks

## 1. Workspace Bootstrap

- [x] 1.1 Implement `speclearn init` interactive selection with Clack `multiselect`, then verify interactive selection creates only chosen adapter outputs.
- [x] 1.2 Implement `init --agents claude,copilot,gemini,cursor --yes` parsing and supported-agent validation, then verify unattended initialization succeeds and unknown agents fail clearly.
- [x] 1.3 Create `.speclearn/specs/`, `.speclearn/state/`, `.speclearn/scratchpad/`, and `.speclearn/config.yaml`, then verify first-run and repeat initialization preserve existing content.
- [x] 1.4 Update `.gitignore` idempotently to ignore `.speclearn/state/` and `.speclearn/scratchpad/` while keeping `.speclearn/specs/` trackable, then verify duplicate entries are not created.

## 2. Agent Adapter Architecture

- [x] 2.1 Define `AgentAdapter` interface and adapter registry under `src/adapters/`, then verify community-style adapters can be registered without core CLI changes.
- [x] 2.2 Implement Claude Code adapter for the four `slx` command files and managed `CLAUDE.md` section, then verify generated paths and marker-bounded updates.
- [x] 2.3 Implement GitHub Copilot adapter for the four prompt files and managed `.github/copilot-instructions.md` section, then verify generated paths and idempotent updates.
- [x] 2.4 Implement Gemini CLI adapter for native `.gemini/commands/slx-*.toml` or Markdown commands and `GEMINI.md`, then verify generated command files and managed guardrails.
- [x] 2.5 Implement Cursor adapter for `.cursor/rules/speclearn.mdc`, then verify slash-command behavior and guardrails are present.
- [x] 2.6 Add shared `/slx:propose`, `/slx:start`, `/slx:explain`, and `/slx:verify` templates and managed markers, then verify all built-in adapters include the four experiences.

## 3. Progress State and Status

- [x] 3.1 Implement strict Zod progress state types in `src/state/progress.ts`, including active course, sandbox, module statuses, SHA-256 hashes, and timestamps, then verify state parsing succeeds for valid data.
- [x] 3.2 Implement read, create, update, and atomic-write operations for `.speclearn/state/progress.json`, then verify malformed state fails clearly and valid writes preserve unrelated fields.
- [x] 3.3 Implement `speclearn status` to render an active-course progress bar and DAG status tree, then verify it handles active and inactive state clearly.
- [x] 3.4 Add unit tests for state validation and status rendering, then verify `pnpm test` passes.

## 4. CLI and Integration

- [x] 4.1 Register `init` and `status` with Commander and Clack formatting, then verify `--help`, interactive selection, and status invocations work locally.
- [x] 4.2 Add initialization and adapter smoke tests in `tests/init.test.ts` and `tests/adapters.test.ts`, then verify they pass for repeated runs and each built-in adapter.
- [x] 4.3 Document `init`, `status`, supported agents, `.speclearn/` layout, and adapter extension in `README.md`, then verify documented commands execute successfully.

## 5. Verification

- [x] 5.1 Run lint, typecheck, build, and test commands, and verify all complete successfully.
- [x] 5.2 Exercise interactive and non-interactive init in temporary repositories plus repeated runs, and verify idempotent files and `.gitignore` entries.
- [x] 5.3 Exercise `speclearn status` with active, completed, and uninitialized progress fixtures, and verify progress and DAG output is clear.
- [x] 5.4 Review the change against all delta specs and proposal scope, and verify no test execution, course compilation, progress completion mutation, or LLM API behavior was added outside scope.

## Workflow follow-up

- Archive this change after implementation review and validation are complete.
