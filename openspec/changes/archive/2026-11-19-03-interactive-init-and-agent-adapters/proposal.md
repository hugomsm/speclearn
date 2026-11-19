# Proposal

## Why

SpecLearn has an executable and an official course format, but a new project still lacks a bootstrap workflow, agent-native instruction files, and persistent learning state. This change establishes the local experience that makes the framework usable across coding-agent harnesses without moving verification or compilation into an LLM-dependent runtime.

## What Changes

- Add an interactive `speclearn init` command using Clack prompts for agent selection and a deterministic non-interactive mode with `--agents` and `--yes`.
- Create the `.speclearn` directory layout and idempotently update `.gitignore` so state and scratchpad data remain local while specifications remain trackable.
- Introduce an extensible `AgentAdapter` architecture in `src/adapters/` and built-in support for Claude Code, GitHub Copilot, Gemini CLI, and Cursor.
- Generate the four `/slx:*` slash command experiences—`propose`, `start`, `explain`, and `verify`—and managed system guardrails in each adapter's native format.
- Add local progress state with active course, sandbox location, module states, test file hashes, and completion timestamps.
- Add `speclearn status` with terminal progress and dependency-tree output.
- Modify the existing CLI entrypoint behavior to include `init` and `status` commands and their command-level tests.

## Capabilities

### New Capabilities
- `project-bootstrap`: Defines interactive and non-interactive local repository initialization, directory creation, configuration, and `.gitignore` behavior.
- `agent-adapter-system`: Defines the adapter interface and native output for Claude Code, GitHub Copilot, Gemini CLI, and Cursor, including `/slx` commands and managed guardrails.
- `learning-progress-state`: Defines persisted module and sandbox state, test-file integrity metadata, and terminal progress rendering.

### Modified Capabilities
- `cli-entrypoint`: The CLI gains `init` and `status` commands while preserving banner and help behavior.

## Impact

- Adds initialization and adapter implementations under `src/adapters/` and local state logic under `src/state/`.
- Extends `src/cli.ts` with interactive and non-interactive command handling.
- Creates `.speclearn/` runtime data conventions and updates `.gitignore`.
- Adds unit and integration tests for initialization, adapter output, state persistence, and status rendering.
- Does not execute test commands, update completion state, compile courses, or make LLM API calls in this foundation change.
