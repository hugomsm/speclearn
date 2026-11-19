import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { z } from "zod";

export const moduleStatusSchema = z.enum([
  "locked",
  "available",
  "in_progress",
  "skipped_mastered",
  "completed",
]);

export const progressModuleSchema = z.object({
  id: z.string().min(1),
  status: moduleStatusSchema,
  test_file_sha256: z.record(z.string()).optional(),
  verification_signature: z.string().min(1).optional(),
  completed_at: z.string().datetime().optional(),
});

export const progressStateSchema = z.object({
  active_course_id: z.string().nullable().default(null),
  active_course_path: z.string().optional(),
  sandbox: z
    .object({
      branch: z.string().optional(),
      path: z.string().optional(),
    })
    .default({}),
  modules: z.array(progressModuleSchema).default([]),
});

export type ProgressState = z.infer<typeof progressStateSchema>;
export type ProgressModule = z.infer<typeof progressModuleSchema>;

export function progressPath(projectRoot: string): string {
  return join(projectRoot, ".speclearn", "state", "progress.json");
}

export async function readProgress(projectRoot: string): Promise<ProgressState | null> {
  try {
    const source = await readFile(progressPath(projectRoot), "utf8");
    const parsed = progressStateSchema.safeParse(JSON.parse(source));
    if (!parsed.success) {
      throw new Error(`Invalid .speclearn/state/progress.json: ${parsed.error.message}`);
    }
    return parsed.data;
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function writeProgress(projectRoot: string, state: ProgressState): Promise<void> {
  const completedWithoutEvidence = state.modules.find(
    (module) => module.status === "completed" && (!module.verification_signature || !module.test_file_sha256),
  );
  if (completedWithoutEvidence) {
    throw new Error(`Completed module ${completedWithoutEvidence.id} lacks verification evidence`);
  }
  const parsed = progressStateSchema.parse(state);
  const target = progressPath(projectRoot);
  await mkdir(dirname(target), { recursive: true });
  const temporary = `${target}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
  await rename(temporary, target);
}

export async function createEmptyProgress(projectRoot: string): Promise<ProgressState> {
  const state = progressStateSchema.parse({});
  await writeProgress(projectRoot, state);
  return state;
}

export function renderProgressBar(state: ProgressState, width = 24): string {
  if (state.modules.length === 0) {
    return `[${"-".repeat(width)}] 0% (0/0)`;
  }
  const completed = state.modules.filter((module) => module.status === "completed").length;
  const percent = Math.round((completed / state.modules.length) * 100);
  const filled = Math.round((completed / state.modules.length) * width);
  return `[${"#".repeat(filled)}${"-".repeat(width - filled)}] ${percent}% (${completed}/${state.modules.length})`;
}

export function renderDagStatus(state: ProgressState): string {
  if (!state.active_course_id) {
    return "No active course. Run speclearn init and activate a course.";
  }
  if (state.modules.length === 0) {
    return `${state.active_course_id}\n└── No modules available`;
  }

  const lines = [state.active_course_id];
  state.modules.forEach((module, index) => {
    const connector = index === state.modules.length - 1 ? "└──" : "├──";
    const evidence =
      module.status === "completed" && module.verification_signature ? " [verified]" : "";
    lines.push(`${connector} ${module.id}: ${module.status}${evidence}`);
  });
  return lines.join("\n");
}
