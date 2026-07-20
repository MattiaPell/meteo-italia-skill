# meteo-italia-mcp-server

MCP server (TypeScript) + pagina web di debug che wrappa tutte le API esterne
usate dalla skill `meteo-italia`: Open-Meteo (forecast, geocoding, archive,
marine, air-quality, ensemble) e le fonti italiane (Protezione Civile allerte/radar,
CheckWX METAR/TAF, AviationWeather, DMI fulmini, floods.it, ARPAV, EUMETSAT).

## Build

```bash
npm install
npm run build      # compila in dist/ con tsc
```

Richiede Node >= 18 (fetch nativo). Testato su Node 24.

## Esecuzione

**Come server MCP (stdio):** lo avvii così da un client MCP (OpenCode, Claude Desktop…):

```bash
node dist/index.js
```

**Con pagina di debug web:** imposta `METEO_MCP_DEBUG_PORT` (default 3000).
Il processo apre anche un listener HTTP sulla porta indicata servendo la UI di debug.

```bash
METEO_MCP_DEBUG_PORT=3000 node dist/index.js
# apri http://localhost:3000
```

La pagina elenca tutti i servizi, permette di inserire i parametri e mostra
richiesta (URL), risposta JSON e tempo di risposta / errori. Utile per validare
i nomi dei modelli Open-Meteo e debuggare le chiamate prima di usarle nella skill.

**CheckWX:** il tool `checkwx_metar_taf` richiede la variabile d'ambiente
`CHECKWX_API_KEY`. Senza key, il tool ritorna un errore esplicito e puoi usare
`aviationweather_metar` as fallback senza autenticazione.

## Tool esposti

| Tool | Servizio | Tipo |
|---|---|---|
| `open_meteo_geocode` | Open-Meteo Geocoding | Esterno |
| `open_meteo_forecast` | Open-Meteo Forecast (raw hourly/daily) | Esterno |
| `open_meteo_forecast_summary` | Open-Meteo Forecast (compact per-model daily summary, ~80-90% less context) | Esterno |
| `open_meteo_archive` | Open-Meteo Archive (ERA5) | Esterno |
| `open_meteo_marine` | Open-Meteo Marine | Esterno |
| `open_meteo_air_quality` | Open-Meteo Air-Quality (CAMS) | Esterno |
| `open_meteo_ensemble` | Open-Meteo Ensemble | Esterno |
| `pc_allerte_wms` | Protezione Civile WMS | Esterno |
| `dpc_radar_vmi` | Radar DPC (nowcasting) | Esterno |
| `checkwx_metar_taf` | CheckWX METAR/TAF (richiede key) | Esterno |
| `aviationweather_metar` | AviationWeather METAR (fallback) | Esterno |
| `dmi_lightning` | DMI Lightning | Esterno |
| `floods_it_monitoring` | floods.it (idro TA-A) | Esterno |
| `arpav_idro` | ARPAV idrometria | Esterno |
| `eumetsat_satellite_info` | EUMETSAT (metadata) | Esterno |
| `meteo_climatology` | Climatologia ERA5 (110 città italiane, anomalie/sigma) | Locale |
| `meteo_bioclimatic_indices` | Heat Index, Wind Chill, GDD, soglie Vite/Api/Olivo, quota neve, rischio incendi | Locale |
| `meteo_local_phenomena` | Riconoscimento Bora, Foehn, Scirocco, Nebbia, Gelicidio | Locale |
| `meteo_model_tuning` | Pesi zone, bias modelli, correzione UHI | Locale |
| `meteo_event_reliability` | Matrice affidabilità forecast per orizzonte/tipo evento | Locale |
| `meteo_reference_guidelines` | Tabelle statiche (models, marine, air_quality, mountain, hydro, nowcasting, satellite, lightning, aviation, portals) | Locale |

Ogni tool ritorna `structuredContent` con `{ ok, url, status, data, elapsedMs }`.

## Test

```bash
# avvia con debug su 3000, poi:
curl -s -X POST http://localhost:3000/api/debug \
  -H 'Content-Type: application/json' \
  -d '{"service":"geocoding","params":{"name":"Roma"}}'
```

Oppure via MCP Inspector: `npx @modelcontextprotocol/inspector node dist/index.js`
