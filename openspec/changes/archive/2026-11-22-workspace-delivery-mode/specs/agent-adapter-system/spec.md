# Spec Delta

## MODIFIED Requirements

### Requirement: Core slash commands
Every built-in adapter SHALL generate complete `propose`, `start`, `explain`, and `verify` slash-command experiences under the `/slx` namespace using plain, approachable language that sounds like a pragmatic senior teammate rather than an academic textbook.

#### Scenario: Claude Code commands are generated
- **WHEN** Claude Code is selected
- **THEN** the adapter SHALL write `.claude/commands/slx/propose.md`, `start.md`, `explain.md`, and `verify.md`
- **AND** SHALL include language mirroring, sandbox and workspace delivery modes, mode announcement and session overrides, Socratic mentor rules, scratchpad isolation, and tamper-proof test verification instructions using plain developer language

#### Scenario: GitHub Copilot commands are generated
- **WHEN** GitHub Copilot is selected
- **THEN** the adapter SHALL write `.github/prompts/slx-propose.prompt.md`, `slx-start.prompt.md`, `slx-explain.prompt.md`, and `slx-verify.prompt.md`
- **AND** SHALL include the same complete SDL behavior, mode announcement, and managed guardrails using plain developer language

#### Scenario: Antigravity commands are generated
- **WHEN** Antigravity is selected
- **THEN** the adapter SHALL write native `/slx:*` command representations under `.gemini/commands/`
- **AND** SHALL write managed guardrails to `ANTIGRAVITY.md`
- **AND** SHALL include the complete SDL workflow, mode announcement, session overrides, and language mirroring rules using plain developer language

#### Scenario: Cursor rules are generated
- **WHEN** Cursor is selected
- **THEN** the adapter SHALL write `.cursor/rules/speclearn.mdc` containing the complete `/slx` command behavior, mode announcement, session overrides, and system guardrails using plain developer language

#### Scenario: Generic agent skills are generated
- **WHEN** Generic Agent is selected
- **THEN** the adapter SHALL write standalone skills with YAML frontmatter under `.agents/skills/slx-propose/SKILL.md`, `.agents/skills/slx-start/SKILL.md`, `.agents/skills/slx-explain/SKILL.md`, and `.agents/skills/slx-verify/SKILL.md`
- **AND** SHALL write managed system guardrails to `AGENTS.md` using plain developer language

### Requirement: Managed guardrails
Adapter output SHALL include system guardrails that prohibit LLM API calls inside the CLI binary, enforce scratchpad isolation, and require deterministic verification behavior.

#### Scenario: Generated adapter files are inspected
- **WHEN** an adapter writes command or instruction files
- **THEN** the output SHALL explain the `/slx:propose`, `/slx:start`, `/slx:explain`, and `/slx:verify` behavior and SHALL direct verification through the SpecLearn verifier

#### Scenario: Managed section is updated
- **WHEN** initialization or adapter regeneration runs again
- **THEN** the adapter SHALL replace only its managed marker-bounded section and SHALL preserve user-authored content outside that section

#### Scenario: Scratchpad isolation is enforced
- **WHEN** an adapter generates command or guardrail files
- **THEN** the instructions SHALL strictly confine temporary files to `.speclearn/scratchpad/` and prohibit creating temporary files in production directories
