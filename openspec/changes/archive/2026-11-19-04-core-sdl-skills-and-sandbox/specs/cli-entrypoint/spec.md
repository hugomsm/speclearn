# Spec Delta

## ADDED Requirements

### Requirement: Start course command
The CLI SHALL provide `speclearn start <course>` to activate course progress and initialize a safe sandbox.

#### Scenario: Course starts safely
- **WHEN** the user starts a valid course
- **THEN** the CLI SHALL validate the course, inspect Git status, initialize progress, and record the sandbox location or branch

#### Scenario: Course cannot start safely
- **WHEN** Git has unrelated changes and no safe isolation choice is accepted
- **THEN** the CLI SHALL not modify the production workspace or active progress

### Requirement: Skip mastered module command
The CLI SHALL provide `speclearn skip <module>` to mark demonstrated mastery and unlock downstream nodes.

#### Scenario: Mastery skip is accepted
- **WHEN** the student has demonstrated mastery accepted by the `/slx:start` diagnostic boundary
- **THEN** the CLI SHALL mark the module `skipped_mastered` and update prerequisite-aware availability

#### Scenario: Mastery evidence is absent
- **WHEN** no mastery evidence is supplied
- **THEN** the CLI SHALL leave module state unchanged and report the requirement
