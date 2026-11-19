import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { lockModuleTests, verifyModule } from "../src/commands/verify.js";
import { createVerificationSignature, sha256File } from "../src/security/integrity.js";
import { writeProgress, readProgress } from "../src/state/progress.js";

const validCourse = `schema_version: "1.0"
id: verify-course
title: Verification Course
author: SpecLearn Team
tier: official
level: beginner
estimated_hours: 1
modules:
  - id: module-one
    title: Module One
    universal_concepts: [Testing]
    arch_context: [Node.js]
    verification:
      test_command: node -e "process.exit(0)"
      test_files:
        - tests/module-one.test.js
      rubric_checks:
        - Uses a passing assertion
`;

describe("deterministic verification", () => {
  it("locks test files and verifies a passing module", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-verify-"));

    try {
      await writeFile(join(root, "course.course.yaml"), validCourse, "utf8");
      const testDirectory = join(root, "tests");
      await import("node:fs/promises").then((fs) => fs.mkdir(testDirectory, { recursive: true }));
      await writeFile(join(root, "tests", "module-one.test.js"), "assert(true);\n", "utf8");

      await writeProgress(root, {
        active_course_id: "verify-course",
        active_course_path: join(root, "course.course.yaml"),
        sandbox: {},
        modules: [{ id: "module-one", status: "available" }],
      });

      const locked = await lockModuleTests(root, "module-one");
      expect(Object.keys(locked.hashes)).toContain("tests/module-one.test.js");

      const result = await verifyModule(root, "module-one");
      expect(result.completed).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(result.verificationSignature).toBe(createVerificationSignature("verify-course", "module-one", 'node -e "process.exit(0)"', 0));

      const state = await readProgress(root);
      expect(state?.modules[0]?.status).toBe("completed");
      expect(state?.modules[0]?.verification_signature).toBe(result.verificationSignature);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("blocks verification when test files are modified or empty", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-integrity-"));

    try {
      await writeFile(join(root, "course.course.yaml"), validCourse, "utf8");
      await import("node:fs/promises").then((fs) => fs.mkdir(join(root, "tests"), { recursive: true }));
      await writeFile(join(root, "tests", "module-one.test.js"), "assert(true);\n", "utf8");

      await writeProgress(root, {
        active_course_id: "verify-course",
        active_course_path: join(root, "course.course.yaml"),
        sandbox: {},
        modules: [{ id: "module-one", status: "available" }],
      });

      await lockModuleTests(root, "module-one");
      await writeFile(join(root, "tests", "module-one.test.js"), "assert(false);\n", "utf8");

      const modified = await verifyModule(root, "module-one");
      expect(modified.completed).toBe(false);
      expect(modified.integrityErrors.join("\n")).toContain("integrity mismatch");

      await writeFile(join(root, "tests", "module-one.test.js"), "", "utf8");
      const empty = await verifyModule(root, "module-one");
      expect(empty.completed).toBe(false);
      expect(empty.integrityErrors.join("\n")).toContain("empty");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("rejects direct completed state without verification evidence", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-direct-edit-"));

    try {
      await expect(writeProgress(root, {
        active_course_id: "verify-course",
        sandbox: {},
        modules: [{ id: "module-one", status: "completed" }],
      })).rejects.toThrow();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("does not mark a module completed when test command fails", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-failing-"));

    try {
      const failingCourse = validCourse.replace('node -e "process.exit(0)"', 'node -e "process.exit(1)"');
      await writeFile(join(root, "course.course.yaml"), failingCourse, "utf8");
      await import("node:fs/promises").then((fs) => fs.mkdir(join(root, "tests"), { recursive: true }));
      await writeFile(join(root, "tests", "module-one.test.js"), "assert(true);\n", "utf8");

      await writeProgress(root, {
        active_course_id: "verify-course",
        active_course_path: join(root, "course.course.yaml"),
        sandbox: {},
        modules: [{ id: "module-one", status: "available" }],
      });
      await lockModuleTests(root, "module-one");

      const result = await verifyModule(root, "module-one");
      expect(result.completed).toBe(false);
      expect(result.exitCode).not.toBe(0);

      const state = await readProgress(root);
      expect(state?.modules[0]?.status).not.toBe("completed");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("returns a SHA-256 digest for a real test file", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-hash-"));
    try {
      const file = join(root, "test.js");
      await writeFile(file, "assert(true);\n", "utf8");
      const hash = await sha256File(file);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
