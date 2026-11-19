# Tasks

## 1. Dependencies and Schema Foundation

- [x] 1.1 Add `zod`, `zod-to-json-schema`, `gray-matter`, and YAML parsing dependencies to `package.json`, update the lockfile, and verify `pnpm install --frozen-lockfile` succeeds.
- [x] 1.2 Implement `src/schema/course-spec.ts` with root fields, context sources, harness defaults, module fields, and Zod type exports, then verify strict typechecking succeeds.
- [x] 1.3 Add course and module identifier refinements plus positive duration and non-empty test command validation, then verify parser unit tests cover invalid field values.
- [x] 1.4 Add module prerequisite-reference and directed-acyclic-graph refinements, then verify unknown prerequisites and cycles produce field-specific errors.

## 2. Dual-Format Parser

- [x] 2.1 Implement `src/parser/load-spec.ts` for Markdown frontmatter and Markdown body parsing with gray-matter, then verify a valid `.course.md` test loads successfully.
- [x] 2.2 Add pure YAML loading for `.course.yaml` and `.yml`, then verify YAML tests return the same Zod-validated course shape.
- [x] 2.3 Normalize file access and parse errors into readable loader errors, then verify missing files and malformed YAML or frontmatter are rejected clearly.
- [x] 2.4 Add `tests/parser.test.ts` coverage for valid Markdown, valid YAML, missing fields, unknown prerequisites, and cyclic DAGs, then verify `pnpm test` passes.

## 3. JSON Schema and CLI Validation

- [x] 3.1 Generate `schemas/course-spec.v1.schema.json` using `zod-to-json-schema`, then verify it is valid JSON and includes enums and defaults.
- [x] 3.2 Add the Commander `validate <path>` command and reusable formatted error output through Clack or picocolors, then verify valid and invalid invocations return appropriate status codes.
- [x] 3.3 Document the COURSE-SPEC input formats and validation command in `README.md`, then verify the documented commands execute successfully.
- [x] 3.4 Extend CLI smoke coverage for `validate --help` and validation command registration, then verify the CLI tests pass.

## 4. Integration Verification

- [x] 4.1 Run lint, typecheck, build, and test commands, and verify all complete successfully.
- [x] 4.2 Exercise `speclearn validate` against representative valid Markdown and YAML files plus missing-field and cyclic DAG fixtures, and verify success and failure output is formatted clearly.
- [x] 4.3 Review the change against the proposal and delta specs, and verify no compilation, progress, or LLM implementation behavior was added outside scope.

## Workflow follow-up

- Archive this change after implementation review and validation are complete.
