import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createBuiltInAdapterRegistry } from "../src/adapters/index.js";

describe("SpecLearn agent adapters", () => {
  it("registers Claude, Copilot, Gemini, and Cursor", () => {
    const registry = createBuiltInAdapterRegistry();
    expect(registry.list().map((adapter) => adapter.id)).toEqual([
      "claude",
      "copilot",
      "gemini",
      "cursor",
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

  it("generates Gemini and Cursor integrations", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-adapters-"));

    try {
      const registry = createBuiltInAdapterRegistry();
      await registry.get("gemini")?.apply(root);
      await registry.get("cursor")?.apply(root);

      for (const name of ["propose", "start", "explain", "verify"]) {
        await expect(stat(join(root, ".gemini", "commands", `slx-${name}.md`))).resolves.toBeDefined();
      }
      await expect(readFile(join(root, "GEMINI.md"), "utf8")).resolves.toContain("SpecLearn Guardrails");
      await expect(readFile(join(root, ".cursor", "rules", "speclearn.mdc"), "utf8")).resolves.toContain("SpecLearn Guardrails");
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
});
