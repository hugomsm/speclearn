# Proposal

## Why

Initializing SpecLearn currently provides a minimal terminal multiselect experience that lacks clear terminal framing, context awareness, and visual feedback. Additionally, while SpecLearn provides dedicated adapters for specific environments (Claude Code, GitHub Copilot, Antigravity, and Cursor), developers using other AI coding agents or extensible agent harnesses need a standardized, open mechanism to load SpecLearn pedagogical skills and guardrails into their workspace. 

By supporting a generic agent adapter targeting standard `.agents/skills/` directories alongside rich interactive terminal auto-detection, SpecLearn becomes universally compatible with any coding agent.

## What Changes

- **Universal Generic Agent Adapter**: Introduce a built-in `generic` adapter that outputs individual skill files under `.agents/skills/slx-<command>/SKILL.md` (with standard YAML metadata and markdown guidance) and manages global agent guardrails in `AGENTS.md`.
- **Clack Terminal Framing**: Add `clack.intro()` and structured headers to interactive `speclearn init` so the terminal UI renders with clean borders and consistent layout.
- **Workspace Agent Auto-Detection**: Inspect the repository directory tree for existing agent directories (`.claude/`, `.github/`, `.gemini/`, `.cursor/`, `.agents/`) and preselect matching agents as defaults in the interactive multiselect prompt.
- **Visual Destination Hints**: Enrich the multiselect prompt options with destination hints showing developers where native skills and slash commands will be bootstrapped (e.g., `.claude/commands/slx/`, `.github/prompts/`, `.cursor/rules/`, `.gemini/commands/`, `.agents/skills/`).
- **Bootstrap Progress Spinner**: Introduce animated progress indicators using `clack.spinner()` while writing adapter commands and guardrails into the workspace.
- **Universal Compatibility Documentation**: Update project documentation and the README to highlight that SpecLearn supports any coding agent through dedicated adapters and universal skill directories.
- **Specification Alignment**: Formalize the interactive initialization requirements in `project-bootstrap` and ensure `agent-adapter-system` requirements reflect both `antigravity` and `generic` adapters.

## Capabilities

### Modified Capabilities
- `project-bootstrap`: Adds workspace assistant auto-detection (including `.agents/`), enriched interactive prompts with preselection and destination hints, and visual bootstrap progress indicators.
- `agent-adapter-system`: Adds the `generic` agent adapter generating standardized `.agents/skills/` skill packages and `AGENTS.md` guardrails, alongside `claude`, `copilot`, `antigravity`, and `cursor`.

## Impact

- Adapter architecture (`src/adapters/builtins.ts`, `src/adapters/types.ts`, `src/adapters/index.ts`).
- CLI entrypoint (`src/cli.ts`) and initialization module (`src/init/initialize.ts`).
- Project documentation (`README.md`).
- Non-interactive mode (`speclearn init --agents ... --yes`) remains fully backward-compatible and deterministic.
