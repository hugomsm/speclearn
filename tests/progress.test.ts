import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createEmptyProgress,
  progressStateSchema,
  readProgress,
  renderDagStatus,
  renderProgressBar,
  writeProgress,
} from "../src/state/progress.js";

describe("SpecLearn progress state", () => {
  it("creates and reads a valid empty state", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-progress-"));
    try {
      await createEmptyProgress(root);
      const state = await readProgress(root);
      expect(state?.active_course_id).toBeNull();
      expect(state?.modules).toEqual([]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("validates module statuses and hashes", () => {
    expect(progressStateSchema.safeParse({
      active_course_id: "typescript-basics",
      sandbox: { branch: "learning/typescript-basics", path: "./sandbox" },
      modules: [{
        id: "types-and-values",
        status: "completed",
        test_file_sha256: { "tests/types.test.ts": "abc123" },
        completed_at: "2026-11-19T12:00:00.000Z",
      }],
    }).success).toBe(true);

    expect(progressStateSchema.safeParse({
      modules: [{ id: "broken", status: "unknown" }],
    }).success).toBe(false);
  });

  it("renders progress and DAG status for active and inactive courses", () => {
    const active = progressStateSchema.parse({
      active_course_id: "typescript-basics",
      modules: [
        { id: "types-and-values", status: "completed" },
        { id: "generics", status: "available" },
      ],
    });

    expect(renderProgressBar(active)).toContain("50% (1/2)");
    expect(renderDagStatus(active)).toContain("typescript-basics");
    expect(renderDagStatus(active)).toContain("generics: available");

    const inactive = progressStateSchema.parse({});
    expect(renderDagStatus(inactive)).toContain("No active course");
  });

  it("writes state atomically and preserves state fields", async () => {
    const root = await mkdtemp(join(tmpdir(), "speclearn-progress-write-"));
    try {
      await writeProgress(root, progressStateSchema.parse({
        active_course_id: "typescript-basics",
        sandbox: { branch: "learning/typescript-basics" },
        modules: [{ id: "types", status: "in_progress" }],
      }));

      const state = await readProgress(root);
      expect(state?.sandbox.branch).toBe("learning/typescript-basics");
      expect(state?.modules[0]?.status).toBe("in_progress");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
