import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { SLX_COMMAND_TEMPLATES, guardedContent } from "../src/adapters/templates.js";
import { createScratchpadExample } from "../src/sandbox/scratchpad.js";
import { inspectGitStatus, courseSlug } from "../src/sandbox/sandbox.js";
import { skipModule } from "../src/sandbox/skip.js";
import { createEmptyProgress, readProgress, writeProgress } from "../src/state/progress.js";

const execFileAsync = promisify(execFile);

describe("Core SDL skills", () => {
  it("includes language mirroring and complete pedagogy in all templates", () => {
    for (const [, template] of Object.entries(SLX_COMMAND_TEMPLATES)) {
      expect(template).toContain("Universal Language Mirroring");
      const lineCount = template.trim().split("\n").length;
      expect(lineCount).toBeGreaterThanOrEqual(30);
      expect(lineCount).toBeLessThanOrEqual(55);
    }

    expect(SLX_COMMAND_TEMPLATES.propose).toContain("no more than three");
    expect(SLX_COMMAND_TEMPLATES.propose).toContain(".speclearn/specs/<id>.course.md");
    expect(SLX_COMMAND_TEMPLATES.propose).toContain("YAML frontmatter");
    expect(SLX_COMMAND_TEMPLATES.propose).toContain("tutor guidance");
    expect(SLX_COMMAND_TEMPLATES.propose).toContain("test_command");
    expect(SLX_COMMAND_TEMPLATES.propose).toContain("Do not invent project architecture");
    expect(SLX_COMMAND_TEMPLATES.propose).toContain("rerun validation");
    expect(SLX_COMMAND_TEMPLATES.propose).toContain("sandbox");
    expect(SLX_COMMAND_TEMPLATES.propose).toContain("workspace");

    expect(SLX_COMMAND_TEMPLATES.start).toContain("three-minute diagnostic");
    expect(SLX_COMMAND_TEMPLATES.start).toContain("# TODO(speclearn)");
    expect(SLX_COMMAND_TEMPLATES.start).toContain("workspace");
    expect(SLX_COMMAND_TEMPLATES.start).toContain("target_files");
    expect(SLX_COMMAND_TEMPLATES.start).toContain("ONE focused question");
    expect(SLX_COMMAND_TEMPLATES.start).toContain("Gradual Hint Escalation");
    expect(SLX_COMMAND_TEMPLATES.start).toContain("Refuse Full Solution Code");

    expect(SLX_COMMAND_TEMPLATES.explain).toContain(".speclearn/scratchpad/");
    expect(SLX_COMMAND_TEMPLATES.explain).toContain("Interactive Micro-Examples");
    expect(SLX_COMMAND_TEMPLATES.explain).toContain("Check for Understanding");

    expect(SLX_COMMAND_TEMPLATES.verify).toContain("tamper-proof test verification");
    expect(SLX_COMMAND_TEMPLATES.verify).toContain("regression_command");
    expect(SLX_COMMAND_TEMPLATES.verify).toContain("diagnostic question");
    expect(SLX_COMMAND_TEMPLATES.verify).toContain("consolidation question");
  });

  it("includes the shared language and verification guardrails", () => {
    const guardrails = guardedContent();
    expect(guardrails).toContain("language");
    expect(guardrails).toContain("Only a passing verification run");
    expect(guardrails).toContain(".speclearn/scratchpad/");
    expect(guardrails).toContain("complete solution code");
  });

  it("creates isolated scratchpad examples without touching production files", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-scratchpad-"));
    const productionFile = join(root, "production.txt");
    await writeFile(productionFile, "keep", "utf8");

    try {
      const example = await createScratchpadExample(root, "TypeScript Generics", "export type Box<T> = { value: T };\n");
      await expect(stat(example)).resolves.toBeDefined();
      await expect(readFile(productionFile, "utf8")).resolves.toBe("keep");
      await expect(readFile(example, "utf8")).resolves.toContain("Box<T>");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("detects clean and dirty Git worktrees safely", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-git-"));

    try {
      await execFileAsync("git", ["init"], { cwd: root });
      await execFileAsync("git", ["config", "user.email", "test@example.com"], { cwd: root });
      await execFileAsync("git", ["config", "user.name", "SpecLearn Test"], { cwd: root });

      let status = await inspectGitStatus(root);
      expect(status.isGitRepository).toBe(true);
      expect(status.isClean).toBe(true);

      await writeFile(join(root, "dirty.txt"), "dirty", "utf8");
      status = await inspectGitStatus(root);
      expect(status.isClean).toBe(false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("marks mastery skips without marking skipped modules completed", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-skip-"));

    try {
      await createEmptyProgress(root);
      await writeProgress(root, {
        active_course_id: "typescript-basics",
        sandbox: { path: ".speclearn/sandbox/typescript-basics" },
        modules: [
          { id: "types", status: "available" },
          { id: "generics", status: "locked" },
        ],
      });

      await skipModule(root, "types");
      const state = await readProgress(root);
      expect(state?.modules.find((module) => module.id === "types")?.status).toBe("skipped_mastered");
      expect(state?.modules.find((module) => module.id === "types")?.status).not.toBe("completed");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("creates stable course slugs", () => {
    expect(courseSlug("TypeScript & Testing!")).toBe("typescript-testing");
  });
});
