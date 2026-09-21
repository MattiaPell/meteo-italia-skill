import { describe, it, expect } from "vitest";
import { normalizeModelId, round1 } from "../models.js";

describe("normalizeModelId", () => {
  it("returns an empty string when given an empty string", () => {
    expect(normalizeModelId("")).toBe("");
  });

  it("returns the same string when there are no hyphens", () => {
    expect(normalizeModelId("icond2")).toBe("icond2");
  });

  it("replaces a single hyphen with an underscore", () => {
    expect(normalizeModelId("icon-eu")).toBe("icon_eu");
  });

  it("replaces multiple hyphens with underscores", () => {
    expect(normalizeModelId("icon-eu-eps")).toBe("icon_eu_eps");
  });

  it("converts uppercase characters to lowercase", () => {
    expect(normalizeModelId("ICON-EU")).toBe("icon_eu");
  });

  it("trims whitespace from the beginning and end", () => {
    expect(normalizeModelId("  icon-eu  ")).toBe("icon_eu");
  });
});

describe("round1", () => {
  it("returns null when given null", () => {
    expect(round1(null)).toBeNull();
  });

  it("rounds to 1 decimal place", () => {
    expect(round1(1.23)).toBe(1.2);
    expect(round1(1.25)).toBe(1.3);
    expect(round1(1.29)).toBe(1.3);
  });

  it("handles negative numbers", () => {
    expect(round1(-1.23)).toBe(-1.2);
    expect(round1(-1.25)).toBe(-1.2); // Math.round(-1.25 * 10) / 10 = Math.round(-12.5) / 10 = -12 / 10 = -1.2
    expect(round1(-1.29)).toBe(-1.3);
  });
});
