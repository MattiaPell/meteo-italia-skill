import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet, toToolResult } from "./http.js";
import { haversine } from "./geo.js";

// ---------------------------------------------------------------------------
// Fonti regionali verificate live (2026-07-21):
// - ARPAV (Veneto): https://api.arpa.veneto.it/REST/v1/bollettini_meteo_simboli_en
//   (previsione per 15 zone, JSON, CC BY 4.0) e
//   https://www.arpa.veneto.it/api/risorse/data-meteo/xml/Ultime48ore.xml
//   (livelli idrometrici 103 stazioni, ultime 48h, XML).
//   NOTA: il vecchio path /rest/v1/meteo/stazioni/{id}/dati risponde 404.
// - Meteotrentino (P.A. Trento): http://dati.meteotrentino.it/service.asmx/*
//   listaStazioni + ultimiDatiStazione?codice= (XML open data, CC BY).
// Altre regioni: nessuna API real-time aperta verificata — dichiararlo.
// ---------------------------------------------------------------------------

export interface ArpavIdroStation {
  id: string;
  nome: string;
  lat: number;
  lon: number;
  quota: number | null;
  provincia: string;
  comune: string;
  livelloM: number | null;
  livello6hFaM: number | null;
  trend: "salita" | "discesa" | "stabile" | null;
  ultimoRilievo: string | null;
}

/** Parse the ARPAV Ultime48ore.xml hydrometric file (ISO-8859-1). */
export function parseArpavIdroXml(xml: string): ArpavIdroStation[] {
  const stations: ArpavIdroStation[] = [];
  const blocks = xml.match(/<STAZIONE>[\s\S]*?<\/STAZIONE>/g) ?? [];
  for (const b of blocks) {
    const get = (tag: string) => b.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))?.[1]?.trim() ?? "";
    const datiMatches = [...b.matchAll(/<DATI ISTANTE="(\d{12})"><VM>([-\d.]+)<\/VM><\/DATI>/g)];
    if (!datiMatches.length) continue;
    const points = datiMatches.map((m) => ({
      t: m[1],
      v: parseFloat(m[2]),
    }));
    const last = points[points.length - 1];
    const ref6h = points.length > 36 ? points[points.length - 37] : points[0];
    const delta = ref6h != null ? last.v - ref6h.v : null;
    const fmt = (t: string) =>
      `${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}T${t.slice(8, 10)}:${t.slice(10, 12)}:00`;
    stations.push({
      id: get("IDSTAZ"),
      nome: get("NOME"),
      lat: parseFloat(get("Y")) || 0,
      lon: parseFloat(get("X")) || 0,
      quota: parseFloat(get("QUOTA")) || null,
      provincia: get("PROVINCIA"),
      comune: get("COMUNE"),
      livelloM: last.v,
      livello6hFaM: ref6h?.v ?? null,
      trend: delta == null ? null : Math.abs(delta) < 0.01 ? "stabile" : delta > 0 ? "salita" : "discesa",
      ultimoRilievo: fmt(last.t),
    });
  }
  return stations;
}

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
  const temps = [...xml.matchAll(/<temperatura_aria[^>]*>\s*<data>([^<]+)<\/data>\s*<temperatura>([-\d.]+)<\/temperatura>/g)];
  const lastTemp = temps.at(-1);
  const rains = [...xml.matchAll(/<precipitazione[^>]*>\s*<data>[^<]+<\/data>\s*<pioggia>([-\d.]+)<\/pioggia>/g)];
  const precipSum = rains.length
    ? Math.round(rains.reduce((a, m) => a + parseFloat(m[1]), 0) * 10) / 10
    : null;
  return {
    tmin: num("tmin"),
    tmax: num("tmax"),
    rainMm: num("rain"),
    lastTempC: lastTemp ? parseFloat(lastTemp[2]) : null,
    lastTempAt: lastTemp ? lastTemp[1] : null,
    precipSumMm: precipSum,
  };
}

export function registerArpa(server: McpServer) {
  // --- ARPAV bollettino meteo per zone (Veneto) --------------------------
  server.registerTool(
    "arpav_bollettino",
    {
      title: "ARPAV Bollettino Meteo Veneto (15 zone)",
      description:
        "Previsione ARPAV per le 15 zone del Veneto (stato del cielo, precipitazioni, temperature in quota, attendibilità) dal Centro Meteorologico regionale. Fonte ufficiale ARPAV REST (CC BY 4.0), aggiornata ~ogni giorno. Usa sempre per località in Veneto: è la previsione della rete regionale competente.",
      inputSchema: {
        zona: z.string().optional().describe("Nome zona (es. 'Pianura polesana', 'Dolomiti Nord-Est', 'Costa'). Match parziale case-insensitive. Omesso = tutte le 15 zone."),
        giorno: z.coerce.number().int().min(0).max(6).optional().describe("0=oggi, 1=domani... Omesso = tutti i giorni disponibili"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ zona, giorno }) => {
      const r = await apiGet("https://api.arpa.veneto.it/REST/v1/bollettini_meteo_simboli_en", {});
      if (!r.ok) return toToolResult(r);
      const rows: any[] = (r.data as any)?.data ?? [];
      const norm = (s: string) => s.toLowerCase();
      const filtered = rows.filter((row) => {
        if (giorno !== undefined && Number(row.giorno) !== giorno) return false;
        if (zona && !norm(String(row.zona ?? "")).includes(norm(zona))) return false;
        return true;
      });
      const compact = filtered.map((row) => ({
        zona: row.zona,
        giorno: row.giorno,
        scadenza: row.scadenza,
        cielo: row.testo,
        precipitazioni: row.precipitazioni,
        temperatura: row.temperatura,
        t1500m: row["temperatura 1500m"],
        t2000m: row["temperatura 2000m"],
        t3000m: row["temperatura 3000m"],
        attendibilita: row.attendibilita,
        avvisi: row.avvisi ?? row.segnalazioni ?? null,
      }));
      return toToolResult({
        ...r,
        data: {
          fonte: "ARPAV Centro Meteorologico (CC BY 4.0)",
          emissione: rows[0]?.dataemissione ?? null,
          zone: compact,
          count: compact.length,
        },
      });
    }
  );

  // --- ARPAV livelli idrometrici (Veneto) --------------------------------
  server.registerTool(
    "arpav_idro",
    {
      title: "ARPAV Livelli Idrometrici Veneto",
      description:
        "Livelli idrometrici delle 103 stazioni ARPAV (Adige, Piave, Brenta, Bacchiglione, Po...) dalle ultime 48h, con trend a 6h. Filtra per provincia, nome stazione/fiume, o stazione più vicina a lat/lon. Fonte XML open data ARPAV aggiornata in continuo. NOTA: sostituisce il vecchio endpoint /rest/v1/meteo/stazioni (404).",
      inputSchema: {
        provincia: z.string().optional().describe("Sigla provincia (BL, PD, RO, TV, VE, VR, VI)"),
        nome: z.string().optional().describe("Match parziale su nome stazione o fiume (es. 'Adige', 'Bassano')"),
        latitude: z.coerce.number().optional().describe("Lat per stazione più vicina"),
        longitude: z.coerce.number().optional().describe("Lon per stazione più vicina"),
        limit: z.coerce.number().int().min(1).max(103).default(10).describe("Max stazioni in output"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ provincia, nome, latitude, longitude, limit }) => {
      const r = await apiGet(
        "https://www.arpa.veneto.it/api/risorse/data-meteo/xml/Ultime48ore.xml",
        {},
        { acceptText: true }
      );
      if (!r.ok) return toToolResult(r);
      let stations = parseArpavIdroXml(String(r.data));
      if (provincia) {
        const p = provincia.toUpperCase();
        stations = stations.filter((s) => s.provincia === p);
      }
      if (nome) {
        const n = nome.toLowerCase();
        stations = stations.filter(
          (s) => s.nome.toLowerCase().includes(n) || s.comune.toLowerCase().includes(n)
        );
      }
      if (latitude !== undefined && longitude !== undefined) {
        stations = stations
          .map((s) => ({ ...s, distKm: Math.round(haversine({ lat: latitude, lon: longitude }, { lat: s.lat, lon: s.lon }) * 10) / 10 }))
          .sort((a, b) => (a as any).distKm - (b as any).distKm);
      }
      const out = stations.slice(0, limit);
      return toToolResult({
        ...r,
        data: {
          fonte: "ARPAV rete idrometrica (open data, non validato)",
          stazioniTotali: stations.length,
          stazioni: out,
        },
      });
    }
  );

  // --- Meteotrentino osservazioni (P.A. Trento) ---------------------------
  server.registerTool(
    "meteotrentino_osservazioni",
    {
      title: "Meteotrentino Osservazioni Stazioni",
      description:
        "Dati recenti (dalla mezzanotte di ieri) delle stazioni meteo del Trentino: tmin/tmax, pioggia cumulata, ultima temperatura. Seleziona la stazione per codice (es. T0383) o la più vicina a lat/lon. Fonte open data Provincia Autonoma di Trento (CC BY).",
      inputSchema: {
        codice: z.string().optional().describe("Codice stazione (es. T0383). Omesso = stazione attiva più vicina a lat/lon"),
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
          ok: false, url: "https://dati.meteotrentino.it/service.asmx/listaStazioni",
          status: 200, data: null, error: "Nessuna stazione trovata", elapsedMs: 0,
        });
      }
      const r = await apiGet(
        `https://dati.meteotrentino.it/service.asmx/ultimiDatiStazione?codice=${stationCode}`,
        {},
        { acceptText: true }
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
    }
  );
}
