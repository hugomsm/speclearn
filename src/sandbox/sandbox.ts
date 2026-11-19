import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface GitStatus {
  isGitRepository: boolean;
  isClean: boolean;
  output: string;
}

export async function inspectGitStatus(projectRoot: string): Promise<GitStatus> {
  try {
    await execFileAsync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: projectRoot });
  } catch {
    return { isGitRepository: false, isClean: true, output: "" };
  }

  try {
    const { stdout } = await execFileAsync("git", ["status", "--porcelain"], { cwd: projectRoot });
    return { isGitRepository: true, isClean: stdout.trim().length === 0, output: stdout };
  } catch (error) {
    throw new Error(`Unable to inspect Git status: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function courseSlug(courseId: string): string {
  const slug = courseId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return slug || "course";
}

export async function createSandboxDirectory(projectRoot: string, courseId: string): Promise<string> {
  const path = join(projectRoot, ".speclearn", "sandbox", courseSlug(courseId));
  await mkdir(path, { recursive: true });
  return path;
}

export async function createLearningBranch(projectRoot: string, courseId: string): Promise<string> {
  const branch = `speclearn/${courseSlug(courseId)}`;
  try {
    await execFileAsync("git", ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`], { cwd: projectRoot });
    await execFileAsync("git", ["switch", branch], { cwd: projectRoot });
  } catch {
    await execFileAsync("git", ["switch", "-c", branch], { cwd: projectRoot });
  }
  return branch;
}
