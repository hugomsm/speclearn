# Proposal

## Why

The current `/slx:*` prompt templates (`propose`, `start`, `explain`, `verify`) in SpecLearn are either too sparse or have practical gaps where AI coding agents tend to improvise or give away answers prematurely. When learners ask for solutions, agents across Claude Code, GitHub Copilot, Cursor, and Antigravity often generate full implementations or deliver lengthy lectures instead of acting as true Socratic mentors. Refining and enriching these templates to a practical, scannable middle ground (~35–50 lines per skill) ensures consistent, disciplined pedagogical behavior without making the prompts bureaucratic or verbose.

## What Changes

- **Enrich `/slx:start` with explicit Socratic pacing**:
  - Ask exactly one focused question at a time and wait for the learner's response before scaffolding or advancing.
  - Escalate hints gradually (conceptual hint → architectural pointer → partial scaffold) only when the learner is stuck.
  - Explicitly refuse requests to generate the full solution code upfront, redirecting the learner to the active TODO markers or failing tests.
- **Enrich `/slx:explain` with tight scratchpad discipline**:
  - Enforce `.speclearn/scratchpad/` as the sole permissible location for temporary runnable files; never touch production or `target_files`.
  - Prefer step-by-step interactive micro-examples over passive theory lectures.
  - Require a clear check-for-understanding before concluding the explanation and returning to the active module.
- **Enrich `/slx:verify` with structured triage and review**:
  - Handle test failures with exactly one targeted diagnostic question based on stdout/stderr, strictly refusing to patch or write the fix for the learner.
  - Detect and explain tampered or missing locked test files, guiding restoration rather than proceeding.
  - On test pass, conduct a structured review against the declared `rubric_checks` and require one consolidation question before displaying the updated learning path.
- **Refine `/slx:propose` and shared guardrails**:
  - Maintain the ~35–50 line balance across all skills with concise, scannable Markdown instructions.
  - Deduplicate language mirroring and guardrails across `guardedContent` and template footers while keeping plain developer terminology (`business rules and edge cases`, `Socratic mentor rules`, `learning path`).
- **Update test suite and documentation**:
  - Update unit and integration tests in `tests/sdl.test.ts` and `tests/adapters.test.ts` to assert the refined Socratic pacing, scratchpad boundaries, verification triage, and guardrails.

## Capabilities

### Modified Capabilities

- `sdl-pedagogy-skills`: Updates the requirements for `Propose skill workflow`, `Start skill Socratic loop`, `Explain skill workflow`, and `Verify skill boundary` to mandate scannable Socratic pacing, gradual hint escalation, interactive micro-examples, distinct failure triage, and consolidation reviews.
- `agent-adapter-system`: Updates the requirements for `Core slash commands` and `Managed guardrails` to require the refined ~35–50 line templates and deduplicated guardrails across all supported agent harnesses.

## Impact

- Affected source files: `src/adapters/templates.ts`, `src/adapters/builtins.ts`.
- Affected test files: `tests/sdl.test.ts`, `tests/adapters.test.ts`.
- Multi-agent harnesses: Claude Code (`.claude/`), GitHub Copilot (`.github/`), Antigravity (`.gemini/`), Cursor (`.cursor/`), and generic `.agents/skills/`.
- No breaking changes to the CLI binary, schema models, or progress state format.
