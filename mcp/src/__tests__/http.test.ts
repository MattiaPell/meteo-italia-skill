import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiGet, validateApiData, getMetrics } from "../http.js";
import { MeteoError } from "../errors.js";
import { z } from "zod";

describe("apiGet resilience", () => {
  const realFetch = globalThis.fetch;
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    globalThis.fetch = realFetch;
    vi.useRealTimers();
  });

  it("resolves a fast 200 once", async () => {
    globalThis.fetch = vi.fn(
      async () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
    ) as unknown as typeof fetch;
    const r = await apiGet("https://example.com", {});
    expect(r.ok).toBe(true);
    expect((r.data as any).ok).toBe(true);
  });

  it("throws MeteoError after timeout + retries", async () => {
    globalThis.fetch = vi.fn((_url: string, init?: any) => {
      const signal: AbortSignal | undefined = init?.signal;
      return new Promise<Response>((_resolve, reject) => {
        const onAbort = () => {
          const e = new Error("aborted");
          e.name = "AbortError";
          reject(e);
        };
        if (signal) {
          if (signal.aborted) return onAbort();
          signal.addEventListener("abort", onAbort, { once: true });
        }
      });
    }) as unknown as typeof fetch;
    const p = apiGet("https://timeout.example.com", { unique: "timeout-case" }, { noCache: true }).catch((e) => e);
    await vi.runAllTimersAsync();
    const err = await p;
    expect(err).toBeInstanceOf(MeteoError);
    expect((err as MeteoError).code).toBe("TIMEOUT");
  });

  // Regressione E3 (.omo/EVOLUTIVE.md): recordMetrics per 4xx terminali era
  // unreachable code in una versione precedente. Oggi un 404 deve registrare
  // l'errore nelle metriche e ritornare ok:false (mai lanciare).
  it("registra metriche di errore su 4xx terminale (regressione E3)", async () => {
    const host = "e3-regression.example.com";
    const before = getMetrics()[host]?.errors ?? 0;
    globalThis.fetch = vi.fn(async () => new Response("not found", { status: 404 })) as unknown as typeof fetch;
    const r = await apiGet(`https://${host}/v1/missing`, {}, { noCache: true });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(404);
    expect(r.error).toContain("HTTP 404");
    const after = getMetrics()[host]?.errors ?? 0;
    expect(after).toBe(before + 1);
  });
});

describe("validateApiData", () => {
  const schema = z.object({ results: z.array(z.object({ name: z.string() })).optional() });

  it("throws MeteoError on non-ok result", () => {
    expect(() =>
      validateApiData({ ok: false, url: "u", status: 500, data: null, error: "boom", elapsedMs: 1 }, schema, "Src"),
    ).toThrow(MeteoError);
  });

  it("throws MeteoError on bad shape", () => {
    expect(() =>
      validateApiData(
        { ok: true, url: "u", status: 200, data: { results: [{ wrong: 1 }] }, elapsedMs: 1 },
        schema,
        "Src",
      ),
    ).toThrow(MeteoError);
  });

  it("returns parsed data on valid shape", () => {
    const data = validateApiData(
      { ok: true, url: "u", status: 200, data: { results: [{ name: "Roma" }] }, elapsedMs: 1 },
      schema,
      "Src",
    );
    expect(data.results?.[0].name).toBe("Roma");
  });
});
