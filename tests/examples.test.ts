import { describe, expect, it } from "vitest";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { loadSpec } from "../src/parser/load-spec.js";

describe("Examples directory validation", () => {
  const examplesDir = join(process.cwd(), "examples");

  it("finds and validates all course spec files in examples/", async () => {
    const entries = await readdir(examplesDir);
    const specFiles = entries.filter(
      (file) =>
        file.endsWith(".course.md") ||
        file.endsWith(".md") ||
        file.endsWith(".course.yaml") ||
        file.endsWith(".yaml") ||
        file.endsWith(".yml"),
    );

    expect(specFiles.length).toBeGreaterThanOrEqual(2);

    for (const file of specFiles) {
      const filePath = join(examplesDir, file);
      const course = await loadSpec(filePath);

      expect(course.id).toBeDefined();
      expect(course.schema_version).toBe("1.0");
      expect(course.modules.length).toBeGreaterThan(0);

      for (const module of course.modules) {
        expect(module.id).toBeDefined();
        expect(module.title).toBeDefined();
        expect(module.verification.test_command).toBeTruthy();
        expect(module.verification.rubric_checks.length).toBeGreaterThan(0);
      }
    }
  });

  it("validates typescript-clean-architecture.course.md structure and guide", async () => {
    const filePath = join(examplesDir, "typescript-clean-architecture.course.md");
    const course = await loadSpec(filePath);

    expect(course.id).toBe("typescript-clean-architecture");
    expect(course.tier).toBe("official");
    expect(course.level).toBe("intermediate");
    expect(course.estimated_hours).toBe(6);
    expect(course.modules).toHaveLength(3);
    expect(course.modules[0]?.id).toBe("domain-entities-and-aggregates");
    expect(course.modules[1]?.id).toBe("hexagonal-ports-and-use-cases");
    expect(course.modules[1]?.prerequisites).toEqual(["domain-entities-and-aggregates"]);
    expect(course.modules[2]?.id).toBe("infrastructure-adapters-and-wiring");
    expect(course.modules[2]?.prerequisites).toEqual(["hexagonal-ports-and-use-cases"]);

    expect(course.pedagogical_guide).toBeDefined();
    expect(course.pedagogical_guide).toContain("Socratic Agent Guidance");
    expect(course.pedagogical_guide).toContain("Architecture Blueprint");
  });

  it("validates python-async-resilience.course.yaml pure YAML structure", async () => {
    const filePath = join(examplesDir, "python-async-resilience.course.yaml");
    const course = await loadSpec(filePath);

    expect(course.id).toBe("python-async-resilience");
    expect(course.tier).toBe("official");
    expect(course.level).toBe("advanced");
    expect(course.estimated_hours).toBe(8);
    expect(course.modules).toHaveLength(3);
    expect(course.modules[0]?.id).toBe("async-event-loop-and-taskgroups");
    expect(course.modules[1]?.id).toBe("retry-and-exponential-backoff");
    expect(course.modules[1]?.prerequisites).toEqual(["async-event-loop-and-taskgroups"]);
    expect(course.modules[2]?.id).toBe("circuit-breaker-pattern");
    expect(course.modules[2]?.prerequisites).toEqual(["retry-and-exponential-backoff"]);
  });
});
