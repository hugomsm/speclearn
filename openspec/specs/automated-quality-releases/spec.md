# automated-quality-releases Specification

## Purpose

Automated quality and release configuration ensures supported runtimes are validated consistently and package releases follow semantic versioning.

## Requirements

### Requirement: Continuous integration matrix

The repository SHALL run lint, typecheck, build, and Vitest validation on Node.js 24.

#### Scenario: A pull request or relevant branch is checked

- **WHEN** CI receives a supported trigger
- **THEN** the quality jobs SHALL run independently on Node.js 24
- **AND** a failed lint, typecheck, build, or test step SHALL fail the workflow

### Requirement: Semantic release configuration

The repository SHALL configure Changesets for package versioning and NPM publishing.

#### Scenario: A maintainer prepares a release

- **WHEN** a maintainer adds one or more Changesets and runs the release workflow
- **THEN** semantic package versions SHALL be derived from the accumulated changes
- **AND** publishing SHALL target the configured npm package metadata

### Requirement: Release-safe package metadata

The package SHALL declare Node.js compatibility, ESM package mode, public distribution files, and the executable entrypoint.

#### Scenario: Package metadata is inspected

- **WHEN** a maintainer or package manager reads the package metadata
- **THEN** it SHALL find Node.js 24 or newer, ESM mode, the `speclearn` binary, and the intended published file set
