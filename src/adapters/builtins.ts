import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { AgentAdapter } from "./types.js";
import { managedSection, MANAGED_END, MANAGED_START, SLX_COMMAND_TEMPLATES } from "./templates.js";

async function writeFileIdempotent(filePath: string, content: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  let existing = "";
  try {
    existing = await readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
  if (existing !== content) {
    await writeFile(filePath, content, "utf8");
  }
}

async function updateManagedSection(filePath: string, content: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  let existing = "";
  try {
    existing = await readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const start = existing.indexOf(MANAGED_START);
  const end = existing.indexOf(MANAGED_END);
  let updated: string;
  if (start >= 0 && end > start) {
    updated = `${existing.slice(0, start)}${content}${existing.slice(end + MANAGED_END.length)}`;
  } else {
    const separator = existing.length > 0 && !existing.endsWith("\n") ? "\n" : "";
    updated = `${existing}${separator}${content}\n`;
  }
  await writeFile(filePath, updated, "utf8");
}

export const claudeAdapter: AgentAdapter = {
  id: "claude",
  name: "Claude Code",
  async apply(projectRoot: string) {
    const commands = {
      propose: "propose.md",
      start: "start.md",
      explain: "explain.md",
      verify: "verify.md",
    };
    for (const [name, fileName] of Object.entries(commands)) {
      await writeFileIdempotent(
        join(projectRoot, ".claude", "commands", "slx", fileName),
        SLX_COMMAND_TEMPLATES[name as keyof typeof SLX_COMMAND_TEMPLATES],
      );
    }
    await updateManagedSection(join(projectRoot, "CLAUDE.md"), managedSection());
  },
};

export const copilotAdapter: AgentAdapter = {
  id: "copilot",
  name: "GitHub Copilot",
  async apply(projectRoot: string) {
    for (const [name, template] of Object.entries(SLX_COMMAND_TEMPLATES)) {
      await writeFileIdempotent(
        join(projectRoot, ".github", "prompts", `slx-${name}.prompt.md`),
        template,
      );
    }
    await updateManagedSection(
      join(projectRoot, ".github", "copilot-instructions.md"),
      managedSection(),
    );
  },
};

export const geminiAdapter: AgentAdapter = {
  id: "gemini",
  name: "Gemini CLI",
  async apply(projectRoot: string) {
    for (const [name, template] of Object.entries(SLX_COMMAND_TEMPLATES)) {
      await writeFileIdempotent(
        join(projectRoot, ".gemini", "commands", `slx-${name}.md`),
        template,
      );
    }
    await updateManagedSection(join(projectRoot, "GEMINI.md"), managedSection());
  },
};

export const cursorAdapter: AgentAdapter = {
  id: "cursor",
  name: "Cursor",
  async apply(projectRoot: string) {
    const content = [
      "---",
      "description: SpecLearn /slx learning workflows and guardrails",
      "alwaysApply: true",
      "---",
      "",
      managedSection(["- Use the `.speclearn/specs/` course and module data for active learning context."]),
      "",
      ...Object.values(SLX_COMMAND_TEMPLATES),
    ].join("\n");
    await writeFileIdempotent(join(projectRoot, ".cursor", "rules", "speclearn.mdc"), content);
  },
};
