# Tasks

## 1. Generic Agent Adapter & Skills

- [x] 1.1 Implement `genericAdapter` in `src/adapters/builtins.ts` generating `.agents/skills/slx-<command>/SKILL.md` with frontmatter and `AGENTS.md` guardrails
- [x] 1.2 Update `BuiltInAgentId` in `src/adapters/types.ts` to include `"generic"` and register `genericAdapter` in `src/adapters/index.ts`
- [x] 1.3 Add unit tests in `tests/adapters.test.ts` verifying `generic` adapter outputs, directory layout, and YAML frontmatter

## 2. Workspace Agent Detection

- [x] 2.1 Implement `detectWorkspaceAgents(projectRoot: string): Promise<string[]>` in `src/init/initialize.ts` checking for `.claude`, `.github`, `.gemini`, `.cursor`, and `.agents`
- [x] 2.2 Add unit tests for `detectWorkspaceAgents` in `tests/init.test.ts` verifying detection of present and absent agent configurations
- [x] 2.3 Update `parseAgentIds` in `src/init/initialize.ts` to support `"generic"` as a valid agent identifier

## 3. Interactive Terminal UI Enhancement

- [x] 3.1 Update `src/cli.ts` `init` action to call `clack.intro()` and establish proper Clack framing
- [x] 3.2 Update `clack.multiselect` options to include `generic`, descriptive `hint` properties, and set `initialValues` from `detectWorkspaceAgents`
- [x] 3.3 Wrap adapter application in `clack.spinner()` with informative start and stop status messages
- [x] 3.4 Verify non-interactive execution (`--agents` with `--yes`) continues to run deterministically without prompting

## 4. Documentation & Universal Support

- [x] 4.1 Update `README.md` to highlight universal coding agent support through dedicated adapters and `.agents/skills/` generic mode

## 5. Verification and Regression Testing

- [x] 5.1 Run `pnpm typecheck` and `pnpm lint` to ensure zero type errors or warnings
- [x] 5.2 Run `pnpm test` and `pnpm build` to verify all unit, integration, and CLI tests pass cleanly
