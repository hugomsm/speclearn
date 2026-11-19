import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";

export interface IntegrityResult {
  valid: boolean;
  hashes: Record<string, string>;
  errors: string[];
}

export function canonicalTestPath(projectRoot: string, testPath: string): string {
  const absolute = isAbsolute(testPath) ? testPath : resolve(projectRoot, testPath);
  return absolute;
}

export function canonicalRelativeTestPath(projectRoot: string, testPath: string): string {
  const absolute = canonicalTestPath(projectRoot, testPath);
  const relative = absolute.replace(/\\/g, "/");
  const root = projectRoot.replace(/\\/g, "/").replace(/\/$/, "");
  return relative.startsWith(root) ? relative.slice(root.length + 1) : relative;
}

export async function sha256File(filePath: string): Promise<string> {
  const metadata = await stat(filePath);
  if (!metadata.isFile()) {
    throw new Error(`Test path is not a file: ${filePath}`);
  }
  if (metadata.size === 0) {
    throw new Error(`Test file is empty: ${filePath}`);
  }
  const bytes = await readFile(filePath);
  return createHash("sha256").update(bytes).digest("hex");
}

export async function lockTestFiles(
  projectRoot: string,
  testFiles: string[] = [],
): Promise<IntegrityResult> {
  const hashes: Record<string, string> = {};
  const errors: string[] = [];

  for (const testPath of testFiles) {
    const absolute = canonicalTestPath(projectRoot, testPath);
    const key = canonicalRelativeTestPath(projectRoot, testPath);
    try {
      hashes[key] = await sha256File(absolute);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  return { valid: errors.length === 0, hashes, errors };
}

export async function verifyTestFiles(
  projectRoot: string,
  lockedHashes: Record<string, string> | undefined,
  testFiles: string[] = [],
): Promise<IntegrityResult> {
  if (!lockedHashes || Object.keys(lockedHashes).length === 0) {
    return {
      valid: false,
      hashes: {},
      errors: ["Test files are not locked. Run speclearn lock-tests before verification."],
    };
  }

  const hashes: Record<string, string> = {};
  const errors: string[] = [];

  for (const testPath of testFiles) {
    const absolute = canonicalTestPath(projectRoot, testPath);
    const key = canonicalRelativeTestPath(projectRoot, testPath);
    try {
      const hash = await sha256File(absolute);
      hashes[key] = hash;
      if (lockedHashes[key] !== hash) {
        errors.push(`Test file integrity mismatch: ${key}`);
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  for (const lockedKey of Object.keys(lockedHashes)) {
    if (!testFiles.some((testPath) => canonicalRelativeTestPath(projectRoot, testPath) === lockedKey)) {
      errors.push(`Locked test file is no longer declared: ${lockedKey}`);
    }
  }

  return { valid: errors.length === 0, hashes, errors };
}

export function createVerificationSignature(
  courseId: string,
  moduleId: string,
  testCommand: string,
  exitCode: number,
): string {
  const canonical = JSON.stringify({ courseId, moduleId, testCommand, exitCode });
  return createHash("sha256").update(canonical).digest("hex");
}
