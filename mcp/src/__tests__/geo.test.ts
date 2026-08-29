import { describe, it, expect } from "vitest";
import { haversine, getDistance } from "../geo.js";

describe("haversine", () => {
  it("computes Milano→Roma ≈ 477 km", () => {
    const d = haversine({ lat: 45.46, lon: 9.19 }, { lat: 41.89, lon: 12.48 });
    expect(Math.abs(d - 477)).toBeLessThan(5);
  });

  it("is zero for identical coordinates", () => {
    expect(haversine({ lat: 10, lon: 10 }, { lat: 10, lon: 10 })).toBeCloseTo(0);
  });

  it("getDistance matches haversine", () => {
    expect(getDistance(45.46, 9.19, 41.89, 12.48)).toBeCloseTo(
      haversine({ lat: 45.46, lon: 9.19 }, { lat: 41.89, lon: 12.48 }),
    );
  });
});
