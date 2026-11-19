# Contributing to SpecLearn

## Local setup

SpecLearn requires Node.js 20 or newer and pnpm.

```sh
pnpm install
pnpm build
pnpm test
```

Before submitting a change, also run:

```sh
pnpm lint
pnpm typecheck
pnpm format
```

## Spec-Driven Development

SpecLearn uses OpenSpec for externally visible behavior and implementation planning.

1. Review the active specifications under `openspec/specs/`.
2. Propose a change with `openspec new change "<kebab-case-name>"`.
3. Generate and review `proposal.md`, delta specs, `design.md`, and `tasks.md`.
4. Validate the plan with `openspec validate "<change-name>"`.
5. Apply an implementation only after explicitly starting the apply workflow.

Keep implementation tasks minimal and update task checkboxes as work is completed.

## Conventional Commits

Use Conventional Commits, for example:

- `feat(cli): add initial help command`
- `fix(build): emit a shebang in the executable`
- `docs: clarify local setup`
- `test(cli): cover banner output`

Breaking changes must use `!` or a `BREAKING CHANGE:` footer.

## Pull requests

Complete the pull request template and include tests or verification evidence for behavior changes.
