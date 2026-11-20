# Tasks

## 1. Starter Course Specifications

- [x] 1.1 Create `examples/typescript-clean-architecture.course.md` modeling Domain-Driven Design and Hexagonal Architecture, with valid COURSE-SPEC frontmatter and embedded Markdown pedagogical guide; verify with `speclearn validate examples/typescript-clean-architecture.course.md`.
- [x] 1.2 Create `examples/python-async-resilience.course.yaml` modeling AsyncIO resilience patterns (Circuit Breaker, Exponential Backoff, TaskGroups) in pure YAML; verify with `speclearn validate examples/python-async-resilience.course.yaml`.

## 2. Automated Validation Test Suite

- [x] 2.1 Implement `tests/examples.test.ts` to discover and validate all files in `examples/` using `loadSpec()`; verify with `pnpm vitest run tests/examples.test.ts`.

## 3. Launch README and Manifesto

- [x] 3.1 Author the `README.md` Hero section with badges (NPM version, CI status, MIT License, Node >= 20) and the official tagline.
- [x] 3.2 Write "The Problem & The SDL Manifesto" addressing the AI Engineering Paradox and providing the side-by-side comparison table (Traditional LMS vs. SDD vs. SDL).
- [x] 3.3 Include visual diagrams (ASCII + Mermaid) for the 4-Stage Pedagogical Loop and Dual-Layer Knowledge model, plus the 30-second quickstart and COURSE-SPEC snippet; verify rendering on GitHub/Markdown viewers.

## 4. Verification and Quality Checks

- [x] 4.1 Run the full test suite and linters (`pnpm test`, `pnpm typecheck`, `pnpm lint`) to verify zero regressions.
