# SpecLearn

**Spec-Driven Learning (SDL) for Coding Agents**

SpecLearn turns coding agents into structured learning mentors inside an IDE. It provides a deterministic TypeScript CLI foundation for authoring, compiling, validating, and verifying spec-driven learning experiences across agent harnesses.

The CLI is designed to work with tools such as Claude Code, GitHub Copilot, Cursor, and other coding-agent environments without requiring LLM API calls from the SpecLearn binary itself.

## Status

This repository is in active foundation development. The current package provides the initial `speclearn` executable, banner and help output, TypeScript build tooling, smoke tests, repository governance, and release automation.

Course parsing, agent adapters, verification, and persistent learning progress are planned capabilities and are not yet part of the initial CLI.

## Requirements

- Node.js 24 or newer
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

Initialize SpecLearn in the current repository:

```sh
speclearn init
```

For unattended setup, select supported agents explicitly:

```sh
speclearn init --agents claude,copilot,gemini,cursor --yes
```

Initialization creates `.speclearn/specs/`, `.speclearn/state/`, `.speclearn/scratchpad/`, and `.speclearn/config.yaml`. It also updates `.gitignore` so state and scratchpad files remain local while specifications stay trackable.

Show local learning progress:

```sh
speclearn status
```

Supported adapters are Claude Code, GitHub Copilot, Gemini CLI, and Cursor. Community adapters can implement the `AgentAdapter` interface in `src/adapters/` and register through the adapter registry.

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
- **Strict TypeScript:** The package uses Node.js 24+, strict ESM TypeScript, tsup, and Vitest.
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

## Spec-Driven Learning skills

The initialized agent adapters expose the `/slx:*` workflows:

- `/slx:propose` — inspect the repository and create a valid course specification
- `/slx:start` — measure, plan, and scaffold the active learning module
- `/slx:explain [concept]` — use an isolated example in `.speclearn/scratchpad/`
- `/slx:verify` — validate tests and test-file integrity before completion

All mentoring is mirrored to the student's or active course's language while framework identifiers remain English.

Start a course with safe sandbox isolation:

```sh
speclearn start ./courses/typescript.course.yaml
```

Record demonstrated mastery without marking the module as deterministically completed:

```sh
speclearn skip types-and-values
```

Lock a module's test files before starting work:

```sh
speclearn lock-tests types-and-values
```

Run deterministic verification:

```sh
speclearn verify types-and-values
```

Verification only completes a module when the test command exits with code 0 and every locked test file still matches its SHA-256 hash. Direct edits to `progress.json` cannot mark a module completed.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md), follow the Code of Conduct, and use the issue and pull request templates.

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Contributor Guide](CONTRIBUTING.md)

## License

SpecLearn is released under the [MIT License](LICENSE).
