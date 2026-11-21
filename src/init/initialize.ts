import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createBuiltInAdapterRegistry } from "../adapters/index.js";

export interface InitOptions {
  projectRoot: string;
  agents: string[];
}

export async function initializeWorkspace(options: InitOptions): Promise<void> {
  const root = options.projectRoot;
  await Promise.all([
    mkdir(join(root, ".speclearn", "specs"), { recursive: true }),
    mkdir(join(root, ".speclearn", "state"), { recursive: true }),
    mkdir(join(root, ".speclearn", "scratchpad"), { recursive: true }),
  ]);

  const configPath = join(root, ".speclearn", "config.yaml");
  try {
    await readFile(configPath, "utf8");
  } catch {
    await writeFile(configPath, "schema_version: \"1.0\"\nagents: []\n", "utf8");
  }

  const gitignorePath = join(root, ".gitignore");
  let gitignore = "";
  try {
    gitignore = await readFile(gitignorePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const entries = [".speclearn/state/", ".speclearn/scratchpad/"];
  for (const entry of entries) {
    if (!gitignore.split(/\r?\n/).includes(entry)) {
      gitignore = `${gitignore}${gitignore.length > 0 && !gitignore.endsWith("\n") ? "\n" : ""}${entry}\n`;
    }
  }
  await writeFile(gitignorePath, gitignore, "utf8");

  const registry = createBuiltInAdapterRegistry();
  for (const agent of options.agents) {
    const adapter = registry.get(agent);
    if (!adapter) {
      throw new Error(`Unsupported agent: ${agent}`);
    }
    await adapter.apply(root);
  }
}

export function parseAgentIds(value: string): string[] {
  const supported = new Set(["claude", "copilot", "antigravity", "cursor", "generic"]);
  const ids = value
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);

  const unsupported = ids.filter((id) => !supported.has(id));
  if (unsupported.length > 0) {
    throw new Error(`Unsupported agent(s): ${unsupported.join(", ")}. Supported agents: claude, copilot, antigravity, cursor, generic`);
  }

  return [...new Set(ids)];
}

async function directoryExists(targetPath: string): Promise<boolean> {
  try {
    const s = await stat(targetPath);
    return s.isDirectory();
  } catch {
    return false;
  }
}

export async function detectWorkspaceAgents(projectRoot: string): Promise<string[]> {
  const detected: string[] = [];
  const checks: Array<{ dir: string; id: string }> = [
    { dir: ".claude", id: "claude" },
    { dir: ".github", id: "copilot" },
    { dir: ".gemini", id: "antigravity" },
    { dir: ".cursor", id: "cursor" },
    { dir: ".agents", id: "generic" },
  ];

  for (const check of checks) {
    if (await directoryExists(join(projectRoot, check.dir))) {
      detected.push(check.id);
    }
  }

  return detected;
}
