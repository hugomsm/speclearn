import { describe, expect, it } from "vitest";
import { BANNER, createCli, VERSION } from "../src/cli.js";

describe("speclearn CLI", () => {
  it("exposes CLI identity and version", () => {
    const program = createCli();

    expect(program.name()).toBe("speclearn");
    expect(program.description()).toContain("Spec-Driven Learning");
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("renders a banner and provides Commander help", () => {
    const program = createCli();
    const help = program.helpInformation();

    expect(BANNER.length).toBeGreaterThan(20);
    expect(help).toContain("Usage:");
    expect(help).toContain("--help");
  });
});
