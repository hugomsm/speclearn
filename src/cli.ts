import { Command } from "commander";
import * as clack from "@clack/prompts";
import pc from "picocolors";
import { fileURLToPath } from "node:url";
import {
  CourseSpecLoadError,
  formatCourseSpecIssues,
  loadSpec,
} from "./parser/load-spec.js";
import { initializeWorkspace, parseAgentIds } from "./init/initialize.js";
import {
  createEmptyProgress,
  readProgress,
  renderDagStatus,
  renderProgressBar,
} from "./state/progress.js";

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
    .option("--agents <agents>", "comma-separated agents: claude,copilot,gemini,cursor")
    .option("--yes", "accept the selected agents without prompting")
    .action(async (options: { agents?: string; yes?: boolean }) => {
      try {
        let agentIds: string[];
        if (options.agents) {
          agentIds = parseAgentIds(options.agents);
          if (!options.yes && process.stdin.isTTY) {
            const confirm = await clack.confirm({
              message: `Initialize adapters: ${agentIds.join(", ")}?`,
              initialValue: true,
            });
            if (clack.isCancel(confirm) || !confirm) {
              clack.cancel("Initialization cancelled");
              return;
            }
          }
        } else if (process.stdin.isTTY && !options.yes) {
          const selected = await clack.multiselect({
            message: "Select coding agents",
            options: [
              { value: "claude", label: "Claude Code" },
              { value: "copilot", label: "GitHub Copilot" },
              { value: "gemini", label: "Gemini CLI" },
              { value: "cursor", label: "Cursor" },
            ],
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

        await initializeWorkspace({ projectRoot: process.cwd(), agents: agentIds });
        await createEmptyProgress(process.cwd());
        clack.outro(pc.green("SpecLearn workspace initialized"));
      } catch (error) {
        clack.log.error(pc.red(error instanceof Error ? error.message : String(error)));
        process.exitCode = 1;
      }
    });

  program
    .command("status")
    .description("Display local SpecLearn learning progress")
    .action(async () => {
      try {
        const state = await readProgress(process.cwd());
        if (!state) {
          clack.log.warning("No progress state found. Run speclearn init first.");
          return;
        }
        console.log(renderProgressBar(state));
        console.log(renderDagStatus(state));
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
