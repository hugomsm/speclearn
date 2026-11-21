# Spec Delta

## MODIFIED Requirements

### Requirement: Interactive initialization
The CLI SHALL provide an interactive `init` command that uses terminal prompts with assistant auto-detection, keyboard selection, and visual progress feedback to create the local SpecLearn workspace.

#### Scenario: User initializes interactively
- **WHEN** the user runs `speclearn init` in an interactive terminal
- **THEN** the CLI SHALL display a structured initialization header
- **AND** SHALL inspect the workspace for existing agent directories (`.claude/`, `.github/`, `.gemini/`, `.cursor/`, `.agents/`)
- **AND** SHALL present supported coding-agent choices with detected agents preselected
- **AND** SHALL display destination path hints for each agent option
- **AND** SHALL show progress feedback while bootstrapping selected adapters
- **AND** SHALL create only the adapters selected by the user

#### Scenario: Interactive selection is cancelled
- **WHEN** the user cancels or declines initialization
- **THEN** the CLI SHALL leave the workspace unchanged and SHALL exit without reporting a successful initialization

### Requirement: Non-interactive initialization
The CLI SHALL support `--agents` with a comma-separated agent list and `--yes` for unattended initialization.

#### Scenario: Supported agents are declared
- **WHEN** the user runs `speclearn init --agents claude,copilot,antigravity,cursor,generic --yes`
- **THEN** the CLI SHALL initialize the workspace and generate outputs for every supported selected agent

#### Scenario: Unsupported agent is declared
- **WHEN** the `--agents` value contains an unknown agent identifier
- **THEN** the CLI SHALL reject the initialization with a clear list of supported identifiers
