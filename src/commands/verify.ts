import { exec } from "node:child_process";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { loadSpec, type LoadedCourseSpec } from "../parser/load-spec.js";
import { readProgress, writeProgress, type ProgressState } from "../state/progress.js";
import {
  createVerificationSignature,
  lockTestFiles,
  verifyTestFiles,
} from "../security/integrity.js";

export interface VerificationResult {
  courseId: string;
  moduleId: string;
  testCommand: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  integrityErrors: string[];
  verificationSignature?: string;
  rubricChecks: string[];
  gitDiff: string;
  completed: boolean;
  regressionCommand?: string;
  regressionExitCode?: number;
  regressionStdout?: string;
  regressionStderr?: string;
}

async function findCoursePath(projectRoot: string, state: ProgressState): Promise<string> {
  if (state.active_course_path) {
    return state.active_course_path;
  }

  const specsRoot = join(projectRoot, ".speclearn", "specs");
  try {
    const entries = await readdir(specsRoot, { withFileTypes: true });
    const courseFile = entries.find((entry) => entry.isFile() && (entry.name.endsWith(".course.md") || entry.name.endsWith(".course.yaml") || entry.name.endsWith(".yml") || entry.name.endsWith(".md")));
    if (courseFile) {
      return join(specsRoot, courseFile.name);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  throw new Error("No active course spec path is available. Run speclearn start <course> first.");
}

function resolveModule(course: LoadedCourseSpec, state: ProgressState, requestedModuleId?: string) {
  const moduleId = requestedModuleId ??
    state.modules.find((item) => item.status === "in_progress")?.id ??
    state.modules.find((item) => item.status === "available")?.id;

  if (!moduleId) {
    throw new Error("No active module is available. Run speclearn start <course> first.");
  }

  const module = course.modules.find((item) => item.id === moduleId);
  if (!module) {
    throw new Error(`Module not found in the active course: ${moduleId}`);
  }

  return module;
}

function runCommand(command: string, cwd: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = exec(command, { cwd, windowsHide: true }, (error, stdout, stderr) => {
      resolve({
        exitCode: typeof error?.code === "number" ? error.code : error ? 1 : 0,
        stdout,
        stderr,
      });
    });
    child.on("error", (error) => {
      resolve({ exitCode: 1, stdout: "", stderr: error.message });
    });
  });
}

async function gitDiff(projectRoot: string): Promise<string> {
  return new Promise((resolve) => {
    exec("git diff --stat; git diff", { cwd: projectRoot, windowsHide: true }, (error, stdout) => {
      resolve(error ? "" : stdout);
    });
  });
}

export async function lockModuleTests(projectRoot: string, requestedModuleId?: string): Promise<{ moduleId: string; hashes: Record<string, string> }> {
  const state = await readProgress(projectRoot);
  if (!state) {
    throw new Error("No active progress state. Run speclearn start <course> first.");
  }
  const coursePath = await findCoursePath(projectRoot, state);
  const course = await loadSpec(coursePath);
  const module = resolveModule(course, state, requestedModuleId);

  const result = await lockTestFiles(projectRoot, module.verification.test_files ?? []);
  if (!result.valid) {
    throw new Error(`Unable to lock test files:\n${result.errors.join("\n")}`);
  }

  const modules = state.modules.map((item) =>
    item.id === module.id
      ? { ...item, test_file_sha256: result.hashes }
      : item,
  );
  await writeProgress(projectRoot, { ...state, modules });
  return { moduleId: module.id, hashes: result.hashes };
}

export async function verifyModule(projectRoot: string, requestedModuleId?: string): Promise<VerificationResult> {
  const state = await readProgress(projectRoot);
  if (!state) {
    throw new Error("No active progress state. Run speclearn start <course> first.");
  }

  const coursePath = await findCoursePath(projectRoot, state);
  const course = await loadSpec(coursePath);
  const module = resolveModule(course, state, requestedModuleId);
  const progressModule = state.modules.find((item) => item.id === module.id);

  const testFiles = module.verification.test_files ?? [];
  let integrity: Awaited<ReturnType<typeof verifyTestFiles>>;

  if (testFiles.length === 0) {
    // No test files declared — integrity check is not applicable; treat as valid.
    integrity = { valid: true, hashes: {}, errors: [] };
  } else {
    integrity = await verifyTestFiles(
      projectRoot,
      progressModule?.test_file_sha256,
      testFiles,
    );
  }

  if (!integrity.valid) {
    return {
      courseId: course.id,
      moduleId: module.id,
      testCommand: module.verification.test_command,
      exitCode: -1,
      stdout: "",
      stderr: "",
      integrityErrors: integrity.errors,
      rubricChecks: module.verification.rubric_checks,
      gitDiff: await gitDiff(projectRoot),
      completed: false,
    };
  }

  const result = await runCommand(module.verification.test_command, projectRoot);
  const integrityErrors: string[] = [];

  if (result.exitCode !== 0) {
    return {
      courseId: course.id,
      moduleId: module.id,
      testCommand: module.verification.test_command,
      ...result,
      integrityErrors,
      rubricChecks: module.verification.rubric_checks,
      gitDiff: await gitDiff(projectRoot),
      completed: false,
    };
  }

  // Run optional regression command before marking complete
  if (module.verification.regression_command) {
    const regressionResult = await runCommand(module.verification.regression_command, projectRoot);
    if (regressionResult.exitCode !== 0) {
      return {
        courseId: course.id,
        moduleId: module.id,
        testCommand: module.verification.test_command,
        exitCode: 0,
        stdout: result.stdout,
        stderr: result.stderr,
        integrityErrors,
        rubricChecks: module.verification.rubric_checks,
        gitDiff: await gitDiff(projectRoot),
        completed: false,
        regressionCommand: module.verification.regression_command,
        regressionExitCode: regressionResult.exitCode,
        regressionStdout: regressionResult.stdout,
        regressionStderr: regressionResult.stderr,
      };
    }
  }

  const verificationSignature = createVerificationSignature(
    course.id,
    module.id,
    module.verification.test_command,
    0,
  );

  const completedModules = state.modules.map((item) => {
    if (item.id === module.id) {
      return {
        ...item,
        status: "completed" as const,
        test_file_sha256: integrity.hashes,
        verification_signature: verificationSignature,
        completed_at: new Date().toISOString(),
      };
    }
    return item;
  });

  const modules = completedModules.map((item) => {
    const courseModule = course.modules.find((candidate) => candidate.id === item.id);
    if (!courseModule || item.status !== "locked") {
      return item;
    }
    const prerequisitesComplete = courseModule.prerequisites.every((prerequisite) => {
      const prerequisiteState = completedModules.find((candidate) => candidate.id === prerequisite);
      return prerequisiteState?.status === "completed" || prerequisiteState?.status === "skipped_mastered";
    });
    return prerequisitesComplete ? { ...item, status: "available" as const } : item;
  });

  await writeProgress(projectRoot, { ...state, modules });

  return {
    courseId: course.id,
    moduleId: module.id,
    testCommand: module.verification.test_command,
    ...result,
    integrityErrors,
    verificationSignature,
    rubricChecks: module.verification.rubric_checks,
    gitDiff: await gitDiff(projectRoot),
    completed: true,
  };
}
