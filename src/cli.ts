import { Command } from "commander";
import * as clack from "@clack/prompts";
import pc from "picocolors";
import { fileURLToPath } from "node:url";

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
  process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectExecution) {
  await main();
}
