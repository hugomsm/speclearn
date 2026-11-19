# repository-governance Specification

## Purpose

Repository governance establishes consistent contributor conduct, security reporting, contribution guidance, and issue and pull request expectations for SpecLearn maintainers and participants.

## Requirements

### Requirement: Contributor setup guidance

The repository SHALL provide contribution guidance for local setup, validation, OpenSpec workflow usage, and Conventional Commits.

#### Scenario: Contributor prepares a change

- **WHEN** a contributor follows the documented setup and validation steps
- **THEN** the guide SHALL identify `pnpm install`, `pnpm build`, and `pnpm test` as the local baseline
- **AND** the guide SHALL explain how Spec-Driven Development changes are proposed and applied with OpenSpec

### Requirement: Community safety and security reporting

The repository SHALL publish a Contributor Covenant v2.1 code of conduct and a security reporting policy.

#### Scenario: A participant needs reporting guidance

- **WHEN** a participant encounters unacceptable behavior or a security concern
- **THEN** the repository SHALL provide a clearly linked conduct policy and a private security contact or reporting process

### Requirement: GitHub contribution templates

The repository SHALL provide structured templates for bug reports, feature requests, agent adapter proposals, and pull requests.

#### Scenario: User opens a contribution request

- **WHEN** a user creates an issue or pull request from GitHub
- **THEN** the appropriate template SHALL guide the contributor to provide reproducible or implementation-ready details
