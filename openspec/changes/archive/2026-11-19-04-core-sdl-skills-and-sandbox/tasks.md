# Tasks

## 1. Core SDL Skill Templates

- [x] 1.1 Add a shared strict language-mirroring instruction to every `/slx:*` adapter template, then verify each built-in command file contains the rule.
- [x] 1.2 Replace the `/slx:propose` placeholder with repository inspection, at most three short calibration questions, dual-format course generation, universal-concept separation, and `npx speclearn validate` verification.
- [x] 1.3 Replace `/slx:start` with the Measure, Plan, and Teach & Scaffold stages, including a three-minute diagnostic, prerequisite-aware path, MCP ADR usage, and TODO/failing-test scaffolding.
- [x] 1.4 Replace `/slx:explain [concept]` with isolated `.speclearn/scratchpad/` example instructions and smooth restoration of the active lab context.
- [x] 1.5 Replace `/slx:verify` with deterministic test-command and SHA-256 integrity boundaries, then verify it never presents test success as sufficient without integrity validation.

## 2. Sandbox Start and Skip CLI

- [x] 2.1 Implement `speclearn start <course>` to load and validate the selected spec, inspect Git status, initialize progress, and record sandbox metadata.
- [x] 2.2 Add safe branch isolation using a deterministic `speclearn/<course>` branch and no destructive Git operations, then verify clean and dirty worktrees behave according to spec.
- [x] 2.3 Add fallback `.speclearn/sandbox/` isolation for non-Git workspaces or when branch isolation is unavailable, then verify sandbox paths are recorded.
- [x] 2.4 Implement `speclearn skip <module>` with mastery-status transition and prerequisite-aware downstream unlocking, then verify unverified skips do not create completed state.

## 3. State and Scratchpad Integration

- [x] 3.1 Extend progress state with active sandbox branch/path and skipped-mastered transitions without allowing skipped modules to become completed.
- [x] 3.2 Implement scratchpad lifecycle helpers for creating isolated runnable examples and restoring active course context, then verify production files remain unchanged.
- [x] 3.3 Add tests for language mirroring, all four skill templates, start safety, skip transitions, scratchpad isolation, and adapter parity.

## 4. Adapter and Documentation Integration

- [x] 4.1 Regenerate Claude, Copilot, Gemini, and Cursor outputs with complete SDL skill content and verify native paths remain correct.
- [x] 4.2 Update `README.md` with `/slx:propose`, `/slx:start`, `/slx:explain`, `/slx:verify`, sandbox, skip, and scratchpad usage.
- [x] 4.3 Update CLI help for `start <course>` and `skip <module>` and verify command registration smoke tests pass.

## 5. Verification

- [x] 5.1 Run lint, typecheck, build, and test commands on Node.js 24 and verify all complete successfully.
- [x] 5.2 Exercise start behavior in clean Git, dirty Git, and non-Git temporary repositories, and verify no production branch or file is polluted unexpectedly.
- [x] 5.3 Exercise mastery skip and status rendering with locked, available, skipped-mastered, and completed modules, and verify DAG state transitions are clear.
- [x] 5.4 Review the implementation against proposal scope and delta specs, and verify no full-solution output, LLM API calls, test execution as completion, or automatic verification mutation was added.

## Workflow follow-up

- Archive this change after implementation review and validation are complete.
