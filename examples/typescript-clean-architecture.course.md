---
schema_version: "1.0"
id: typescript-clean-architecture
title: TypeScript Clean Architecture & Hexagonal Ports
author: SpecLearn Core Authors
tier: official
level: intermediate
estimated_hours: 6
locale: en
context_sources:
  mcp_resources:
    - mcp://codebase-architecture
    - mcp://domain-entities
  mandatory_adrs:
    - docs/adr/001-hexagonal-architecture.md
  reference_repo: https://github.com/speclearn/typescript-clean-architecture-starter
harness_rules:
  socratic_mode: true
  allow_full_code_spoiler: false
  scratchpad_enabled: true
modules:
  - id: domain-entities-and-aggregates
    title: Domain Entities and Core Business Aggregates
    prerequisites: []
    universal_concepts:
      - Domain-Driven Design (DDD)
      - Aggregate Roots
      - Entity Identity vs Value Objects
      - Immutability
    arch_context:
      - Core Domain Layer Isolation
      - Zero External Framework Dependencies
    verification:
      test_command: pnpm test tests/unit/domain
      test_files:
        - tests/unit/domain/order-aggregate.test.ts
      rubric_checks:
        - Entity enforces its own business rules without relying on external validation
        - Business rules throw descriptive domain exceptions without framework references

  - id: hexagonal-ports-and-use-cases
    title: Application Use Cases and Inbound/Outbound Ports
    prerequisites:
      - domain-entities-and-aggregates
    universal_concepts:
      - Hexagonal Architecture (Ports and Adapters)
      - Command Pattern
      - Inversion of Control (IoC)
    arch_context:
      - Application Layer Orchestration
      - Repository Interfaces Definition
    verification:
      test_command: pnpm test tests/unit/use-cases
      test_files:
        - tests/unit/use-cases/place-order.test.ts
      rubric_checks:
        - Use case depends strictly on abstraction interfaces rather than concrete databases
        - Domain event dispatching occurs after successful state transition

  - id: infrastructure-adapters-and-wiring
    title: Secondary Adapters, Repositories, and Dependency Injection
    prerequisites:
      - hexagonal-ports-and-use-cases
    universal_concepts:
      - Secondary (Driven) Adapters
      - Dependency Injection Container
      - Data Mapper Pattern
    arch_context:
      - Infrastructure Layer Boundary
      - Persistence Adapter Integration
    verification:
      test_command: pnpm test tests/integration/adapters
      test_files:
        - tests/integration/adapters/prisma-order-repository.test.ts
      rubric_checks:
        - Persistence adapter maps relational/database models to pure domain aggregates
        - Composition root wires dependencies cleanly without leaking infrastructure details into use cases
---

# Tutor Guide: Mastering Clean Architecture in TypeScript

Welcome to **TypeScript Clean Architecture & Hexagonal Ports**, an official SpecLearn course.

## Socratic Agent Guidance

When an AI coding agent acts as a tutor in this course, it MUST follow these mentoring principles:

1. **Socratic Inquiry**: Never output raw completed implementations into the learner's workspace when asked for solutions. Instead, challenge the learner to identify the business rules and edge cases before writing constructors, with questions that highlight architectural boundaries:
   - *"Which layer should know about database connection errors?"*
   - *"If we swapped PostgreSQL for MongoDB tomorrow, how many files in our domain would need to change?"*
2. **Concept Before Code**: Ensure the learner articulates the difference between an Entity (identity-tracked) and a Value Object (structural equality) before writing the constructor business rules and edge cases.
3. **Deterministic Verification**: Guide the learner to execute `speclearn verify` at each milestone to prove correctness against deterministic unit tests.

## Architecture Blueprint

```text
  +-------------------------------------------------------------+
  |                   INFRASTRUCTURE LAYER                      |
  |  [Express / Fastify HTTP Adapter]    [Prisma / TypeORM Repo]|
  +------------------------------+------------------------------+
                                 |
                                 v
  +-------------------------------------------------------------+
  |                    APPLICATION LAYER                        |
  |             [PlaceOrderUseCase]   [Ports/Interfaces]        |
  +------------------------------+------------------------------+
                                 |
                                 v
  +-------------------------------------------------------------+
  |                      DOMAIN LAYER                           |
  |         [Order Aggregate]        [Money Value Object]       |
  |         * Pure TypeScript — Zero External Dependencies *    |
  +-------------------------------------------------------------+
```

## Module Progression

- **Module 1: Domain Entities and Core Business Aggregates**: Model pure domain logic without leaking HTTP or ORM abstractions.
- **Module 2: Application Use Cases and Inbound/Outbound Ports**: Define clear contract interfaces (Ports) and implement single-responsibility use cases.
- **Module 3: Secondary Adapters, Repositories, and Dependency Injection**: Plug database drivers into repository ports and assemble the composition root.
