import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet, apiPostJson, toToolResult, CHECKWX_API_KEY } from "./http.js";
import { haversine } from "./geo.js";

/** Map CheckWX decoded / AviationWeather shapes into a normalized station record. */
function parseMetarStation(s: any, nwpTempC?: number): any {
  const tempC = s.temp_c ?? s.temperature?.celsius ?? null;
  const windKt = s.wind_speed_kt ?? s.wind_speed?.kts ?? null;
  const windDir = s.wind_dir_degrees ?? s.wind_direction?.degrees ?? null;
  const visMi = s.visibility_statute_mi ?? s.visibility?.statute_miles ?? null;
  const visibilityM = visMi != null ? Math.round(visMi * 1609.34) : null;
  const sky = Array.isArray(s.sky_condition)
    ? s.sky_condition.map((c: any) => c.sky_cover).join("/")
    : s.cloud_base ?? null;
  const qnhHpa =
    s.altim_in_hpa ?? (s.altim_in_hg != null ? Math.round(s.altim_in_hg * 33.8639) : null);
  return {
    icao: s.icaoId ?? s.station_id ?? s.icao ?? null,
    tempC,
    windKt,
    windDir,
    visibilityM,
    skyCover: sky,
    qnhHpa,
    decodedVsNwp:
      nwpTempC != null && tempC != null
        ? { tempScarto: Math.round(Math.abs(tempC - nwpTempC) * 10) / 10, visFlag: visibilityM != null && visibilityM < 2000 }
        : { tempScarto: null, visFlag: false },
  };
}

/** Parse an AviationWeather raw METAR text into the same normalized shape. */
export function parseRawMetar(raw: string, _s: any): any {
  const temp = raw.match(/(\d{2})\/(\d{2})\//);
  const wind = raw.match(/(\d{3})(\d{2})(?:G(\d{2}))?KT/);
  // Visibility: CAVOK → unlimited; otherwise the 4-digit field that follows
  // the wind group (VVVV in meters for Italian METARs, 9999 = ≥10km).
  const cavok = /CAVOK/.test(raw);
  const visMatch = raw.match(/\s(\d{4})(?=\s|$)/);
  const visibilityM = cavok ? null : visMatch ? parseInt(visMatch[1], 10) : null;
  return {
    raw_text: raw,
    temp_c: temp ? parseInt(temp[1], 10) : null,
    wind_speed_kt: wind ? parseInt(wind[2], 10) : null,
    wind_gust_kt: wind && wind[3] ? parseInt(wind[3], 10) : null,
    wind_dir_degrees: wind ? parseInt(wind[1], 10) : null,
    visibility_statute_mi: visibilityM != null ? visibilityM / 1609.34 : cavok ? null : null,
    cavok,
  };
}

/** Normalize the PC bollettino JSON into a flat list of regional alert levels. */
const LEVEL_BY_COLOR: Record<string, number> = {
  verde: 0,
  giallo: 1,
  arancione: 2,
  rosso: 3,
};
export function parseAllerte(data: any, regione?: string): any {
  const records: any[] = [];
  const push = (reg: string, livello: string, tipo: string) => {
    const color = livello?.toLowerCase()?.trim();
    records.push({
      regione: reg,
      livello,
      colore: color,
      livelloCodice: LEVEL_BY_COLOR[color] ?? -1,
      tipo_rischio: tipo,
    });
  };
  // Shape 1: { regioni: [{nome, allerte:[{livello, rischio}]}] }
  const regioni = data?.regioni ?? data?.regioni_allerta ?? [];
  if (Array.isArray(regioni)) {
    for (const r of regioni) {
      const nome = r.nome ?? r.regione;
      const liste = r.allerte ?? r.rischi ?? [];
      for (const a of liste) push(nome, a.livello ?? a.colore, a.rischio ?? a.tipo);
    }
  }
  // Shape 2: flat array of {regione, livello, rischio}
  if (!records.length && Array.isArray(data)) {
    for (const a of data) push(a.regione ?? a.nome, a.livello ?? a.colore, a.rischio ?? a.tipo);
  }
  const filtered = regione ? records.filter((x) => x.regione?.toLowerCase().includes(regione.toLowerCase())) : records;
  const maxLevel = filtered.reduce((m, x) => Math.max(m, x.livelloCodice), -1);
  return {
    source: "bollettino_protezionecivile",
    allertaMax: maxLevel,
    count: filtered.length,
    alerts: filtered,
    raw: data,
  };
}

export function registerItalianSources(server: McpServer) {
  // --- Protezione Civile allerte (Step E) ------------------------
  server.registerTool(
    "pc_allerte_wms",
    {
      title: "Protezione Civile Allerte",
      description:
        "Fetch the PC civil-protection alert level per region. Tries the public bollettino JSON API first; falls back to the WMS endpoint if needed. Returns a normalized list of {regione, livello, colore, tipo_rischio}. Used by skill Step E.",
      inputSchema: {
        regione: z.string().optional().describe("Filter by region name (e.g. 'Lombardia'). Omit for all."),
        service: z.string().default("WMS").describe("OGC service for fallback, default WMS"),
        request: z.string().default("GetCapabilities").describe("WMS request when falling back"),
        version: z.string().default("1.3.0").describe("WMS version"),
        layer: z.string().optional().describe("Layer name for WMS GetMap"),
        bbox: z.string().optional().describe("Bounding box for WMS GetMap"),
        width: z.coerce.number().int().default(800).optional(),
        height: z.coerce.number().int().default(600).optional(),
        format: z.string().default("application/json").describe("Output format"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ regione, service, request, version, layer, bbox, width, height, format }) => {
      // 1) Try the public bollettino di criticità JSON API (real alert data).
      const bulletin = await apiGet(
        "https://api.protezionecivile.gov.it/bollettini/allerte/ultimo",
        {}
      );
      if (bulletin.ok) {
        const parsed = parseAllerte(bulletin.data, regione);
        return toToolResult({ ...bulletin, data: parsed });
      }
      // 2) Fallback to WMS.
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
        nwpTempC: z.coerce.number().optional().describe("Optional NWP forecast temperature (°C) for scarto comparison"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ icao, type, nwpTempC }) => {
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
      if (!r.ok) return toToolResult(r);
      const arr = Array.isArray((r.data as any)?.data) ? (r.data as any).data : [(r.data as any)?.data];
      const stations = arr.filter(Boolean).map((s: any) => parseMetarStation(s, nwpTempC));
      return toToolResult({ ...r, data: { stations, raw: r.data } });
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
        nwpTempC: z.coerce.number().optional().describe("Optional NWP forecast temperature (°C) for scarto comparison"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ ids, format, nwpTempC }) => {
      const r = await apiGet("https://aviationweather.gov/api/data/metar", {
        ids,
        format,
      });
      if (!r.ok) return toToolResult(r);
      // aviationweather returns either an array or {data: [...]} / {features: [...]}
      const payload = r.data as any;
      const list = Array.isArray(payload)
        ? payload
        : payload?.data ?? payload?.features ?? [payload];
      const stations = list.filter(Boolean).map((s: any) => {
        if (s.raw_text) return parseMetarStation(parseRawMetar(s.raw_text, s), nwpTempC);
        return parseMetarStation(s, nwpTempC);
      });
      return toToolResult({ ...r, data: { stations, raw: r.data } });
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
        lat: z.coerce.number().optional().describe("Reference latitude to compute nearest strike distance (km)"),
        lon: z.coerce.number().optional().describe("Reference longitude to compute nearest strike distance (km)"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ bbox, limit, observed_after, lat, lon }) => {
      const r = await apiGet(
        "https://opendataapi.dmi.dk/v2/lightningdata/collections/observation/items",
        {
          bbox,
          limit,
          observed: observed_after,
        }
      );
      if (!r.ok) return toToolResult(r);
      const fc = (r.data as any)?.features ?? [];
      const strikes = fc.map((f: any) => {
        const [lonS, latS] = f.geometry?.coordinates ?? [];
        const observed = f.properties?.observed ?? null;
        const hour = observed ? new Date(observed).getUTCHours() : null;
        let distKm: number | null = null;
        if (lat != null && lon != null && latS != null && lonS != null) {
          const d = haversine({ lat, lon }, { lat: latS, lon: lonS });
          distKm = Math.round(d * 10) / 10;
        }
        return { lat: latS, lon: lonS, observed, hour, distKm };
      });
      const byHour: Record<number, number> = {};
      for (const s of strikes) if (s.hour != null) byHour[s.hour] = (byHour[s.hour] ?? 0) + 1;
      const nearest = lat != null ? strikes.filter((s: any) => s.distKm != null).sort((a: any, b: any) => a.distKm - b.distKm)[0] ?? null : null;
      return toToolResult({
        ...r,
        data: { count: strikes.length, byHour, nearestKm: nearest?.distKm ?? null, strikes, raw: r.data },
      });
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
