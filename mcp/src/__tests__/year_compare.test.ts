import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { registerYearCompare } from "../year_compare.js";

const mocks = vi.hoisted(() => ({
  apiGet: vi.fn(),
}));

vi.mock("../http.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../http.js")>();
  return { ...actual, apiGet: mocks.apiGet };
});

describe("meteo_year_compare", () => {
  let server: McpServer;
  let client: Client;
  let clientTransport: InMemoryTransport;
  let serverTransport: InMemoryTransport;

  beforeEach(async () => {
    server = new McpServer({ name: "test-server", version: "1.0.0" });
    registerYearCompare(server);
    client = new Client({ name: "test-client", version: "1.0.0" });
    const transports = InMemoryTransport.createLinkedPair();
    clientTransport = transports[0];
    serverTransport = transports[1];
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    mocks.apiGet.mockReset();
  });

  afterEach(async () => {
    await client.close();
    await server.close();
  });

  it("should calculate anomalies successfully (happy path)", async () => {
    mocks.apiGet.mockImplementation((url: string) => {
      if (url.includes("api.open-meteo.com/v1/forecast")) {
        return Promise.resolve({
          ok: true,
          data: {
            daily: {
              time: ["2026-08-27", "2026-08-28", "2026-08-29"],
              temperature_2m_max: [28, 30, 29],
              temperature_2m_min: [18, 20, 19],
              precipitation_sum: [0, 5, 2],
            },
          },
        });
      }
      if (url.includes("archive-api.open-meteo.com/v1/archive")) {
        return Promise.resolve({
          ok: true,
          data: {
            daily: {
              time: ["2025-08-27", "2025-08-28", "2025-08-29"],
              temperature_2m_max: [25, 26, 25],
              temperature_2m_min: [15, 16, 15],
              precipitation_sum: [1, 1, 1],
            },
          },
        });
      }
      return Promise.resolve({ ok: false });
    });

    const res = (await client.callTool({
      name: "meteo_year_compare",
      arguments: { latitude: 45, longitude: 9, days: 3 },
    })) as { isError?: boolean; structuredContent?: any };

    expect(res.isError).toBe(false);
    expect(res.structuredContent?.ok).toBe(true);

    const data = res.structuredContent?.data;
    expect(data.summary.avgDeltaTmax).toBe(3.7); // (3 + 4 + 4) / 3
    expect(data.trend.temperature).toBe("Più caldo dell'anno scorso");

    expect(data.summary.totalPrecipCurrent).toBe(7);
    expect(data.summary.totalPrecipLastYear).toBe(3);
    expect(data.trend.precipitation).toBe("Più piovoso dell'anno scorso");
  });

  it("should handle api failure", async () => {
    mocks.apiGet.mockImplementation((_url: string) => {
      return Promise.resolve({ ok: false });
    });

    const res = (await client.callTool({
      name: "meteo_year_compare",
      arguments: { latitude: 45, longitude: 9, days: 3 },
    })) as { isError?: boolean; structuredContent?: any; content?: any[] };

    expect(res.isError).toBe(true);
    expect(res.structuredContent?.ok).toBe(false);
    expect(res.structuredContent?.error).toBe("Dati non disponibili: current=false, lastYear=false");
  });

  it("should handle missing data", async () => {
    mocks.apiGet.mockImplementation((url: string) => {
      if (url.includes("api.open-meteo.com/v1/forecast")) {
        return Promise.resolve({
          ok: true,
          data: {
            daily: {
              time: ["2026-08-27", "2026-08-28", "2026-08-29"],
              temperature_2m_max: [null, null, null],
              temperature_2m_min: [null, null, null],
              precipitation_sum: [null, null, null],
            },
          },
        });
      }
      if (url.includes("archive-api.open-meteo.com/v1/archive")) {
        return Promise.resolve({
          ok: true,
          data: {
            daily: {
              time: ["2025-08-27", "2025-08-28", "2025-08-29"],
              temperature_2m_max: [null, null, null],
              temperature_2m_min: [null, null, null],
              precipitation_sum: [null, null, null],
            },
          },
        });
      }
      return Promise.resolve({ ok: false });
    });

    const res = (await client.callTool({
      name: "meteo_year_compare",
      arguments: { latitude: 45, longitude: 9, days: 3 },
    })) as { isError?: boolean; structuredContent?: any };

    expect(res.isError).toBe(false);
    expect(res.structuredContent?.ok).toBe(true);

    const data = res.structuredContent?.data;
    expect(data.summary.avgDeltaTmax).toBeNull();
    expect(data.trend.temperature).toBe("Dati insufficienti");
  });
});
