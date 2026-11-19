export const MANAGED_START = "<!-- speclearn-managed:start -->";
export const MANAGED_END = "<!-- speclearn-managed:end -->";

export const SLX_COMMAND_TEMPLATES = {
  propose: `# /slx:propose

Use the repository's Spec-Driven Learning workflow to propose a focused course or change. Keep planning separate from implementation. Read the active COURSE-SPEC and existing specifications before generating a proposal.`,
  start: `# /slx:start

Activate the selected learning course and module. Display prerequisites and the active sandbox context. Do not mark work completed unless deterministic verification succeeds.`,
  explain: `# /slx:explain

Explain the active concept using Socratic guidance. Prefer questions and incremental hints unless the course explicitly allows spoilers.`,
  verify: `# /slx:verify

Run only the module's declared deterministic test command and verify test-file SHA-256 integrity. Only SpecLearn verification can mark a module completed.`,
} as const;

export function guardedContent(extraLines: string[] = []): string {
  return [
    "## SpecLearn Guardrails",
    "- SpecLearn CLI commands are deterministic and make no LLM API calls.",
    "- Preserve existing user-authored content outside SpecLearn managed markers.",
    "- Use `/slx:propose`, `/slx:start`, `/slx:explain`, and `/slx:verify` for structured learning workflows.",
    "- Only deterministic verification may mark modules completed.",
    ...extraLines,
  ].join("\n");
}

export function managedSection(extraLines: string[] = []): string {
  return `${MANAGED_START}\n${guardedContent(extraLines)}\n${MANAGED_END}`;
}
