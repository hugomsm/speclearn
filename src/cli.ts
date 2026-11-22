import { Command } from "commander";
import * as clack from "@clack/prompts";
import pc from "picocolors";
import { fileURLToPath } from "node:url";
import {
  CourseSpecLoadError,
  formatCourseSpecIssues,
  loadSpec,
} from "./parser/load-spec.js";
import { initializeWorkspace, parseAgentIds, detectWorkspaceAgents } from "./init/initialize.js";
import {
  createEmptyProgress,
  readProgress,
  renderDagStatus,
  renderProgressBar,
} from "./state/progress.js";
import { startCourse } from "./sandbox/start.js";
import { skipModule } from "./sandbox/skip.js";
import { lockModuleTests, verifyModule } from "./commands/verify.js";

export const VERSION = "0.1.0";

export const BANNER = `
  S P E C L E A R N
  Spec-Driven Learning
  for Coding Agents`;

export function createCli(): Command {
  const program = new Command();

  program
    .name("speclearn")
    .description("Spec-Driven Learning (SDL) for Coding Agents")
    .version(VERSION, "-v, --version", "display the CLI version")
    .helpOption("-h, --help", "display help for command");

  program
    .command("validate")
    .description("Validate a COURSE-SPEC Markdown or YAML file")
    .argument("<path>", "path to a .course.md, .md, .course.yaml, or .yml file")
    .action(async (path: string) => {
      try {
        const course = await loadSpec(path);
        clack.outro(
          pc.green(`Valid COURSE-SPEC: ${course.id} (${course.modules.length} modules)`),
        );
      } catch (error) {
        if (error instanceof CourseSpecLoadError && error.kind === "validation") {
          const issues = formatCourseSpecIssues(error.issues);
          clack.log.error(pc.red("COURSE-SPEC validation failed"));
          for (const issue of issues) {
            clack.log.message(pc.yellow(issue));
          }
        } else {
          clack.log.error(
            pc.red(error instanceof Error ? error.message : String(error)),
          );
        }
        process.exitCode = 1;
      }
    });

  program
    .command("init")
    .description("Initialize SpecLearn in the current project")
    .option("--agents <agents>", "comma-separated agents: claude,copilot,antigravity,cursor,generic")
    .option("--yes", "accept the selected agents without prompting")
    .action(async (options: { agents?: string; yes?: boolean }) => {
      try {
        const isInteractive = Boolean(process.stdin.isTTY && !options.yes);
        if (isInteractive) {
          clack.intro(pc.bold("SpecLearn Initialization"));
        }

        let agentIds: string[];
        if (options.agents) {
          agentIds = parseAgentIds(options.agents);
          if (isInteractive) {
            const confirm = await clack.confirm({
              message: `Initialize adapters: ${agentIds.join(", ")}?`,
              initialValue: true,
            });
            if (clack.isCancel(confirm) || !confirm) {
              clack.cancel("Initialization cancelled");
              return;
            }
          }
        } else if (isInteractive) {
          const detected = await detectWorkspaceAgents(process.cwd());
          const selected = await clack.multiselect({
            message: "Select coding agents (Space to toggle, Enter to confirm)",
            options: [
              { value: "claude", label: "Claude Code", hint: ".claude/commands/slx/" },
              { value: "copilot", label: "GitHub Copilot", hint: ".github/prompts/" },
              { value: "antigravity", label: "Antigravity", hint: ".gemini/commands/ & ANTIGRAVITY.md" },
              { value: "cursor", label: "Cursor", hint: ".cursor/rules/speclearn.mdc" },
              { value: "generic", label: "Generic Agent", hint: ".agents/skills/ & AGENTS.md" },
            ],
            initialValues: detected,
            required: false,
          });
          if (clack.isCancel(selected)) {
            clack.cancel("Initialization cancelled");
            return;
          }
          agentIds = selected as string[];
        } else {
          agentIds = [];
        }

        const spinner = isInteractive ? clack.spinner() : null;
        if (spinner) {
          spinner.start("Setting up skills and guardrails...");
        }

        await initializeWorkspace({ projectRoot: process.cwd(), agents: agentIds });
        await createEmptyProgress(process.cwd());

        if (spinner) {
          spinner.stop(
            agentIds.length > 0
              ? `Set up ${agentIds.join(", ")} skills and guardrails`
              : "SpecLearn workspace initialized (no agent adapters selected)",
          );
        }

        clack.outro(pc.green("SpecLearn workspace initialized"));
      } catch (error) {
        clack.log.error(pc.red(error instanceof Error ? error.message : String(error)));
        process.exitCode = 1;
      }
    });

  program
    .command("start")
    .description("Start a COURSE-SPEC in an isolated sandbox")
    .argument("<course>", "path to a COURSE-SPEC Markdown or YAML file")
    .action(async (coursePath: string) => {
      try {
        const result = await startCourse(process.cwd(), coursePath);
        const location = result.sandbox.branch
          ? `branch ${result.sandbox.branch}`
          : `directory ${result.sandbox.path ?? ".speclearn/sandbox/"}`;
        clack.outro(pc.green(`Started ${result.courseId} in ${location}`));
      } catch (error) {
        clack.log.error(pc.red(error instanceof Error ? error.message : String(error)));
        process.exitCode = 1;
      }
    });

  program
    .command("skip")
    .description("Mark demonstrated mastery for a module")
    .argument("<module>", "module ID to mark as skipped_mastered")
    .action(async (moduleId: string) => {
      try {
        await skipModule(process.cwd(), moduleId);
        clack.outro(pc.green(`Marked ${moduleId} as skipped_mastered`));
      } catch (error) {
        clack.log.error(pc.red(error instanceof Error ? error.message : String(error)));
        process.exitCode = 1;
      }
    });

  program
    .command("status")
    .description("Show your current learning progress")
    .action(async () => {
      try {
        const state = await readProgress(process.cwd());
        if (!state) {
          clack.log.warning("No learning progress found. Run speclearn init first.");
          return;
        }
        console.log(renderProgressBar(state));
        console.log(renderDagStatus(state));
      } catch (error) {
        clack.log.error(pc.red(error instanceof Error ? error.message : String(error)));
        process.exitCode = 1;
      }
    });

  program
    .command("verify")
    .description("Run your tests and record module completion if they pass")
    .argument("[module-id]", "module ID; defaults to the active module")
    .action(async (moduleId?: string) => {
      try {
        const result = await verifyModule(process.cwd(), moduleId);
        if (result.integrityErrors.length > 0) {
          clack.log.error(pc.red("Test files have changed — verification stopped"));
          for (const error of result.integrityErrors) {
            clack.log.message(pc.yellow(error));
          }
          process.exitCode = 1;
          return;
        }
        if (!result.completed) {
          clack.log.error(pc.red("Module verification failed"));
          if (result.stdout) console.log(result.stdout);
          if (result.stderr) console.log(result.stderr);
          process.exitCode = result.exitCode === -1 ? 1 : result.exitCode || 1;
          return;
        }
        clack.outro(pc.green(`Verified and completed ${result.moduleId}`));
        console.log(renderDagStatus(await readProgress(process.cwd()) ?? { active_course_id: result.courseId, sandbox: {}, modules: [] }));
      } catch (error) {
        clack.log.error(pc.red(error instanceof Error ? error.message : String(error)));
        process.exitCode = 1;
      }
    });

  program
    .command("lock-tests")
    .description("Snapshot test files so tampering is caught during verification")
    .argument("[module-id]", "module ID; defaults to the active module")
    .action(async (moduleId?: string) => {
      try {
        const result = await lockModuleTests(process.cwd(), moduleId);
        clack.outro(pc.green(`Locked test files for ${result.moduleId}`));
      } catch (error) {
        clack.log.error(pc.red(error instanceof Error ? error.message : String(error)));
        process.exitCode = 1;
      }
    });

  return program;
}

export function renderBanner(): void {
  clack.intro(pc.bold("SpecLearn"));
  console.log(BANNER);
  console.log(pc.dim(`Version ${VERSION}`));
}

export async function main(argv: string[] = process.argv): Promise<void> {
  const program = createCli();

  if (argv.length <= 2) {
    renderBanner();
    program.outputHelp();
    return;
  }

  await program.parseAsync(argv);
}

const isDirectExecution =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectExecution) {
  await main();
}
