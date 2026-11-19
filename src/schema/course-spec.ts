import { z } from "zod";

export const KEBAB_CASE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const kebabCaseSchema = z
  .string()
  .trim()
  .regex(KEBAB_CASE_PATTERN, "Must be a kebab-case slug");

export const contextSourcesSchema = z
  .object({
    mcp_resources: z.array(z.string().min(1)).default([]),
    mandatory_adrs: z.array(z.string().min(1)).default([]),
    reference_repo: z.string().min(1).optional(),
  })
  .default({});

export const harnessRulesSchema = z
  .object({
    socratic_mode: z.boolean().default(true),
    allow_full_code_spoiler: z.boolean().default(false),
    scratchpad_enabled: z.boolean().default(true),
  })
  .default({});

export const moduleVerificationSchema = z.object({
  test_command: z
    .string()
    .trim()
    .min(1, "test_command must be a non-empty string"),
  test_files: z.array(z.string().min(1)).optional(),
  rubric_checks: z.array(z.string().min(1)),
});

export const courseModuleSchema = z.object({
  id: kebabCaseSchema,
  title: z.string().trim().min(1),
  prerequisites: z.array(kebabCaseSchema).default([]),
  universal_concepts: z.array(z.string().min(1)),
  arch_context: z.array(z.string().min(1)),
  verification: moduleVerificationSchema,
});

export const courseSpecSchema = z
  .object({
    schema_version: z.literal("1.0"),
    id: kebabCaseSchema,
    title: z.string().trim().min(1),
    author: z.string().trim().min(1),
    tier: z.enum(["official", "community", "personal"]),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    estimated_hours: z.number().positive(),
    locale: z.string().trim().min(1).default("auto"),
    context_sources: contextSourcesSchema,
    harness_rules: harnessRulesSchema,
    modules: z.array(courseModuleSchema).min(1, "At least one module is required"),
  })
  .superRefine((course, context) => {
    const moduleIds = new Set(course.modules.map((module) => module.id));

    for (const module of course.modules) {
      if (moduleIds.size !== course.modules.length) {
        continue;
      }

      for (const prerequisite of module.prerequisites) {
        if (!moduleIds.has(prerequisite)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["modules", course.modules.indexOf(module), "prerequisites"],
            message: `Unknown prerequisite module ID: ${prerequisite}`,
          });
        }
      }
    }

    const visiting = new Set<string>();
    const visited = new Set<string>();

    const visit = (moduleId: string, path: string[]): boolean => {
      if (visiting.has(moduleId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["modules"],
          message: `Circular module dependency detected: ${[...path, moduleId].join(" -> ")}`,
        });
        return true;
      }

      if (visited.has(moduleId)) {
        return false;
      }

      const module = course.modules.find((item) => item.id === moduleId);
      if (!module) {
        return false;
      }

      visiting.add(moduleId);
      for (const prerequisite of module.prerequisites) {
        if (moduleIds.has(prerequisite) && visit(prerequisite, [...path, moduleId])) {
          visiting.delete(moduleId);
          return true;
        }
      }
      visiting.delete(moduleId);
      visited.add(moduleId);
      return false;
    };

    for (const module of course.modules) {
      if (visit(module.id, [])) {
        break;
      }
    }

    const seenIds = new Set<string>();
    for (const [index, module] of course.modules.entries()) {
      if (seenIds.has(module.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["modules", index, "id"],
          message: `Duplicate module ID: ${module.id}`,
        });
      }
      seenIds.add(module.id);
    }
  });

export type CourseSpec = z.infer<typeof courseSpecSchema>;
export type CourseModule = z.infer<typeof courseModuleSchema>;
