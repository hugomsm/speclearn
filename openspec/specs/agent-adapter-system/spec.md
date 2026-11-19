# agent-adapter-system Specification

## Purpose
The agent adapter system generates native slash-command and guardrail integrations for supported coding-agent harnesses through a contributor-extensible interface.

## Requirements

### Requirement: Extensible adapter interface
The system SHALL expose a clean `AgentAdapter` interface that contributors can implement to add a new coding-agent harness.

#### Scenario: Built-in adapter is registered
- **WHEN** initialization selects a built-in agent
- **THEN** the adapter registry SHALL invoke the corresponding adapter implementation

#### Scenario: Community adapter is implemented
- **WHEN** a contributor implements the public adapter interface
- **THEN** the adapter SHALL be able to declare its identifier and write native command and guardrail outputs without modifying the core parser or state manager

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
- **WHEN** Gemini CLI is selected
- **THEN** the adapter SHALL write native `/slx:*` command representations under `.gemini/commands/`
- **AND** SHALL include the complete SDL workflow and language mirroring rules

#### Scenario: Cursor rules are generated
- **WHEN** Cursor is selected
- **THEN** the adapter SHALL write `.cursor/rules/speclearn.mdc` containing the complete `/slx` command behavior and system guardrails

### Requirement: Managed guardrails
Adapter output SHALL include system guardrails that prohibit LLM API calls inside the CLI binary and require deterministic verification behavior.

#### Scenario: Generated adapter files are inspected
- **WHEN** an adapter writes command or instruction files
- **THEN** the output SHALL explain the `/slx:propose`, `/slx:start`, `/slx:explain`, and `/slx:verify` behavior and SHALL direct verification through the SpecLearn verifier

#### Scenario: Managed section is updated
- **WHEN** initialization or adapter regeneration runs again
- **THEN** the adapter SHALL replace only its managed marker-bounded section and SHALL preserve user-authored content outside that section
