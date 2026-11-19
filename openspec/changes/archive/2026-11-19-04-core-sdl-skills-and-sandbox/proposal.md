# Proposal

## Why

SpecLearn can now initialize workspaces and generate agent-native command files, but the core `/slx` experiences need complete pedagogical behavior and safe training isolation. Establishing these contracts will make course authoring, Socratic learning, sandbox startup, and temporary concept exploration consistent across supported coding-agent harnesses.

## What Changes

- Replace minimal `/slx` command templates with complete four-skill pedagogical guidance.
- Add a strict multilingual language-mirroring rule to every core skill template.
- Define `/slx:propose` authoring behavior, including repository inspection, up to three calibration questions, COURSE-SPEC generation, and validation.
- Add `speclearn start <course>` CLI behavior and `/slx:start` stages for diagnostic measurement, tailored planning, Socratic teaching, scaffolding, and mastery skipping.
- Protect the student's production workspace by checking Git status and isolating learning work in a branch or `.speclearn/sandbox/` directory.
- Add `/slx:explain [concept]` scratchpad behavior that pauses the main lab, creates an isolated runnable example, and restores the main lab context afterward.
- Enforce no-solution-spoiler behavior, TODO scaffolding, failing tests, and deterministic verification boundaries.

## Capabilities

### New Capabilities
- `sdl-pedagogy-skills`: Defines the universal language-mirroring rule and detailed `/slx:propose`, `/slx:start`, `/slx:explain`, and `/slx:verify` mentoring behavior.
- `learning-sandbox-isolation`: Defines safe CLI startup, Git status checks, sandbox branch or directory creation, and protection of production work.
- `concept-scratchpad`: Defines isolated `/slx:explain [concept]` examples under `.speclearn/scratchpad/` and smooth return to the active lab.

### Modified Capabilities
- `agent-adapter-system`: Native adapter command files must include the complete core SDL templates and language-mirroring guardrails rather than minimal placeholders.
- `cli-entrypoint`: The CLI gains `start <course>` behavior and `skip <module>` behavior for mastery unlocking, in addition to existing commands.
- `learning-progress-state`: Starting a course and skipping a mastered module update sandbox and module state consistently, while completion remains verification-controlled.

## Impact

- Expands `src/adapters/templates.ts` and all built-in adapter outputs.
- Adds CLI start and skip operations and sandbox integration.
- Extends progress state for active course, sandbox location, module availability, and skipped-mastered transitions.
- Adds scratchpad lifecycle behavior and isolated runnable examples.
- Uses Git status and filesystem operations only; no LLM API calls or autonomous test completion are added.
