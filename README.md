# SpecLearn

**Spec-Driven Learning (SDL) for Coding Agents**

SpecLearn turns coding agents into structured learning mentors inside an IDE. It provides a deterministic TypeScript CLI foundation for authoring, compiling, validating, and verifying spec-driven learning experiences across agent harnesses.

The CLI is designed to work with tools such as Claude Code, GitHub Copilot, Cursor, and other coding-agent environments without requiring LLM API calls from the SpecLearn binary itself.

## Status

This repository is in active foundation development. The current package provides the initial `speclearn` executable, banner and help output, TypeScript build tooling, smoke tests, repository governance, and release automation.

Course parsing, agent adapters, verification, and persistent learning progress are planned capabilities and are not yet part of the initial CLI.

## Requirements

- Node.js 20 or newer
- pnpm 10 or newer

## Installation

Install the package from npm:

```sh
npm install --global speclearn
```

Or run it with pnpm:

```sh
pnpm dlx speclearn
```

## Usage

Display help:

```sh
speclearn --help
```

Display the installed CLI version:

```sh
speclearn --version
```

Run the CLI without arguments to display the SpecLearn banner and help:

```sh
speclearn
```

Validate a course document in Markdown or YAML format:

```sh
speclearn validate ./courses/typescript.course.md
speclearn validate ./courses/typescript.course.yaml
```

Markdown courses use YAML frontmatter and the Markdown body as the pedagogical guide. Pure `.course.yaml` and `.yml` files use the same COURSE-SPEC model.

The IDE-compatible JSON Schema is published at `schemas/course-spec.v1.schema.json`.

## Local Development

Clone the repository and install dependencies:

```sh
pnpm install
```

Available commands:

```sh
pnpm dev        # Watch and rebuild the CLI
pnpm build      # Build dist/cli.js
pnpm test       # Run Vitest
pnpm lint       # Run ESLint
pnpm typecheck  # Run strict TypeScript checks
pnpm format     # Format the repository with Prettier
```

After building, exercise the generated executable:

```sh
node dist/cli.js --help
node dist/cli.js --version
node dist/cli.js
```

## Spec-Driven Development

SpecLearn uses OpenSpec to plan and document behavior changes.

- Existing specifications live under `openspec/specs/`.
- Active and archived changes live under `openspec/changes/`.
- Use a single active change for each cohesive implementation scope.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the proposal, validation, implementation, and archive workflow.

## Project Principles

- **Deterministic:** The CLI does not make LLM API calls.
- **Strict TypeScript:** The package uses Node.js 20+, strict ESM TypeScript, tsup, and Vitest.
- **Multi-agent:** The project is designed to generate native workflows for multiple coding-agent harnesses.
- **Verifiable:** Verification behavior is intended to run deterministic commands and validate test integrity.
- **Brand neutral:** Core concepts and core repositories avoid proprietary or company-specific dependencies.

## Repository Structure

```text
src/                   CLI source code
tests/                 Automated tests
schemas/               Distributed SpecLearn schema resources
openspec/specs/        Current specifications
openspec/changes/      Active and archived change plans
.github/               CI, issue templates, and pull request templates
.changeset/            Semantic release metadata
```

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md), follow the Code of Conduct, and use the issue and pull request templates.

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Contributor Guide](CONTRIBUTING.md)

## License

SpecLearn is released under the [MIT License](LICENSE).
