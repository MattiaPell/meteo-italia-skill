---
name: meteo-italia
description: >
  Analisi meteo multi-modello Italia (uso personale e informativo). Previsioni, confronto ECMWF/ICON/GFS, fenomeni locali (foehn, bora, scirocco), qualità aria, nowcasting temporali. Trigger: qualsiasi domanda meteo su città/regione italiana.
---

# Weather Forecast Analysis — Italia

## Trigger Keywords
"meteo", "previsioni", "pioggia", "neve", "allerta", "vento", "bora", "scirocco", "foehn", "temporale", "grandine", "mare", "montagna", "ghiaccio", "nebbia", "acqua alta", "modelli meteo".

---

Analisi comparativa multi-modello specializzata per il territorio italiano (uso personale e informativo).
Integra: previsioni numeriche (Open-Meteo), osservazioni in tempo reale (reti ARPA regionali),
climatologia di riferimento (ERA5) e bias noti dei modelli.

---

## Bootstrap obbligatorio

⚠️ **STRATEGIA MCP-FIRST (RACCOMANDATA)**:
Se il server MCP (`meteo-italia-mcp-server`) è disponibile nell'ambiente, **NON caricare alcun file di reference in contesto**. Usa direttamente i tool MCP dedicati per ottenere climatologia, indici bioclimatici, bias dei modelli, affidabilità e riconoscimento fenomeni locali al volo, risparmiando oltre l'80% di context window.

Se l'ambiente NON supporta MCP, carica in contesto i seguenti file nell'ordine indicato prima di procedere al Step 1 (solo file contrassegnati con [CORE] sono strettamente necessari):

[CORE] references/models.md
[CORE] references/italy_zones.md
[CORE] references/model_bias.md
[CORE] references/climatology.md
[CORE] references/event_reliability.md
[OPTIONAL - carica solo se use case attivo] references/mountain.md
[OPTIONAL] references/air_quality.md
[OPTIONAL] references/uv_marine_recent.md
[OPTIONAL] references/ensemble_spread.md
[OPTIONAL] references/nowcasting_radar.md
[OPTIONAL] references/lightning.md
[OPTIONAL] references/hydro_italia.md
[OPTIONAL] references/metar_taf.md
[OPTIONAL] references/local_phenomena.md
[OPTIONAL] references/arpa_network.md
[OPTIONAL] references/satellite.md
[OPTIONAL] references/italian_portals.md

I references con confidence: low sono indicativi. NON citarli come fonti autorevoli nel report. Usa la formulazione 'stima indicativa' invece di 'secondo i dati storici'.

---

## MCP Server (meteo-italia-mcp-server)

Tutte le chiamate API esterne e le basi di conoscenza meteorologiche sono esposte come **tool MCP**. Se l'ambiente fornisce questo server, **USA I TOOL al posto dei fetch HTTP grezzi e dei file di reference locali**: gestiscono errori, rate-limit e parsing, ed eseguono calcoli complessi restituendo `structuredContent` pronto all'uso (campi `ok`, `url`, `status`, `data`, `elapsedMs`).

**Avvio / installazione** (vedi `mcp/README.md`):
```bash
cd mcp && npm install && npm run build
# come server stdio (per client MCP):
node dist/index.js
# con pagina di debug web su http://localhost:3000 (porta via METEO_MCP_DEBUG_PORT):
METEO_MCP_DEBUG_PORT=3000 node dist/index.js
```
`CHECKWX_API_KEY` va esposta come variabile d'ambiente per il tool `checkwx_metar_taf`.

**Mappatura step/riferimenti → tool MCP:**

| Step / Riferimento | Tool MCP | Servizio / Funzione |
|---|---|---|
| Geocoding | `open_meteo_geocode` | Open-Meteo Geocoding |
| A (forecast) | `open_meteo_forecast` / `open_meteo_forecast_summary` | Open-Meteo Forecast (raw / compact summary) |
| B (Climatologia ERA5) | `meteo_climatology` / `open_meteo_archive` | Query norme ERA5 di capoluoghi italiani / Archive raw |
| E (allerte) | `pc_allerte_wms` | PC WMS & Bollettino JSON |
| F (marine) | `open_meteo_marine` | Open-Meteo Marine |
| H (CAMS) | `open_meteo_air_quality` | Open-Meteo Air-Quality |
| J (ensemble) | `open_meteo_ensemble` | Open-Meteo Ensemble |
| I (radar) | `dpc_radar_vmi` | Radar DPC |
| K (METAR/TAF) | `checkwx_metar_taf` / `aviationweather_metar` | CheckWX / AviationWeather |
| L (fulmini) | `dmi_lightning` | DMI Lightning |
| M (idro TA-A) | `floods_it_monitoring` | floods.it |
| M (idro Veneto) | `arpav_idro` | ARPAV |
| N (satellite) | `eumetsat_satellite_info` | EUMETSAT (metadata) |
| **Ref: Climatologia** | `meteo_climatology` | Ottieni medie e anomalie storiche per 110 città italiane |
| **Ref: Indici / Soglie** | `meteo_bioclimatic_indices` | Calcola Heat Index, Wind Chill, GDD, Water Balance, soglie Vite, Api, Olivo, ecc. |
| **Ref: Fenomeni Locali** | `meteo_local_phenomena` | Riconoscimento automatico Bora, Foehn, Scirocco, Nebbia, Gelicidio, ecc. |
| **Ref: Bias e Pesi** | `meteo_model_tuning` | Recupera pesi zone, bias modelli e correzione UHI (Isola di Calore) |
| **Ref: Affidabilità** | `meteo_event_reliability` | Matrice di affidabilità forecast per orizzonte e tipo evento |

I template `GET https://...` nei singoli step restano come **riferimento/override**: usali solo se il tool MCP non è disponibile.

---

## Flusso di lavoro

### 1. Determina Parametri

| Parametro | Default se non specificato |
|---|---|
| Luogo | Chiedi se ambiguo |
| Periodo | Oggi (giornata corrente) |
| Variabili | Temperatura, precipitazioni, vento, temporali, weather code |
| Output | Report strutturato + widget visuale |
| Response Mode | **Lite** (query semplici) o **Pro** (analisi/use case) |
| Use case | Generico (vedi sezione Use Case per specializzazioni) |

Identifica subito: **macroarea** (→ set modelli) + **regione amministrativa** (→ ARPA + allerte PC).

### 2. Geocoding

> **Via MCP:** `open_meteo_geocode` (name, count, language).
> Il tool filtra già per `country_code == "IT"`, restituisce `chosen` (primo risultato IT), `candidates[]`, `needsDisambiguation` (>3 IT) e `fallbackSuggestion` (se nessun IT).

Usa la risposta:
1. Se `chosen` è null → chiedi conferma all'utente con `fallbackSuggestion`.
2. Se `needsDisambiguation` è true → mostra `candidates` all'utente prima di procedere.
3. Annota lat, lon, `elevation` di `chosen` — serve per neve e mountain bias.

### 3. Fetch sequenziale prioritizzato

L'esecuzione del workflow segue una sequenza prioritizzata suddivisa in 3 Tier. L'agente deve completare il **TIER 1** prima di procedere al **TIER 2**.

**Regola di gestione del contesto:** Se il contesto supera 80k token dopo il TIER 1, esegui solo gli step TIER 2 con condizione TRUE. Salta completamente il TIER 3.

| Tier | Step | Nome | Condizione | Riferimento |
|---|---|---|---|---|
| **TIER 1** | A | Previsioni numeriche (Open-Meteo) | Sempre | references/models.md, references/italy_zones.md |
| | B | Climatologia ERA5 | Sempre (10y baseline) | references/climatology.md |
| | E | Allerta (Dati Pubblici) | Sempre | references/arpa_network.md |
| **TIER 2** | D | Osservazioni ARPA | Sempre | references/arpa_network.md |
| | F | Dati marini | Se costiero/nautica/ASE/Caligo | references/uv_marine_recent.md |
| | H | Qualità aria CAMS | Pianura Padana (ott-mar), salute, inversione, scirocco | references/air_quality.md |
| | J | Ensemble Spread | Orizzonte >3gg, eventi significativi, allerta ≥gialla, divergenza modelli | references/ensemble_spread.md |
| **TIER 3** | I | Nowcasting Radar DPC | Allerta ≥gialla, CAPE>800, weather_code 80-99, richiesta 1-3h | references/nowcasting_radar.md |
| | K | METAR/TAF | Aviazione/droni, validazione forecast, ARPA non disp., divergenza >2°C | references/metar_taf.md |
| | L | Lightning Detection | Allerta ≥gialla per temporali, CAPE>800, nautica/montagna/outdoor | references/lightning.md |
| | M | Dati Idrologici | Allerta ≥gialla idro, pioggia>30mm/24h, cumulata 7gg>100mm, agricoltura | references/hydro_italia.md |
| | N | Satellite Meteosat | Allerta ≥gialla, divergenza modelli >1.5σ, nebbia prevista, nautica/aero | references/satellite.md |

*Nota: Gli Step C (Analisi Storico) e G (UV Index) sono inclusi o derivati dallo Step A.*

Esegui i passi seguendo l'ordine dei Tier:

#### TIER 1 (Obbligatori sempre)

#### A — Previsioni numeriche (Open-Meteo) — Strategia a 3 Livelli
> **Via MCP:** `open_meteo_forecast` (latitude, longitude, models, hourly, daily, current, past_days, forecast_days, **level**).
> Il tool gestisce internamente la strategia a 3 livelli: con `level="auto"` (default) decide da solo se salire a Livello 2 (trigger `weather_code` 80-99, CAPE >500, precip >10mm, vento >50km/h) o Livello 3 (use case specializzato). La risposta include `levelUsed` e `triggerActivated`.
> **Per il report di sintesi usa `open_meteo_forecast_summary`**: ritorna max/min T, precip totale, probabilità pioggia max, CAPE max, raffica max, conteggio ore temporale/precipitazione, **score 0-100 e flag** per giorno e modello — ~80-90% meno contesto del raw. Usalo di default.
> Nomi modello validi: `ecmwf_ifs`, `ecmwf_ifs025`, `icon_seamless`, `gfs_seamless`, `metno_nordic`, `ukmo_seamless`, `gem_seamless`, `jma_seamless` (default `best_match`).

Vedi `references/models.md` per il set corretto per macroarea.

**Regola:** NON chiedere livelli superiori se non necessari — il tool lo fa automaticamente. Dichiara nel report `levelUsed` restituito dalla risposta.

#### C — Storico recente (ultimi 7gg)
Analisi disponibile solo se **LIVELLO 2** di Step A è attivato (`past_days=7`).
Calcola precipitazioni cumulate 7gg, giorni consecutivi senza pioggia, anomalia T media e **Bilancio Idrico Nimbus** (Precipitazioni - ET0). Includi nel report se: pioggia prevista >20mm, allerta ≥gialla, ondata calore/freddo in corso, o use case Agricoltura/Api.
Vedi `references/uv_marine_recent.md` per soglie e interpretazione.

#### G — UV Index
Già incluso nel fetch A (`uv_index`, `uv_index_clear_sky`, `uv_index_max`).
Includi la sezione UV nel report se: `uv_index_max` >5, use case spiaggia/montagna, o richiesta esplicita.
Vedi scala UV e raccomandazioni in `references/uv_marine_recent.md`.

#### B — Climatologia ERA5
> **Via MCP:** `open_meteo_archive` (start_date, end_date, daily/hourly).
Per confrontare il forecast con la norma storica del periodo.
```http
GET https://archive-api.open-meteo.com/v1/archive
  ?latitude={LAT}&longitude={LON}
  &start_date={STESSO_GIORNO_-10_ANNI}&end_date={STESSO_GIORNO_-1_ANNO}
  &daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,
         apparent_temperature_min,precipitation_sum,wind_speed_10m_max,
         et0_fao_evapotranspiration
  &timezone=Europe/Rome
```
Calcola media e σ su 10 anni → usala come baseline "nella norma / sopra / sotto".

#### E — Allerta (Dati Pubblici)
> **Via MCP:** `pc_allerte_wms` (regione opzionale).
> Il tool prova l'API JSON del bollettino (`api.protezionecivile.gov.it/bollettini/allerte/ultimo`), con fallback al WMS se irraggiungibile. Restituisce `alerts[]` (regione, livello, colore, livelloCodice 0-3, tipo_rischio) e `allertaMax`.
Estrai da `alerts`: livello allerta per la regione target e tipo di rischio (idrogeologico, temporali, neve, vento). Se `allertaMax` ≥1 (gialla) segnala nel report e attiva gli Step condizionali (I, L, M, N).

#### TIER 2 (Condizionali ad alta priorità)

#### D — Osservazioni ARPA
Consulta `references/arpa_network.md` per endpoint e stazioni della regione target.
Recupera: T attuale, precipitazioni ultime 6/24h, vento, umidità dalla stazione più vicina.
Se disponibile, confronta con il forecast delle ore precedenti → stima bias locale del giorno.

#### F — Dati marini (solo se coordinata costiera o use case mare/nautica)
> **Via MCP:** `open_meteo_marine` (latitude, longitude, hourly, daily).
Attiva se: coordinate a <20km dalla costa, oppure use case "mare/spiaggia/nautica", oppure macroarea con costa adriatica (per ASE), oppure Macroarea Nord-Ovest (per Maccaja/Caligo), oppure Macroarea Sicilia/Sud (per Lupa di mare).
```http
GET https://marine-api.open-meteo.com/v1/marine
  ?latitude={LAT}&longitude={LON}
  &hourly=wave_height,wave_direction,wave_period,
          wind_wave_height,wind_wave_direction,wind_wave_period,
          swell_wave_height,swell_wave_direction,
          swell_wave_period,
          sea_surface_temperature
  &daily=wave_height_max,wind_wave_height_max,swell_wave_height_max
  &timezone=Europe/Rome
  &forecast_days={N}
```
Vedi scala Beaufort e soglie operative in `references/uv_marine_recent.md`.

#### H — Qualità aria CAMS (condizionale)
> **Via MCP:** `open_meteo_air_quality` (latitude, longitude, hourly, current, domains=cams_europe).

**Attiva sempre per:** Pianura Padana (ott–mar), use case salute/bambini/anziani/sport, scirocco con dust elevato, inversione termica prevista (vento <5 km/h + cielo sereno).
**Attiva se AQI ≥ Moderato** per qualsiasi altra zona.

```http
GET https://air-quality-api.open-meteo.com/v1/air-quality
  ?latitude={LAT}&longitude={LON}
  &hourly=pm10,pm2_5,pm10_wildfires,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide,
          dust,ammonia,european_aqi,european_aqi_pm2_5,
          european_aqi_pm10,european_aqi_no2,european_aqi_o3,
          alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,
          olive_pollen,ragweed_pollen
  &current=european_aqi,pm10,pm2_5,pm10_wildfires,nitrogen_dioxide,ozone,dust
  &domains=cams_europe
  &timezone=Europe/Rome
  &forecast_days=5
```

Interpreta con `references/air_quality.md`: scala AQI EEA (0-20 buono → >100 pessimo),
scenari accumulo/dispersione da dati meteo, flag dust sahariano vs PM antropico,
pollini stagionali, zone critiche Italia, raccomandazioni per soggetti sensibili.

#### J — Ensemble Spread (condizionale)
> **Via MCP:** `open_meteo_ensemble` (models, hourly con `*_spread`, daily).

**Attiva sempre per:** orizzonte >3 giorni, eventi potenzialmente significativi, allerta PC ≥ gialla, divergenza tra modelli deterministici (σ >2°C su T o >50% su precipitazioni).

```http
GET https://ensemble-api.open-meteo.com/v1/ensemble
  ?latitude={LAT}&longitude={LON}
  &models=ecmwf_ifs025_ensemble_mean,icon_seamless_ensemble_mean,gfs025_ensemble_mean
  &hourly=temperature_2m,temperature_2m_spread,
          apparent_temperature,apparent_temperature_spread,
          precipitation_mean,precipitation_spread,
          wind_gusts_10m_mean,wind_gusts_10m_spread,
          cape_mean,cape_spread,
          snowfall_mean,snowfall_spread,
          precipitation_probability_mean
  &daily=temperature_2m_max,temperature_2m_min,
         apparent_temperature_max,apparent_temperature_min,
         precipitation_sum,wind_speed_10m_max
  &timezone=Europe/Rome
  &forecast_days=16
```

`spread` = σ tra i membri. p90-p10 ≈ spread × 2.56 (gaussiana, valido per T; non per precipitazioni).
Per probabilità specifiche (P(pioggia >20mm)) usa Ensemble API con tutti i membri raw.
Vedi soglie spread, gerarchia ensemble–deterministico e template in `references/ensemble_spread.md`.

#### TIER 3 (Condizionali a bassa priorità)

#### I — Nowcasting Radar DPC (solo se condizioni attivanti)
> **Via MCP:** `dpc_radar_vmi` (productType=VMI, download=true → restituisce URL immagine).

**Attiva se almeno una di queste condizioni è vera:**
- Allerta PC ≥ gialla per temporali (Step E)
- CAPE previsto >800 J/kg da modelli NWP (Step A)
- `weather_code` corrente 80–99 (rovesci/temporali in atto)
- Utente chiede situazione nelle prossime 1-3h ("sta arrivando?", "tra quanto finisce?")

**Step 1 — Verifica disponibilità e fetch VMI:**
```http
GET https://radar-api.protezionecivile.it/findLastProductByType?type=VMI
```
Salva `time` (epoch ms UTC) come `T`. Se disponibile:
```http
POST https://radar-api.protezionecivile.it/downloadProduct
{"productType": "VMI", "productDate": T}
```
Recupera l'URL dell'immagine dal campo `url` della risposta.

**Step 2 — Analisi Vision (Qualitativa):**
Se l'agente ha capacità Vision, deve analizzare l'immagine VMI per identificare:
1. **Presenza di nuclei**: individuare macchie colorate (riflettività).
2. **Intensità (dBZ)**: stimare l'intensità in base alla scala colori (giallo/arancio = forte, rosso/viola = estremo).
3. **Posizione**: localizzare i nuclei rispetto al punto target (es. "cella intensa a 20km Nord-Ovest").

**Fallback Testuale:**
Se l'immagine non è visualizzabile, non è interpretabile o le API falliscono:
- Dichiarare nel report: "nowcasting non disponibile in questa sessione".
- Fornire il link diretto per consultazione manuale: https://mappe.protezionecivile.gov.it

**Estrapolazione:** vedi `references/nowcasting_radar.md` per la scala dBZ e la logica di blending con i modelli NWP (ICON-D2) per la tendenza 0-3h.

**Licenza**: citare sempre "Radar-DPC, Dipartimento di Protezione Civile (CC-BY-SA)"

#### K — METAR/TAF (condizionale)
> **Via MCP:** `checkwx_metar_taf` (icao, type) richiede `CHECKWX_API_KEY`; fallback `aviationweather_metar` (ids) senza auth.

**Attiva sempre per:** use case aviazione/droni, città con aeroporto ICAO nella lista (`references/metar_taf.md`). **Attiva se:** l'utente chiede validazione forecast, oppure stazioni ARPA non disponibili per la zona, oppure divergenza >2°C tra NWP e ARPA.

**Fetch primario (CheckWX — JSON decoded):**
Richiede `CHECKWX_API_KEY` (vedi README).
```http
GET https://api.checkwx.com/v2/metar/{ICAO1},{ICAO2},{ICAO3}/decoded
Headers: X-API-KEY: {YOUR_API_KEY}
```
Esempio: `GET https://api.checkwx.com/v2/metar/LIRF,LIMC,LIPE/decoded`

**Fetch TAF (previsioni aeroportuali):**
```http
GET https://api.checkwx.com/v2/taf/{ICAO}/decoded
Headers: X-API-KEY: {YOUR_API_KEY}
```

**Fallback (aviationweather.gov — raw, no auth):** `aviationweather_metar` (ids, format, nwpTempC).

Il tool normalizza entrambe le sorgenti in `stations[]` (tempC, windKt, windDir, visibilityM, skyCover, qnhHpa) e, se passi `nwpTempC`, calcola `decodedVsNwp.tempScarto` e `decodedVsNwp.visFlag` (<2000m). Usa questi campi per il confronto.

**Interpretazione — confronto forecast vs osservato (soglie già applicate dal tool):**
1. **Temperatura**: scarto >2°C → modello fuori; >4°C → inaffidabile per la zona
2. **Vento**: scarto >10kt → modello sottostima vento; raffiche >20kt non previste → attenzione strutture
3. **Visibilità/Nebbia**: `visFlag` true ma NWP sereno → nebbia non risolta (critico viabilità)
4. **Copertura**: OVC ma NWP weather_code ≤2 → nuvolosità sottostimata
5. **Pressione**: QNH vs NWP pressure_msl — coerenza sinottica

**Gerarchia validazione:** TAF > NWP per 0-6h su aeroporti. Per zone senza aeroporto → stazioni ARPA (Step D).

Vedi `references/metar_taf.md` for lista completa ICAO e soglie di validazione.

#### L — Lightning Detection (Nowcasting Temporali)
> **Via MCP:** `dmi_lightning` (bbox, limit, observed_after, **lat**, **lon**).

**Attiva sempre per:** allerta PC ≥ gialla per temporali (Step E), CAPE >800 J/kg da Step A, use case mare/nautica/montagna/events outdoor. **Altrimenti:** attiva se `weather_code` attuale 80-99.

Il tool raggruppa gli strike per ora (`byHour`), calcola `nearestKm` (distanza Haversine dal punto target se passi lat/lon) e restituisce il conteggio totale. Usa questi campi:
1. **Densità**: >10 fulmini/50km² = temporale attivo, >20 = severo
2. **Trend**: seconda chiamata con `observed_after` (finestra precedente) → confronta `count`
3. **Integrazione Step A (CAPE)**: CAPE >1500 + fulmini >10/15min → supercella probabile
4. **Integrazione Step I (radar)**: nuclei >45 dBZ + fulmini → grandine probabile (>70%)
5. **Dry lightning**: fulmini ma precip <1mm → rischio incendi (segnala)

**Distanza:** `nearestKm` <5km = pericolo immediato.

Vedi `references/lightning.md` per guida completa e alternative API.

#### M — Dati Idrologici (Trentino real-time + bacini nazionali via soglie)

Mappa esplicita del monitoraggio:
- **TIER A (API real-time)**: floods.it → solo Trentino-Alto Adige.
- **TIER B (soglie manuali + ARPA)**: Po, Adige, Arno, Tevere, Reno, Volturno → usa references/hydro_italia.md + Step D (ARPA).
- **TIER C (nessun dato disponibile)**: tutti gli altri → dichiara esplicitamente "dati idrologici real-time non disponibili per questa zona".

**Attiva sempre per:** allerta PC ≥ gialla per rischio idrogeologico/idraulico (Step E), precipitazioni previste >30mm/24h da Step A, precipitazioni cumulate 7gg >100mm (dallo storico in C), use case agricoltura/cantieri/viabilità/nautica. **Altrimenti:** disattiva.

### TIER A (API real-time)

> **Via MCP:** `floods_it_monitoring` (sensor_id opzionale) per floods.it; `arpav_idro` (station_id, parametro, periodo) per ARPAV.

**Trentino-Alto Adige (floods.it):**
```http
GET https://www.floods.it/api/v1/monitoring/index.json
# Se sensor_id trovato:
GET https://www.floods.it/api/v1/monitoring/{sensor_id}.json
```

### TIER B (soglie manuali + ARPA)

**Veneto (ARPAV API):**
```http
GET https://api.arpa.veneto.it/rest/v1/meteo/stazioni/{ID_STAZIONE}/dati?parametro=livello_idrometrico&periodo=ultimo-giorno
```
*(Vedi references/arpa_network.md per ID stazioni: Verona 124, Vicenza 108, Bassano 105, ecc. — Stazioni: Verona 124, Boara Pisani 142, Bassano 105, Vicenza 108, Ariano 132)*

**Interpretazione e Dati Manuali (Po, Adige, Arno, Tevere, Reno, Volturno):**
Consulta `references/hydro_italia.md` e incrocia con le osservazioni ARPA (Step D) per le soglie critiche di:
1.  **Fiume Po**: Stazioni di Piacenza, Cremona, Casalmaggiore, Boretto, Borgoforte, Pontelagoscuro.
2.  **Fiume Adige**: Trento e Verona.
3.  **Fiume Arno**: Firenze (Nave di Rovezzano, Uffizi) e Pisa.
4.  **Fiume Tevere**: Roma (Ripetta, Isola Tiberina).
5.  **Fiume Reno**: Casalecchio Chiusa.
6.  **Fiume Volturno**: Capua.

**Logica di Analisi:**
1. **Livello attuale vs soglie**: confronta `value` con soglie Gialla/Arancione/Rossa (AIPO/CFR).
2. **Trend (ultime 3-6 ore)**: in salita/discesa/stabile.
3. **Combinato con Step A (precipitazioni)**: se previsti >30mm/24h E livello > soglia gialla → scenario peggiorativo (Rischio Idraulico Nimbus).
4. **Combinato con Step A (soil_moisture_0_to_1cm)**: se >0.35 m³/m³ → suolo saturo, deflusso superficiale rapido.
5. **Combinato con lo storico recente in C**: piogge cumulate 7gg >100mm → bacino già carico.

### TIER C (nessun dato disponibile)

Per tutte le altre zone geografiche non coperte da TIER A o TIER B, dichiara esplicitamente: **"dati idrologici real-time non disponibili per questa zona"**.

In queste aree, stima il rischio idraulico potenziale utilizzando i parametri di Step A e C:
- **Criticità Alta**: `soil_moisture_0_to_1cm` > 0.35 m³/m³ (suolo saturo) **E** precipitazioni cumulate 7gg > 100mm.
- **Aggravante**: Previsione pioggia > 30mm/24h.
Segnala come: "Rischio Idraulico stimato via Nimbus (dati locali non disponibili)".

Vedi `references/hydro_italia.md` per endpoint completi, stazioni principali, soglie interpretative, e fonti regionali alternative.

#### N — Satellite Meteosat
> **Via MCP:** `eumetsat_satellite_info` (channel) — restituisce metadata collection (EO:EUM:DAT:MSG:HRSEVIRI) perché EUMETSAT richiede API key e dati binari; il fetch dell'immagine va fatto fuori dal MCP. (Validazione Visiva)

**Attiva sempre per:** allerta PC ≥ gialla (Step E), divergenza >1.5σ tra modelli su precipitazioni (Step 4a), nebbia prevista (visibilità <500m da Step A), use case nautica/aeronautico. **Altrimenti:** disattiva (costo computazionale elevato).

**Fetch EUMETView (immagini pre-renderizzate, no auth):**
```http
GET https://eumetview.eumetsat.int/static-images/latest/IR108.jpg
GET https://eumetview.eumetsat.int/static-images/latest/VIS06.jpg
GET https://eumetview.eumetsat.int/static-images/latest/WV062.jpg
```

**Interpretazione qualitativa (l'agente AI descrive l'immagine):**
1. **Fronti atlantici**: bande nuvolose continue IR10.8 → fronte in arrivo, confronta posizione con NWP
2. **Celle convettive**: tops molto freddi (IR10.8 scuro) → temporali intensi. Overshooting top → supercella
3. **Nebbia**: strato uniforme basso in VIS0.6, non visibile in IR10.8 notturno → nebbia da irraggiamento
4. **Dust sahariano**: area diffusa in IR8.7 → conferma dust CAMS (Step H)
5. **Copertura nuvolosa generale**: sereno/parzialmente coperto/coperto → validazione weather_code NWP

**Integrazione con nowcasting radar (Step I):** satellite mostra contesto sinottico, radar mostra dettaglio locale. Convergenza = alta fiducia.

**Nota:** L'agente AI può descrivere qualitativamente l'immagine. Per analisi quantitative usare i dati numerici degli Step A-J. Il satellite serve solo come validazione visiva di contesto. Se EUMETView non disponibile, usare il portale web https://eumetview.eumetsat.int/ per navigazione manuale.

Vedi `references/satellite.md` per canali SEVIRI, guida interpretazione pattern, e alternative (EUMETSAT Data Store, NASA GIBS).

### 4. Analisi Comparativa

#### 4a. Consensus modelli numerici (Massima Accuratezza)
- Per ogni variabile e slot orario: media, min, max, σ tra i modelli.
- **Dynamic Weighting**: Applica i correttivi di peso basati sullo scenario meteo (Temporali, Fronti, Nebbia, Venti) come definito in `references/italy_zones.md#pesatura-dinamica`.
- **Outlier**: modelli che scostano >1.5σ → segnala e applica bias noto (vedi `references/model_bias.md`).
- **Scenari probabilistici**: "X/Y modelli prevedono precipitazioni >5mm".
- Usa pesi ponderati da `references/italy_zones.md` e dettagli modelli da `references/models.md`.

#### 4b. Affidabilità contestuale per evento
Non usare solo l'orizzonte temporale — usa la matrice evento × orizzonte in `references/event_reliability.md`:

| Tipo evento | 0-24h | 1-3gg | 4-7gg | >7gg |
|---|---|---|---|---|
| Fronte atlantico / neve frontale | Alta | Buona | Media | Bassa |
| Temporale convettivo | Media | Bassa | Molto bassa | No |
| Ondata di calore / freddo | Alta | Alta | Media | Bassa |
| Vento sinottico (Bora, Tramontana) | Alta | Buona | Media | Bassa |
| Nebbia | Media | Bassa | Molto bassa | No |
| Foehn | Alta | Buona | Bassa | No |

Segnala sempre il tipo di evento riconosciuto e la sua affidabilità contestuale.

#### 4c. Confronto con climatologia e Raffinamenti (Accuracy+)
Vedi `references/climatology.md` per valori di riferimento e classificazione anomalie.
- "T max prevista: 28°C | media storica 15 maggio: 22°C → **+6°C anomalia positiva**"
- "Precipitazioni attese: 25mm | media maggio: 65mm/mese → **evento sopra norma**"
- Usa σ climatologica per classificare: dentro norma (±1σ), anomalo (1-2σ), estremo (>2σ)

**Raffinamenti di Accuratezza obbligatori:**
1.  **Quota Neve (Snow-Line)**: Non usare solo lo Zero Termico. Applica i correttivi per intensità e orografia (valli strette) definiti in `references/mountain.md#raffinamento-quota-neve`.
2.  **Isola di Calore Urbana (UHI)**: Se il target è una grande città (MI, RM, NA, TO, BO, FI), correggi le temperature minime notturne in condizioni di cielo sereno e vento calmo (vedi `references/model_bias.md#uhi`).
3.  **Rischio Mareggiata (Traversia)**: Se il target è costiero, verifica se vento/onde colpiscono perpendicolarmente la costa (Traversia) usando la matrice in `references/uv_marine_recent.md#traversia`.

#### 4d. Confronto forecast vs osservato (se dati ARPA disponibili)
- "Stazione di {NOME}: T attuale {X}°C, ICON D2 prevedeva {Y}°C → scarto {Z}°C"
- Se scarto sistematico > 2°C → applica correzione locale al forecast pomeridiano

#### 4e. Fenomeni locali italiani
Verifica automaticamente i pattern in `references/local_phenomena.md` e `references/italy_zones.md` → flag se attivi.

#### 4f. Analisi Ensemble Spread
Quando il fetch J è attivo:
1. Confronta **ensemble mean** con il **consensus deterministico** (fetch A)
2. Classifica lo spread per variabile (soglie in `references/ensemble_spread.md`)
3. Calcola probabilità da ensemble: P(pioggia >5/20/50mm), P(gelo), P(vento >70 km/h)
4. Applica la gerarchia ensemble–deterministico:
   - Spread basso + accordo → alta fiducia
   - Spread alto + accordo → situazione genuinamente incerta
   - Spread basso + divergenza → fidati dell'ensemble
   - Spread alto + divergenza → solo tendenze generali affidabili
5. Includi sempre scenario p10, mediana e p90 nel report per eventi significativi

#### 4g. Integrazione nowcasting + NWP (Blending Matrix)
Quando il nowcasting radar (Step I) o i fulmini (Step L) sono attivi, segui rigorosamente la **Matrice di Transizione** in `references/nowcasting_radar.md#matrice-di-transizione-radar-nwp-blending`:
- **0-15 min**: 100% Radar (Estrapolazione).
- **15-45 min**: 80% Radar / 20% NWP.
- **45-90 min**: 40% Radar / 60% NWP.
- **90-150 min**: 10% Radar / 90% NWP.
- **>150 min**: 100% NWP.

Se radar e NWP divergono sullo scenario a 1-3h → applica la **Logica di correzione temporale** (delay/advance) descritta in `references/nowcasting_radar.md`.

Se radar e NWP divergono sullo scenario a 1-3h → segnala esplicitamente l'incertezza.

### 5. Output

| Richiesta | Formato |
|---|---|
| "analisi", "report", non specificato | Report strutturato (con Execution Manifest) + widget HTML/React |
| "grafico", "visualizza", "chart" | Widget con grafici comparativi modelli |
| "piove?", "nevica?", "fa caldo?" | Risposta sintetica con semaforo |
| "dati", "numeri", "JSON" | Tabella strutturata |
| "tutto" | Report + grafici + tabella + raccomandazione |
| Use case specifico | Vedi sezione Use Case |

---

## Use Case Specializzati

Riconosci automaticamente il contesto dall'input e adatta il report:

### 🏔️ Montagna / Escursionismo / Sci (Uso personale e informativo)
Trigger: "montagna", "escursione", "trekking", "sci", "alpinismo", "rifugio"
Focus: quota neve (`freezing_level_height`), visibilità, temporali pomeridiani (orario picco 14-17),
vento in quota (stima: +50% rispetto 10m ogni 1000m), temperature a quota target.
**Mountain Intelligence**: Includi sempre la **Qualità della Neve** (Farinosa, Crostosa, Pesante, Marcia) se applicabile. (Vedi `references/mountain.md`).
Aggiungi: `elevation={quota_target}` nella chiamata API.
**UV obbligatorio**: in quota UV aumenta ~10% ogni 1000m — includi sempre sezione UV (Vedi `references/uv_marine_recent.md`, Step G).
**Fulmini**: rischio elevato in cresta/esposto se lightning density >5 in 50km² — verifica trend ore 12-18 per temporali pomeridiani (Step L).
**Satellite per nuvolosità in quota**: immagini IR10.8 per valutazione temporali in formazione sui rilievi e copertura nuvolosa generale (Step N).

### 🐝 Apicoltura / Impollinazione
Focus: Finestre di volo (T > 10°C, vento < 25 km/h), secrezione nettarifero (T notturna > 12°C e UR > 60%),
rischio gelate tardive su fioriture (Acacia, Castagno, Agrumi), rischio grandine e piogge battenti.
**Storico recente**: giorni di volo nell'ultima settimana e piogge pregresse per stato vegetativo (Step C).
Vedi soglie specifiche in `references/climatology.md`.

### ⚽ Evento sportivo / All'aperto
Trigger: "partita", "evento", "concerto", "gara", "sagra", orario specifico citato
Focus: fascia oraria dell'evento (±2h), probabilità pioggia in quella finestra, vento (soglia 50 km/h per strutture), temperatura percepita.
**UV se evento diurno**: includi picco UV e orario (Step G).
**Fulmini**: se fulmini entro 20km → sospensione evento. Ripresa >30 min dall'ultimo fulmine rilevato (Step L).

### 🌾 Agricoltura / Campagna
Trigger: "raccolto", "vendemmia", "irrigazione", "gelo", "grandine", "campi", "agricoltura", "peronospora", "viticoltura", "olivicoltura"
Focus: gelate (T <0°C, specie notturna), gelicidio (pioggia congelantesi), grandine (CAPE + LI),
bilancio idrologico (Precipitazioni vs ET0), umidità del suolo (soil_moisture_0_to_1cm),
Somma Termica (GDD) per maturazione, Rischio Peronospora (Regola dei 3-10),
siccità (precipitazioni ultimi 30gg vs norma), vento per irrorazione (>20 km/h = stop),
umidità fogliare (UR >90% = rischio funghi/oidio), gelate tardive (T < -1°C in primavera).
**Rischio allagamento campi**: se livello fiumi > soglia gialla + pioggia prevista >20mm/24h.
**Ristagno idrico**: se `soil_moisture_0_to_1cm` >0.35 + livello falda in salita (dati idrologici Step M).
**Storico recente**: precipitazioni 7gg e giorni senza pioggia sono critici per questo use case (Step C).

### 🏗️ Cantiere / Lavori all'aperto
Trigger: "cantiere", "lavori", "operai", "gru", "ponteggio"
Focus: vento >50 km/h (stop gru), pioggia cumulata (calcestruzzo), gelate notturne (ghiaccio su superfici), visibilità.
**METAR per visibilità**: se aeroporto ICAO nelle vicinanze, usa METAR per visibilità orizzontale — utile per lavoro in quota (gru, ponteggi) (Step K).
**Rischio allagamento scavi**: se livello falda in salita (Step M) + precipitazioni previste >20mm/24h.
**UV se estate**: rischio colpo di calore per i lavoratori (Step G).

### 🚗 Viabilità / Trasporti
Trigger: "viaggio", "autostrada", "strada", "guida", "treno", "volo"
Focus: neve (quota e accumulo stimato), nebbia (visibilità <200m), gelicidio (black ice),
acquaplaning (pioggia intensa), vento laterale (>70 km/h su ponti e tratti esposti).
**METAR per nebbia aeroportuale**: se aeroporto ICAO nelle vicinanze, usa METAR per visibilità RVR e ceiling — indicatore precoce di nebbia in pianura (Step K).
**Satellite per nebbia in Val Padana**: immagini VIS0.6 (diurno) e IR3.9 (notturno) per estensione nebbia (Step N).
**Rischio allagamento strade**: se livello fiume > soglia rossa per ponte/guado sul percorso (Step M), o pioggia >50mm/24h + dati ISPRA dissesto → rischio interruzione.

### 🏖️ Mare / Spiaggia / Nautica (Uso personale e informativo)
Trigger: "mare", "spiaggia", "barca", "vela", "nautica", "bagno"
Focus: stato del mare (Douglas Scale), vento (Beaufort), swell (mare lungo), temporali costieri, UV index.
**Marine API obbligatoria**: attiva fetch F per dati onde completi (wave_height, swell, periodo).
**UV obbligatorio**: includi sempre per questo use case (Step G).
**Fulmini**: se fulmini entro 10km dalla costa (Step L) → evacuazione spiaggia, rientro imbarcazioni immediate.
**Satellite per copertura nuvolosa costiera**: immagini IR10.8 per valutazione sistemi temporaleschi in avvicinamento dal mare (Step N).
Vedi scale Douglas/Beaufort e soglie in `references/uv_marine_recent.md`.

### 🌡️ Salute / Caldo estremo / Allergie
Trigger: "caldo", "afa", "anziani", "bambini", "salute", "allergie", "polline", "asma"
Focus: T percepita (Heat Index), Notti Tropicali (T min >20°C), ondata di calore (T >35°C per 3+ giorni), UV index, qualità aria.
**UV obbligatorio**: includi picco, orario e raccomandazioni SPF (Step G).
**Qualità aria obbligatoria**: AQI + PM2.5 + O3 + pollini stagionali + raccomandazioni soggetti sensibili (Step H).
**Storico recente**: segnala se ondata calore già in corso da giorni (Step C).

### 🚲 Ciclismo / Sport su strada
Focus: Vento (intensità e direzione), T percepita (comfort), rischio pioggia (grip), qualità aria.
**Soglie Operative**:
- **Vento**: >25 km/h = disturbo significativo (laterale/frontale), >40 km/h = rischio sicurezza.
- **Comfort**: T percepita 15-25°C = ideale, <10°C = rischio ipotermia (abbigliamento tecnico), >30°C = rischio disidratazione/colpo di calore.
- **Sicurezza**: probabilità pioggia >30% = rischio asfalto viscido/perdita grip.
- **Qualità Aria**: AQI >60 (Scarso) = sconsigliato sforzo intenso (Vedi `references/air_quality.md`).
**UV Index**: includi sempre per uscite diurne (Vedi `references/uv_marine_recent.md`, Step G).

### ⚡ Energia — Eolico e Solare
Trigger: "eolico", "solare", "fotovoltaico", "energia", "produzione", "impianto", "turbina", "pannelli", "grid"
Focus:
**Eolico**: velocità e direzione vento a 80m e 120m (altezze hub turbine), raffiche (>90 km/h = stop sicurezza). Produzione stimata: vento 5-25 m/s = zona operativa, <3 m/s = cut-in (nessuna produzione), >25 m/s = cut-out (stop).
**Solare**: `shortwave_radiation`, `direct_normal_irradiance` (DNI), `direct_radiation`, `diffuse_radiation`, `terrestrial_radiation`, `cloud_cover`. Produzione stimata: DNI > 600 W/m² = produzione ottimale, < 200 W/m² = produzione bassa. Rapporto `direct/diffuse` per valutazione efficienza impianti fissi vs inseguimento.
**Forecast vs climatologia**: confronta irraggiamento e vento previsti con la norma del periodo per valutare se la produzione sarà sopra/sotto media.
**Fulmini (Step L)**: se fulmini entro 10km da impianto eolico → stop preventivo turbine.
**METAR (Step K)**: se aeroporto vicino, usa METAR per validazione vento osservato vs previsto.

### 🏖️ Turismo — Beach Index e Ski Index
Trigger: "spiaggia", "bagno", "mare vacanza", "sci", "neve pista", "ski resort", "vacanza", "weekend fuori porta"
Focus:
**Beach Index** (trigger: mare, spiaggia, bagno, vacanza estiva):
- SST (Sea Surface Temperature) da Marine API (Step F): >22°C = confortevole, 18-22°C = fresco, <18°C = freddo
- UV Index: picco + orario + raccomandazione SPF (Step G)
- Vento: <15 km/h = ideale, 15-30 km/h = ventilato (piacevole), >30 km/h = vento forte (sabbia)
- Pioggia: probabilità nella fascia 10-18h
- Stato del mare: Douglas 0-2 = calmo, 3-4 = mosso, ≥5 = agitato (sconsigliato bagno)
- **Score**: 0-100 basato su T mare (30%), UV (20%), vento (20%), pioggia (20%), mare (10%)

**Ski Index** (trigger: sci, neve pista, ski resort, vacanza in montagna):
- Neve fresca prevista (`snowfall_sum`): >10cm = ottimo, 5-10cm = buono, <5cm = scarso
- Temperatura in quota: -5 a 0°C = ideale (neve farinosa), >2°C = neve pesante/marcia, <-10°C = molto freddo
- Vento in quota (stima: `wind_speed_10m × 2` per 2000m): >60 km/h = impianti chiusi
- Visibilità: >5km = ottimo, 1-5km = foschia, <1km = nebbia (impianti rallentati)
- **Snow depth** (`snow_depth`): >50cm = ottima copertura, 20-50cm = sufficiente, <20cm = scarsa
- **Score**: 0-100 basato su neve fresca (30%), T (20%), vento (20%), visibilità (15%), snow depth (15%)

---

## Granularità Temporale

| Richiesta | Parametri API |
|---|---|
| Ora corrente | `current=temperature_2m,...` |
| Oggi (default) | `forecast_days=1` |
| Domani | `forecast_days=2`, usa day index 1 |
| Weekend | `forecast_days=N` fino a sabato/domenica |
| Settimana | `forecast_days=7`, usa `daily` |
| 10–16 giorni | `forecast_days=16` + segnala affidabilità ridotta |
| Storico | `https://historical-forecast-api.open-meteo.com/v1/forecast` |
| Climatologia | `https://archive-api.open-meteo.com/v1/archive` (ERA5, dal 1940) |

---

## Template Report

---
⚠️ USO PERSONALE E INFORMATIVO
Questo report è generato da un sistema AI sperimentale basato su
fetch di dati pubblici e knowledge base non certificata.
NON è adatto a decisioni professionali in ambito nautico, alpinistico,
agricolo o di protezione civile. Per questi use case consultare:
- Meteo AM (Aeronautica Militare): meteoam.it
- Protezione Civile: protezionecivile.gov.it
- ARPA regionale di riferimento
---

### 📋 Execution Manifest (OBBLIGATORIO)
Da compilare SEMPRE prima di qualsiasi analisi. Se lo **Step A** è in stato "**🧠 Stima interna**", è obbligatorio inserire il banner di avviso in cima al report.

| Step | Nome | Stato | Fonte | Livello Fetch | Timestamp |
|---|---|---|---|---|---|
| A | Previsioni numeriche | ✅ / ⚠️ / ❌ / 🧠 | | 1 / 2 / 3 | |
| B | Climatologia ERA5 | | | - | |
| ... | ... | ... | ... | ... |

**Stati ammessi:**
- ✅ **Eseguito**: Dati reali ottenuti con successo.
- ⚠️ **Parziale**: Alcuni dati mancanti o fallback utilizzati.
- ❌ **Saltato**: Step non necessario o fallito senza fallback.
- 🧠 **Stima interna**: Dati non disponibili, basati su conoscenza del modello.

---

### 🟢 Report Sintetico (Response Mode: LITE)
Da usare per query semplici ("Che tempo fa?", "Piove?", "Temperatura?").

{⚠️ ATTENZIONE: report basato su conoscenza interna, non su dati meteorologici in tempo reale. - SOLO SE STEP A = STIMA INTERNA}

```
---
⚠️ USO PERSONALE E INFORMATIVO
Questo report è generato da un sistema AI sperimentale basato su
fetch di dati pubblici e knowledge base non certificata.
NON è adatto a decisioni professionali in ambito nautico, alpinistico,
agricolo o di protezione civile. Per questi use case consultare:
- Meteo AM (Aeronautica Militare): meteoam.it
- Protezione Civile: protezionecivile.gov.it
- ARPA regionale di riferimento
---

## 📋 Execution Manifest [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{Tabella Manifest}
**Livello Fetch Step A**: {1 | 2 | 3}

## 🌤️ Meteo {LUOGO} — {DATA} [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
**Sintesi**: {2-3 righe su cielo, precipitazioni e vento}
**🌡️ Temp**: {min} / {max}°C (Percepita: {max_app}°C)
**🚨 Allerta**: {🟢 Verde / 🟡 Gialla / 🟠 Arancione / 🔴 Rossa} - {Tipo/Nessuna}
**☔ Pioggia**: {P}% ({range mm})
**💨 Vento**: {intensità} km/h da {DIR}
```

### 🔵 Report Completo (Response Mode: PRO)
Da usare per "analisi", "report" o use-case specifici.

{⚠️ ATTENZIONE: report basato su conoscenza interna, non su dati meteorologici in tempo reale. - SOLO SE STEP A = STIMA INTERNA}

```
---
⚠️ USO PERSONALE E INFORMATIVO
Questo report è generato da un sistema AI sperimentale basato su
fetch di dati pubblici e knowledge base non certificata.
NON è adatto a decisioni professionali in ambito nautico, alpinistico,
agricolo o di protezione civile. Per questi use case consultare:
- Meteo AM (Aeronautica Militare): meteoam.it
- Protezione Civile: protezionecivile.gov.it
- ARPA regionale di riferimento
---

## 📋 Execution Manifest [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{Tabella Manifest}
**Livello Fetch Step A**: {1 | 2 | 3}

## 🌤️ Analisi Meteo — {LUOGO} ({REGIONE}) — {DATA} [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]

{⚠️ ALERT: UTILIZZO FONTI ESTERNE - Solo se Open-Meteo non disponibile}
> **AVVISO**: I dati per questa analisi sono stati aggregati da fonti esterne (es. 3bMeteo, iLMeteo, Meteo.it) a causa dell'indisponibilità temporanea dei sistemi primari Open-Meteo. L'accuratezza potrebbe variare.

### 📡 Nowcasting Radar (0-6h) — {HH:MM} ora locale (Step I) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{se immagine disponibile:
Analisi visiva: {descrizione nuclei, intensità dBZ e posizione rispetto al target}
Tendenza 0-3h: {blending tra osservazione radar e modello ICON-D2}
| altrimenti:
⚠️ nowcasting non disponibile in questa sessione.
Consulta manuale: https://mappe.protezionecivile.gov.it}
Affidabilità: 0-30min Alta (Radar) → 30-60min Media → >60min Bassa (NWP)
Fonte: Radar-DPC (CC-BY-SA)

### 🚨 Allerta {COLORE} — {TIPO} (Step E) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{Dettaglio allerta (solo a scopo informativo)}

### Consensus Multi-Modello [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Modelli: {N} | Macroarea: {ZONA} | Concordanza: Alta/Media/Bassa
{lista modelli con pesi}

### 📅 Ultimi 7 giorni (Step C) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Precipitazioni cumulate: {X}mm (norma: {Y}mm → {±Z}%)
**Bilancio Idrico Nimbus**: {±X}mm ({Surplus/Equilibrio/Deficit/Stress})
Giorni senza pioggia: {N} consecutivi | T media anomalia: {±X}°C
Contesto: {frase — es. "suoli saturi" / "siccità in corso" / "nella norma"}

### 📊 vs Climatologia (Step B) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
T max: {X}°C | Media storica: {Y}°C | Anomalia: {±Z}°C ({dentro norma/anomalo/estremo})
Precipitazioni: {X}mm attesi | Media periodo: {Y}mm | {valutazione}

### 📡 Osservato (stazione {NOME_STAZIONE}, ore {HH} — Step D) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
T: {X}°C | Pioggia ultime 6h: {X}mm | Vento: {X} km/h da {DIR}
{confronto con forecast precedente: scarto modelli}

### Scenario del giorno [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{2-3 righe narrative su come si sviluppa la giornata}
**Visibilità**: {X} km ({Classe})

### Temperatura [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Range: {min}–{max}°C | **Percepita (Apparent)**: {min_app}–{max_app}°C
Consensus: {media}°C ±{σ}°C | Anomalia: {+/-X}°C vs norma

### Precipitazioni [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{N}/{TOT} modelli prevedono pioggia | Quantitativi: {range mm} | P: {%}%
{se temporali: CAPE={X} J/kg, LI={Y}, scenario grandine}

### Vento [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Sostenuto: {X} km/h da {DIR} | Raffiche: {max} km/h
{flag: FOEHN / BORA / TRAMONTANA / SCIROCCO / LIBECCIO / MAESTRALE / GARBINO / PONENTINO / GRECALE / BREVA / TIVANO / ORA / PELER}

### ☀️ UV Index (Step G) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Picco: {X} ({Basso/Moderato/Alto/Molto alto/Estremo}) alle {HH}:00
Protezione: {raccomandazione SPF}

### 🌊 Condizioni Marine (Step F) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Stato del mare: Grado {N} (Douglas) | Onde: {X}m | Beaufort (Vento): {N}
**Mare Morto (Swell)**: {Bassa/Media/Alta} | Periodo: {X}s ({Descrizione})
**SST (Temperatura Mare)**: {X}°C ({Comfort})
Balneazione: {Ok/Cautela/Sconsigliata} | Nautica: {Ok/Cautela/Sconsigliata}

### 📊 Ensemble Spread (Step J) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
T max: p10={A}°C | mediana={B}°C | p90={C}°C | spread={D}°C → {Bassa/Media/Alta/Molto alta}
Precipitazioni: mediana={X}mm | p90={Y}mm | P(>5mm)={P}% | P(>20mm)={Q}%
Vento raffica: mediana={X} km/h | p90={Y} km/h | P(>70km/h)={P}%
Concordanza ensemble–deterministico: {Alta/Media/Bassa}
Scenario p10 (ottimistico): {descrizione breve}
Scenario p90 (pessimistico): {descrizione breve}

### 💨 Qualità dell'Aria (Step H) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
AQI: {X} — {Buono/Discreto/Moderato/Scarso/Molto scarso/Pessimo} {EMOJI}
PM2.5: {X} µg/m³ | PM10: {X} µg/m³ | NO2: {X} µg/m³ | O3: {X} µg/m³
{se Bacino Padano: Protocollo Aria: {Verde/Arancio/Rosso} (Misure temporanee)}
{se dust: Polvere sahariana: {X} µg/m³ ⚠️ evento naturale}
{se wildfire: Fumo da incendi: {X} µg/m³ (PM10 wildfire) ⚠️}
{se pollini: {Tipo} pollen: {livello (Basso/Medio/Alto — Soglie AIA)}}
Condizioni: {accumulo/dispersione/neutro}
Soggetti sensibili: {raccomandazione}

### ✈️ Validazione METAR (Step K) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Aeroporto: {ICAO} | Osservato: {HH:MM} UTC
T osservata: {X}°C | T prevista: {Y}°C → Scarto: {±Z}°C
Vento osservato: {DIR}/{X}kt raffiche {Y}kt | Vento previsto: {DIR}/{X}kt
Visibilità: {X}m ({VFR/IFR/LIFR}) | Nuvole: {SKC/FEW/SCT/BKN/OVC}
{se divergenza >2°C: ⚠️ modello sovrastima/sottostima — correggi forecast}
{se visibilità <2000m: ⚠️ nebbia — critico per viabilità}

### ⚡ Fulmini in Tempo Reale (Step L) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Fulmini ultimi 15min: {N} in {area}km² | Densità: {X}/50km²/15min
Trend: {in intensificazione / stabile / in dissolvimento}
Distanza minima: {X}km ({pericolo immediato / in zona / nelle vicinanze / lontano})
{se CAPE>1500 + fulmini>10: ⚠️ supercella probabile}
{se fulmini + nuclei intensi (>45 dBZ) in Vision: ⚠️ grandine probabile (>70%)}
{se dry lightning: ⚠️ rischio incendi — fulmini senza pioggia}

### 🌊 Dati Idrologici (Step M) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Fiume: {NOME} a {LOCALITÀ} | Livello: {X}m
Soglie: {Gialla: X | Arancione: Y | Rossa: Z}
Stato: {🟢 Basso / 🟡 Medio / 🟠 Alto / 🔴 Estremo} (Rischio Idraulico Nimbus)
Trend 6h: {in salita / stabile / in discesa} ({±X}m)
{se livello > soglia gialla + pioggia prevista: ⚠️ scenario peggiorativo}
{se suolo saturo + pioggia >50mm: ⚠️ rischio piena lampo / esondazione}
{se TIER C: "dati idrologici real-time non disponibili per questa zona"}

### 🛰️ Satellite (Step N) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Canale IR10.8: {copertura nuvolosa — sereno / parzialmente coperto / coperto}
{se fronti: Banda frontale {in arrivo / in transito / in allontanamento} — posizione vs NWP: {convergente / divergente}}
{se celle convettive: Tops freddi (<-60°C) → temporali intensi {con/senza} overshooting}
{se nebbia: Strato nuvoloso basso confermato in {Val Padana / zona costiera}}
{se dust: Area diffusa IR8.7 → conferma dust CAMS}

### ⚠️ Fenomeni speciali [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{solo se presenti — con spiegazione del meccanismo fisico}

### ⚠️ Incertezze [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Tipo evento: {TIPO} | Affidabilità contestuale: {Alta/Media/Bassa}
{dove i modelli divergono e perché conta praticamente}

### Raccomandazione operativa [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{frase diretta — scenario più probabile, cosa aspettarsi, cosa fare}

---
Fonte previsioni: Open-Meteo (CC BY 4.0) | Modelli: {lista}
Osservazioni: {ARPA regionale} | METAR: CheckWX / aviationweather.gov
Allerte: Fonti Pubbliche | Radar: DPC (CC-BY-SA)
Climatologia: ERA5 (media {N} anni) | Pollini: AIA
Idrologia: floods.it (Trentino/Veneto) | Satellite: EUMETSAT
```

---

## Note Operative

- `timezone=Europe/Rome` sempre per l'Italia (mai `auto`)
- Isole: usa sempre ECMWF come backbone — altri modelli hanno copertura ridotta
- Montagna >1500m: aggiungi `elevation={quota}` per dati corretti
- ECMWF IFS a 9km è open-data completa dal 1 ottobre 2025
- Bias noti dei modelli → consulta il tool `meteo_model_tuning` (o `references/model_bias.md` se MCP non attivo) prima di interpretare outlier
- **Badge Confidence**: Assegna il colore in base alla fonte: 🟢 REALE (dati fetchati o ricavati tramite tool MCP in questa sessione), 🟡 PARZIALE (dati parziali o da cache), 🔴 STIMA (generato dalla conoscenza interna del modello). Non omettere mai il badge confidence. Preferisci dichiarare 🔴 STIMA piuttosto che omettere la sezione.

## Fallback Strategy

SE Open-Meteo API restituisce errore 5xx o timeout >10s:
1. Prova https://historical-forecast-api.open-meteo.com per dati storici recenti.
2. Usa `references/italian_portals.md` per portali regionali alternativi.
3. Se anche i portali falliscono: dichiara nel report "dati NWP non disponibili", produci solo sezioni E (allerte pubbliche se disponibili), D (ARPA se disponibile) e una stima qualitativa basata sulla climatologia usando il tool `meteo_climatology` (o `references/climatology.md` se MCP non attivo).

**MANDATORIO**: NON produrre numeri specifici di temperatura o precipitazioni senza fonte reale.

## Rate Limits e Retry Strategy

- **CheckWX**: 3000 req/giorno → se quota esaurita, switcha immediatamente su `aviationweather.gov` senza notificare l'utente.
- **DMI Lightning**: ~60 req/min → se 429 (Too Many Requests), aspetta 2s e riprova una volta sola, poi dichiara "lightning data non disponibile".
- **Open-Meteo**: no hard limit ma fair use → se >10 modelli nella stessa chiamata e risposta >5s, riduci a 5 modelli prioritari per macroarea (usando il tool `meteo_model_tuning` o `references/italy_zones.md` se MCP non attivo).
- **floods.it**: no rate limit noto → in caso di 503 (Service Unavailable), skip senza retry.

## Validation Status

### Componenti verificati
- [ ] `meteo_climatology` vs ARPA dati storici
- [ ] `meteo_model_tuning` vs ECMWF verification scores
- [ ] `meteo_event_reliability` vs SMI bollettini storici
- [ ] `meteo_local_phenomena` vs Atlante Climatico CNR
- [ ] Output report vs esperto meteorologo (almeno 10 casi)
- [ ] Output nautico vs Meteo AM bollettino comparato
- [ ] Output montagna vs AINEVA bollettino comparato

### Come contribuire alla validazione
Per ogni campo numerico verificato, aprire una PR con:
- valore attuale nel reference
- valore corretto dalla fonte primaria
- link alla fonte primaria
