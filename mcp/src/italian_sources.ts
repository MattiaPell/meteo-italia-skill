import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet, apiPostJson, toToolResult, CHECKWX_API_KEY } from "./http.js";
import { haversine } from "./geo.js";

/** Map CheckWX decoded / AviationWeather shapes into a normalized station record.
 *
 * aviationweather.gov JSON shape (verified 2026-07): { icaoId, temp, dewp,
 * wdir, wspd, wgst, visib ("6+" | number, statute miles), altim (hPa),
 * cover, fltCat, rawOb }. CheckWX decoded uses temp_c / wind_speed_kt /
 * visibility_statute_mi / sky_condition.
 */
export function parseMetarStation(s: any, nwpTempC?: number): any {
  const tempC = s.temp_c ?? s.temp ?? s.temperature?.celsius ?? null;
  const windKt = s.wind_speed_kt ?? s.wspd ?? s.wind_speed?.kts ?? null;
  const windDir = s.wind_dir_degrees ?? s.wdir ?? s.wind_direction?.degrees ?? null;
  const visRaw = s.visibility_statute_mi ?? s.visib ?? s.visibility?.statute_miles ?? null;
  const visMi = typeof visRaw === "string" ? parseFloat(visRaw) : visRaw;
  const visibilityM = visMi != null && Number.isFinite(visMi) ? Math.round(visMi * 1609.34) : null;
  const sky = Array.isArray(s.sky_condition)
    ? s.sky_condition.map((c: any) => c.sky_cover).join("/")
    : s.cover ?? s.cloud_base ?? null;
  const altim = s.altim_in_hpa ?? s.altim ?? null;
  const qnhHpa =
    altim != null
      ? altim > 900
        ? Math.round(altim)
        : Math.round(altim * 33.8639)
      : null;
  return {
    icao: s.icaoId ?? s.station_id ?? s.icao ?? null,
    tempC,
    windKt,
    windDir,
    visibilityM,
    skyCover: sky,
    qnhHpa,
    flightCategory: s.fltCat ?? null,
    rawOb: s.rawOb ?? null,
    decodedVsNwp:
      nwpTempC != null && tempC != null
        ? { tempScarto: Math.round(Math.abs(tempC - nwpTempC) * 10) / 10, visFlag: visibilityM != null && visibilityM < 2000 }
        : { tempScarto: null, visFlag: false },
  };
}

/** Parse an AviationWeather raw METAR text into the same normalized shape.
 *
 * Visibility is parsed from the first standalone 4-digit metre field (9999
 * means ≥10 km). CAVOK sets unlimited visibility. If `nwpTempC` is provided,
 * `parseMetarStation` will compute the forecast-vs-observed temperature delta.
 */
export function parseRawMetar(raw: string, nwpTempC?: number): any {
  const temp = raw.match(/\b(\d{2})\/(\d{2})\b/);
  const wind = raw.match(/(\d{3})(\d{2})(?:G(\d{2}))?KT/);
  const cavok = /CAVOK/.test(raw);
  const visMatch = cavok ? null : raw.match(/\b(\d{4})\b/);
  const visibilityM = visMatch ? parseInt(visMatch[1], 10) : null;
  return {
    raw_text: raw,
    temp_c: temp ? parseInt(temp[1], 10) : null,
    wind_speed_kt: wind ? parseInt(wind[2], 10) : null,
    wind_gust_kt: wind && wind[3] ? parseInt(wind[3], 10) : null,
    wind_dir_degrees: wind ? parseInt(wind[1], 10) : null,
    visibility_statute_mi: visibilityM != null ? visibilityM / 1609.34 : null,
    cavok,
  };
}

export function registerItalianSources(server: McpServer) {
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
        const rawText = s.rawOb ?? s.raw_text;
        const hasJsonFields = s.temp != null || s.temp_c != null;
        if (rawText && !hasJsonFields) {
          return parseMetarStation(parseRawMetar(rawText, nwpTempC), nwpTempC);
        }
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
