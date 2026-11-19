# Proposal

## Why

SpecLearn needs an official, machine-readable course format before higher-level compilation and verification features can be implemented. A strict Zod model and dual-format parser will give the CLI a deterministic source of truth for Markdown and YAML courses while producing IDE-compatible JSON Schema metadata.

## What Changes

- Add the versioned `COURSE-SPEC` data model for course metadata, context sources, harness rules, modules, prerequisites, and verification commands.
- Add custom structural validation for kebab-case identifiers, unknown prerequisites, and circular module dependencies.
- Add a dual-format loader that accepts Markdown with YAML frontmatter and pure YAML, adding the Markdown body as the pedagogical guide.
- Export a versioned JSON Schema for IDE autocomplete and validation.
- Add a `speclearn validate <path>` command with formatted, deterministic error reporting.
- Modify the existing CLI entrypoint behavior to include the validation subcommand and its test coverage.

## Capabilities

### New Capabilities
- `course-spec-format`: Defines the official course document model, dual-format loading behavior, DAG integrity, and generated JSON Schema output.

### Modified Capabilities
- `cli-entrypoint`: The CLI gains a validation command that accepts a course file path and reports success or structured schema and DAG errors.

## Impact

- Adds Zod, gray-matter, and zod-to-json-schema dependencies.
- Adds `src/schema/course-spec.ts`, `src/parser/load-spec.ts`, and parser tests.
- Adds `schemas/course-spec.v1.schema.json` for IDE integration.
- Extends `src/cli.ts` with `validate` command behavior and relevant error presentation.
- No course compilation, verification execution, progress persistence, or LLM behavior is included in this change.
