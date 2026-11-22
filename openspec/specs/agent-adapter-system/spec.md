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

#### Scenario: Scannable template length contract
- **WHEN** any adapter emits `/slx:*` command prompt templates
- **THEN** each template SHALL maintain a concise, scannable length between approximately 35 and 50 lines that provides clear operational guardrails without bureaucratic verbosity

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

#### Scenario: Deduplicated shared guardrails
- **WHEN** adapters render managed sections and template footers
- **THEN** universal language mirroring and framework guardrails SHALL be deduplicated and shared cleanly across templates and managed sections

### Requirement: Consistent mentor tone across adapters
All adapter-generated prompt files SHALL use the same terminology and voice so the agent sounds consistent regardless of which coding tool the student uses.

#### Scenario: Terminology is consistent across adapters
- **WHEN** the same SLX command template is applied to different adapters
- **THEN** every adapter output SHALL use `Socratic mentor rules` instead of `pedagogical harness`, `learning path` instead of `progress graph`, `business rules and edge cases` instead of `system invariants`, and `tamper-proof test verification` instead of `SHA-256 integrity` in user-facing strings

#### Scenario: Framework terms are preserved
- **WHEN** any adapter generates command files
- **THEN** `Spec-Driven Learning (SDL)` and `COURSE-SPEC` SHALL appear unchanged as immutable framework terms
