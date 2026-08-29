import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet, toToolResult } from "../http.js";
import { haversine } from "../geo.js";

// ---------------------------------------------------------------------------
// Meteotrentino (P.A. Trento)
// http://dati.meteotrentino.it/service.asmx/*
//   listaStazioni + ultimiDatiStazione?codice= (XML open data, CC BY).
// ---------------------------------------------------------------------------

export interface MeteoTrentinoStation {
  codice: string;
  nome: string;
  quota: number | null;
  lat: number;
  lon: number;
}

/** Parse the meteotrentino listaStazioni XML (active stations only). */
export function parseMeteoTrentinoStations(xml: string): MeteoTrentinoStation[] {
  const out: MeteoTrentinoStation[] = [];
  const blocks = xml.match(/<anagrafica>[\s\S]*?<\/anagrafica>/g) ?? [];
  for (const b of blocks) {
    const get = (tag: string) => b.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1]?.trim() ?? "";
    const fine = get("fine");
    if (fine) continue;
    const lat = parseFloat(get("latitudine"));
    const lon = parseFloat(get("longitudine"));
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    out.push({
      codice: get("codice"),
      nome: get("nomebreve") || get("nome"),
      quota: parseFloat(get("quota")) || null,
      lat,
      lon,
    });
  }
  return out;
}

export interface MeteoTrentinoObs {
  tmin: number | null;
  tmax: number | null;
  rainMm: number | null;
  lastTempC: number | null;
  lastTempAt: string | null;
  precipSumMm: number | null;
}

/** Parse ultimiDatiStazione XML (dati dalla mezzanotte del giorno precedente). */
export function parseMeteoTrentinoObs(xml: string): MeteoTrentinoObs {
  const num = (tag: string) => {
    const m = xml.match(new RegExp(`<${tag}>([-\\d.]+)</${tag}>`));
    return m ? parseFloat(m[1]) : null;
  };
  const temps = [
    ...xml.matchAll(/<temperatura_aria[^>]*>\s*<data>([^<]+)<\/data>\s*<temperatura>([-\d.]+)<\/temperatura>/g),
  ];
  const lastTemp = temps.at(-1);
  const rains = [...xml.matchAll(/<precipitazione[^>]*>\s*<data>[^<]+<\/data>\s*<pioggia>([-\d.]+)<\/pioggia>/g)];
  const precipSum = rains.length ? Math.round(rains.reduce((a, m) => a + parseFloat(m[1]), 0) * 10) / 10 : null;
  return {
    tmin: num("tmin"),
    tmax: num("tmax"),
    rainMm: num("rain"),
    lastTempC: lastTemp ? parseFloat(lastTemp[2]) : null,
    lastTempAt: lastTemp ? lastTemp[1] : null,
    precipSumMm: precipSum,
  };
}

// --- Adapter per brief.ts (Trentino) ----------------------------------------
export async function runBriefArpa(lat: number, lon: number): Promise<any> {
  const list = await apiGet("https://dati.meteotrentino.it/service.asmx/listaStazioni", {}, { acceptText: true });
  if (!list.ok) return { ok: false, agenzia: "Meteotrentino", error: list.error };
  const stations = parseMeteoTrentinoStations(String(list.data));
  let best: any = null;
  for (const s of stations) {
    const d = haversine({ lat, lon }, { lat: s.lat, lon: s.lon });
    if (!best || d < best.distKm) best = { ...s, distKm: Math.round(d * 10) / 10 };
  }
  if (!best) return { ok: false, agenzia: "Meteotrentino", error: "nessuna stazione" };
  const obs = await apiGet(
    `https://dati.meteotrentino.it/service.asmx/ultimiDatiStazione?codice=${best.codice}`,
    {},
    { acceptText: true },
  );
  return {
    ok: obs.ok,
    agenzia: "Meteotrentino (P.A. Trento)",
    stazione: { codice: best.codice, nome: best.nome, distKm: best.distKm, quota: best.quota },
    osservazioni: obs.ok ? parseMeteoTrentinoObs(String(obs.data)) : null,
  };
}

export function registerMeteotrentino(server: McpServer) {
  // --- Meteotrentino osservazioni (P.A. Trento) ---------------------------
  server.registerTool(
    "meteotrentino_osservazioni",
    {
      title: "Meteotrentino Osservazioni Stazioni",
      description:
        "Dati recenti (dalla mezzanotte di ieri) delle stazioni meteo del Trentino: tmin/tmax, pioggia cumulata, ultima temperatura. Seleziona la stazione per codice (es. T0383) o la più vicina a lat/lon. Fonte open data Provincia Autonoma di Trento (CC BY).",
      inputSchema: {
        codice: z
          .string()
          .optional()
          .describe("Codice stazione (es. T0383). Omesso = stazione attiva più vicina a lat/lon"),
        latitude: z.coerce.number().optional().describe("Lat per stazione più vicina"),
        longitude: z.coerce.number().optional().describe("Lon per stazione più vicina"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ codice, latitude, longitude }) => {
      let stationCode = codice?.toUpperCase();
      let chosen: MeteoTrentinoStation | null = null;
      let distKm: number | null = null;
      if (!stationCode) {
        const list = await apiGet("https://dati.meteotrentino.it/service.asmx/listaStazioni", {}, { acceptText: true });
        if (!list.ok) return toToolResult(list);
        const stations = parseMeteoTrentinoStations(String(list.data));
        if (latitude === undefined || longitude === undefined) {
          return toToolResult({
            ok: false,
            url: list.url,
            status: 200,
            data: null,
            error: "Passa codice stazione oppure latitude+longitude. Stazioni attive: " + stations.length,
            elapsedMs: 0,
          });
        }
        for (const s of stations) {
          const d = haversine({ lat: latitude, lon: longitude }, { lat: s.lat, lon: s.lon });
          if (distKm == null || d < distKm) {
            distKm = d;
            chosen = s;
          }
        }
        stationCode = chosen?.codice;
      }
      if (!stationCode) {
        return toToolResult({
          ok: false,
          url: "https://dati.meteotrentino.it/service.asmx/listaStazioni",
          status: 200,
          data: null,
          error: "Nessuna stazione trovata",
          elapsedMs: 0,
        });
      }
      const r = await apiGet(
        `https://dati.meteotrentino.it/service.asmx/ultimiDatiStazione?codice=${stationCode}`,
        {},
        { acceptText: true },
      );
      if (!r.ok) return toToolResult(r);
      const obs = parseMeteoTrentinoObs(String(r.data));
      return toToolResult({
        ...r,
        data: {
          fonte: "Meteotrentino / Provincia Autonoma di Trento (CC BY, dati non validati)",
          stazione: { codice: stationCode, nome: chosen?.nome ?? null, distKm },
          osservazioni: obs,
        },
      });
    },
  );
}
