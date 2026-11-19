import { readProgress, writeProgress, type ProgressState } from "../state/progress.js";

export async function skipModule(projectRoot: string, moduleId: string): Promise<ProgressState> {
  const state = await readProgress(projectRoot);
  if (!state) {
    throw new Error("No active course. Run speclearn start <course> first.");
  }

  const module = state.modules.find((item) => item.id === moduleId);
  if (!module) {
    throw new Error(`Module not found in active progress: ${moduleId}`);
  }

  const updatedModules = state.modules.map((item) =>
    item.id === moduleId
      ? { ...item, status: "skipped_mastered" as const }
      : item,
  );

  const updated: ProgressState = { ...state, modules: updatedModules };
  await writeProgress(projectRoot, updated);
  return updated;
}
