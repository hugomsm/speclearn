# Spec Delta

## ADDED Requirements

### Requirement: Reference course specification examples
The repository SHALL provide canonical starter course specifications in `examples/` demonstrating both hybrid Markdown (`.course.md`) and pure YAML (`.course.yaml`) formats that validate against the COURSE-SPEC standard.

#### Scenario: Hybrid markdown course example validation
- **WHEN** `speclearn validate` processes `examples/typescript-clean-architecture.course.md`
- **THEN** the validator SHALL successfully load the YAML frontmatter and validate all modules, prerequisites, concepts, and verification commands without error

#### Scenario: Pure YAML course example validation
- **WHEN** `speclearn validate` processes `examples/python-async-resilience.course.yaml`
- **THEN** the validator SHALL successfully load the YAML course structure and validate all modules, prerequisites, concepts, and verification commands without error

#### Scenario: Automated CI validation of starter examples
- **WHEN** the test suite is executed via Vitest or CI
- **THEN** an automated test in `tests/examples.test.ts` SHALL discover and validate every course specification file in `examples/`
