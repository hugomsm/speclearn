# Proposal

## Why
SpecLearn is ready for public launch, but currently lacks a comprehensive, high-impact `README.md` that introduces the Spec-Driven Learning (SDL) paradigm and articulates the AI Engineering Paradox to the global developer community. In addition, developers and course authors need production-ready, validated starter `COURSE-SPEC` reference files in both hybrid Markdown (`.course.md`) and pure YAML (`.course.yaml`) formats to adopt and author courses with confidence.

## What Changes
- Author a world-class, high-impact `README.md` featuring:
  - Hero section with project badges (NPM version, CI status, MIT License, Node >= 20) and punchy tagline.
  - The AI Engineering Paradox analysis and the core Spec-Driven Learning (SDL) Manifesto.
  - A side-by-side comparison table contrasting Traditional LMS video courses, SDD harnesses (OpenSpec / Spec-Kit), and SDL with SpecLearn.
  - ASCII/Mermaid visual diagrams illustrating the 4-Stage Pedagogical Loop (`Measure → Plan → Teach & Scaffold → Verify`) and the Dual-Layer Knowledge model (`Universal Tech Concepts` + `Architecture Context via MCP`).
  - A 30-second quickstart demonstrating `npx speclearn init` and the 4 slash commands (`/slx:propose`, `/slx:start`, `/slx:explain`, `/slx:verify`).
  - COURSE-SPEC open standard overview with syntax-highlighted code blocks.
- Add canonical starter examples in `examples/`:
  - `examples/typescript-clean-architecture.course.md` (hybrid Markdown with YAML frontmatter).
  - `examples/python-async-resilience.course.yaml` (pure YAML course spec).
- Add automated test coverage in `tests/examples.test.ts` to ensure all starter course examples pass validation in CI.

## Capabilities

### New Capabilities

### Modified Capabilities
- `repository-governance`: Add requirement for public project presentation, SDL manifesto, and quickstart documentation.
- `course-spec-format`: Add requirement for validated reference starter course specifications.

## Impact
- `README.md`: Updated to serve as the official project manifesto and documentation entry point.
- `examples/`: New top-level directory containing canonical starter course specs.
- `tests/examples.test.ts`: New test suite validating all files in `examples/`.
