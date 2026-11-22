# Design

## Context

SpecLearn previously assumed all learning took place in isolated Git branches or `.speclearn/sandbox/` directories. For real-world production teams, developers want to learn architectural patterns, libraries, or new domain features while shipping real features into their actual codebase. Furthermore, when working with external or team-shared courses, developers need the flexibility to choose whether to run the course in an isolated sandbox or directly against their workspace without mutating the shared course file.

See `proposal.md` for motivation and background.

## Goals / Non-Goals

**Goals:**
- Provide a `mode` field on `COURSE-SPEC` (`"sandbox" | "workspace"`, defaulting to `"sandbox"`) so courses can explicitly declare whether their default delivery is an isolated training exercise or real-repository feature delivery.
- Allow modules to declare `target_files` (mapping tasks directly to real project source files) and `regression_command` (ensuring feature additions do not break existing repository tests).
- Enable `/slx:propose` to detect workspace feature intent (via `--workspace` or prompt context) and, if unspecified, ask during calibration whether the course should target an isolated `sandbox` or real `workspace` files.
- Enable `/slx:start` to announce the course's configured mode before scaffolding, accept `--sandbox` / `--workspace` overrides, and offer the learner a quick confirmation or option to switch delivery modes for their session.
- Persist session mode overrides in local progress state (`.speclearn/state/progress.json`) rather than mutating shared `COURSE-SPEC` files.
- Direct Socratic mentoring during `/slx:start` to guide changes directly in `target_files` without full implementation spoilers, keeping git diffs PR-ready when in workspace mode.
- Confine all temporary examples and exploration files during `/slx:explain` strictly to `.speclearn/scratchpad/`, never creating temporary files in production directories.
- In `speclearn verify`, run targeted feature tests with tamper-proof checks, followed by the module's `regression_command` (if defined), before marking a module complete.
- Keep `speclearn start` clean by bypassing sandbox branch creation when the effective session mode is `workspace`.

**Non-Goals:**
- Automated git committing or branch merging by SpecLearn (git operations for PR submission remain under developer control).
- Automatic code patching or writing solution code (Socratic mentor rules strictly withhold full solutions).
- Replacing standard package-level regression test runners; SpecLearn delegates command execution deterministically to the local environment.

## Decisions

### 1. Delivery Mode Schema and Defaults

- **Decision**: Add `mode: z.enum(["sandbox", "workspace"]).default("sandbox")` to `courseSpecSchema`.
- **Rationale**: Setting the default to `"sandbox"` guarantees 100% backward compatibility for all existing course specifications (`.course.md` and `.course.yaml`), existing starter examples, and user workspaces.
- **Alternatives considered**:
  - Requiring `mode` on every course: rejected because it would break existing courses and starter examples.
  - Inferring mode from the presence of `target_files`: rejected because explicit intent is safer and allows sandbox courses to reference example files without treating them as production workspace targets.

### 2. Module Target Files and Regression Command

- **Decision**: Add `target_files?: z.array(z.string().min(1)).optional()` to `courseModuleSchema`, and add `regression_command?: z.string().trim().min(1).optional()` to `moduleVerificationSchema`.
- **Rationale**: `target_files` gives the agent and student unambiguous scope boundaries for where real implementation happens. `regression_command` enables running the broader test suite (e.g., `pnpm test`, `pytest`) after the module-specific `test_command` passes, ensuring no regressions before learning path advancement.
- **Alternatives considered**:
  - Reusing `test_command` for both feature tests and regression: rejected because combining them slows down targeted feedback and obscures whether the feature failed or an existing invariant was broken.

### 3. Session-Level Delivery Mode Overrides and State Persistence

- **Decision**: Add optional `mode: z.enum(["sandbox", "workspace"]).optional()` to `progressStateSchema` in `src/state/progress.ts`. Support `--sandbox` and `--workspace` flags in `speclearn start <course>`, and announce configured mode in `/slx:start` with a quick session switch option.
- **Rationale**: Shared course specs (e.g., committed to a repo or imported from community repositories) may declare a default `mode: "sandbox"`. A senior developer building a real feature on their branch may want to run it in `workspace` mode without modifying git-tracked course files. Persisting this choice in `.speclearn/state/progress.json` keeps course files immutable while giving the user full local control.
- **Effective mode resolution**: `const effectiveMode = state.mode ?? course.mode ?? "sandbox"`.
- **Alternatives considered**:
  - Mutating the COURSE-SPEC file on disk: rejected because course files may be committed, version-controlled, or shared across teams.
  - Keeping mode overrides solely in-memory: rejected because subsequent CLI commands (`speclearn verify`, `speclearn status`) need to know the active session delivery mode.

### 4. Calibration for Delivery Mode in `/slx:propose`

- **Decision**: In `/slx:propose`, if the user does not pass `--workspace` or express clear feature-delivery intent in their prompt, ask during calibration whether to target an isolated sandbox or real repository files (`workspace` mode), as one of the maximum 3 calibration questions.
- **Rationale**: Gives course authors explicit choice upfront without adding extra interrogation rounds.

### 5. Scratchpad Isolation Guardrail

- **Decision**: Enforce in `SLX_COMMAND_TEMPLATES.explain`, adapter prompt templates, and `guardedContent()` that all temporary files must reside strictly in `.speclearn/scratchpad/`.
- **Rationale**: In workspace mode, creating temporary files in the repository root or source tree can contaminate production code, git status, and PR diffs. Confining scratchpads to `.speclearn/scratchpad/` (which is gitignored) guarantees safety.
- **Alternatives considered**:
  - Disallowing `/slx:explain` in workspace mode: rejected because conceptual Socratic explanations are even more valuable when working on production code.

### 6. Verification Execution Pipeline

- **Decision**: Update `verifyModule()` in `src/commands/verify.ts`:
  1. Verify tamper-proof integrity of `test_files`.
  2. Execute `test_command`. If exit code !== 0, report failure and return.
  3. If `regression_command` is defined, execute it in `projectRoot`. If exit code !== 0, report regression failure and return without marking completed.
  4. Only when both pass (exit code 0), generate verification signature and mark the module completed in `.speclearn/state/progress.json`.
- **Rationale**: Deterministic, sequential execution with early exit provides clear feedback to the developer on whether the feature test or regression test failed.
- **Alternatives considered**:
  - Running regression tests in parallel with feature tests: rejected because failing feature tests should immediately report feedback without waiting for a lengthy regression suite.

### 7. Workspace Mode in `startCourse`

- **Decision**: In `src/sandbox/start.ts`, check the effective delivery mode (`options.mode ?? course.mode ?? "sandbox"`). When effective mode is `"workspace"`, bypass Git cleanliness checks and sandbox branch creation, setting `sandbox: { path: "." }` and saving `mode: "workspace"` in progress state.
- **Rationale**: In workspace mode, developers are often working in a feature branch with uncommitted edits. Blocking them from starting a workspace course would defeat the purpose of real-time Socratic mentoring on work-in-progress features.
- **Alternatives considered**:
  - Creating a separate workspace branch: rejected because feature branch lifecycle belongs to the developer's normal Git workflow.

## Risks / Trade-offs

- **[Risk] Regression commands may be long-running in large repositories.**
  - **Mitigation**: `regression_command` is optional. Course authors should specify fast, relevant regression commands (e.g., focused package test suites) rather than whole-monorepo CI pipelines.
- **[Risk] In workspace mode, student may inadvertently commit `.speclearn` files.**
  - **Mitigation**: `speclearn init` automatically adds `.speclearn/state/` and `.speclearn/scratchpad/` to `.gitignore`. `.speclearn/specs/` remains trackable so courses can be shared with teammates.

## Migration Plan

1. Existing courses without `mode` automatically parse as `mode: "sandbox"`.
2. Existing progress state files without `mode` default to course mode.
3. Existing verification suites without `regression_command` continue executing `test_command` identically.
4. No breaking changes to existing progress state or CLI commands.
