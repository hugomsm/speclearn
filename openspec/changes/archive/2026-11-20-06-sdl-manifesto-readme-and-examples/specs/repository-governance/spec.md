# Spec Delta

## ADDED Requirements

### Requirement: Public project presentation and SDL manifesto
The repository SHALL provide a comprehensive README documenting the Spec-Driven Learning (SDL) paradigm, the AI Engineering Paradox, comparison against LMS and SDD, visual architecture diagrams, a 30-second quickstart, and COURSE-SPEC format examples.

#### Scenario: Developer explores project README
- **WHEN** a developer views the project repository README
- **THEN** it SHALL present the project title, badges (NPM version, CI status, MIT License, Node >= 20), and core tagline
- **AND** it SHALL articulate the AI Engineering Paradox and the core principles of the Spec-Driven Learning (SDL) Manifesto
- **AND** it SHALL present a side-by-side comparison matrix comparing Traditional LMS, SDD harnesses, and SDL with SpecLearn

#### Scenario: Developer references architecture diagrams and quickstart
- **WHEN** a developer or contributor reads the technical sections of the README
- **THEN** it SHALL display visual diagrams for the 4-Stage Pedagogical Loop (`Measure → Plan → Teach & Scaffold → Verify`) and Dual-Layer Knowledge structure
- **AND** it SHALL provide a 30-second quickstart walkthrough covering `npx speclearn init` and `/slx:*` commands
- **AND** it SHALL provide a syntax-highlighted COURSE-SPEC specification snippet
