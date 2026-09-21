import { describe, it, expect } from "vitest";
import { normalizeModelId, round1 } from "../models";

describe("models", () => {
  describe("round1", () => {
    it("returns null when input is null", () => {
      expect(round1(null)).toBeNull();
    });

    it("rounds positive numbers to 1 decimal place", () => {
      expect(round1(1.23)).toBe(1.2);
      expect(round1(1.25)).toBe(1.3);
      expect(round1(1.28)).toBe(1.3);
    });

    it("rounds negative numbers to 1 decimal place", () => {
      expect(round1(-1.23)).toBe(-1.2);
      expect(round1(-1.25)).toBe(-1.2); // Math.round(-1.25 * 10) / 10 -> Math.round(-12.5) / 10 -> -12 / 10 -> -1.2
      expect(round1(-1.28)).toBe(-1.3);
    });

    it("handles zero correctly", () => {
      expect(round1(0)).toBe(0);
      expect(round1(-0)).toBe(-0); // Though 0 and -0 are technically strictly equal in toBe
    });

    it("preserves numbers already at 1 decimal place", () => {
      expect(round1(5.5)).toBe(5.5);
      expect(round1(-5.5)).toBe(-5.5);
    });
  });

  describe("normalizeModelId", () => {
    it("converts to lowercase and trims", () => {
      expect(normalizeModelId("  ICON-EU  ")).toBe("icon_eu");
    });

    it("replaces all dashes with underscores", () => {
      expect(normalizeModelId("a-b-c-d")).toBe("a_b_c_d");
    });

    it("leaves already normalized IDs unchanged", () => {
      expect(normalizeModelId("icon_eu")).toBe("icon_eu");
    });
  });
});
