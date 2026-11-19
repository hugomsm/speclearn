import { readFile } from "node:fs/promises";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";
import { ZodError } from "zod";
import {
  courseSpecSchema,
  type CourseSpec,
} from "../schema/course-spec.js";

export type LoadedCourseSpec = CourseSpec & {
  pedagogical_guide?: string;
};

export class CourseSpecLoadError extends Error {
  constructor(
    message: string,
    readonly kind: "file" | "format" | "validation",
    readonly issues?: unknown,
  ) {
    super(message);
    this.name = "CourseSpecLoadError";
  }
}

export function parseCourseData(data: unknown): LoadedCourseSpec {
  const parsed = courseSpecSchema.safeParse(data);
  if (!parsed.success) {
    throw new CourseSpecLoadError(
      "The course document failed COURSE-SPEC validation",
      "validation",
      parsed.error,
    );
  }

  return parsed.data;
}

export async function loadSpec(filePath: string): Promise<LoadedCourseSpec> {
  const normalizedPath = filePath.trim();
  if (!normalizedPath) {
    throw new CourseSpecLoadError("A course file path is required", "file");
  }

  let source: string;
  try {
    source = await readFile(normalizedPath, "utf8");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new CourseSpecLoadError(`Unable to read course file: ${detail}`, "file", error);
  }

  if (/\.ya?ml$/i.test(normalizedPath) || /\.course\.ya?ml$/i.test(normalizedPath)) {
    try {
      const data = parseYaml(source);
      return parseCourseData(data);
    } catch (error) {
      if (error instanceof CourseSpecLoadError) {
        throw error;
      }
      throw new CourseSpecLoadError(
        "The YAML course document is malformed",
        "format",
        error,
      );
    }
  }

  if (/\.md$/i.test(normalizedPath) || /\.course\.md$/i.test(normalizedPath)) {
    try {
      const parsed = matter(source);
      const data = parseCourseData(parsed.data);
      return {
        ...data,
        pedagogical_guide: parsed.content.trim(),
      };
    } catch (error) {
      if (error instanceof CourseSpecLoadError) {
        throw error;
      }
      throw new CourseSpecLoadError(
        "The Markdown frontmatter is malformed",
        "format",
        error,
      );
    }
  }

  throw new CourseSpecLoadError(
    "Unsupported course file type. Use .md, .course.md, .yml, or .yaml",
    "format",
  );
}

export function formatCourseSpecIssues(error: unknown): string[] {
  if (!(error instanceof ZodError)) {
    return [error instanceof Error ? error.message : String(error)];
  }

  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "course";
    return `${path}: ${issue.message}`;
  });
}
