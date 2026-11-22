# Tasks

## 1. Skill Template Refinement

- [x] 1.1 Refine `/slx:start` in `src/adapters/templates.ts` to implement disciplined Socratic pacing (ask one question at a time, wait for response, gradual 3-tier hint escalation, refusal of full solution code) within ~35–50 lines, and verify with unit tests in `tests/sdl.test.ts`
- [x] 1.2 Refine `/slx:explain` in `src/adapters/templates.ts` to strictly enforce `.speclearn/scratchpad/` isolation, step-by-step interactive micro-examples, and understanding checks before returning, and verify with unit tests in `tests/sdl.test.ts`
- [x] 1.3 Refine `/slx:verify` in `src/adapters/templates.ts` to separate failure diagnostics (one guiding question without code editing), test integrity checks, and post-pass consolidation review against `rubric_checks`, and verify with unit tests in `tests/sdl.test.ts`
- [x] 1.4 Refine `/slx:propose` in `src/adapters/templates.ts` and deduplicate `LANGUAGE_MIRRORING` and `guardedContent()` to maintain scannable ~35–50 line templates with clear developer terminology, and verify line counts and content in `tests/sdl.test.ts`

## 2. Multi-Agent Adapter and Documentation Alignment

- [x] 2.1 Update built-in adapter integrations in `src/adapters/builtins.ts` and verify generated command files and managed sections across all supported agents in `tests/adapters.test.ts`
- [x] 2.2 Update `README.md` and documentation to describe the enhanced Socratic mentoring flow (turn-taking, hint escalation, and scratchpad discipline) using approachable developer language

## 3. Integration & Quality Verification

- [x] 3.1 Run full typecheck (`pnpm typecheck`), build (`pnpm build`), and test suite (`pnpm test`) to confirm zero regressions and full type safety
- [x] 3.2 Run OpenSpec validation (`openspec validate --all`) to verify all delta specs and change artifacts conform to OpenSpec standards
