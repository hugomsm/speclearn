# Design

## Context

See proposal.md → Why for the motivation. The terminology changes affect a small, well-isolated set of TypeScript source files. All user-facing strings are concentrated in `src/adapters/templates.ts` (prompt templates), `src/cli.ts` (command descriptions and spinner text), `src/commands/verify.ts` (error messages), `src/state/progress.ts` (status display strings), `README.md`, and `examples/`. The main specs under `openspec/specs/` describe behavioral requirements in scenario language that also uses the terms being simplified.

The five affected source files have clear ownership. No new abstractions are needed; this is a targeted string-level change with one architectural decision around SHA-256 messaging.

## Goals / Non-Goals

**Goals:**
- Replace the four specific jargon terms (`system invariants`, `pedagogical harness`, `progress graph`, `SHA-256 integrity`) with their plain-language equivalents in every user-facing location.
- Audit and simplify remaining academic phrasing throughout prompts, CLI strings, and docs.
- Keep all five agent adapters in sync by editing the single shared `SLX_COMMAND_TEMPLATES` source in `templates.ts` (all adapters read from it).
- Update the five OpenSpec main specs to reflect the new requirement language.

**Non-Goals:**
- Changing schema field names or public API surface (no breaking changes).
- Altering cryptographic behavior — SHA-256 hashing stays in `integrity.ts` unchanged.
- Rewriting test files or test fixture content.
- Changing the CONTRIBUTING, SECURITY, or CODE_OF_CONDUCT docs.

## Decisions

### Decision 1: Single-source template edit propagates to all adapters

All five adapters (Claude Code, GitHub Copilot, Cursor, Antigravity, Generic) read from the same `SLX_COMMAND_TEMPLATES` object in `templates.ts`. Editing that one file propagates to all adapters on the next `speclearn init` run. No per-adapter edits are needed beyond the generic adapter's description strings in `builtins.ts`.

**Alternative considered**: Edit each adapter's output file directly. Rejected — it duplicates the change and diverges on the next `init` regeneration.

### Decision 2: SHA-256 stays in internal code; user-facing strings reframe around benefit

The `integrity.ts` module uses SHA-256 internally (unchanged). User-facing CLI strings in `verify.ts`, `cli.ts`, and `templates.ts` are rewritten to say "tamper-proof test verification" or "test files appear to have changed" rather than "SHA-256 hash mismatch". Verbose/error diagnostic output (stdout/stderr forwarded from the subprocess) is not modified — it surfaces the raw technical detail only when needed for debugging.

**Alternative considered**: Expose a `--verbose` flag that shows hash details. Deferred — the current architecture already forwards raw stdout/stderr on failure, which serves the diagnostic case. A dedicated flag is not needed to satisfy the requirements.

### Decision 3: `renderDagStatus` → rename underlying function comment, not the function

The function `renderDagStatus` in `progress.ts` is an internal TypeScript identifier. The spec requires the *output string* to say "learning path" rather than a DAG-specific label; it does not require renaming internal function identifiers. Only the user-visible output message changes (e.g., "No active course" message). This avoids a pointless refactor that would break existing test assertions on function names.

### Decision 4: Spec delta for `cli-entrypoint` covers descriptions, not behavior

The `cli-entrypoint` spec already has 10 requirements. This change adds/modifies requirements that govern the *tone and language* of CLI descriptions, not new commands or behavioral contracts. The existing functional requirements (how `verify` works, how `init` processes agents) are unchanged.

## Risks / Trade-offs

- **[Risk] Existing tests assert on exact CLI output strings** → Mitigation: Update matching test assertions in `tests/cli.test.ts` and `tests/adapters.test.ts` as part of the implementation tasks. The test logic is unaffected; only expected strings change.
- **[Risk] README wording changes could affect indexing or discoverability** → Low impact. The SDL manifesto rewrite keeps all searchable terms (`Spec-Driven Learning`, `COURSE-SPEC`, `Socratic`) in place. `pedagogical harness` and `progress graph` are not indexed terms.
- **[Risk] Course authors referencing old terminology in their own `.course.md` files** → Out of scope. Schema field names (`harness_rules`, `socratic_mode`) are unchanged. Only display-layer strings change.

## Migration Plan

No migration needed. All changes are additive string substitutions within the CLI binary source and documentation. The CLI's public command interface (subcommand names, flags, exit codes) is unchanged. Agent adapters regenerate automatically on the next `speclearn init` run.
