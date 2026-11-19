import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { initializeWorkspace, parseAgentIds } from "../src/init/initialize.js";

describe("SpecLearn workspace initialization", () => {
  it("creates required directories and config without losing existing content", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-init-"));
    const keepFile = join(root, ".speclearn", "specs", "keep.md");

    try {
      await initializeWorkspace({ projectRoot: root, agents: ["claude"] });
      await writeFile(keepFile, "keep me", "utf8");
      await initializeWorkspace({ projectRoot: root, agents: ["claude"] });

      await expect(stat(join(root, ".speclearn", "specs"))).resolves.toBeDefined();
      await expect(stat(join(root, ".speclearn", "state"))).resolves.toBeDefined();
      await expect(stat(join(root, ".speclearn", "scratchpad"))).resolves.toBeDefined();
      await expect(readFile(keepFile, "utf8")).resolves.toBe("keep me");
      await expect(readFile(join(root, ".speclearn", "config.yaml"), "utf8")).resolves.toContain("schema_version");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("updates gitignore idempotently", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-gitignore-"));

    try {
      await initializeWorkspace({ projectRoot: root, agents: [] });
      await initializeWorkspace({ projectRoot: root, agents: [] });

      const gitignore = await readFile(join(root, ".gitignore"), "utf8");
      expect(gitignore.split(/\r?\n/).filter((line) => line === ".speclearn/state/")).toHaveLength(1);
      expect(gitignore.split(/\r?\n/).filter((line) => line === ".speclearn/scratchpad/")).toHaveLength(1);
      expect(gitignore).not.toContain(".speclearn/specs/");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("parses and validates agent identifiers", () => {
    expect(parseAgentIds("claude,copilot,gemini,cursor,claude")).toEqual([
      "claude",
      "copilot",
      "gemini",
      "cursor",
    ]);
    expect(() => parseAgentIds("claude,unknown")).toThrow("Unsupported agent(s): unknown");
  });
});
