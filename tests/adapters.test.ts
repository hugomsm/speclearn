import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createBuiltInAdapterRegistry } from "../src/adapters/index.js";

describe("SpecLearn agent adapters", () => {
  it("registers Claude, Copilot, Antigravity, Cursor, and Generic", () => {
    const registry = createBuiltInAdapterRegistry();
    expect(registry.list().map((adapter) => adapter.id)).toEqual([
      "claude",
      "copilot",
      "antigravity",
      "cursor",
      "generic",
    ]);
  });

  it("generates native Claude and Copilot command files", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-adapters-"));

    try {
      const registry = createBuiltInAdapterRegistry();
      await registry.get("claude")?.apply(root);
      await registry.get("copilot")?.apply(root);

      for (const name of ["propose", "start", "explain", "verify"]) {
        await expect(stat(join(root, ".claude", "commands", "slx", `${name}.md`))).resolves.toBeDefined();
        await expect(stat(join(root, ".github", "prompts", `slx-${name}.prompt.md`))).resolves.toBeDefined();
      }

      await expect(readFile(join(root, "CLAUDE.md"), "utf8")).resolves.toContain("SpecLearn Guardrails");
      await expect(readFile(join(root, ".github", "copilot-instructions.md"), "utf8")).resolves.toContain("SpecLearn Guardrails");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("generates Antigravity and Cursor integrations", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-adapters-"));

    try {
      const registry = createBuiltInAdapterRegistry();
      await registry.get("antigravity")?.apply(root);
      await registry.get("cursor")?.apply(root);

      for (const name of ["propose", "start", "explain", "verify"]) {
        await expect(stat(join(root, ".gemini", "commands", `slx-${name}.md`))).resolves.toBeDefined();
      }
      await expect(readFile(join(root, "ANTIGRAVITY.md"), "utf8")).resolves.toContain("SpecLearn Guardrails");
      await expect(readFile(join(root, ".cursor", "rules", "speclearn.mdc"), "utf8")).resolves.toContain("SpecLearn Guardrails");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("generates Generic agent skills and AGENTS.md guardrails", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-generic-adapters-"));

    try {
      const registry = createBuiltInAdapterRegistry();
      await registry.get("generic")?.apply(root);

      for (const name of ["slx-propose", "slx-start", "slx-explain", "slx-verify"]) {
        const skillPath = join(root, ".agents", "skills", name, "SKILL.md");
        await expect(stat(skillPath)).resolves.toBeDefined();
        const skillContent = await readFile(skillPath, "utf8");
        expect(skillContent).toContain(`name: ${name}`);
        expect(skillContent).toContain("---");
        expect(skillContent).toContain("SpecLearn");
      }
      const proposeSkill = await readFile(join(root, ".agents", "skills", "slx-propose", "SKILL.md"), "utf8");
      expect(proposeSkill).toContain(".speclearn/specs/<id>.course.md");
      expect(proposeSkill).toContain("YAML frontmatter");
      expect(proposeSkill).toContain("npx speclearn validate");
      await expect(readFile(join(root, "AGENTS.md"), "utf8")).resolves.toContain("SpecLearn Guardrails");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("allows a community adapter to register", () => {
    const registry = createBuiltInAdapterRegistry();
    registry.register({
      id: "community-agent",
      name: "Community Agent",
      async apply() {},
    });
    expect(registry.get("community-agent")?.name).toBe("Community Agent");
  });

  it("includes complete SDL skill content in every built-in adapter", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-sdl-adapters-"));

    try {
      const registry = createBuiltInAdapterRegistry();
      await registry.get("claude")?.apply(root);
      await registry.get("copilot")?.apply(root);
      await registry.get("antigravity")?.apply(root);
      await registry.get("cursor")?.apply(root);

      const claudePropose = await readFile(join(root, ".claude", "commands", "slx", "propose.md"), "utf8");
      const copilotStart = await readFile(join(root, ".github", "prompts", "slx-start.prompt.md"), "utf8");
      const antigravityExplain = await readFile(join(root, ".gemini", "commands", "slx-explain.md"), "utf8");
      const cursorRules = await readFile(join(root, ".cursor", "rules", "speclearn.mdc"), "utf8");

      expect(claudePropose).toContain("Universal Language Mirroring");
      expect(copilotStart).toContain("three-minute diagnostic");
      expect(antigravityExplain).toContain(".speclearn/scratchpad/");
      expect(cursorRules).toContain("SHA-256");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
