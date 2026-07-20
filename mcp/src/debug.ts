import express from "express";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { apiGet, apiPostJson, CHECKWX_API_KEY, getMetrics, getCacheStats } from "./http.js";
import { summarizeForecast } from "./summaries.js";
import { parseAllerte } from "./italian_sources.js";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, "public");
let publicWarned = false;

/** Split a comma-joined query value into a list (mirrors the MCP tools). */
function list(v: string | undefined): string[] | undefined {
  if (!v) return undefined;
  const parts = v.split(",").map((x) => x.trim()).filter(Boolean);
  return parts.length ? parts : undefined;
}

/**
 * Local HTTP proxy + debug UI. The browser calls /api/debug which performs the
 * upstream request server-side (avoids CORS and reuses the shared client).
 */
export function startDebugServer(port: number) {
  const app = express();
  app.use(express.json());
  if (existsSync(publicDir)) {
    app.use(express.static(publicDir));
  } else if (!publicWarned) {
    publicWarned = true;
    console.error(`[meteo-italia-mcp] debug public/ dir not found at ${publicDir}; serving API only`);
  }

  const services: Record<string, (q: Record<string, string>) => Promise<unknown>> = {
    geocoding: (q) =>
      apiGet("https://geocoding-api.open-meteo.com/v1/search", {
        name: q.name,
        count: q.count ?? 10,
        language: q.language ?? "it",
        format: "json",
      }),
    forecast: (q) =>
      apiGet("https://api.open-meteo.com/v1/forecast", {
        latitude: q.latitude,
        longitude: q.longitude,
        models: list(q.models),
        hourly: list(q.hourly),
        daily: list(q.daily),
        timezone: q.timezone ?? "Europe/Rome",
        past_days: q.past_days,
        forecast_days: q.forecast_days,
      }),
    archive: (q) =>
      apiGet("https://archive-api.open-meteo.com/v1/archive", {
        latitude: q.latitude,
        longitude: q.longitude,
        start_date: q.start_date,
        end_date: q.end_date,
        daily: list(q.daily),
        timezone: q.timezone ?? "Europe/Rome",
      }),
    marine: (q) =>
      apiGet("https://marine-api.open-meteo.com/v1/marine", {
        latitude: q.latitude,
        longitude: q.longitude,
        hourly: list(q.hourly),
        daily: list(q.daily),
        timezone: q.timezone ?? "Europe/Rome",
      }),
    air_quality: (q) =>
      apiGet("https://air-quality-api.open-meteo.com/v1/air-quality", {
        latitude: q.latitude,
        longitude: q.longitude,
        hourly: list(q.hourly),
        current: list(q.current),
        domains: q.domains ?? "cams_europe",
        timezone: q.timezone ?? "Europe/Rome",
      }),
    ensemble: (q) =>
      apiGet("https://ensemble-api.open-meteo.com/v1/ensemble", {
        latitude: q.latitude,
        longitude: q.longitude,
        models: list(q.models),
        hourly: list(q.hourly),
        daily: list(q.daily),
        timezone: q.timezone ?? "Europe/Rome",
      }),
    forecast_summary: async (q) => {
      const raw = await apiGet("https://api.open-meteo.com/v1/forecast", {
        latitude: q.latitude,
        longitude: q.longitude,
        models: list(q.models),
        hourly: list(q.hourly) ?? ["temperature_2m", "precipitation", "weather_code", "cape", "wind_gusts_10m"],
        daily: list(q.daily) ?? [
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_sum",
          "precipitation_probability_max",
        ],
        timezone: q.timezone ?? "Europe/Rome",
      });
      if (!raw.ok) return raw;
      const modelList = list(q.models);
      const summary = summarizeForecast(raw.data, modelList);
      const bytesRaw = JSON.stringify(raw.data).length;
      const bytesSum = JSON.stringify(summary).length;
      return { ...raw, data: summary, compression: `${bytesRaw} -> ${bytesSum} bytes (${Math.round((1 - bytesSum / bytesRaw) * 100)}% smaller)` };
    },
    pc_allerte: async (q) => {
      // 1) Try the public bollettino di criticità JSON API (real alert data).
      const bulletin = await apiGet(
        "https://api.protezionecivile.gov.it/bollettini/allerte/ultimo",
        {}
      );
      if (bulletin.ok) {
        const parsed = parseAllerte(bulletin.data, q.regione || undefined);
        return { ...bulletin, data: parsed };
      }
      // 2) Fallback to WMS.
      const r = await apiGet("https://mappe.protezionecivile.gov.it/geowebcache/service/wms", {
        service: q.service ?? "WMS",
        request: q.request ?? "GetCapabilities",
        version: q.version ?? "1.3.0",
        layers: q.layer,
        bbox: q.bbox,
        width: q.width,
        height: q.height,
        format: q.format ?? "application/json",
        crs: "EPSG:4326",
      });
      if (!r.ok) {
        r.error = `${r.error} — se l'endpoint è irraggiungibile, consulta https://mappe.protezionecivile.gov.it (bollettino allerte).`;
      }
      return r;
    },
    dpc_radar: async (q) => {
      const find = await apiGet("https://radar-api.protezionecivile.it/findLastProductByType", {
        type: q.productType ?? "VMI",
      });
      if (!find.ok || q.download !== "true") return find;
      const time = (find.data as any)?.time;
      if (time === undefined) return find;
      const dl = await apiPostJson("https://radar-api.protezionecivile.it/downloadProduct", {
        productType: q.productType ?? "VMI",
        productDate: time,
      });
      return { ...dl, data: { find: find.data, download: dl.data } };
    },
    checkwx: (q) => {
      if (!CHECKWX_API_KEY)
        return Promise.resolve({
          ok: false,
          url: "https://api.checkwx.com",
          status: 0,
          data: null,
          error: "CHECKWX_API_KEY non impostata",
          elapsedMs: 0,
        });
      const codes = (q.icao ?? "").split(",").map((x) => x.trim().toUpperCase()).join(",");
      return apiGet(`https://api.checkwx.com/v2/${q.type ?? "metar"}/${codes}/decoded`, {}, {
        headers: { "X-API-KEY": CHECKWX_API_KEY },
      });
    },
    aviationweather: (q) =>
      apiGet("https://aviationweather.gov/api/data/metar", { ids: q.ids, format: q.format ?? "json" }),
    dmi_lightning: (q) =>
      apiGet("https://opendataapi.dmi.dk/v2/lightningdata/collections/observation/items", {
        bbox: q.bbox,
        limit: q.limit ?? 1000,
        observed: q.observed_after,
      }),
    floods_it: (q) => {
      const path = q.sensor_id ? `${q.sensor_id}.json` : "index.json";
      return apiGet(`https://www.floods.it/api/v1/monitoring/${path}`, {});
    },
    arpav: (q) => {
      const base = q.base_url ?? "https://api.arpa.veneto.it";
      return apiGet(`${base}/rest/v1/meteo/stazioni/${q.station_id}/dati`, {
        parametro: q.parametro ?? "livello_idrometrico",
        periodo: q.periodo ?? "ultimo-giorno",
      });
    },
    eumetsat: () =>
      Promise.resolve({
        ok: true,
        url: "https://api.eumetsat.int/",
        status: 200,
        data: {
          note: "EUMETSAT richiede API key; dati binari. Vedi collection EO:EUM:DAT:MSG:HRSEVIRI.",
          portal: "https://eoportal.eumetsat.int/",
        },
        elapsedMs: 0,
      }),
  };

  app.get("/api/services", (_req, res) => res.json(Object.keys(services)));

  app.get("/api/metrics", (_req, res) => {
    const pct = (arr: number[], p: number) => {
      if (!arr.length) return null;
      const s = [...arr].sort((a, b) => a - b);
      const i = Math.min(s.length - 1, Math.floor((p / 100) * s.length));
      return s[i];
    };
    const metrics = getMetrics();
    const perService = Object.fromEntries(
      Object.entries(metrics).map(([host, m]) => [
        host,
        {
          errors: m.errors,
          samples: m.latenciesMs.length,
          p50Ms: pct(m.latenciesMs, 50),
          p95Ms: pct(m.latenciesMs, 95),
        },
      ])
    );
    res.json({ cache: getCacheStats(), perService });
  });

  app.post("/api/debug", async (req, res) => {
    const { service, params } = req.body as { service: string; params?: Record<string, string> };
    const fn = services[service];
    if (!fn) {
      res.status(400).json({ error: `unknown service: ${service}` });
      return;
    }
    try {
      const result = await fn(params ?? {});
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  });

  app.get("/", (_req, res) => res.send(htmlPage()));

  const server = app.listen(port, () => {
    console.error(`[meteo-italia-mcp] debug page on http://localhost:${port}`);
  });
  server.on("error", (err) => {
    // A failed debug-page bind must not take down the MCP stdio server.
    console.error(`[meteo-italia-mcp] debug page unavailable on :${port} (${err.message})`);
  });
  return server;
}

function htmlPage(): string {
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Meteo Italia MCP — Debug</title>
<style>
  :root { color-scheme: dark; --bg:#0f1419; --card:#1a2029; --acc:#4ea1ff; --ok:#3ecf8e; --err:#ff6b6b; --txt:#e6edf3; --mut:#8b98a5; }
  * { box-sizing: border-box; }
  body { margin:0; font:14px/1.5 system-ui,Segoe UI,Roboto,sans-serif; background:var(--bg); color:var(--txt); }
  header { padding:16px 24px; border-bottom:1px solid #222c38; }
  header h1 { margin:0; font-size:18px; }
  header p { margin:4px 0 0; color:var(--mut); }
  .wrap { display:flex; gap:16px; padding:16px 24px; flex-wrap:wrap; }
  .panel { background:var(--card); border:1px solid #222c38; border-radius:10px; padding:16px; flex:1 1 320px; min-width:300px; }
  select, input { width:100%; margin:6px 0 12px; padding:8px; background:#0f1419; border:1px solid #2a3543; color:var(--txt); border-radius:6px; }
  label { color:var(--mut); font-size:12px; display:block; }
  button { background:var(--acc); color:#04121f; border:0; padding:10px 16px; border-radius:6px; font-weight:600; cursor:pointer; }
  button:disabled { opacity:.5; cursor:default; }
  .meta { font-size:12px; color:var(--mut); margin-bottom:8px; }
  .status-ok { color:var(--ok); } .status-err { color:var(--err); }
  pre { background:#0a0e12; border:1px solid #222c38; border-radius:6px; padding:12px; overflow:auto; max-height:420px; white-space:pre-wrap; word-break:break-word; }
  .url { color:var(--acc); font-size:12px; word-break:break-all; margin:8px 0; }
</style>
</head>
<body>
<header>
  <h1>⛅ Meteo Italia MCP — Debug</h1>
  <p>Chiama ogni servizio API e ispeziona richiesta/risposta. Le chiamate passano dal proxy locale (no CORS).</p>
</header>
<div class="wrap">
  <div class="panel">
    <label>Servizio</label>
    <select id="service"></select>
    <div id="fields"></div>
    <button id="run">Esegui chiamata</button>
  </div>
  <div class="panel">
    <div class="meta" id="meta">Pronto.</div>
    <div class="url" id="url"></div>
    <pre id="out">—</pre>
  </div>
</div>
<script>
const FIELDS = {
  geocoding: { name:"Roma", count:"10", language:"it" },
  forecast: { latitude:"41.9", longitude:"12.5", models:"ecmwf_ifs025,icon_seamless,gfs_seamless", hourly:"temperature_2m,precipitation,weather_code", daily:"temperature_2m_max,temperature_2m_min,precipitation_sum", timezone:"Europe/Rome", forecast_days:"3", past_days:"0" },
  archive: { latitude:"41.9", longitude:"12.5", start_date:"2016-07-19", end_date:"2025-07-18", daily:"temperature_2m_max,temperature_2m_min,precipitation_sum", timezone:"Europe/Rome" },
  marine: { latitude:"44.0", longitude:"12.3", hourly:"wave_height,wave_direction,wave_period,sea_surface_temperature", daily:"wave_height_max", timezone:"Europe/Rome" },
  air_quality: { latitude:"45.5", longitude:"9.2", hourly:"pm10,pm2_5,european_aqi,ozone,dust", current:"european_aqi,pm10,pm2_5", domains:"cams_europe", timezone:"Europe/Rome" },
  ensemble: { latitude:"41.9", longitude:"12.5", models:"ecmwf_ifs025_ensemble_mean,gfs025_ensemble_mean", hourly:"temperature_2m,temperature_2m_spread,precipitation_mean,precipitation_spread", daily:"temperature_2m_max,temperature_2m_min", timezone:"Europe/Rome", forecast_days:"7" },
  forecast_summary: { latitude:"41.9", longitude:"12.5", models:"ecmwf_ifs025,icon_seamless,gfs_seamless", hourly:"temperature_2m,precipitation,weather_code,cape,wind_gusts_10m", daily:"temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max", timezone:"Europe/Rome", forecast_days:"7" },
  pc_allerte: { regione:"", service:"WMS", request:"GetCapabilities", version:"1.3.0", layer:"", bbox:"", width:"800", height:"600", format:"application/json" },
  dpc_radar: { productType:"VMI", download:"false" },
  checkwx: { icao:"LIRF,LIMC,LIPE", type:"metar" },
  aviationweather: { ids:"LIRF,LIMC,LIPE", format:"json" },
  dmi_lightning: { bbox:"6.5,44.0,14.0,47.0", limit:"1000", observed_after:"" },
  floods_it: { sensor_id:"" },
  arpav: { station_id:"124", parametro:"livello_idrometrico", periodo:"ultimo-giorno", base_url:"https://api.arpa.veneto.it" },
  eumetsat: {}
};
const fieldsEl = document.getElementById('fields');
const serviceEl = document.getElementById('service');
const out = document.getElementById('out');
const meta = document.getElementById('meta');
const urlEl = document.getElementById('url');

fetch('/api/services').then(r=>r.json()).then(list=>{
  list.forEach(s=>{ const o=document.createElement('option'); o.value=s; o.textContent=s; serviceEl.appendChild(o); });
  renderFields();
});
serviceEl.onchange = renderFields;
function renderFields(){
  const s = serviceEl.value;
  fieldsEl.innerHTML='';
  for (const [k,v] of Object.entries(FIELDS[s]||{})){
    const l=document.createElement('label'); l.textContent=k;
    const i=document.createElement('input'); i.id='f_'+k; i.value=v;
    fieldsEl.appendChild(l); fieldsEl.appendChild(i);
  }
}
document.getElementById('run').onclick = async ()=>{
  const s = serviceEl.value;
  const params={};
  for (const k of Object.keys(FIELDS[s]||{})){ params[k]=document.getElementById('f_'+k).value; }
  meta.textContent='Chiamata in corso…'; out.textContent=''; urlEl.textContent='';
  const t0=performance.now();
  try {
    const res = await fetch('/api/debug',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service:s,params})});
    const data = await res.json();
    const ms = Math.round(performance.now()-t0);
    urlEl.textContent = data.url || '';
    meta.innerHTML = '<span class="'+(data.ok?'status-ok':'status-err')+'">'+(data.ok?'OK':'ERRORE')+'</span> HTTP '+(data.status??'-')+' · '+ms+'ms';
    out.textContent = JSON.stringify(data.data, null, 2);
  } catch(e){ meta.innerHTML='<span class="status-err">ERRORE</span>'; out.textContent=String(e); }
};
</script>
</body>
</html>`;
}
