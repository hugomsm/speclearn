# Proposal

## Why

SpecLearn's Socratic agent prompts, CLI output, and documentation contain academic and infrastructure-heavy terminology — `system invariants`, `pedagogical harness`, `progress graph`, `SHA-256 integrity` — that creates unnecessary distance between the tool and the students and junior-to-mid developers it targets. The agent reads like an academic textbook rather than a helpful senior teammate, undermining the approachability that SDL's Socratic mentoring model depends on.

## What Changes

- Replace `system invariants` / `invariants` with `business rules and edge cases` in Socratic prompt templates (`/slx:propose`, `/slx:start`, `/slx:explain`, `/slx:verify`), adapter-generated files, and examples.
- Replace `pedagogical harness` with `Socratic mentor rules` across CLI messages, adapter templates, README, and docs.
- Replace `progress graph` with `learning path` in CLI output messages, skill templates, and specs.
- Reframe `SHA-256 integrity` / `SHA-256 test integrity` around its user benefit (`tamper-proof test verification`) in user-facing strings; keep cryptographic details in verbose/error diagnostics and technical reference docs only.
- Audit and rewrite remaining overly academic, formal-methods, or infrastructure-heavy phrasing in prompts, CLI strings, and documentation into plain, approachable language (e.g. `pedagogical curriculums` → `learning curriculums`, `deterministic verification boundary` → `verification checkpoint`, `DAG` → `learning path tree`, `invariant` in rubric examples → `business rule`).
- Sync updated phrasing across all five agent adapters (Claude Code, GitHub Copilot, Cursor, Antigravity, Generic/AGENTS.md) so the generated skills sound like a pragmatic, supportive senior teammate.
- Preserve `Spec-Driven Learning (SDL)` and `COURSE-SPEC` as immutable framework terms everywhere.

## Capabilities

### New Capabilities

*(none — all changes are updates to existing capability requirements)*

### Modified Capabilities

- `sdl-pedagogy-skills`: Update Socratic skill requirements to reflect plain-language phrasing (replace `progress graph`, `pedagogical harness`, `invariants` in scenario language).
- `agent-adapter-system`: Update adapter requirements to mandate plain-language mentor tone and sync phrasing across all adapter outputs.
- `anti-tampering-verification`: Update requirement language to frame SHA-256 integrity around tamper-proof test verification rather than raw cryptographic detail.
- `deterministic-module-verification`: Update result-reporting requirement to use `learning path` instead of `progress graph`.
- `cli-entrypoint`: Update CLI command description requirements to reflect simplified, benefit-first language.

## Impact

- **Source files**: `src/adapters/templates.ts` (all four SLX_COMMAND_TEMPLATES), `src/adapters/builtins.ts` (adapter descriptions in generic adapter), `src/cli.ts` (command descriptions and spinner text), `src/commands/verify.ts` (error messages), `src/state/progress.ts` (`renderDagStatus` output strings).
- **Examples**: `examples/typescript-clean-architecture.course.md` (rubric checks, pedagogical guide text).
- **Documentation**: `README.md` (manifesto, comparison matrix, inline prose).
- **OpenSpec main specs**: `openspec/specs/sdl-pedagogy-skills/spec.md`, `openspec/specs/agent-adapter-system/spec.md`, `openspec/specs/anti-tampering-verification/spec.md`, `openspec/specs/deterministic-module-verification/spec.md`, `openspec/specs/cli-entrypoint/spec.md`.
- No schema changes, no API breaking changes, no test file changes.
