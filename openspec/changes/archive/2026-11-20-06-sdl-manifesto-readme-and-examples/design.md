# Design

## Context
See `proposal.md` for motivation. The core SpecLearn framework (CLI entrypoint, parser, anti-tampering verification, sandbox isolation, agent adapters) is implemented and verified by automated tests. We now need to articulate the Spec-Driven Learning (SDL) paradigm, structure the official `README.md`, provide reference starter courses in `examples/`, and guarantee their validity via automated testing.

## Goals / Non-Goals

**Goals:**
- Present a clear, compelling developer manifesto addressing the AI Engineering Paradox in `README.md`.
- Provide a side-by-side comparative analysis between Traditional LMS, Spec-Driven Development (SDD), and Spec-Driven Learning (SDL).
- Illustrate the 4-Stage Pedagogical Loop (`Measure → Plan → Teach & Scaffold → Verify`) and Dual-Layer Knowledge structure via clean ASCII and GitHub-compatible Mermaid diagrams.
- Deliver a 30-second developer quickstart demonstrating `npx speclearn init` and `/slx:*` commands.
- Deliver two realistic, production-grade starter courses:
  - `examples/typescript-clean-architecture.course.md` (Hybrid Markdown + YAML frontmatter).
  - `examples/python-async-resilience.course.yaml` (Pure YAML).
- Add `tests/examples.test.ts` to validate all example courses during Vitest runs in CI.

**Non-Goals:**
- Modifying the core parser, Zod schemas, or CLI execution pipelines.
- Building online web LMS viewers or proprietary hosted portals.
- Introducing external dependencies beyond the existing `loadSpec` / `vitest` infrastructure.

## Decisions

### Decision 1: Realistic Domain-Specific Starter Examples
Instead of toy or placeholder examples ("Hello World"), the two starter specifications will model high-value engineering domains:
- `examples/typescript-clean-architecture.course.md`: Focuses on Domain-Driven Design, Hexagonal Architecture (Ports & Adapters), and Inversion of Control. Provides an embedded Markdown pedagogical guide with Socratic prompts.
- `examples/python-async-resilience.course.yaml`: Focuses on AsyncIO resilience patterns, Circuit Breakers, Retry with Exponential Backoff, and TaskGroup cancellation. Demonstrates pure YAML structure with multi-step DAG modules.

*Alternative considered:* Minimal stub courses. Rejected because course authors need realistic templates showing how real architectural context and verification commands are formulated.

### Decision 2: Testing Examples via Direct Parser Invocation and CLI Validation
`tests/examples.test.ts` will:
1. Dynamically discover all `.course.md`, `.md`, `.course.yaml`, and `.yaml` files inside `examples/`.
2. Execute `loadSpec(filePath)` to assert schema compliance, DAG validity, and non-empty module verifications.
3. Assert that both Markdown and pure YAML variants parse properly and retain their respective attributes (such as `pedagogical_guide` in Markdown).

*Alternative considered:* Hardcoding filenames in the test suite. Rejected in favor of dynamic directory scanning so any future added examples are automatically verified.

### Decision 3: Dual-Mode Architecture Visualization (ASCII + Mermaid)
In `README.md`, diagrams will use standard GitHub-flavored Mermaid blocks for web rendering, supplemented with clean ASCII representations for terminal/raw Markdown viewers.

*Alternative considered:* Raw ASCII only or images only. Mermaid renders natively on GitHub and package registries while maintaining searchability and theme adaptability.

## Risks / Trade-offs

- **[Risk]** Example course specifications might become outdated if `courseSpecSchema` changes.
  → **Mitigation**: `tests/examples.test.ts` runs on every `pnpm test` and CI workflow, failing immediately if any example violates the active schema.
- **[Risk]** Large Markdown documents might overwhelm users looking for quick setup.
  → **Mitigation**: Place the 30-Second Quickstart immediately following the Manifesto and Architecture sections with clear jump links and collapsible deep dives.
