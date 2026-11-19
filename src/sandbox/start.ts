import { loadSpec } from "../parser/load-spec.js";
import { readProgress, writeProgress, type ProgressState } from "../state/progress.js";
import { createLearningBranch, createSandboxDirectory, inspectGitStatus } from "./sandbox.js";

export interface StartResult {
  courseId: string;
  sandbox: { branch?: string; path?: string };
  progress: ProgressState;
}

export async function startCourse(projectRoot: string, coursePath: string): Promise<StartResult> {
  const course = await loadSpec(coursePath);
  const gitStatus = await inspectGitStatus(projectRoot);

  if (gitStatus.isGitRepository && !gitStatus.isClean) {
    throw new Error(
      "The Git working tree has uncommitted changes. Commit or stash unrelated work before starting a course, or use a separate .speclearn/sandbox/ directory.",
    );
  }

  let sandbox: { branch?: string; path?: string };
  if (gitStatus.isGitRepository) {
    const branch = await createLearningBranch(projectRoot, course.id);
    sandbox = { branch };
  } else {
    const path = await createSandboxDirectory(projectRoot, course.id);
    sandbox = { path };
  }

  const existing = await readProgress(projectRoot);
  const modules = course.modules.map((module, index) => {
    const previous = existing?.modules.find((item) => item.id === module.id);
    const hasPrerequisite = module.prerequisites.every((prerequisite) =>
      course.modules.some((candidate) => candidate.id === prerequisite) &&
      (previous?.status === "skipped_mastered" || previous?.status === "completed" ||
        existing?.modules.find((item) => item.id === prerequisite)?.status === "skipped_mastered" ||
        existing?.modules.find((item) => item.id === prerequisite)?.status === "completed"),
    );
    const status = previous?.status ?? (index === 0 || module.prerequisites.length === 0 || hasPrerequisite
      ? "available"
      : "locked");
    return {
      id: module.id,
      status,
      ...(previous?.test_file_sha256 ? { test_file_sha256: previous.test_file_sha256 } : {}),
      ...(previous?.completed_at ? { completed_at: previous.completed_at } : {}),
    };
  });

  const progress: ProgressState = {
    active_course_id: course.id,
    active_course_path: coursePath,
    sandbox,
    modules,
  };
  await writeProgress(projectRoot, progress);

  return { courseId: course.id, sandbox, progress };
}
