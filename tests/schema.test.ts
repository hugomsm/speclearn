import { describe, expect, it } from "vitest";
import {
  courseModuleSchema,
  courseSpecSchema,
  moduleVerificationSchema,
} from "../src/schema/course-spec.js";

describe("COURSE-SPEC schema extensions", () => {
  const minimalValidCourse = {
    schema_version: "1.0",
    id: "production-feature",
    title: "Production Feature Delivery",
    author: "SpecLearn Team",
    tier: "official",
    level: "intermediate",
    estimated_hours: 3,
    modules: [
      {
        id: "core-domain",
        title: "Core Domain Logic",
        universal_concepts: ["Domain Driven Design"],
        arch_context: ["Clean Architecture"],
        verification: {
          test_command: "pnpm test tests/core.test.ts",
          rubric_checks: ["Pure domain entities"],
        },
      },
    ],
  };

  it("defaults mode to sandbox when omitted", () => {
    const parsed = courseSpecSchema.parse(minimalValidCourse);
    expect(parsed.mode).toBe("sandbox");
  });

  it("accepts mode: workspace explicitly", () => {
    const parsed = courseSpecSchema.parse({
      ...minimalValidCourse,
      mode: "workspace",
    });
    expect(parsed.mode).toBe("workspace");
  });

  it("rejects invalid mode values", () => {
    const result = courseSpecSchema.safeParse({
      ...minimalValidCourse,
      mode: "invalid-mode",
    });
    expect(result.success).toBe(false);
  });

  it("accepts target_files on modules", () => {
    const module = courseModuleSchema.parse({
      id: "feature-impl",
      title: "Feature Implementation",
      universal_concepts: ["Dependency Inversion"],
      arch_context: ["Ports and Adapters"],
      target_files: ["src/domain/payment.ts", "src/ports/payment-gateway.ts"],
      verification: {
        test_command: "pnpm test",
        rubric_checks: ["No leaky abstractions"],
      },
    });
    expect(module.target_files).toEqual([
      "src/domain/payment.ts",
      "src/ports/payment-gateway.ts",
    ]);
  });

  it("accepts regression_command on verification schema", () => {
    const verification = moduleVerificationSchema.parse({
      test_command: "pnpm test tests/feature.test.ts",
      rubric_checks: ["Code is clean"],
      regression_command: "pnpm test:regression",
    });
    expect(verification.regression_command).toBe("pnpm test:regression");
  });

  it("rejects empty regression_command", () => {
    const result = moduleVerificationSchema.safeParse({
      test_command: "pnpm test",
      rubric_checks: ["Passes"],
      regression_command: "   ",
    });
    expect(result.success).toBe(false);
  });
});
