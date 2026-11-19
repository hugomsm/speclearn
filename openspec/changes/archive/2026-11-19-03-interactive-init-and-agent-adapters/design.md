# Design

## Context

SpecLearn now has a strict course format and a validation CLI. This change adds the local bootstrap, adapter, state, and status surfaces required for a usable workspace. See `proposal.md` for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Initialize deterministic local `.speclearn` structures in interactive and unattended modes.
- Generate native slash-command and guardrail outputs for Claude Code, GitHub Copilot, Gemini CLI, and Cursor.
- Provide a public, registry-based adapter extension point.
- Persist and validate local progress state, including SHA-256 test-file metadata.
- Render terminal progress and DAG status without making network or LLM calls.

**Non-Goals:**
- Implement course compilation beyond the initial slash-command and guardrail templates.
- Execute test commands or mark modules completed as part of `verify`; that behavior belongs to later verification work.
- Add MCP runtime access or network synchronization.
- Implement automatic sandbox branch creation or Git operations beyond storing sandbox metadata.

## Decisions

- **Separate init orchestration from adapter implementations:** `init` will resolve the project root, requested adapters, and workspace operations. Each adapter owns native file paths and content rendering. Shared filesystem helpers remain responsible for idempotent directory and managed-section writes.
- **Use a public `AgentAdapter` interface:** The interface will expose an adapter identifier, display name, availability or activation description, and an idempotent `apply(projectRoot)` operation. Built-ins will implement the same contract and register in a central adapter registry.
- **Use marker-bounded managed sections:** Adapter updates to `CLAUDE.md`, `.github/copilot-instructions.md`, `GEMINI.md`, and related instruction files will use explicit start/end markers. Existing user-authored content outside markers is preserved.
- **Use static core command templates:** The four `/slx` commands are deterministic text templates initially, parameterized only by adapter-native syntax. They explain propose, start, explain, and verify behavior without invoking an LLM API from the binary.
- **Use Zod for progress state:** `src/state/progress.ts` will define and export a strict progress-state schema. Reads will fail clearly on malformed JSON or invalid state; writes will serialize atomically through a temporary file and rename.
- **Model module state independently from course data:** Progress state will track module IDs and status values. Course prerequisite relationships remain in the COURSE-SPEC document. Status rendering will correlate the state with the active course's loaded module graph.
- **Record hashes without executing tests:** The state schema and update APIs will accept test-file SHA-256 values and completion timestamps. Hash generation is deterministic file I/O, not test execution.
- **Render status through Clack-compatible terminal primitives:** A compact progress bar and indented DAG tree will use picocolors or plain text fallbacks. The command remains deterministic and may display no progress when no active course exists.
- **Support explicit and interactive init modes:** Commander will expose `--agents` and `--yes`. When both are absent and stdin supports prompts, Clack will use `multiselect`; unattended environments or explicit flags will avoid interactive prompts.

## Risks / Trade-offs

- **Prompt cancellation** → The init workflow will perform no writes until selections are confirmed or `--yes` is supplied.
- **Managed file conflicts** → Marker sections provide idempotent updates, but missing or malformed marker pairs will be reported rather than silently overwriting user content.
- **Progress file corruption** → Read validation stops mutations and directs the user to resolve or restore the file; automatic reconstruction is avoided.
- **Cross-agent native format drift** → Native syntax remains isolated inside adapter implementations, with shared slash-command semantics documented in core templates.
- **State and course data separation** → Status may find state module IDs absent from the active course; the renderer will flag the mismatch instead of inventing module relationships.

## Migration Plan

Initialization is additive and idempotent. Existing `.speclearn/` content is preserved. Existing instruction files are updated only inside managed markers. Malformed progress files remain untouched until corrected; no automatic migration or destructive reset is performed.

## Open Questions

None. The supported identifiers, paths, state model, and status behavior are sufficiently defined for implementation.
