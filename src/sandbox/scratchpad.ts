import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function createScratchpadExample(
  projectRoot: string,
  concept: string,
  source = "// Minimal SpecLearn scratchpad example\n",
): Promise<string> {
  const slug = concept
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "concept";
  const directory = join(projectRoot, ".speclearn", "scratchpad", slug);
  await mkdir(directory, { recursive: true });
  const filePath = join(directory, "example.js");
  await writeFile(filePath, source, "utf8");
  return filePath;
}
