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

});

describe("getDistance", () => {
  it("computes Milano→Roma ≈ 477 km", () => {
    const d = getDistance(45.46, 9.19, 41.89, 12.48);
    expect(Math.abs(d - 477)).toBeLessThan(5);
  });

  it("is zero for identical coordinates", () => {
    expect(getDistance(10, 10, 10, 10)).toBeCloseTo(0);
  });

  it("matches haversine results", () => {
    const lat1 = 45.46;
    const lon1 = 9.19;
    const lat2 = 41.89;
    const lon2 = 12.48;
    expect(getDistance(lat1, lon1, lat2, lon2)).toBeCloseTo(
      haversine({ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 }),
    );
  });

  it("is commutative", () => {
    const lat1 = 45.46;
    const lon1 = 9.19;
    const lat2 = 41.89;
    const lon2 = 12.48;
    expect(getDistance(lat1, lon1, lat2, lon2)).toBeCloseTo(
      getDistance(lat2, lon2, lat1, lon1),
    );
  });
});
