# concept-scratchpad Specification

## Purpose
The concept scratchpad gives students isolated, runnable examples for universal concepts without disrupting the active project lab.

## Requirements

### Requirement: Scratchpad isolation
The `/slx:explain [concept]` workflow SHALL create minimal runnable examples under `.speclearn/scratchpad/` and SHALL leave the main lab intact.

#### Scenario: A concept needs separation
- **WHEN** the student asks for a project-independent explanation
- **THEN** the skill SHALL create or reuse an isolated scratchpad example beneath `.speclearn/scratchpad/`

#### Scenario: Scratchpad run is requested
- **WHEN** the student runs or inspects the scratchpad example
- **THEN** the example SHALL be runnable independently of production lab files

### Requirement: Main lab restoration
The explanation workflow SHALL preserve active lab context and smoothly return to it after the scratchpad exercise.

#### Scenario: Explanation ends
- **WHEN** the student indicates that the concept is understood or ends the explanation loop
- **THEN** the skill SHALL summarize the concept and restore references to the active course, module, and sandbox
