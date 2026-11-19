# Design

## Context

The repository currently contains documentation and OpenSpec configuration but no application source or package metadata. The implementation therefore starts from an intentionally minimal TypeScript ESM package and should preserve the project constraints in `openspec/config.yaml`. See `proposal.md` for the motivation and scope.

## Goals / Non-Goals

**Goals:**
- Establish a reproducible pnpm-based Node.js 20+ package foundation.
- Build one deterministic ESM CLI executable with a stable basic interface.
- Add automated quality, governance, and semantic release conventions.
- Keep the initial implementation small enough to validate before feature work.

**Non-Goals:**
- Implement course parsing, agent compilation, verification, or progress persistence.
- Make any LLM API calls or introduce framework-specific runtime integrations beyond project dependencies.
- Add a persistent configuration system or subcommand functionality beyond the initial help experience.

## Decisions

- **Use pnpm with Node.js engine and package metadata:** The root `package.json` will use ESM, declare Node.js `>=20.0.0`, expose `speclearn` as `dist/cli.js`, and publish only the runtime distribution and required documentation and schemas. This aligns the package with the specified toolchain and avoids accidental source-file publication.
- **Use tsup for a single CLI bundle:** `tsup.config.ts` will bundle `src/cli.ts` as ESM, emit `dist/cli.js`, and prepend `#!/usr/bin/env node`. The CLI remains deterministic and easy to distribute. `tsup` is preferred over direct `tsc` emission because it produces a self-contained executable-oriented bundle.
- **Use strict TypeScript with explicit module settings:** `tsconfig.json` will enable strict checking and Node-compatible ESM resolution. It will also exclude build outputs and test-only dependencies from production emission while allowing Vitest and source imports to typecheck coherently.
- **Compose the CLI from small established libraries:** Commander owns arguments and help, Clack supplies terminal presentation primitives, and picocolors supplies portable ANSI styling. The initial CLI will have no network or filesystem behavior beyond normal process startup and help rendering.
- **Use Vitest for executable smoke coverage:** `tests/cli.test.ts` will verify loading or invocation behavior and basic output without depending on external services. A small exported CLI setup may be used to make help output testable, while `src/cli.ts` remains the executable entrypoint.
- **Centralize quality scripts:** `build`, `dev`, `test`, `lint`, `format`, and `typecheck` scripts will use the repository's chosen pnpm tools. For initial implementation, linting and formatting may use Biome or ESLint + Prettier, but the selected tool must be pinned and CI must invoke the same scripts.
- **CI validates a supported runtime matrix:** The CI workflow will run install, lint, typecheck, build, and Vitest on Node.js 20 and 22. Matrix coverage will catch both the minimum supported runtime and the next active LTS line.
- **Changesets owns package release metadata:** `.changeset/config.json` will define the package versioning and publishing configuration. Release automation will remain separate from CI and require repository secrets for npm publication.
- **Governance files are repository contracts:** MIT, Contributor Covenant v2.1, security guidance, and GitHub templates are checked as repository assets rather than runtime code. Their acceptance is structural and linked from contribution guidance.

## Risks / Trade-offs

- **Tool choice ambiguity** → The design permits Biome or ESLint + Prettier, but implementation tasks will require selecting one and documenting the exact scripts to avoid CI/local drift.
- **Banner rendering across terminals** → ASCII-only output and picocolors will reduce terminal incompatibility; color will degrade cleanly when unsupported.
- **Changesets release credentials** → Without npm credentials, maintainers cannot publish; CI will validate and build, while release execution remains secret-gated.
- **Minimal CLI contract** → An intentionally limited initial interface may be expanded later; the smoke test will protect the initial banner and help behavior rather than broad assumptions.

## Migration Plan

No migration is needed because this change establishes the first package foundation. If contributors have local uncommitted source outside OpenSpec, implementation will add files without overwriting or moving existing repository data. Existing MIT, README, and workflow files will be reviewed rather than replaced without need.

## Open Questions

None. Tool-family implementation details are small enough to be resolved in the implementation tasks while satisfying the named stack and scripts.
