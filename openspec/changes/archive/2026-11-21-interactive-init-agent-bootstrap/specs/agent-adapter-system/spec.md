# Spec Delta

## MODIFIED Requirements

### Requirement: Core slash commands
Every built-in adapter SHALL generate complete `propose`, `start`, `explain`, and `verify` slash-command experiences under the `/slx` namespace.

#### Scenario: Claude Code commands are generated
- **WHEN** Claude Code is selected
- **THEN** the adapter SHALL write `.claude/commands/slx/propose.md`, `start.md`, `explain.md`, and `verify.md`
- **AND** SHALL include language mirroring, sandbox, Socratic, scratchpad, and deterministic verification instructions

#### Scenario: GitHub Copilot commands are generated
- **WHEN** GitHub Copilot is selected
- **THEN** the adapter SHALL write `.github/prompts/slx-propose.prompt.md`, `slx-start.prompt.md`, `slx-explain.prompt.md`, and `slx-verify.prompt.md`
- **AND** SHALL include the same complete SDL behavior and managed guardrails

#### Scenario: Gemini CLI commands are generated
- **WHEN** Antigravity (formerly Gemini CLI) is selected
- **THEN** the adapter SHALL maintain native `/slx:*` command representations under `.gemini/commands/`

#### Scenario: Antigravity commands are generated
- **WHEN** Antigravity is selected
- **THEN** the adapter SHALL write native `/slx:*` command representations under `.gemini/commands/`
- **AND** SHALL write managed guardrails to `ANTIGRAVITY.md`
- **AND** SHALL include the complete SDL workflow and language mirroring rules

#### Scenario: Cursor rules are generated
- **WHEN** Cursor is selected
- **THEN** the adapter SHALL write `.cursor/rules/speclearn.mdc` containing the complete `/slx` command behavior and system guardrails

#### Scenario: Generic agent skills are generated
- **WHEN** Generic Agent is selected
- **THEN** the adapter SHALL write standalone skills with YAML frontmatter under `.agents/skills/slx-propose/SKILL.md`, `.agents/skills/slx-start/SKILL.md`, `.agents/skills/slx-explain/SKILL.md`, and `.agents/skills/slx-verify/SKILL.md`
- **AND** SHALL write managed system guardrails to `AGENTS.md`
