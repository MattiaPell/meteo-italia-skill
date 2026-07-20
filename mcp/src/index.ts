import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerOpenMeteo } from "./open_meteo.js";
import { registerItalianSources } from "./italian_sources.js";
import { registerSummaries } from "./summaries.js";
import {
  registerClimatology,
  registerBioclimaticIndices,
  registerLocalPhenomena,
  registerModelTuning,
  registerEventReliability,
  registerReferenceGuidelines,
} from "./reference_tools.js";
import { startDebugServer } from "./debug.js";
import { DEBUG_PORT } from "./http.js";

const server = new McpServer({
  name: "meteo-italia-mcp-server",
  version: "1.0.0",
});

registerOpenMeteo(server);
registerItalianSources(server);
registerSummaries(server);
registerClimatology(server);
registerBioclimaticIndices(server);
registerLocalPhenomena(server);
registerModelTuning(server);
registerEventReliability(server);
registerReferenceGuidelines(server);

// Stdio transport for MCP clients.
const transport = new StdioServerTransport();
await server.connect(transport);

// Debug web page on a TCP port (independent of stdio).
startDebugServer(DEBUG_PORT);

console.error("[meteo-italia-mcp] stdio MCP server ready");
