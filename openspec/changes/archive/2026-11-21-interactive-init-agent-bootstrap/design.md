# Design

## Context

The current `speclearn init` action in `src/cli.ts` provides basic interactive functionality via `@clack/prompts`, but omits the `clack.intro()` frame, does not inspect the workspace for existing agent configurations, displays no hints regarding generated file locations, and performs adapter writes without progress feedback. Furthermore, SpecLearn only provides adapters for specific tools, leaving developers using other or generic coding agents without a standard skill bootstrap mechanism.

See `proposal.md` for background and motivation.

## Goals / Non-Goals

**Goals:**
- Provide a structured Clack terminal frame (`clack.intro` / `clack.outro`) for interactive `speclearn init`.
- Introduce a built-in `generic` agent adapter that writes skills to `.agents/skills/slx-<command>/SKILL.md` and guardrails to `AGENTS.md`.
- Detect existing AI coding assistant configurations in the repository (including `.agents/`) and preselect them in the interactive checklist.
- Provide descriptive destination hints on each selectable option in `clack.multiselect`.
- Display animated progress feedback with `clack.spinner()` while writing adapter skills and guardrails.
- Highlight universal coding agent compatibility in `README.md`.
- Maintain complete determinism and backward compatibility for headless/CI invocations (`--agents` with `--yes`).

**Non-Goals:**
- Modifying the underlying `AgentAdapter` interface contract in `src/adapters/types.ts`.
- Adding new third-party dependencies (the feature relies exclusively on `@clack/prompts` and `picocolors`).
- Auto-installing or configuring external CLI binaries.

## Decisions

### 1. Generic Agent Adapter Architecture
- **Decision**: Implement `genericAdapter` in `src/adapters/builtins.ts` with identifier `generic` and label `Generic Agent (.agents/skills)`.
- **Output Structure**:
  - `.agents/skills/slx-propose/SKILL.md`
  - `.agents/skills/slx-start/SKILL.md`
  - `.agents/skills/slx-explain/SKILL.md`
  - `.agents/skills/slx-verify/SKILL.md`
  - `AGENTS.md` (root guardrails using `managedSection()`)
- **Skill Format**: Each skill includes standard YAML frontmatter with `name` and `description` followed by the command template:
  ```markdown
  ---
  name: slx-<command>
  description: <short summary of command purpose>
  ---
  
  <command template content>
  ```
- **Rationale**: The `.agents/skills/<skill-name>/SKILL.md` layout is the open, directory-based convention supported by modern coding agents, enabling any compatible agent to discover SpecLearn skills automatically.

### 2. Workspace Agent Auto-Detection Helper
- **Decision**: Create an exported utility function `detectWorkspaceAgents(projectRoot: string): Promise<string[]>` in `src/init/initialize.ts`. It tests for the existence of:
  - `.claude` -> `"claude"`
  - `.github` -> `"copilot"`
  - `.gemini` -> `"antigravity"`
  - `.cursor` -> `"cursor"`
  - `.agents` -> `"generic"`
- **Rationale**: Keeps detection testable and reusable, decoupling file-system inspection from prompt rendering.

### 3. Multi-Select Configuration with Hints and Initial Values
- **Decision**: Supply `initialValues: detectedAgents` and explicit `hint` strings to `clack.multiselect`:
  - `claude`: `hint: ".claude/commands/slx/"`
  - `copilot`: `hint: ".github/prompts/"`
  - `antigravity`: `hint: ".gemini/commands/ & ANTIGRAVITY.md"`
  - `cursor`: `hint: ".cursor/rules/speclearn.mdc"`
  - `generic`: `hint: ".agents/skills/ & AGENTS.md"`
- **Rationale**: Developers immediately see where skills and guardrails will be generated before confirming with `Space` and `Enter`.

### 4. Progressive Bootstrap Feedback with Clack Spinner
- **Decision**: In `src/cli.ts`, instantiate `const s = clack.spinner(); s.start("Bootstrapping agent skills and guardrails...");` before executing `initializeWorkspace`, then `s.stop(...)` with a summary of initialized adapters.
- **Rationale**: Gives visual feedback that work is being performed rather than freezing the prompt briefly.

## Risks / Trade-offs

- **[Risk] Terminal without TTY running interactive path** → **Mitigation**: Preserve `if (process.stdin.isTTY && !options.yes)` guards so non-interactive or piped environments do not hang waiting for keyboard input.
- **[Risk] Multiple agent adapters selected together** → **Mitigation**: Adapters operate on independent directories and independent root guardrail files (`CLAUDE.md`, `ANTIGRAVITY.md`, `AGENTS.md`, `.github/copilot-instructions.md`), making multi-selection completely conflict-free.
