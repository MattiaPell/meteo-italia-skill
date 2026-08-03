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

⚠️ **STRATEGIA MCP-FIRST OBBLIGATORIA**:
L'intero progetto adotta una filosofia **MCP-First**. Tutti i file presenti sotto `references/` sono file placeholder minimi che puntano ai tool MCP. L'intera base di conoscenza dettagliata (tabelle, scale, regole di calcolo, soglie, codici, bias) è stata migrata all'interno del server MCP, riducendo il contesto di ~79%.

Se il server MCP è disponibile nell'ambiente, **NON caricare alcun file di reference in contesto**. Usa direttamente i tool MCP dedicati per ottenere climatologia, indici bioclimatici avanzati, bias dei modelli, affidabilità, linee guida e riconoscimento dei fenomeni locali al volo.

Se l'ambiente non supporta MCP, l'agente opererà in modalità `🧠 Stima interna` — basandosi esclusivamente sulla propria conoscenza del modello, senza accesso a dati reali. In questo caso, **dichiarare esplicitamente** il badge `🔴 STIMA` nel report e non produrre numeri specifici senza fonte verificata.

---

## MCP Server (meteo-italia-mcp-server)

Tutte le chiamate API esterne e le basi di conoscenza meteorologiche sono esposte come **tool MCP**. Se l'ambiente fornisce questo server, **USA I TOOL al posto dei fetch HTTP grezzi e dei file di reference locali**: gestiscono errori, cache, rate-limit e calcoli complessi.

**Mappatura step/riferimenti → tool MCP:**

| Step / Riferimento | Tool MCP | Servizio / Funzione |
|---|---|---|
| **0 (default, SEMPRE)** | `meteo_brief` | Aggrega in 1 chiamata: NWP multi-modello + allerte PC + radar + METAR + ARPA regionale + ensemble, con divergenze calcolate |
| Geocoding | `open_meteo_geocode` | Open-Meteo Geocoding |
| A (forecast) | `open_meteo_forecast` / `open_meteo_forecast_summary` | Open-Meteo Forecast (raw / compact summary) |
| B (Climatologia ERA5) | `meteo_climatology` / `open_meteo_archive` | Query norme ERA5 di capoluoghi italiani / Archive raw |
| E (allerte) | `pc_allerte` | Bollettino criticità DPC (GitHub pcm-dpc), filtro per comune/regione |
| F (marine) | `open_meteo_marine` | Open-Meteo Marine |
| G (flood / GloFAS) | `open_meteo_flood` | Portata fiumi simulata GloFAS v4 a 5km |
| H (CAMS) | `open_meteo_air_quality` | Open-Meteo Air-Quality |
| J (ensemble) | `open_meteo_ensemble` | Open-Meteo Ensemble |
| I (radar) | `dpc_radar` | Radar-DPC REST (22 prodotti, pre-signed GeoTIFF) |
| K (METAR/TAF) | `checkwx_metar_taf` / `aviationweather_metar` | CheckWX / AviationWeather |
| L (fulmini) | `dmi_lightning` | DMI Lightning |
| M (idro TA-A) | `floods_it_monitoring` | floods.it |
| M (idro Veneto) | `arpav_idro` | ARPAV livelli idrometrici stazioni (Veneto) |
| D (ARPA Veneto) | `arpav_bollettino` | Previsione ARPAV per 15 zone |
| D (ARPA Trentino) | `meteotrentino_osservazioni` | Osservazioni stazioni P.A. Trento |
| D (ARPA Emilia-Romagna) | `arpae_bollettino` | Bollettino ARPAE fino 4gg |
| D (ARPA FVG) | `arpafvg_previsioni` / `arpafvg_stazione` | Previsioni OSMER + osservazioni stazione |
| D (ARPA Marche) | `arpa_marche_stazioni` / `arpa_marche_stazione` / `arpa_marche_grandezze` | Stazioni AMAP Agrometeo |
| D (ARPA Lombardia) | `arpa_lombardia_stazioni` / `arpa_lombardia_osservazioni` | Osservazioni Socrata Open Data |
| D (ARPA Piemonte) | `arpa_piemonte_stazioni` | Stazioni meteo Piemonte |
| N (satellite) | `eumetsat_satellite_info` | EUMETSAT (metadata) |
| **Outlook stagionale** | `open_meteo_seasonal` | ECMWF SEAS5 (6-ore, fino a 7 mesi) |
| **Ref: Climatologia** | `meteo_climatology` | Ottieni medie e anomalie storiche per 110 città italiane |
| **Ref: Indici / Soglie** | `meteo_bioclimatic_indices` | Calcola Heat Index, Wind Chill, GDD, Water Balance, soglie Vite, Api, Olivo, Quota Neve, Rischio Incendi (NFR), Energia FV/Eolico |
| **Ref: Fenomeni Locali** | `meteo_local_phenomena` | Riconoscimento automatico Bora, Foehn, Scirocco, Maestrale, Nebbia, Gelicidio, Libeccio, Tramontana, Garbino, Breva/Tivano, ecc. |
| **Ref: Bias e Pesi** | `meteo_model_tuning` | Recupera pesi zone, bias modelli e correzione UHI |
| **Ref: Affidabilità** | `meteo_event_reliability` | Matrice di affidabilità forecast per orizzonte e tipo evento |
| **Ref: Linee Guida e Scale** | `meteo_reference_guidelines` | Tabelle statiche per categorie (models, marine, air_quality, mountain, hydro, nowcasting, satellite, lightning, aviation, portals, pollen, uv, construction, tourism) |
| **Ref: Verifica Storica** | `meteo_verification` | Confronta forecast passati con ERA5 reanalysis (MAE, bias, RMSE) |
| **Ref: Confronto Annuale** | `meteo_year_compare` | Confronta meteo attuale vs stesso periodo anno scorso (ERA5) |
| **Ref: Pollini** | `meteo_pollen` | Previsione pollini Italia |

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
> **Via MCP:** `open_meteo_geocode` con `count=10`.
Filtra per `country_code == 'IT'`. Gestisci la conferma manuale per risultati esteri e mostra un prompt di disambiguazione all'utente se ci sono più di 3 corrispondenze italiane. Annota lat, lon, `elevation`.

### 3. Fetch sequenziale prioritizzato

**STEP 0 (OBBLIGATORIO, SEMPRE): `meteo_brief`** — Prima di qualsiasi analisi, chiama `meteo_brief` (nome o lat/lon) per interrogare in parallelo NWP multi-modello, allerte PC, radar DPC, METAR vicini, ARPA regionale se coperta, ed ensemble spread. Analizza le divergenze calcolate dal brief e usa i tool singoli solo per approfondire anomalie o dati mancanti.

Esegui il workflow in 3 Tier. Completa il **TIER 1** prima di procedere al **TIER 2**.
*Regola del contesto:* Se il contesto supera 80k token dopo il TIER 1, esegui solo gli step TIER 2 con condizione TRUE e salta completamente il TIER 3.

| Tier | Step | Nome | Condizione | Tool di riferimento / Guideline |
|---|---|---|---|---|
| **TIER 1** | A | Previsioni numeriche (Open-Meteo) | Sempre | `meteo_model_tuning` (pesi/bias) |
| | B | Climatologia ERA5 | Sempre (10y baseline) | `meteo_climatology` |
| | E | Allerta (Dati Pubblici) | Sempre | `pc_allerte` |
| **TIER 2** | D | Osservazioni ARPA | Sempre | `meteo_brief` o tool ARPA specifici |
| | F | Dati marini | Se costiero/nautica/ASE/Caligo | `meteo_reference_guidelines` (marine) |
| | H | Qualità aria CAMS | Pianura Padana (ott-mar), salute, inversione, scirocco | `meteo_reference_guidelines` (air_quality) |
| | J | Ensemble Spread | Orizzonte >3gg, eventi significativi, allerta ≥gialla, divergenza modelli | `meteo_reference_guidelines` (models) |
| **TIER 3** | I | Nowcasting Radar DPC | Allerta ≥gialla, CAPE>800, weather_code 80-99, richiesta 1-3h | `meteo_reference_guidelines` (nowcasting) |
| | K | METAR/TAF | Aviazione/droni, validazione forecast, ARPA non disp., divergenza >2°C | `meteo_reference_guidelines` (aviation) |
| | L | Lightning Detection | Allerta ≥gialla per temporali, CAPE>800, nautica/montagna/outdoor | `meteo_reference_guidelines` (lightning) |
| | M | Dati Idrologici (Trentino real-time + bacini nazionali via soglie) | Allerta ≥gialla idro, pioggia>30mm/24h, cumulata 7gg>100mm, agricoltura | `meteo_reference_guidelines` (hydro) |
| | N | Satellite Meteosat | Allerta ≥gialla, divergenza modelli >1.5σ, nebbia prevista, nautica/aero | `meteo_reference_guidelines` (satellite) |

*Nota: Gli Step C (Analisi Storico) e G (UV Index) sono inclusi o derivati dallo Step A.*

#### TIER 1 (Obbligatori sempre)

#### A — Previsioni numeriche (Open-Meteo) — Strategia a 3 Livelli
> **Via MCP:** Usa `open_meteo_forecast` (con `level="auto"` per delegare la gestione automatica dei 3 livelli) o `open_meteo_forecast_summary` (raccomandato per report di sintesi).
Dichiara nel report `levelUsed` restituito dal tool.

#### C — Storico recente (ultimi 7gg)
Disponibile se attivato il **LIVELLO 2** di Step A (`past_days=7`). Includi nel report in caso di piogge previste >20mm, allerte, ondate estreme o use case Agricoltura. Per calcolare indici specifici (es. Bilancio Idrico Nimbus) usa `meteo_bioclimatic_indices`.

#### G — UV Index
Già incluso nel fetch A. Includi nel report se `uv_index_max` >5, o per spiaggia/montagna. Usa `meteo_reference_guidelines` (uv) per le raccomandazioni.

#### B — Climatologia ERA5
> **Via MCP:** Confronta il forecast con la norma storica tramite `meteo_climatology` o `open_meteo_archive` per valutare le anomalie.

#### E — Allerta (Dati Pubblici)
> **Via MCP:** Usa `pc_allerte` (comune/regione). Se `allertaMaxOggi` ≥1 (gialla) attiva gli step condizionali (I, L, M, N).

#### TIER 2 (Condizionali ad alta priorità)

#### D — Osservazioni ARPA
> **Via MCP:** Usa `meteo_brief` o tool ARPA regionali dedicati. Se disponibile, confronta con forecast per stimare il bias del giorno. Altrove usa METAR (Step K) o Radar (Step I).

#### F — Dati marini (solo se costa o uso nautico)
> **Via MCP:** Usa `open_meteo_marine`. Per le scale Beaufort/Douglas e matrici di traversia, usa `meteo_reference_guidelines` con categoria "marine" (coste adriatiche, Maccaja/Caligo a NW, Lupa di mare al Sud/Sicilia).

#### H — Qualità aria CAMS (condizionale)
> **Via MCP:** Usa `open_meteo_air_quality`. Per interpretare AQI, pollini e limiti, usa `meteo_reference_guidelines` con categoria "air_quality".

#### J — Ensemble Spread (condizionale)
> **Via MCP:** Usa `open_meteo_ensemble`. Per lo spread e l'incertezza, usa `meteo_reference_guidelines` con categoria "models".

#### TIER 3 (Condizionali a bassa priorità)

#### I — Nowcasting Radar DPC (condizionale)
> **Via MCP:** Usa `dpc_radar` (VMI). Esegui analisi Vision qualitativa (nuclei, intensità dBZ, posizione) o fallback testuale. Usa `meteo_reference_guidelines` con categoria "nowcasting" per dBZ e blending.

#### K — METAR/TAF (condizionale)
> **Via MCP:** Usa `checkwx_metar_taf` o `aviationweather_metar`. Usa `meteo_reference_guidelines` con categoria "aviation" per la lista aeroporti ICAO e regole di validazione (scarti T, vento, visibilità).

#### L — Lightning Detection (Nowcasting Temporali)
> **Via MCP:** Usa `dmi_lightning`. Rileva densità, trend e distanza. Usa `meteo_reference_guidelines` con categoria "lightning" per la scala di pericolo.

#### M — Dati Idrologici (Trentino real-time + bacini nazionali via soglie)
> **Via MCP:** Usa `floods_it_monitoring` (Trentino), `arpav_idro` (Veneto) o `open_meteo_flood` (portata simulata GloFAS v4 per qualsiasi bacino).
- **TIER A (API Real-time)**: floods.it, ARPAV o GloFAS.
- **TIER B (Soglie manuali)**: Po, Adige, Arno, Tevere, Reno, Volturno. Incrocia stazioni e soglie critiche tramite `meteo_reference_guidelines` con categoria "hydro" (ad es. Casalecchio Reno: 0.80m, 1.60m, 2.20m; Volturno Capua via Bollettino Campania).
- **TIER C (Fallback)**: Altre zone → dichiara *"dati idrologici real-time non disponibili per questa zona"* e stima il rischio idraulico potenziale (Rischio Idraulico Nimbus).

#### N — Satellite Meteosat (condizionale)
> **Via MCP:** Usa `eumetsat_satellite_info`. Esegui descrizione qualitativa di fronti, celle o nebbie. Usa `meteo_reference_guidelines` con categoria "satellite".

---

### 4. Analisi Comparativa

- **Consensus**: Calcola media/spread usando `meteo_model_tuning` per i pesi dinamici (consensando scenari vento forte/neve).
- **Affidabilità**: Determina l'affidabilità con `meteo_event_reliability`.
- **Raffinamenti**: Calcola quota neve (Nimbus formula in `meteo_bioclimatic_indices`), UHI e bias locali tramite `meteo_model_tuning` e verifica storica con `meteo_verification`.
- **Nowcasting Blending**: 0-15m Radar (100%), 15-45m (80/20), 45-90m (40/60), 90-120m (10/90), >120m (100% NWP).

### 5. Output
Riconosci la richiesta dell'utente e adatta l'output (LITE per sintesi, PRO per report completo o use-case specifico).

---

## Use Case Specializzati
Riconosci il contesto dall'input e calcola soglie/indici tramite `meteo_bioclimatic_indices`:
- **🏔️ Montagna**: Quota neve (Nimbus formula), temporali, UV, vento, indici sci (Ski Index).
- **🐝 Apicoltura**: Finestre di volo, secrezione nettarifera.
- **⚽ Evento sportivo**: Precipitazioni in fascia oraria, vento, fulmini.
- **🌾 Agricoltura**: Gelate, GDD, bilancio idrico, umidità suolo (Bagnatura Fogliare proxy `RH > 90% OR Precip > 0`), regola dei tre dieci per peronospora vite.
- **🏗️ Cantiere**: Limiti vento gru/ponteggi, temperatura getto calcestruzzo via `meteo_reference_guidelines` (construction).
- **🚗 Viabilità**: Neve, nebbia, gelicidio, acquaplaning, vento.
- **🏖️ Mare/Nautica**: Douglas/Beaufort, swell, balneazione, Beach Index.
- **🌡️ Salute**: Heat Index, THI stress bestiame, AQI, pollini.
- **⚡ Energia (Eolico/Solare)**: Vento a 80-120m, cut-in/cut-out, irraggiamento, efficienza FV/Eolico.

---

## Granularità Temporale

- **Ora corrente**: Usa nowcasting o `current` dell'MCP.
- **Oggi / Domani / Weekend / Settimana**: Imposta il parametro `days` (1-7) nell'MCP.
- **Lungo termine / Stagionali**: Segnala ridotta affidabilità e usa `open_meteo_seasonal`.

---

## Template Report

Tutti i report generati (sia LITE che PRO) devono **OBBLIGATORIAMENTE** iniziare con il seguente disclaimer immutabile:

```markdown
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
```

### 📋 Execution Manifest (OBBLIGATORIO)
Includi sempre questa tabella prima del report. Se lo **Step A** è in stato "**🧠 Stima interna**", inserisci un avviso in rosso all'inizio.

| Step | Nome | Stato | Fonte | Livello Fetch | Timestamp |
|---|---|---|---|---|---|
| A | Previsioni numeriche | ✅ / ⚠️ / ❌ / 🧠 | | 1 / 2 / 3 | |
| B | Climatologia ERA5 | | | - | |
| ... | ... | ... | ... | ... |

*(Stati: ✅ Eseguito, ⚠️ Parziale, ❌ Saltato, 🧠 Stima interna)*

---

### 🟢 Report Sintetico (Response Mode: LITE)

`[MANDATORIO: DISCLAIMER IMMUTABILE IN CIMA]`

## 📋 Execution Manifest [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{Tabella Manifest con Livello Fetch Step A}

## 🌤️ Meteo {LUOGO} — {DATA} [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
**Sintesi**: {2-3 righe su cielo, precipitazioni, vento}
**🌡️ Temp**: {min} / {max}°C (Percepita: {max_app}°C)
**🚨 Allerta**: {Semaforo e tipo}
**☔ Pioggia**: {P}% ({range mm})
**💨 Vento**: {intensità} km/h da {DIR}

---

### 🔵 Report Completo (Response Mode: PRO)

`[MANDATORIO: DISCLAIMER IMMUTABILE IN CIMA]`

## 📋 Execution Manifest [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{Tabella Manifest con Livello Fetch Step A}

## 🌤️ Analisi Meteo — {LUOGO} ({REGIONE}) — {DATA} [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]

{⚠️ ALERT: UTILIZZO FONTI ESTERNE - Solo se Open-Meteo non disponibile}

### 📡 Nowcasting Radar (0-6h) (Step I) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{Analisi visiva Vision o fallback testuale}

### 🚨 Allerta {COLORE} (Step E) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{Dettaglio allerta}

### Consensus Multi-Modello [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Modelli: {N} | Pesi e concordanza

### 📅 Ultimi 7 giorni (Step C) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Precipitazioni cumulate, Bilancio Idrico Nimbus, anomalia T.

### 📊 vs Climatologia (Step B) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Confronto T max/min e precipitazioni vs medie storiche ERA5.

### 📡 Osservato (stazione {NOME}, Step D) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
T, pioggia, vento misurati e scarto modelli.

### Scenario del giorno [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Descrizione narrativa. Visibilità.

### Temperatura [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Range, percepita, consensus deviazione standard, anomalia.

### Precipitazioni [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Modelli favorevoli, quantitativi, probabilità, CAPE/LI, rischio grandine.

### Vento [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Velocità, raffiche, flag fenomeni locali (Bora, Foehn, Scirocco, ecc.).

### ☀️ UV Index (Step G) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Picco e raccomandazioni protezione.

### 🌊 Condizioni Marine (Step F) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Douglas, onde, Beaufort, swell, SST, idoneità balneazione/nautica.

### 📊 Ensemble Spread (Step J) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Percentili T, precipitazioni, vento, concordanza e scenari p10/p90.

### 💨 Qualità dell'Aria (Step H) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
AQI, PM2.5, PM10, polvere sahariana, incendi, pollini, misure limitative.

### ✈️ Validazione METAR (Step K) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
ICAO, T osservata vs prevista, vento, visibilità, nubi, anomalie.

### ⚡ Fulmini in Tempo Reale (Step L) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Fulmini, densità, trend, distanza minima, rischio supercelle/grandine/incendi.

### 🌊 Dati Idrologici (Step M) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Fiume, livello, soglie, stato di rischio, trend, rischio piena lampo.

### 🛰️ Satellite (Step N) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Analisi qualitativa canali IR/VIS, transito fronti, celle convettive, nebbia.

### ⚠️ Fenomeni speciali e Incertezze [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Spiegazione meccanismi fisici e divergenze modelli.

### Raccomandazione operativa [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Scenario più probabile e consigli pratici diretti.

---
Fonti: Open-Meteo, ARPA regionali, DPC, CheckWX, EUMETSAT, AIA, floods.it.
```

---

## Note Operative

- `timezone=Europe/Rome` sempre per l'Italia (mai `auto`).
- Isole: usa sempre ECMWF come backbone.
- Montagna >1500m: imposta `elevation`.
- **Badge Confidence**: Assegna il colore in base alla fonte: 🟢 REALE (fetch sessione corrente), 🟡 PARZIALE (cache/parziale), 🔴 STIMA (conoscenza interna). Obbligatorio su ogni sezione ## e ###. Default: 🔴 STIMA.
- **Rate limits, retry e fallback**: I rate limit e retry automatici (es. CheckWX, DMI, Open-Meteo, floods.it) sono gestiti direttamente a livello di server MCP.

## Fallback Strategy

Se Open-Meteo API restituisce errore 5xx o timeout >10s:
1. Prova l'archivio storico o i portali di fallback in `meteo_reference_guidelines` (portals).
2. Se non disponibili, dichiara *"dati NWP non disponibili"*, produci solo sezioni E (allerte), D (ARPA) e stima qualitativa basata su `meteo_climatology` (o ERA5).
3. **MANDATORIO**: NON produrre numeri specifici di temperatura o precipitazioni senza fonte reale.

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
