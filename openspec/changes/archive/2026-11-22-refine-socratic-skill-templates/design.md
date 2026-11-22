# Design

## Context

SpecLearn generates slash-command prompt files (`/slx:propose`, `/slx:start`, `/slx:explain`, `/slx:verify`) across five agent targets: Claude Code, GitHub Copilot, Antigravity, Cursor, and generic `.agents/skills/`. Currently, the prompt templates in `src/adapters/templates.ts` have either missing rules or practical ambiguities that allow AI agents to jump straight to writing solutions or lecturing rather than acting as true Socratic mentors. Furthermore, language mirroring and guardrails are duplicated across both the prompt footers and `guardedContent()`.

See `proposal.md` for the motivation and scope.

## Goals / Non-Goals

**Goals:**
- Refine all 4 skill templates (`propose`, `start`, `explain`, `verify`) to a practical, scannable sweet spot of ~35–50 lines each.
- Define unambiguous turn-taking and hint-escalation rules in `/slx:start` to prevent premature code giveaways.
- Ensure `/slx:explain` keeps scratchpad work strictly inside `.speclearn/scratchpad/` and uses micro-examples with a check-for-understanding.
- Provide clear triage for `/slx:verify` across test failures, tamper detection, and post-pass rubric reviews.
- Deduplicate language mirroring and guardrail text across templates and `guardedContent`.
- Maintain 100% compatibility across all five supported agent adapters and pass all Vitest suites.

**Non-Goals:**
- Creating a heavy state-machine prompt with rigid ASCII syntax or cumbersome bureaucracy.
- Changing the CLI command signatures, runtime behavior, or JSON schema.
- Adding runtime LLM API calls (preserving the strict zero-LLM CLI architecture).

## Decisions

### 1. Template Structure & Target Line Count (~35–50 lines per skill)
- **Decision:** Each template will follow a uniform, highly scannable structure:
  1. Persona & Primary Directive (2–3 lines)
  2. Numbered Operational Steps (4–6 steps with bold imperative anchors)
  3. Socratic Guardrails & Prohibitions (3–4 bullet points clearly stating what *not* to do)
  4. Concise language mirroring reference
- **Rationale:** AI models adhere significantly better to numbered steps with clear negative constraints ("Never X", "Refuse Y") than to unstructured prose. Keeping the length around 35–50 lines provides sufficient operational detail without bloating the agent's context window.
- **Alternatives considered:**
  - *Micro-prompts (<20 lines):* Too terse; agents fall back to standard code-generation behavior.
  - *Comprehensive state machines (>80 lines):* Overly rigid, burns tokens, and causes agents to become pedantic or ignore instructions.

### 2. Socratic Turn-Taking & Hint Escalation in `/slx:start`
- **Decision:** Introduce explicit three-tier hint escalation:
  - *Tier 1 (Conceptual):* Socratic question targeting domain rules and edge cases.
  - *Tier 2 (Architectural):* Pointing to specific file locations, contracts, or test assertions.
  - *Tier 3 (Scaffolding):* Inserting failing tests or `# TODO(speclearn)` stubs—never complete implementations.
  - Mandate asking only one question per turn and waiting for the user's response.
- **Rationale:** Agents frequently ask multiple questions in a single reply or provide code alongside the question, breaking the conversational learning loop.
- **Alternatives considered:**
  - Allowing the agent to decide pacing: Led to inconsistent behavior across models, with Claude Code and Cursor often printing entire files.

### 3. Scratchpad Sandbox Boundaries in `/slx:explain`
- **Decision:** Mandate that all scratchpad code must be created within `.speclearn/scratchpad/`, use minimal micro-examples (≤15 lines) focused on the specific concept, require a short interactive question to test understanding, and promptly return to the active lab.
- **Rationale:** Prevents agents from writing scratchpad experiments in production source trees or polluting git status.

### 4. Distinct Verification Triage in `/slx:verify`
- **Decision:** Structure `/slx:verify` into 3 explicit branches:
  - *Failure Branch:* Formulate exactly one diagnostic question based on the error output; do not touch or edit the student's code.
  - *Tamper / Missing Files Branch:* Explain that test files must match their locked snapshots before progress can be validated.
  - *Success Branch:* Review the git diff against `rubric_checks`, ask a conceptual consolidation question, and display the updated learning path.
- **Rationale:** Closing the loop with a consolidation question reinforces why the solution works before the student moves to the next module.

### 5. Deduplication of Language Mirroring & Guardrails
- **Decision:** Keep `LANGUAGE_MIRRORING` concise (3–4 lines) and shared across templates via a single constant, and keep `guardedContent()` focused on system guardrails for root agent instruction files (`CLAUDE.md`, `ANTIGRAVITY.md`, `AGENTS.md`, etc.).
- **Rationale:** Reduces repetitive token overhead across multi-file adapter generation while ensuring consistent wording.

## Risks / Trade-offs

- **[Risk] Prompt length variance across models** → Some models might still try to generate code if the user insists.
  - *Mitigation:* Include explicit refusal phrasing in the template: *"If the learner asks you to write the code, refuse politely: 'I'm here to guide you through building this yourself. Let's look at...'"*
- **[Risk] Existing regex assertions in test suite might fail if strings change** → `tests/sdl.test.ts` and `tests/adapters.test.ts` check specific keywords.
  - *Mitigation:* Audit and update assertions in `tests/sdl.test.ts` to reflect the refined phrases while maintaining all core keyword checks.
