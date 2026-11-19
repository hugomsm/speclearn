# Proposal

## Why

SpecLearn needs a minimal, production-ready Node.js and TypeScript repository foundation before feature implementation can begin. Establishing a consistent CLI entrypoint, contributor standards, quality automation, and release tooling now reduces setup friction and prevents divergent project conventions.

## What Changes

- Configure SpecLearn as an ESM Node.js package for Node.js 20 or newer.
- Add a TypeScript build pipeline with tsup and a bundled `speclearn` executable entrypoint.
- Provide an initial CLI that renders the SpecLearn ASCII banner and help metadata, and add a smoke test.
- Establish MIT licensing, community governance documents, GitHub issue and pull request templates, CI quality checks, and Changesets-based semantic releases.
- Add package scripts for development, build, tests, linting, formatting, and typechecking.

## Capabilities

### New Capabilities

- `cli-entrypoint`: Defines the initial executable behavior, including ESM package exposure, version metadata, banner presentation, and help output.
- `repository-governance`: Defines the repository-level contributor, conduct, security, issue, and pull request expectations published for maintainers and contributors.
- `automated-quality-releases`: Defines CI validation across supported Node.js versions and Changesets-managed semantic versioning and publishing.

### Modified Capabilities

- None.

## Impact

- Creates or updates root package and TypeScript configuration files, source and test directories, and release configuration.
- Adds repository governance and GitHub automation files.
- Introduces development dependencies for Commander, Clack, picocolors, Vitest, tsup, TypeScript, linting and formatting tools, and Changesets.
- Does not implement course parsing, agent compilation, verification, or persistent progress behavior.
