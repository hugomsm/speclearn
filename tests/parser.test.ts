import { describe, expect, it } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  CourseSpecLoadError,
  formatCourseSpecIssues,
  loadSpec,
} from "../src/parser/load-spec.js";

const validCourse = `schema_version: "1.0"
id: typescript-basics
title: TypeScript Basics
author: SpecLearn Team
tier: official
level: beginner
estimated_hours: 4
modules:
  - id: types-and-values
    title: Types and Values
    universal_concepts:
      - Static typing
    arch_context:
      - JavaScript runtime
    verification:
      test_command: pnpm test
      rubric_checks:
        - Uses explicit types
`;

describe("COURSE-SPEC parser", () => {
  it("loads valid Markdown with YAML frontmatter", async () => {
    const directory = await mkdtemp(join(tmpdir(), "speclearn-md-"));
    const file = join(directory, "typescript.course.md");
    await writeFile(file, `---\n${validCourse}---\n# Welcome\nLearn the basics.\n`, "utf8");

    try {
      const course = await loadSpec(file);
      expect(course.id).toBe("typescript-basics");
      expect(course.locale).toBe("auto");
      expect(course.harness_rules.socratic_mode).toBe(true);
      expect(course.pedagogical_guide).toContain("Learn the basics");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("loads valid pure YAML", async () => {
    const directory = await mkdtemp(join(tmpdir(), "speclearn-yaml-"));
    const file = join(directory, "typescript.course.yaml");
    await writeFile(file, validCourse, "utf8");

    try {
      const course = await loadSpec(file);
      expect(course.modules).toHaveLength(1);
      expect(course.modules[0]?.prerequisites).toEqual([]);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("reports missing required fields", async () => {
    const directory = await mkdtemp(join(tmpdir(), "speclearn-invalid-"));
    const file = join(directory, "missing.course.yaml");
    await writeFile(file, 'schema_version: "1.0"\nid: missing-fields\n', "utf8");

    try {
      await expect(loadSpec(file)).rejects.toMatchObject({ kind: "validation" });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("rejects unknown prerequisites", async () => {
    const yaml = `${validCourse}  - id: functions
    title: Functions
    prerequisites:
      - not-created
    universal_concepts:
      - Functions
    arch_context:
      - Runtime
    verification:
      test_command: pnpm test
      rubric_checks:
        - Uses functions
`;

    const directory = await mkdtemp(join(tmpdir(), "speclearn-dag-"));
    const file = join(directory, "unknown.course.yaml");
    await writeFile(file, yaml, "utf8");

    try {
      await expect(loadSpec(file)).rejects.toMatchObject({ kind: "validation" });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("rejects cyclic module dependencies", async () => {
    const yaml = `schema_version: "1.0"
id: cyclic-course
title: Cyclic Course
author: SpecLearn Team
tier: official
level: intermediate
estimated_hours: 2
modules:
  - id: alpha
    title: Alpha
    prerequisites: [beta]
    universal_concepts: [A]
    arch_context: [Runtime]
    verification:
      test_command: pnpm test
      rubric_checks: [Pass]
  - id: beta
    title: Beta
    prerequisites: [alpha]
    universal_concepts: [B]
    arch_context: [Runtime]
    verification:
      test_command: pnpm test
      rubric_checks: [Pass]
`;

    const directory = await mkdtemp(join(tmpdir(), "speclearn-cycle-"));
    const file = join(directory, "cycle.course.yaml");
    await writeFile(file, yaml, "utf8");

    try {
      await expect(loadSpec(file)).rejects.toBeInstanceOf(CourseSpecLoadError);
      await expect(loadSpec(file)).rejects.toMatchObject({ kind: "validation" });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("reports malformed or missing files clearly", async () => {
    await expect(loadSpec("missing.course.yaml")).rejects.toMatchObject({ kind: "file" });

    const directory = await mkdtemp(join(tmpdir(), "speclearn-format-"));
    const file = join(directory, "broken.course.yaml");
    await writeFile(file, "modules: [\n", "utf8");

    try {
      await expect(loadSpec(file)).rejects.toMatchObject({ kind: "format" });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("formats Zod validation issues", async () => {
    const directory = await mkdtemp(join(tmpdir(), "speclearn-format-issues-"));
    const file = join(directory, "invalid.course.yaml");
    await writeFile(file, 'schema_version: "1.0"\nid: "Invalid ID"\n', "utf8");

    try {
      try {
        await loadSpec(file);
      } catch (error) {
        if (error instanceof CourseSpecLoadError) {
          const issues = formatCourseSpecIssues(error.issues);
          expect(issues.join("\n")).toContain("kebab-case");
        }
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
