import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerOpenMeteo } from "./open_meteo.js";
import { registerItalianSources } from "./italian_sources.js";
import { registerDpc } from "./dpc.js";
import { registerArpav } from "./regioni/arpav.js";
import { registerMeteotrentino } from "./regioni/meteotrentino.js";
import { registerArpae } from "./regioni/arpae.js";
import { registerArpaFvg } from "./regioni/arpa-fvg.js";
import { registerArpaMarche } from "./regioni/arpa-marche.js";
import { registerArpaLombardia } from "./regioni/arpa-lombardia.js";
import { registerBrief } from "./brief.js";
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
registerDpc(server);
registerArpav(server);
registerMeteotrentino(server);
registerArpae(server);
registerArpaFvg(server);
registerArpaMarche(server);
registerArpaLombardia(server);
registerBrief(server);
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
