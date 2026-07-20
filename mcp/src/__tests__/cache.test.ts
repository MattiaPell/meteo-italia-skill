import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiGet, getCacheStats } from "../http.js";

describe("apiGet cache (E2)", () => {
  const realFetch = globalThis.fetch;
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    globalThis.fetch = realFetch;
    vi.useRealTimers();
  });

  it("serves a repeat GET from cache without a 2nd fetch", async () => {
    let calls = 0;
    globalThis.fetch = vi.fn(async () => {
      calls++;
      return new Response(JSON.stringify({ n: calls }), { status: 200 });
    }) as unknown as typeof fetch;

    const before = getCacheStats();
    const r1 = await apiGet("https://api.open-meteo.com/v1/forecast", { latitude: 1, longitude: 2 });
    const r2 = await apiGet("https://api.open-meteo.com/v1/forecast", { latitude: 1, longitude: 2 });
    await vi.runAllTimersAsync();

    expect(calls).toBe(1);
    expect((r2 as any).cached).toBe(true);
    expect(getCacheStats().hits).toBeGreaterThan(before.hits);
  });
});
