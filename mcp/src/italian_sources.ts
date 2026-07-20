import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet, apiPostJson, toToolResult, CHECKWX_API_KEY } from "./http.js";

export function registerItalianSources(server: McpServer) {
  // --- Protezione Civile allerte (WMS) (Step E) ------------------------
  server.registerTool(
    "pc_allerte_wms",
    {
      title: "Protezione Civile Allerte (WMS)",
      description:
        "Fetch the PC civil-protection alert WMS (GetCapabilities / GetMap). NOTE: this endpoint is often network-restricted or returns XML; if it fails, use the human portal https://mappe.protezionecivile.gov.it for the bollettino. Used by skill Step E.",
      inputSchema: {
        service: z.string().default("WMS").describe("OGC service, default WMS"),
        request: z.string().default("GetCapabilities").describe("WMS request: GetCapabilities | GetMap"),
        version: z.string().default("1.3.0").describe("WMS version"),
        layer: z.string().optional().describe("Layer name for GetMap"),
        bbox: z.string().optional().describe("Bounding box for GetMap: minx,miny,maxx,maxy"),
        width: z.coerce.number().int().default(800).optional(),
        height: z.coerce.number().int().default(600).optional(),
        format: z.string().default("application/json").describe("Output format"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ service, request, version, layer, bbox, width, height, format }) => {
      const r = await apiGet("https://mappe.protezionecivile.gov.it/geowebcache/service/wms", {
        service,
        request,
        version,
        layers: layer,
        bbox,
        width,
        height,
        format,
        crs: "EPSG:4326",
      });
      if (!r.ok) {
        r.error = `${r.error} — se l'endpoint è irraggiungibile, consulta https://mappe.protezionecivile.gov.it (bollettino allerte).`;
      }
      return toToolResult(r);
    }
  );

  // --- DPC Radar nowcasting (Step I) -----------------------------------
  server.registerTool(
    "dpc_radar_vmi",
    {
      title: "DPC Radar VMI (nowcasting)",
      description:
        "Find the latest DPC radar product (VMI) and optionally download its image URL. Used by skill Step I for 0-3h nowcasting.",
      inputSchema: {
        productType: z.string().default("VMI").describe("Radar product type, default VMI"),
        download: z.boolean().default(false).describe("If true, also POST downloadProduct and return the image URL"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ productType, download }) => {
      const find = await apiGet("https://radar-api.protezionecivile.it/findLastProductByType", {
        type: productType,
      });
      if (!find.ok || !download) return toToolResult(find);
      const time = (find.data as any)?.time;
      if (time === undefined) return toToolResult(find);
      const dl = await apiPostJson("https://radar-api.protezionecivile.it/downloadProduct", {
        productType,
        productDate: time,
      });
      return toToolResult({
        ...dl,
        data: { find: find.data, download: dl.data },
      });
    }
  );

  // --- CheckWX METAR/TAF (Step K, primary) -----------------------------
  server.registerTool(
    "checkwx_metar_taf",
    {
      title: "CheckWX METAR/TAF",
      description:
        "Decoded METAR/TAF from CheckWX for one or more ICAO airports. Requires CHECKWX_API_KEY env var. Used by skill Step K.",
      inputSchema: {
        icao: z.string().describe("Comma-separated ICAO codes, e.g. LIRF,LIMC,LIPE"),
        type: z.enum(["metar", "taf"]).default("metar").describe("Product type"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ icao, type }) => {
      if (!CHECKWX_API_KEY) {
        return toToolResult({
          ok: false,
          url: "https://api.checkwx.com",
          status: 0,
          data: null,
          error:
            "CHECKWX_API_KEY non impostata. Imposta la variabile d'ambiente o usa aviationweather_metar come fallback.",
          elapsedMs: 0,
        });
      }
      const codes = icao.split(",").map((x) => x.trim().toUpperCase()).join(",");
      const r = await apiGet(`https://api.checkwx.com/v2/${type}/${codes}/decoded`, {}, {
        headers: { "X-API-KEY": CHECKWX_API_KEY },
      });
      return toToolResult(r);
    }
  );

  // --- aviationweather.gov METAR (Step K, fallback) --------------------
  server.registerTool(
    "aviationweather_metar",
    {
      title: "AviationWeather METAR (fallback)",
      description:
        "Raw METAR from aviationweather.gov (no auth). Fallback when CheckWX key is absent. Used by skill Step K.",
      inputSchema: {
        ids: z.string().describe("Comma-separated ICAO codes, e.g. LIRF,LIMC,LIPE"),
        format: z.string().default("json").describe("Response format, default json"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ ids, format }) => {
      const r = await apiGet("https://aviationweather.gov/api/data/metar", {
        ids,
        format,
      });
      return toToolResult(r);
    }
  );

  // --- DMI Lightning (Step L) ------------------------------------------
  server.registerTool(
    "dmi_lightning",
    {
      title: "DMI Lightning Detection",
      description:
        "Recent lightning strikes (GeoJSON FeatureCollection) from DMI Open Data OGC API-Features. Pass bbox (minLon,minLat,maxLon,maxLat) for the Italian macroarea and optionally observed_after for trend. Used by skill Step L.",
      inputSchema: {
        bbox: z.string().describe("Bounding box minLon,minLat,maxLon,maxLat (e.g. 6.5,44.0,14.0,47.0)"),
        limit: z.coerce.number().int().min(1).max(5000).default(1000).describe("Max records"),
        observed_after: z.string().optional().describe("ISO timestamp to fetch trend vs a previous window"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ bbox, limit, observed_after }) => {
      const r = await apiGet(
        "https://opendataapi.dmi.dk/v2/lightningdata/collections/observation/items",
        {
          bbox,
          limit,
          observed: observed_after,
        }
      );
      return toToolResult(r);
    }
  );

  // --- floods.it hydrology (Step M, TIER A) ----------------------------
  server.registerTool(
    "floods_it_monitoring",
    {
      title: "floods.it Hydrology Monitoring",
      description:
        "Real-time hydrology index for Trentino-Alto Adige from floods.it. Use sensor_id to fetch a single station. Used by skill Step M (TIER A).",
      inputSchema: {
        sensor_id: z.string().optional().describe("Optional sensor id; if omitted returns the monitoring index"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ sensor_id }) => {
      const path = sensor_id ? `${sensor_id}.json` : "index.json";
      const r = await apiGet(`https://www.floods.it/api/v1/monitoring/${path}`, {});
      return toToolResult(r);
    }
  );

  // --- ARPAV hydrology (Step M, TIER B) --------------------------------
  server.registerTool(
    "arpav_idro",
    {
      title: "ARPAV Hydrology Stations",
      description:
        "Hydrometric level from ARPA Veneto stations (e.g. Verona 124, Vicenza 108, Bassano 105). The documented REST path is https://api.arpa.veneto.it/rest/v1/meteo/stazioni/{id}/dati; if it is unreachable, use the human portal https://www.arpa.veneto.it/dati-ambientali/dati-in-tempo-reale/meteo. Used by skill Step M (TIER B).",
      inputSchema: {
        station_id: z.string().describe("ARPAV station id, e.g. 124"),
        parametro: z.string().default("livello_idrometrico").describe("Parameter name"),
        periodo: z.string().default("ultimo-giorno").describe("Period selector"),
        base_url: z.string().optional().describe("Override base URL if the REST endpoint path differs"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ station_id, parametro, periodo, base_url }) => {
      const base = base_url ?? "https://api.arpa.veneto.it";
      const r = await apiGet(`${base}/rest/v1/meteo/stazioni/${station_id}/dati`, {
        parametro,
        periodo,
      });
      if (!r.ok) {
        r.error = `${r.error} — REST non raggiungibile da qui; usa il portale https://www.arpa.veneto.it/dati-ambientali/dati-in-tempo-reale/meteo.`;
      }
      return toToolResult(r);
    }
  );

  // --- EUMETSAT satellite (Step N) -------------------------------------
  server.registerTool(
    "eumetsat_satellite_info",
    {
      title: "EUMETSAT Satellite Imagery Info",
      description:
        "Resolve Meteosat imagery collection/endpoint metadata. EUMETSAT requires an API key and returns binary/NetCDF, so this tool returns the collection id, channels and processed-image guidance rather than raw data. Used by skill Step N.",
      inputSchema: {
        channel: z.string().optional().describe("Spectral channel, e.g. VIS0.6, IR10.8, WV6.2"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ channel }) => {
      const info = {
        note:
          "EUMETSAT Data Store richiede CONSUMER_KEY/CONSUMER_SECRET (api.eumetsat.int). Dati grezzi in NetCDF/HRIT; immagini processate in PNG/JPG.",
        collection_id: "EO:EUM:DAT:MSG:HRSEVIRI",
        portal: "https://eoportal.eumetsat.int/",
        api_key_page: "https://api.eumetsat.int/api-key/",
        requested_channel: channel ?? null,
        hint: "Per debug visivo usa le immagini processate HRSEVIRI; il fetch binario va fatto fuori dal MCP.",
      };
      return toToolResult({
        ok: true,
        url: "https://api.eumetsat.int/",
        status: 200,
        data: info,
        elapsedMs: 0,
      });
    }
  );
}
