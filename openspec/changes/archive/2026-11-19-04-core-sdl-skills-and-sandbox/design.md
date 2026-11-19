# Design

## Context

SpecLearn already generates basic native agent commands and persists a local progress model. This change fills those command templates with operational pedagogical behavior and adds safe course startup plus isolated concept examples. See `proposal.md` for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Provide complete, consistent `/slx:*` templates across built-in adapters.
- Mirror the student's or course's learning language in every pedagogical interaction.
- Add safe `start` and `skip` operations for course activation and mastery transitions.
- Isolate exercises from production work through Git branches or `.speclearn/sandbox/`.
- Provide isolated scratchpad examples for `/slx:explain [concept]`.

**Non-Goals:**
- Execute test commands or mark completed state in this change.
- Use LLM APIs inside the CLI binary.
- Automatically commit, merge, or publish sandbox work.
- Replace course verification or integrity SHA-256 logic beyond the existing state model.

## Decisions

- **Centralize complete skill text in adapter templates:** `src/adapters/templates.ts` will own the canonical English skill structure plus the explicit multilingual mirroring rule. Native adapters will apply that content without copying unrelated implementation logic.
- **Pass language and course context through prompts:** Skills will receive student prompt language naturally and should read active course metadata. The framework does not translate fixed schema keys or internal state fields.
- **Use staged `/slx:start` instructions:** The template will enforce Measure → Plan → Teach & Scaffold. It will prohibit direct solution output and require `# TODO(speclearn)` markers plus failing tests.
- **Separate sandbox selection from sandbox mutation:** `speclearn start` will first validate the course and Git status, then calculate a safe strategy. Git branch creation or sandbox directory creation will be isolated behind explicit filesystem/Git helpers.
- **Prefer Git branch isolation when safe:** A `speclearn/<course-or-safe-slug>` branch is preferred when a repository is clean and Git operations succeed. Dirty or non-Git workspaces use `.speclearn/sandbox/` or stop before mutation, depending on explicit safety choices.
- **Keep completion verification separate:** `skip <module>` changes only the `skipped_mastered` status after an accepted mastery boundary. It will not set `completed`; only deterministic verification may set completed state.
- **Make scratchpad independent:** `/slx:explain` templates will require creation in `.speclearn/scratchpad/`, preserve the active lab context, and avoid modifying production files.
- **Use existing Node native process APIs:** Git status and branch operations may use `child_process` or a small typed wrapper. No additional Git library is required for the initial implementation.

## Risks / Trade-offs

- **Dirty Git worktrees** → Stop by default and present safe alternatives; never discard or automatically stash unrelated changes.
- **Branch name collisions** → Generate a deterministic course slug and report an existing branch rather than silently overwriting it.
- **Student asks for a direct solution** → Skill guardrails must respond with Socratic scaffolding and code markers; adapters cannot enforce agent behavior, so templates remain explicit and testable.
- **Scratchpad runtime dependencies** → Use the smallest runnable example appropriate to the concept and avoid installing dependencies by default.
- **Mastery skip misuse** → Require diagnostic evidence through skill instructions and expose CLI skip only as a state transition, not a verification bypass.

## Migration Plan

Existing adapter-generated placeholders can be replaced idempotently using managed markers or file rewrites. Existing progress files remain valid. A course start should add no fields beyond optional sandbox and active course updates. No sandbox or scratchpad content is migrated automatically.

## Open Questions

None. The course format, language behavior, sandbox strategy, and completion boundary are sufficiently specified.
