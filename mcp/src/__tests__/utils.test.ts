import { describe, it, expect } from "vitest";
import { escapeRegExp } from "../utils.js";

describe("escapeRegExp", () => {
  it("escapes special regex characters", () => {
    const input = ".*+?^${}()|[]\\";
    const expected = "\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\";
    expect(escapeRegExp(input)).toBe(expected);
  });

  it("leaves normal strings unchanged", () => {
    const input = "hello world 123";
    expect(escapeRegExp(input)).toBe(input);
  });

  it("can be used to build a regex that matches the literal string", () => {
    const literal = "C++";
    const escaped = escapeRegExp(literal);
    const regex = new RegExp(`^${escaped}$`);
    expect(regex.test("C++")).toBe(true);
    expect(regex.test("C  ")).toBe(false);
  });
});
