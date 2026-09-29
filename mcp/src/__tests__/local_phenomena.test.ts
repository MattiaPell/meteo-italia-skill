import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { registerLocalPhenomena } from "../local_phenomena.js";

async function makeClient(): Promise<Client> {
  const server = new McpServer({ name: "test-server", version: "1.0.0" });
  registerLocalPhenomena(server);
  const client = new Client({ name: "test-client", version: "1.0.0" });
  const [cT, sT] = InMemoryTransport.createLinkedPair();
  await server.connect(sT);
  await client.connect(cT);
  return client;
}

type ToolResult = {
  isError?: boolean;
  structuredContent?: {
    ok: boolean;
    url: string;
    status: number;
    data: { detectedPhenomena: string[]; alerts: Record<string, string> };
    elapsedMs: number;
  };
  content?: Array<{ type: string; text: string }>;
};

describe("Local Phenomena Riconoscimento", () => {
  it("meteo_local_phenomena: FOEHN", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 45.0,
        longitude: 8.0, // Piedmont
        temp2m: 15,
        relHum2m: 25,
        windSpeed10m: 35,
        windDir10m: 10, // N
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("FOEHN");
    await client.close();
  });

  it("meteo_local_phenomena: BORA", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 45.65,
        longitude: 13.75, // Trieste
        temp2m: 6,
        relHum2m: 55,
        windSpeed10m: 45,
        windDir10m: 65, // ENE
        weatherCode: 61,
        windGusts10m: 70,
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("BORA");
    await client.close();
  });

  it("meteo_local_phenomena: SCIROCCO", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 38.0,
        longitude: 13.0,
        temp2m: 35,
        relHum2m: 20,
        windSpeed10m: 25,
        windDir10m: 160, // SSE
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("SCIROCCO");
    await client.close();
  });

  it("meteo_local_phenomena: MAESTRALE", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 40.0,
        longitude: 9.0, // Sardinia
        temp2m: 20,
        relHum2m: 50,
        windSpeed10m: 30,
        windDir10m: 310, // NW
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("MAESTRALE");
    await client.close();
  });

  it("meteo_local_phenomena: NEBBIA_PADANA", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 45.2,
        longitude: 9.5, // Po Valley
        temp2m: 4,
        relHum2m: 98,
        windSpeed10m: 2,
        windDir10m: 135,
        weatherCode: 45,
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("NEBBIA_PADANA");
    await client.close();
  });

  it("meteo_local_phenomena: GELICIDIO", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 44.5,
        longitude: 9.0, // Appennino ligure/emiliano
        temp2m: -1,
        relHum2m: 90,
        windSpeed10m: 10,
        windDir10m: 180,
        weatherCode: 66, // Freezing rain
        soilTemp0cm: -2,
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("GELICIDIO");
    await client.close();
  });

  it("meteo_local_phenomena: NEBBIA_MARITTIMA (Caligo / Lupa di Mare)", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 44.0,
        longitude: 9.0, // Liguria costiera
        temp2m: 20,
        relHum2m: 95,
        windSpeed10m: 5,
        windDir10m: 180,
        seaSurfaceTemp: 15,
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("NEBBIA_MARITTIMA");
    await client.close();
  });

  it("meteo_local_phenomena: TRAMONTANA", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 44.0,
        longitude: 9.0,
        temp2m: 5,
        relHum2m: 40, // < 50
        windSpeed10m: 30, // > 22
        windDir10m: 10, // N
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("TRAMONTANA");
    await client.close();
  });

  it("meteo_local_phenomena: GARBINO", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 43.5,
        longitude: 13.5, // Marche coast
        temp2m: 25,
        relHum2m: 30,
        windSpeed10m: 25,
        windDir10m: 230, // SW
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("GARBINO");
    await client.close();
  });

  it("meteo_local_phenomena: MACCAJA", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 44.3,
        longitude: 8.5, // Liguria
        temp2m: 15,
        relHum2m: 90,
        windSpeed10m: 15,
        windDir10m: 180, // S
        cloudCoverLow: 90,
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("MACCAJA");
    await client.close();
  });

  it("meteo_local_phenomena: ADRIATIC_SEA_EFFECT", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 43.0,
        longitude: 14.0, // Marche/Abruzzo offshore
        temp2m: 2,
        relHum2m: 70,
        windSpeed10m: 40,
        windDir10m: 45, // NE
        temp850hPa: -10,
        seaSurfaceTemp: 10, // seaSurfaceTemp - temp850hPa = 20 (> 13)
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("ADRIATIC_SEA_EFFECT");
    await client.close();
  });

  it("meteo_local_phenomena: ACQUA_ALTA", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 45.4,
        longitude: 12.3, // Venice
        temp2m: 10,
        relHum2m: 80,
        windSpeed10m: 35, // > 30
        windDir10m: 135, // SE
        pressureMsl: 995, // < 1005
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("ACQUA_ALTA");
    await client.close();
  });

  it("meteo_local_phenomena: V_SHAPED_STORM & MCS_PADANO", async () => {
    const client = await makeClient();

    // Test V_SHAPED_STORM
    const resVShaped = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 44.5,
        longitude: 8.5,
        temp2m: 25,
        relHum2m: 80,
        windSpeed10m: 20,
        windDir10m: 180,
        cape: 1500, // > 1000
        windSpeed500hPa: 80, // > 70
      },
    })) as ToolResult;
    expect(resVShaped.isError).toBe(false);
    expect(resVShaped.structuredContent!.data.detectedPhenomena).toContain("V_SHAPED_STORM");

    // Test MCS_PADANO
    const resMCS = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 45.5,
        longitude: 9.0, // Padana
        temp2m: 28,
        relHum2m: 60, // < 75 so not V-shaped
        windSpeed10m: 10,
        windDir10m: 180,
        cape: 1200, // > 1000
      },
    })) as ToolResult;
    expect(resMCS.isError).toBe(false);
    expect(resMCS.structuredContent!.data.detectedPhenomena).toContain("MCS_PADANO");

    await client.close();
  });

  it("meteo_local_phenomena: GALAVERNA & BRINA", async () => {
    const client = await makeClient();

    // GALAVERNA
    const resGalaverna = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 45.0,
        longitude: 9.0,
        temp2m: -2,
        soilTemp0cm: -3,
        relHum2m: 98,
        windSpeed10m: 5,
        windDir10m: 0,
        weatherCode: 45, // Fog
      },
    })) as ToolResult;
    expect(resGalaverna.isError).toBe(false);
    expect(resGalaverna.structuredContent!.data.detectedPhenomena).toContain("GALAVERNA");

    // BRINA
    const resBrina = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 45.0,
        longitude: 9.0,
        temp2m: -2,
        soilTemp0cm: -3,
        relHum2m: 80,
        windSpeed10m: 2, // < 4
        windDir10m: 0,
        cloudCover: 10, // < 20
      },
    })) as ToolResult;
    expect(resBrina.isError).toBe(false);
    expect(resBrina.structuredContent!.data.detectedPhenomena).toContain("BRINA");

    await client.close();
  });

  it("meteo_local_phenomena: LIBECCIO", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 40.0,
        longitude: 10.0, // Tirreno
        temp2m: 20,
        relHum2m: 60,
        windSpeed10m: 35, // > 25
        windDir10m: 220, // SW
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("LIBECCIO");
    await client.close();
  });

  it("meteo_local_phenomena: GELO_IRRAGGIAMENTO", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 46.0,
        longitude: 11.0, // Trentino valley
        temp2m: -5,
        relHum2m: 70, // > 60
        windSpeed10m: 2, // < 5
        windDir10m: 0,
        cloudCover: 5, // < 15
        precip7dMm: 0, // < 2
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("GELO_IRRAGGIAMENTO");
    await client.close();
  });

  it("meteo_local_phenomena: NEBBIA_AVVEZIONE", async () => {
    const client = await makeClient();
    const res = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 44.0,
        longitude: 12.5, // Rimini coast
        temp2m: 18,
        relHum2m: 96,
        windSpeed10m: 10, // between 5 and 15
        windDir10m: 90,
        cloudCoverLow: 95, // > 90
        seaSurfaceTemp: 14, // 18 - 14 > 3
      },
    })) as ToolResult;
    expect(res.isError).toBe(false);
    expect(res.structuredContent!.data.detectedPhenomena).toContain("NEBBIA_AVVEZIONE");
    await client.close();
  });

  it("meteo_local_phenomena: BREVA / TIVANO (Lago di Como) via mock", async () => {
    const client = await makeClient();

    const OriginalDate = global.Date;

    // Mock for BREVA (hour 14)
    global.Date = class extends OriginalDate {
      getHours() {
        return 14;
      }
    } as any;

    const resBreva = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 46.0,
        longitude: 9.2, // Lago di Como
        temp2m: 20,
        relHum2m: 50,
        windSpeed10m: 10, // > 8
        windDir10m: 180, // S
      },
    })) as ToolResult;
    expect(resBreva.isError).toBe(false);
    expect(resBreva.structuredContent!.data.detectedPhenomena).toContain("BREVA");

    // Mock for TIVANO (hour 4)
    global.Date = class extends OriginalDate {
      getHours() {
        return 4;
      }
    } as any;

    const resTivano = (await client.callTool({
      name: "meteo_local_phenomena",
      arguments: {
        latitude: 46.0,
        longitude: 9.2, // Lago di Como
        temp2m: 15,
        relHum2m: 50,
        windSpeed10m: 10, // > 8
        windDir10m: 350, // N
      },
    })) as ToolResult;
    expect(resTivano.isError).toBe(false);
    expect(resTivano.structuredContent!.data.detectedPhenomena).toContain("TIVANO");

    global.Date = OriginalDate;
    await client.close();
  });
});
