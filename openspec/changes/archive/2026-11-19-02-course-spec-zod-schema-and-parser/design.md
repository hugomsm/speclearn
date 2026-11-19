# Design

## Context

The repository currently contains a minimal ESM CLI and no course document model or parser. The proposal establishes the first formal course format without implementing compilation or verification. See `proposal.md` for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Define one strict Zod source of truth for COURSE-SPEC version 1.
- Normalize Markdown-frontmatter and YAML inputs into the same validated object shape.
- Detect structural prerequisite errors, including unknown IDs and graph cycles.
- Generate a distributable JSON Schema and expose file validation through the CLI.
- Keep parsing deterministic and independent of LLM services.

**Non-Goals:**
- Compile slash commands or agent-specific harness files.
- Execute course test commands or update learning progress.
- Implement course discovery, module selection, or interactive teaching flows.
- Add network resources or MCP runtime integrations; context sources remain declarative data.

## Decisions

- **Use Zod as the runtime and inferred TypeScript model:** `src/schema/course-spec.ts` will define reusable schemas and export an inferred course type. Zod refinements are preferable to post-parse ad hoc checks because the full validation pipeline can share one error model and one JSON Schema export.
- **Normalize both formats into a single object:** `.course.md` and `.md` inputs will use gray-matter to extract frontmatter and `content`. For YAML inputs, YAML must be parsed to a JavaScript object before Zod validation. Both paths will apply the same course schema and return the Markdown body as `pedagogical_guide` only for Markdown inputs.
- **Implement graph checks after base-field validation:** Module IDs will be validated first, then prerequisites will be checked for existence and traversed with a cycle-detection algorithm. This allows field errors and structural graph errors to remain distinguishable.
- **Use DAG validation as a Zod superRefinement:** Base module parsing should first ensure IDs and verification fields are valid, followed by prerequisite-reference and cycle refinements. The implementation may use an array-level refinement or a custom graph helper, provided the exported schema remains serializable.
- **Generate JSON Schema from Zod:** `zod-to-json-schema` will emit `schemas/course-spec.v1.schema.json` during implementation or build preparation. The JSON Schema will contain defaults and enum constraints without relying on generated TypeScript-only metadata.
- **Expose validation through Commander:** `src/cli.ts` will add a required `validate <path>` command. The command will use the shared loader, format Zod issues with field paths and readable messages through Clack, and set a non-zero exit code for failures.
- **Represent YAML parse and file errors separately:** Missing files, unreadable files, malformed YAML, and schema failures are distinct CLI outcomes. The loader and command may share result or exception types, but user-facing output must remain concise and deterministic.
- **Test behavior at loader and CLI boundaries:** Unit tests in `tests/parser.test.ts` will cover valid Markdown, valid YAML, missing fields, unknown prerequisites, cyclic graphs, and malformed input. CLI smoke coverage in `tests/cli.test.ts` will verify command discovery and exit behavior where practical.

## Risks / Trade-offs

- **gray-matter YAML parser differences** → Pin the dependencies and test frontmatter parsing with representative YAML; preserve the Markdown body exactly except for surrounding parser normalization.
- **Zod-to-JSON-Schema limitations** → Test generated schema serialization and avoid unsupported refinements in JSON Schema-compatible fields; graph validation remains runtime-only.
- **Ambiguous Markdown file extensions** → Accept both `.course.md` and `.md` exactly as specified, while YAML support is limited to `.course.yaml` and `.yml`.
- **Locale defaults** → `locale` defaults to `auto` only after Zod parsing; omit the field from explicit output unless normalization intentionally materializes the default.
- **Graph validation performance** → The graph is expected to be small; depth-first cycle detection with a visited set is sufficient for the initial implementation.

## Migration Plan

There is no migration because COURSE-SPEC is an initial format. Existing repositories without course files remain unaffected. The package will gain generated schema and parser exports, while the default CLI banner behavior remains unchanged when no arguments are supplied.

## Open Questions

None. The format fields, file extensions, defaults, and validation outcomes are defined sufficiently for implementation.
