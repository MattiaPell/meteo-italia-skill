# Meteo Italia Skill ⛅

---
⚠️ USO PERSONALE E INFORMATIVO
Questo sistema è basato su fetch di dati pubblici e knowledge base non certificata.
NON è adatto a decisioni professionali in ambito nautico, alpinistico,
agricolo o di protezione civile. Per questi use case consultare i siti ufficiali (Meteo AM, Protezione Civile, ARPA).
---

Skill per **analisi comparativa multi-modello delle previsioni meteo** (uso personale e informativo) specializzata per il territorio italiano. Integra modelli numerici, osservazioni ARPA e climatologia di riferimento.

Progettata principalmente per agenti AI (OpenClaw, Hermes...): l'agente carica `SKILL.md` come istruzioni operative per eseguire analisi meteo complete e strutturate.

## Installazione

```bash
npx skills install MattiaPell/meteo-italia-skill
```
oppure scarica la repository e importala manualmente.

## Configurazione

Alcune funzionalità avanzate richiedono chiavi API (facoltative ma consigliate):

- **METAR/TAF (CheckWX)**: Per la validazione con dati aeroportuali, imposta la chiave API in un file `.env` o come variabile d'ambiente:
  ```
  CHECKWX_API_KEY=tua_chiave_qui
  ```
  Puoi ottenerne una gratuita su [checkwxapi.com](https://www.checkwxapi.com/).

Tutte le altre API (Open-Meteo, DPC Radar, DMI Lightning, floods.it, EUMETSAT) sono ad accesso libero o non richiedono autenticazione per l'uso previsto in questa skill.

## Come funziona

L'agente AI segue il flusso definito in `SKILL.md`:

1. **Determina parametri** — luogo, periodo, variabili, use case
2. **Geocoding** — risoluzione città italiane via Open-Meteo Geocoding API
3. **Fetch parallelo** — previsioni multi-modello + qualità aria + allerte
4. **Analisi contestuale** — bias noti, fenomeni locali, spread ensemble, climatologia
5. **Report finale** — output strutturato con widget visuale

## MCP Server (opzionale ma consigliato)

Le chiamate API e la knowledge base meteorologica sono esposte anche come **MCP server**
in [`mcp/`](mcp/): **24 tool** (18 API esterne + 6 locali di climatologia/indici/bias)
più una **pagina web di debug** (`METEO_MCP_DEBUG_PORT`, default 3000) per ispezionare
richieste e risposte. Se il tuo agente supporta MCP, usa i tool al posto dei fetch
grezzi e dei file di reference — risparmi fino al 95% di context window.

Il tool centrale è **`meteo_brief`**: per qualsiasi località italiana aggrega in una
sola chiamata NWP multi-modello, allerte Protezione Civile per il comune, radar DPC,
METAR delle stazioni più vicine, osservazioni ARPA regionali (dove coperte) e spread
ensemble — con le divergenze tra fonti già calcolate. Il confronto multi-fonte è il
default, non un'opzione.

### Installazione rapida

```bash
cd mcp && npm install && npm run build
```

### Esecuzione

```bash
# Solo MCP stdio (per client MCP)
node mcp/dist/index.js

# MCP stdio + debug web su http://localhost:3000
METEO_MCP_DEBUG_PORT=3000 node mcp/dist/index.js
```

### Configurazione client

**OpenCode** (`.opencode.json` o `opencode.jsonc`):
```json
{
  "mcpServers": {
    "meteo-italia": {
      "command": "node",
      "args": ["mcp/dist/index.js"],
      "env": { "CHECKWX_API_KEY": "${CHECKWX_API_KEY}" }
    }
  }
}
```

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "meteo-italia": {
      "command": "node",
      "args": ["/percorso/assoluto/meteo-italia-skill/mcp/dist/index.js"],
      "env": { "CHECKWX_API_KEY": "tua_chiave" }
    }
  }
}
```

> `CHECKWX_API_KEY` è opzionale (per METAR/TAF). Ottienila gratis su [checkwxapi.com](https://www.checkwxapi.com/).

### Tool MCP

| Tool | Servizio | Tipo |
|---|---|---|
| `meteo_brief` | **Aggregatore multi-fonte** (NWP + PC + radar + METAR + ARPA + ensemble) | API |
| `open_meteo_geocode` | Open-Meteo Geocoding | API |
| `open_meteo_forecast` | Open-Meteo Forecast (raw) | API |
| `open_meteo_forecast_summary` | Open-Meteo Forecast (compact, ~85% meno contesto) | API |
| `open_meteo_archive` | Open-Meteo Archive (ERA5) | API |
| `open_meteo_marine` | Open-Meteo Marine | API |
| `open_meteo_air_quality` | Open-Meteo Air-Quality (CAMS) | API |
| `open_meteo_ensemble` | Open-Meteo Ensemble | API |
| `pc_allerte` | Protezione Civile — bollettino criticità (GitHub pcm-dpc), filtro comune/regione | API |
| `dpc_radar` | Radar-DPC REST (22 prodotti, GeoTIFF pre-signed) | API |
| `checkwx_metar_taf` | CheckWX METAR/TAF (richiede key) | API |
| `aviationweather_metar` | AviationWeather METAR (fallback, no auth) | API |
| `dmi_lightning` | DMI Lightning (fulmini) | API |
| `floods_it_monitoring` | floods.it (idro Trentino-Alto Adige) | API |
| `arpav_bollettino` | ARPAV previsione 15 zone Veneto | API |
| `arpav_idro` | ARPAV livelli idrometrici 103 stazioni (Veneto) | API |
| `meteotrentino_osservazioni` | Meteotrentino osservazioni stazioni (P.A. Trento) | API |
| `eumetsat_satellite_info` | EUMETSAT (metadata satellite) | API |

> **Breaking changes 2026-07**: `pc_allerte_wms` → `pc_allerte` (host bollettini defunto,
> nuova fonte GitHub pcm-dpc), `dpc_radar_vmi` → `dpc_radar` (parsing risposta REST
> aggiornata alla nuova piattaforma), `arpav_idro` nuova firma. Dettagli in SKILL.md.
| `meteo_climatology` | Climatologia ERA5 (110 città, anomalie/σ) | Locale |
| `meteo_bioclimatic_indices` | Heat Index, Wind Chill, GDD, quota neve, incendi | Locale |
| `meteo_local_phenomena` | Riconoscimento Bora, Foehn, Scirocco, Nebbia | Locale |
| `meteo_model_tuning` | Pesi zone, bias modelli, correzione UHI | Locale |
| `meteo_event_reliability` | Matrice affidabilità forecast | Locale |
| `meteo_reference_guidelines` | Tabelle statiche di riferimento | Locale |

### Base URL utilizzati dal progetto

Tutti gli endpoint contattati dal server MCP (elenco completo e verificato; l'host originale `api.protezionecivile.gov.it` è stato rimosso perché il DNS è-morto).

**Open-Meteo (NWP, clima, marine, qualità aria, ensemble)**
- `https://geocoding-api.open-meteo.com/v1/search` — geocoding città italiane
- `https://api.open-meteo.com/v1/forecast` — forecast multi-modello (Step A, meteo_brief)
- `https://archive-api.open-meteo.com/v1/archive` — ERA5 historical / climatologia (Step B)
- `https://marine-api.open-meteo.com/v1/marine` — mare e SST (Step F)
- `https://air-quality-api.open-meteo.com/v1/air-quality` — CAMS europee (Step H)
- `https://ensemble-api.open-meteo.com/v1/ensemble` — spread probabilistico (Step J, meteo_brief)

**Protezione Civile — bollettino di criticità (allerte)**
- `https://api.github.com/repos/pcm-dpc/DPC-Bollettini-Criticita-Idrogeologica-Idraulica` — discovery ultimo stamp via git tree API (repo ufficiale del DPC)
- `https://raw.githubusercontent.com/pcm-dpc/DPC-Bollettini-Criticita-Idrogeologica-Idraulica/master/files/...` — metadati JSON + geojson zone (fonte dati strutturata)
- Portale umano: `https://mappe.protezionecivile.gov.it/it/mappe-rischi/bollettino-di-criticita/` — visualizzazione ufficiale
- App mappa: `https://servizio-mappe.protezionecivile.it` — dashboard MapLite usata dal portale
- Documentazione bollettino: repository GitHub `pcm-dpc/DPC-Bollettini-Criticita-Idrogeologica-Idraulica`

**Radar-DPC (nowcasting) — REST API ufficiale (https://dpc-radar.readthedocs.io/it/latest/api.html)**
- `https://radar-api.protezionecivile.it/findLastProductByType` — ultimo timestamp per prodotto (VMI, SRI, SRT1, IR_108, TEMP, CUM3/6/12/24, CAPPI_1..10, VIL, ETM, POH, SITES)
- `https://radar-api.protezionecivile.it/downloadProduct` — POST → pre-signed URL S3 del GeoTIFF (valida ~300s)
- `origin` header / query param obbligatorio: `https://radar.protezionecivile.it` (pure portale visuale)
- WebSocket push (NON integrato nel MCP stdio, documentato): `wss://radar-wss.protezionecivile.it` — notifica nuovi prodotti; client ufficiali java/python su `https://github.com/pcm-dpc/DPC-Radar-data-downloader` (branch `radarv2`)
- Servizi WMS/WMTS (`https://radar-geowebcache.protezionecivile.it/service/`) — NON usati: nel nostro caso non utili (PNG tile 256×256 a layer fissato, no arricchimento informativo rispetto al GeoTIFF+REST)

**METAR/TAF aeronautici**
- `https://aviationweather.gov/api/data/metar` — METAR grezzo/JSON senza chiave (fallback principale)
- `https://api.checkwx.com/v2/{metar|taf}/{ICAO}/decoded` — METAR/TAF decodificati (richiede `CHECKWX_API_KEY`)

**Fulmini (lightning)**
- `https://opendataapi.dmi.dk/v2/lightningdata/collections/observation/items` — DMI Open Data OGC API-Features (copertura italiana incerta, vedi note in SKILL.md)

**Idrologia**
- `https://www.floods.it/api/v1/monitoring/` — Trentino-Alto Adige realtime (TIER A)
- soglie manuali Po/Adige/Arno/Tevere/Reno/Volturno in `references/hydro_italia.md` (TIER B)

**ARPA regionali (osservazioni real-time)**
- Veneto (ARPAV):
  - `https://api.arpa.veneto.it/REST/v1/bollettini_meteo_simboli_en` — previsione 15 zone (Centro Meteorologico)
  - `https://www.arpa.veneto.it/api/risorse/data-meteo/xml/Ultime48ore.xml` — livelli idrometrici 103 stazioni (ultime 48h)
  - Portale: `https://www.arpa.veneto.it` · mappa stazioni: `https://meteo.arpa.veneto.it`
- Trentino (Meteotrentino / P.A. Trento, open data):
  - `https://dati.meteotrentino.it/service.asmx/listaStazioni` — anagrafica stazioni (XML)
  - `https://dati.meteotrentino.it/service.asmx/ultimiDatiStazione?codice={COD}` — dati recenti stazione
  - Portale: `https://www.meteotrentino.it`
- Altre regioni: nessuna API pubblica verificata. Fallback = METAR + radar DPC + portali umani (vedi `references/arpa_network.md`).

**Satellite (metadata-only)**
- `https://api.eumetsat.int` — richiede CONSUMER_KEY/CONSUMER_SECRET; dati binari NetCDF/HRIT (fetch fuori MCP)
- `https://eoportal.eumetsat.int` — portale
- `https://eumetview.eumetsat.int` — immagini pre-renderizzate fallback

**Rate limiting**
- GitHub anonimo: 60 req/h — mitigato da cache 30min su `resolveLatestStamp`()
- CheckWX: 3000 req/giorno — fallback automatico su aviationweather.gov
- Open-Meteo: fair use, no hard limit

**Endpoint non più utilizzati (rimossi)**
- `https://api.protezionecivile.gov.it/bollettini/allerte/ultimo` — **DNS morto**, sostituito dalla catena GitHub pcm-dpc
- `https://mappe.protezionecivile.gov.it/geowebcache/service/wms` (vecchio endpoint radar)
- `https://api.arpa.veneto.it/rest/v1/meteo/stazioni/{id}/dati` (lowercase) — **404**, sostituito da `REST/v1/bollettini_meteo_simboli_en` + XML `Ultime48ore.xml`

Ogni tool ritorna `{ ok, url, status, data, elapsedMs }`.

Per dettagli su build, test, MCP Inspector e debug API → [`mcp/README.md`](mcp/README.md).

## Funzionalità

| Funzionalità | Descrizione |
|---|---|
| **Multi-modello** | Confronta simultaneamente fino a 10 modelli su Open-Meteo API |
| **Geocoding** | Ricerca città italiane con discriminazione omonimi via `admin1` (regione) |
| **Fenomeni locali** | Riconoscimento automatico di foehn, bora, scirocco, tramontana, libeccio, grandine padana, neve appenninica, temporali adriatici |
| **Allerte** | Integrazione allerte da fonti pubbliche per regione (solo informativo) |
| **Qualità aria** | Dati CAMS via Open-Meteo AQ API |
| **Matrice affidabilità** | Affidabilità forecast per tipo di evento × orizzonte temporale |
| **Bias noti** | Calibrazione per macroarea italiana con bias documentati per modello e stagione |
| **METAR/TAF** | Validazione forecast con dati aeroportuali osservati (CheckWX API) |
| **Lightning Detection** | Nowcasting temporali con fulmini in tempo reale (DMI API) |
| **Dati Idrologici** | Monitoraggio fiumi e rischio alluvioni (floods.it + ISPRA + EFAS) |
| **Immagini Satellite** | Validazione visiva nowcasting con Meteosat (EUMETSAT) |

## Modelli Supportati

| Modello | Ente | Copertura | Risoluzione |
|---|---|---|---|
| ECMWF IFS | Centro Europeo | Globale | 9 km |
| ICON | DWD (Germania) | Globale + EU | 13 km / 7 km |
| GFS | NOAA (USA) | Globale | 13 km |
| GEFS | NOAA (USA) | Globale ensemble | 25 km |
| Arpège | Météo France | Globale + EU | 10 km / 5 km |
| AROME | Météo France | EU + Francia | 2.5 km |
| ICON-EU | DWD (Germania) | Europa | 7 km |
| MetOffice | UK Met Office | Globale | 10 km |
| GEM | Canada | Globale | 15 km |
| JMA | Giappone | Globale | 20 km |

## Riferimenti

La cartella `references/` contiene la knowledge base di supporto per l'agente:

| File | Contenuto |
|---|---|
| [models.md](references/models.md) | Modelli meteo Open-Meteo — coverage, risoluzione, update |
 | [model_tuning.md](references/model_tuning.md) | Calibrazione Modelli e Macroaree (pesi, bias, UHI) |
| [arpa_network.md](references/arpa_network.md) | Rete ARPA/ARPAS — endpoint osservativi regionali |
| [climatology.md](references/climatology.md) | Climatologia ERA5 1991-2020 — 32 città italiane, indici derivati, record storici |
| [ensemble_spread.md](references/ensemble_spread.md) | Spread ensemble — incertezza probabilistica |
| [event_reliability.md](references/event_reliability.md) | Affidabilità forecast per evento e orizzonte |
| [local_phenomena.md](references/local_phenomena.md) | Flag automatici per fenomeni italiani |
| [mountain.md](references/mountain.md) | Montagna, Neve e Agro-meteo |
| [air_quality.md](references/air_quality.md) | Qualità dell'aria — CAMS + Open-Meteo AQ API |
| [italian_portals.md](references/italian_portals.md) | Portali meteo italiani di fallback |
| [nowcasting_radar.md](references/nowcasting_radar.md) | Nowcasting radar — precipitazioni in tempo reale |
| [uv_marine_recent.md](references/uv_marine_recent.md) | UV index e condizioni marine recenti |
| [metar_taf.md](references/metar_taf.md) | METAR/TAF aeroporti italiani — validazione forecast (CheckWX API) |
| [lightning.md](references/lightning.md) | Lightning detection — nowcasting temporali (DMI Open Data API) |
| [hydro_italia.md](references/hydro_italia.md) | Dati idrologici — fiumi e rischio alluvioni (floods.it + ISPRA + EFAS) |
| [satellite.md](references/satellite.md) | Immagini satellite Meteosat — validazione visiva (EUMETSAT) |

## Use Case

| Use Case | Focus |
|----------|-------|
| 🏔️ Montagna / Escursionismo / Sci | Quota neve, temporali pomeridiani, UV in quota, fulmini in cresta |
| 🐝 Apicoltura / Impollinazione | Finestre di volo, secrezione nettarifero, gelate tardive |
| ⚽ Evento sportivo / All'aperto | Probabilità pioggia nella finestra, vento strutture, fulmini (sospensione) |
| 🌾 Agricoltura / Campagna | Gelate, grandine, bilancio idrico, umidità fogliare, allagamento campi |
| 🏗️ Cantiere / Lavori all'aperto | Vento gru, pioggia calcestruzzo, visibilità METAR, allagamento scavi |
| 🚗 Viabilità / Trasporti | Neve, nebbia, gelicidio, acquaplaning, vento laterale, allagamento strade |
| 🏖️ Mare / Spiaggia / Nautica | Douglas Scale, Beaufort, swell, UV, fulmini costa, satellite nuvolosità |
| 🌡️ Salute / Caldo estremo / Allergie | Heat Index, Notti Tropicali, AQI, pollini |
| ⚡ Energia — Eolico e Solare | Produzione stimata, cut-in/cut-out vento, irraggiamento, nuvolosità |
| 🏖️ Turismo — Beach/Ski Index | SST, UV, vento, neve fresca, snow depth, score 0-100 |

## Trigger

Domande meteo sull'Italia: previsioni, confronto modelli, affidabilità forecast, allerte, fenomeni locali. Qualsiasi città/regione italiana.

Esempi di domande che attivano la skill:

- _"Che tempo fa a Milano?"_
- _"Previsioni weekend in Toscana"_
- _"Confronta ECMWF e ICON per Roma"_
- _"Allerta meteo in Sicilia"_
- _"Neve sugli Appennini?"_
- _"Accordo modelli per il Nord-Est"_
- _"Produzione eolica prevista in Puglia"_
- _"Beach index per la Sardegna questo weekend"_
- _"Ski index per Cortina"_

## Licenza

MIT
