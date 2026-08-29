import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { z } from "zod";
import { MeteoError } from "../errors.js";

/**
 * Fase 1.1 — verifica EMPIRICA di cosa succede quando un tool handler lancia
 * MeteoError: l'SDK MCP deve trasformarlo in una risposta `isError: true`
 * senza far crashare il processo stdio né propagare l'eccezione al client.
 */
async function makeServerWithTool(name: string, handler: () => Promise<unknown>): Promise<Client> {
  const server = new McpServer({ name: "test-server", version: "1.0.0" });
  server.registerTool(
    name,
    {
      title: name,
      inputSchema: {},
      outputSchema: undefined as never,
      annotations: { readOnlyHint: true },
    },
    async () => (await handler()) as never,
  );
  const client = new Client({ name: "test-client", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return client;
}

describe("propagazione MeteoError nei tool MCP (SDK 1.x)", () => {
  it("un handler che lancia MeteoError produce isError:true, non un crash", async () => {
    const client = await makeServerWithTool("tool_che_lancia", async () => {
      throw new MeteoError("TIMEOUT", "Request to https://example.com timed out after 10000ms");
    });
    const result = (await client.callTool({ name: "tool_che_lancia", arguments: {} })) as {
      isError?: boolean;
      content?: Array<{ type: string; text: string }>;
    };
    expect(result.isError).toBe(true);
    expect(result.content?.[0]?.text).toContain("timed out");
  });

  it("un handler che lancia un Error generico produce isError:true", async () => {
    const client = await makeServerWithTool("tool_errore_generico", async () => {
      throw new Error("boom improvviso");
    });
    const result = (await client.callTool({ name: "tool_errore_generico", arguments: {} })) as {
      isError?: boolean;
      content?: Array<{ type: string; text: string }>;
    };
    expect(result.isError).toBe(true);
    expect(result.content?.[0]?.text).toContain("boom improvviso");
  });

  it("un handler che ritorna toToolResult con ok:false produce isError:true senza lanciare", async () => {
    const server = new McpServer({ name: "test-server", version: "1.0.0" });
    server.registerTool(
      "tool_ok_false",
      {
        title: "tool_ok_false",
        inputSchema: { q: z.string().optional() },
      },
      async () => ({
        content: [{ type: "text" as const, text: JSON.stringify({ ok: false, error: "HTTP 503" }) }],
        isError: true,
      }),
    );
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [cT, sT] = InMemoryTransport.createLinkedPair();
    await server.connect(sT);
    await client.connect(cT);
    const result = (await client.callTool({ name: "tool_ok_false", arguments: {} })) as {
      isError?: boolean;
    };
    expect(result.isError).toBe(true);
  });

  it("outputSchema presente ma handler che lancia: isError:true, niente validazione output", async () => {
    // Il tool reale meteo_brief dichiara outputSchema; un throw non deve
    // passare dalla validazione zod dell'output ma dall'error path.
    const server = new McpServer({ name: "test-server", version: "1.0.0" });
    server.registerTool(
      "tool_con_outputschema",
      {
        title: "tool_con_outputschema",
        inputSchema: {},
        outputSchema: { ok: z.boolean() },
      },
      async () => {
        throw new MeteoError("NETWORK", "Network error contacting https://api.example.com");
      },
    );
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [cT, sT] = InMemoryTransport.createLinkedPair();
    await server.connect(sT);
    await client.connect(cT);
    const result = (await client.callTool({ name: "tool_con_outputschema", arguments: {} })) as {
      isError?: boolean;
      content?: Array<{ type: string; text: string }>;
    };
    expect(result.isError).toBe(true);
    expect(result.content?.[0]?.text).toContain("Network error");
  });
});
