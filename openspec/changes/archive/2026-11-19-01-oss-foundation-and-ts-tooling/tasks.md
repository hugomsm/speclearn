# Tasks

## 1. Package and Build Foundation

- [x] 1.1 Create `package.json` with ESM mode, Node.js 20+ engine, `speclearn` binary, `dist`, `schemas`, README, and license file publishing metadata, then verify with `pnpm install` and package metadata inspection.
- [x] 1.2 Add pinned TypeScript, tsup, Vitest, CLI, quality, and Changesets dependencies plus `build`, `dev`, `test`, `lint`, `format`, and `typecheck` scripts, then verify `pnpm install --frozen-lockfile` succeeds.
- [x] 1.3 Create strict `tsconfig.json` and `tsup.config.ts`; configure the build to emit `dist/cli.js` as ESM with a Node shebang, then verify `pnpm build` creates the executable bundle.

## 2. CLI Entry Point

- [x] 2.1 Implement `src/cli.ts` with Commander, Clack-compatible terminal presentation, and picocolors; verify `--help` and no-argument invocation match the CLI contract.
- [x] 2.2 Add the SpecLearn ASCII banner and package version output to the CLI, then verify invocation renders the banner and version in a terminal.
- [x] 2.3 Add `tests/cli.test.ts` smoke coverage for entrypoint loading, help output, and basic no-argument behavior; verify `pnpm test` passes.

## 3. Repository Governance

- [x] 3.1 Review and retain the MIT `LICENSE` with a complete standard text and copyright notice, then verify the license file remains present and readable.
- [x] 3.2 Create `CONTRIBUTING.md` covering pnpm setup, build/test commands, OpenSpec proposal and apply workflow, and Conventional Commits, then verify the documented commands execute successfully.
- [x] 3.3 Create `CODE_OF_CONDUCT.md` from Contributor Covenant v2.1 and create `SECURITY.md` with a clear private vulnerability reporting route, then verify both files are linked or discoverable.
- [x] 3.4 Create `.github/ISSUE_TEMPLATE/bug_report.yml`, `feature_request.yml`, `agent_adapter.yml`, and `.github/PULL_REQUEST_TEMPLATE.md`, then verify the YAML templates parse and required fields are present.

## 4. CI and Release Automation

- [x] 4.1 Create `.github/workflows/ci.yml` to run dependency install, lint, typecheck, build, and Vitest on Node.js 20 and 22, then verify workflow syntax and successful local-equivalent commands.
- [x] 4.2 Configure `.changeset/config.json` for the SpecLearn package and npm publishing, then verify Changesets recognizes the package and can create a pending changeset.
- [x] 4.3 Add release-safe package metadata and any release workflow wiring required by Changesets, then verify the publish artifact contains `dist/cli.js`, `schemas`, README, and LICENSE as intended.

## 5. Integration Verification

- [x] 5.1 Run the full local quality sequence with `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test`, and verify all commands complete successfully.
- [x] 5.2 Exercise the built executable on Node.js 20 and Node.js 22 where available, and verify `speclearn --help` plus no-argument behavior match the specs.
- [x] 5.3 Review the repository diff against all delta specs and proposal scope, and verify no course, verification, or LLM feature work was added outside this foundation change.

## Workflow follow-up

- Archive this change after implementation review and validation are complete.
- Verify the archived result and synchronize delta specs into the main OpenSpec specs only when requested.
