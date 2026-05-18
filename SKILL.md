---
name: meteo-italia
description: >
  Analisi comparativa delle previsioni meteo multi-modello specializzata per l'Italia.
  Usa questa skill ogni volta che l'utente chiede del tempo in Italia: previsioni,
  confronto modelli, affidabilità forecast, analisi di fenomeni locali italiani
  (foehn, bora, scirocco, tramontana, libeccio, maestrale, garbino, ponentino,
  grandine padana, neve appenninica, temporali adriatici, allerte Protezione Civile).
  Trigger per: "che tempo fa", "previsioni meteo", "piove domani", "neve", "grandine",
  "maestrale", "garbino", "ponentino",
  "caldo", "allerta meteo", "modelli meteo", "ECMWF vs ICON", "accordo modelli",
  "analisi meteo [città italiana]", "weekend meteo", "settimana meteo".
  NON aspettare che l'utente chieda esplicitamente "analisi multi-modello" — qualsiasi
  domanda sul tempo in Italia usa questa skill.
---

# Weather Forecast Analysis — Italia

Analisi comparativa multi-modello specializzata per il territorio italiano.
Integra: previsioni numeriche (Open-Meteo), osservazioni in tempo reale (reti ARPA regionali),
allerte ufficiali (Protezione Civile), climatologia di riferimento (ERA5) e bias noti dei modelli.

---

## Flusso di lavoro

### 1. Determina Parametri

| Parametro | Default se non specificato |
|---|---|
| Luogo | Chiedi se ambiguo |
| Periodo | Oggi (giornata corrente) |
| Variabili | Temperatura, precipitazioni, vento, temporali, weather code |
| Output | Report strutturato + widget visuale |
| Use case | Generico (vedi sezione Use Case per specializzazioni) |

Identifica subito: **macroarea** (→ set modelli) + **regione amministrativa** (→ ARPA + allerte PC).

### 2. Geocoding

```
GET https://geocoding-api.open-meteo.com/v1/search
  ?name={CITTA}&count=3&language=it&format=json
```
Usa `results[0]`. Per comuni omonimi verifica `admin1` (regione) e `country_code=IT`.
Annota lat, lon, quota (`elevation`) — serve per neve e mountain bias.

### 3. Fetch in parallelo (esegui tutto insieme)

Esegui simultaneamente i passi A–G:

#### A — Previsioni numeriche (Open-Meteo)
Vedi sezione **Modelli** per il set corretto per macroarea.
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={LAT}&longitude={LON}
  &models={MODEL1,MODEL2,...}
  &hourly=temperature_2m,precipitation,precipitation_probability,
          wind_speed_10m,wind_direction_10m,wind_gusts_10m,
          cloud_cover,weather_code,relative_humidity_2m,
          cape,lifted_index,freezing_level_height,
          uv_index,uv_index_clear_sky
  &daily=temperature_2m_max,temperature_2m_min,precipitation_sum,
         precipitation_probability_max,wind_speed_10m_max,
         wind_gusts_10m_max,weather_code,uv_index_max
  &timezone=Europe/Rome
  &forecast_days={N}
```

#### B — Climatologia di riferimento (ERA5)
Per confrontare il forecast con la norma storica del periodo.
```
GET https://archive-api.open-meteo.com/v1/archive
  ?latitude={LAT}&longitude={LON}
  &start_date={STESSO_GIORNO_-10_ANNI}&end_date={STESSO_GIORNO_-1_ANNO}
  &daily=temperature_2m_max,temperature_2m_min,precipitation_sum
  &timezone=Europe/Rome
```
Calcola media e σ su 10 anni → usala come baseline "nella norma / sopra / sotto".

#### C — Storico recente (ultimi 7 giorni)
Contestualizza il forecast con le condizioni degli ultimi 7 giorni.
```
GET https://historical-forecast-api.open-meteo.com/v1/forecast
  ?latitude={LAT}&longitude={LON}
  &start_date={OGGI-7}&end_date={OGGI-1}
  &daily=temperature_2m_max,temperature_2m_min,precipitation_sum,
         wind_speed_10m_max,weather_code
  &timezone=Europe/Rome
```
Calcola: precipitazioni cumulate 7gg, giorni consecutivi senza pioggia, anomalia T media.
Vedi soglie interpretative in `references/uv_marine_recent.md`.
Includi questa sezione nel report se: previsione pioggia >20mm, allerta ≥gialla, ondata calore/freddo in corso.

#### D — Osservazioni in tempo reale (ARPA regionale)
Consulta `references/arpa_network.md` per endpoint e stazioni della regione target.
Recupera: T attuale, precipitazioni ultime 6/24h, vento, umidità dalla stazione più vicina.
Se disponibile, confronta con il forecast delle ore precedenti → stima bias locale del giorno.

#### E — Allerta Protezione Civile
```
GET https://mappe.protezionecivile.gov.it/geowebcache/service/wms
  (vedi references/arpa_network.md per parametri corretti)
```
Oppure consulta il bollettino testuale su `mappe.protezionecivile.gov.it`.
Estrai: livello allerta attivo per la regione, tipo (idrogeologico, temporali, neve, vento, ecc.).

#### F — Dati marini (solo se coordinata costiera o use case mare/nautica)
Attiva se: coordinate a <20km dalla costa, oppure use case "mare/spiaggia/nautica".
```
GET https://marine-api.open-meteo.com/v1/marine
  ?latitude={LAT}&longitude={LON}
  &hourly=wave_height,wave_direction,wave_period,
          wind_wave_height,swell_wave_height,swell_wave_direction
  &daily=wave_height_max,wind_wave_height_max,swell_wave_height_max
  &timezone=Europe/Rome
  &forecast_days={N}
```
Vedi scala Beaufort e soglie operative in `references/uv_marine_recent.md`.

#### G — UV Index
Già incluso nel fetch A (`uv_index`, `uv_index_clear_sky`, `uv_index_max`).
Includi la sezione UV nel report se: `uv_index_max` >5, use case spiaggia/montagna, o richiesta esplicita.
Vedi scala UV e raccomandazioni in `references/uv_marine_recent.md`.

#### H — Qualità dell'Aria CAMS (condizionale)

**Attiva sempre per:** Pianura Padana (ott–mar), use case salute/bambini/anziani/sport, scirocco con dust elevato, inversione termica prevista (vento <5 km/h + cielo sereno).
**Attiva se AQI ≥ Moderato** per qualsiasi altra zona.

```http
GET https://air-quality-api.open-meteo.com/v1/air-quality
  ?latitude={LAT}&longitude={LON}
  &hourly=pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide,
          dust,ammonia,european_aqi,european_aqi_pm2_5,
          european_aqi_pm10,european_aqi_no2,european_aqi_o3,
          grass_pollen,olive_pollen,birch_pollen,ragweed_pollen
  &current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,dust
  &domains=cams_europe
  &timezone=Europe/Rome
  &forecast_days=5
```

Interpreta con `references/air_quality.md`: scala AQI EEA (0-20 buono → >100 pessimo),
scenari accumulo/dispersione da dati meteo, flag dust sahariano vs PM antropico,
pollini stagionali, zone critiche Italia, raccomandazioni per soggetti sensibili.

#### J — Ensemble Spread (condizionale)

**Attiva sempre per:** orizzonte >3 giorni, eventi potenzialmente significativi, allerta PC ≥ gialla, divergenza tra modelli deterministici (σ >2°C su T o >50% su precipitazioni).

```http
GET https://ensemble-api.open-meteo.com/v1/ensemble-mean
  ?latitude={LAT}&longitude={LON}
  &models=ecmwf_ifs025_ensemble_mean,icon_eu_eps_mean,gfs025_ensemble_mean
  &hourly=temperature_2m_mean,temperature_2m_spread,
          precipitation_mean,precipitation_spread,
          wind_gusts_10m_mean,wind_gusts_10m_spread,
          cape_mean,cape_spread,
          snowfall_mean,snowfall_spread,
          precipitation_probability_mean
  &daily=temperature_2m_max_mean,temperature_2m_max_spread,
         temperature_2m_min_mean,temperature_2m_min_spread,
         precipitation_sum_mean,precipitation_sum_spread,
         wind_speed_10m_max_mean,wind_speed_10m_max_spread
  &timezone=Europe/Rome
  &forecast_days=16
```

`spread` = σ tra i membri. p90-p10 ≈ spread × 2.56 (gaussiana, valido per T; non per precipitazioni).
Per probabilità specifiche (P(pioggia >20mm)) usa Ensemble API con tutti i membri raw.
Vedi soglie spread, gerarchia ensemble–deterministico e template in `references/ensemble_spread.md`.

#### I — Nowcasting Radar DPC (solo se condizioni attivanti)

**Attiva se almeno una di queste condizioni è vera:**
- Allerta PC ≥ gialla per temporali
- CAPE previsto >800 J/kg da modelli NWP
- `weather_code` corrente 80–99 (rovesci/temporali in atto)
- Utente chiede situazione nelle prossime 1-3h ("sta arrivando?", "tra quanto finisce?")

**Step 1 — Verifica rete:**
```http
GET https://radar-api.protezionecivile.it/findLastProductByType?type=SITES
```
Se radar vicino offline → nota "dato radar parziale" nel report.

**Step 2 — Ultimo timestamp disponibile:**
```http
GET https://radar-api.protezionecivile.it/findLastProductByType?type=VMI
```
Salva `time` (epoch ms UTC) come `T`.

**Step 3 — Scarica prodotti chiave:**
```http
POST https://radar-api.protezionecivile.it/downloadProduct
{"productType": "VMI", "productDate": T}

POST https://radar-api.protezionecivile.it/downloadProduct
{"productType": "SRI", "productDate": T}

POST https://radar-api.protezionecivile.it/downloadProduct
{"productType": "POH", "productDate": T}   ← probabilità grandine

POST https://radar-api.protezionecivile.it/downloadProduct
{"productType": "VIL", "productDate": T}   ← grandine intensa

POST https://radar-api.protezionecivile.it/downloadProduct
{"productType": "ETM", "productDate": T}   ← sviluppo verticale

POST https://radar-api.protezionecivile.it/downloadProduct
{"productType": "SRT1", "productDate": T}  ← cumulata ultima ora
```

**Step 4 — Sequenza per analisi movimento (ultimi 30 min):**
```http
POST /downloadProduct {"productType":"VMI","productDate": T-300000}    ← T-5min
POST /downloadProduct {"productType":"VMI","productDate": T-600000}    ← T-10min
POST /downloadProduct {"productType":"VMI","productDate": T-1800000}   ← T-30min
```
Usa i 4 frame (T, T-5, T-10, T-30) per stimare direzione e velocità del sistema.

**Interpretazione e estrapolazione:** vedi `references/nowcasting_radar.md` per:
- Scala dBZ → intensità precipitazioni
- VIL → probabilità grandine
- ETM → sviluppo verticale / severità
- Calcolo vettore movimento e stima arrivo su punto target
- Incertezza per orizzonte temporale

**Licenza obbligatoria**: citare sempre "Radar-DPC, Dipartimento di Protezione Civile (CC-BY-SA)"

### 4. Analisi Comparativa

#### 4a. Consensus modelli numerici
- Per ogni variabile e slot orario: media, min, max, σ tra i modelli
- **Outlier**: modelli che scostano >1.5σ → segnala e applica bias noto (vedi `references/model_bias.md`)
- **Scenari probabilistici**: "X/Y modelli prevedono precipitazioni >5mm"
- Usa pesi ponderati da `references/italy_zones.md`

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

#### 4c. Confronto con climatologia
Vedi `references/climatology.md` per valori di riferimento e classificazione anomalie.
- "T max prevista: 28°C | media storica 15 maggio: 22°C → **+6°C anomalia positiva**"
- "Precipitazioni attese: 25mm | media maggio: 65mm/mese → **evento sopra norma**"
- Usa σ climatologica per classificare: dentro norma (±1σ), anomalo (1-2σ), estremo (>2σ)

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

#### 4g. Integrazione nowcasting + NWP
Quando il nowcasting radar è attivo, usa questa gerarchia per orizzonte:
- **0-30 min**: usa esclusivamente radar (estrapolazione lineare)
- **30-90 min**: radar primario + NWP come contesto
- **90 min-6h**: NWP primario + radar per verifica situazione attuale
- **>6h**: solo NWP

Se radar e NWP divergono sullo scenario a 1-3h → segnala esplicitamente l'incertezza.

### 5. Output

| Richiesta | Formato |
|---|---|
| "analisi", "report", non specificato | Report strutturato + widget HTML/React |
| "grafico", "visualizza", "chart" | Widget con grafici comparativi modelli |
| "piove?", "nevica?", "fa caldo?" | Risposta sintetica con semaforo |
| "dati", "numeri", "JSON" | Tabella strutturata |
| "tutto" | Report + grafici + tabella + raccomandazione |
| Use case specifico | Vedi sezione Use Case |

---

## Use Case Specializzati

Riconosci automaticamente il contesto dall'input e adatta il report:

### 🏔️ Montagna / Escursionismo / Sci
Trigger: "montagna", "escursione", "trekking", "sci", "alpinismo", "rifugio"
Focus: quota neve (`freezing_level_height`), visibilità, temporali pomeridiani (orario picco 14-17),
vento in quota (stima: +50% rispetto 10m ogni 1000m), temperature a quota target, rischio valanghe (neve fresca + vento).
Aggiungi: `elevation={quota_target}` nella chiamata API.
**UV obbligatorio**: in quota UV aumenta ~10% ogni 1000m — includi sempre sezione UV.

### ⚽ Evento sportivo / All'aperto
Trigger: "partita", "evento", "concerto", "gara", "sagra", orario specifico citato
Focus: fascia oraria dell'evento (±2h), probabilità pioggia in quella finestra, vento (soglia 50 km/h per strutture), temperatura percepita.
**UV se evento diurno**: includi picco UV e orario.

### 🌾 Agricoltura / Campagna
Trigger: "raccolto", "vendemmia", "irrigazione", "gelo", "grandine", "campi", "agricoltura"
Focus: gelate (T <0°C, specie notturna), grandine (CAPE + LI), siccità (precipitazioni ultimi 30gg vs norma),
vento per irrorazione (>20 km/h = stop), umidità fogliare (UR >90% = rischio funghi).
**Storico recente obbligatorio**: precipitazioni 7gg e giorni senza pioggia sono critici per questo use case.

### 🏗️ Cantiere / Lavori all'aperto
Trigger: "cantiere", "lavori", "operai", "gru", "ponteggio"
Focus: vento >50 km/h (stop gru), pioggia cumulata (calcestruzzo), gelate notturne (ghiaccio su superfici), visibilità.
**UV se estate**: rischio colpo di calore per i lavoratori.

### 🚗 Viabilità / Trasporti
Trigger: "viaggio", "autostrada", "strada", "guida", "treno", "volo"
Focus: neve (quota e accumulo stimato), nebbia (visibilità <200m), acquaplaning (pioggia intensa), vento laterale (>70 km/h su ponti e tratti esposti).

### 🏖️ Mare / Spiaggia / Nautica
Trigger: "mare", "spiaggia", "barca", "vela", "nautica", "bagno"
Focus: stato del mare, vento (Beaufort), temporali costieri, UV index.
**Marine API obbligatoria**: attiva fetch F per dati onde completi (wave_height, swell, periodo).
**UV obbligatorio**: includi sempre per questo use case.
Vedi scala Beaufort e soglie in `references/uv_marine_recent.md`.

### 🌡️ Salute / Caldo estremo / Allergie
Trigger: "caldo", "afa", "anziani", "bambini", "salute", "allergie", "polline", "asma"
Focus: T percepita (heat index), notti tropicali (T >20°C), ondata di calore (T >35°C per 3+ giorni), UV index, qualità aria.
**UV obbligatorio**: includi picco, orario e raccomandazioni SPF.
**Qualità aria obbligatoria**: AQI + PM2.5 + O3 + pollini stagionali + raccomandazioni soggetti sensibili.
**Storico recente**: segnala se ondata calore già in corso da giorni.

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

```
## 🌤️ Analisi Meteo — {LUOGO} ({REGIONE}) — {DATA}

### 📡 Nowcasting Radar (0-6h) — {HH:MM} ora locale (se attivato)
Situazione attuale: {sistema in atto / in avvicinamento / assente}
VMI max: {X} dBZ → {intensità} | SRI: {X} mm/h | VIL: {X} kg/m²
Movimento: {DIR} a {X} km/h | Distanza da {LUOGO}: {D} km
+30min: {scenario} | +60min: {scenario} | +90min: {scenario}
{se grandine: ⚠️ POH: {X}% — Echo Top: {X} km}
Affidabilità: 0-30min Alta → 30-60min Media → >60min Bassa (usa NWP)
Fonte: Radar-DPC DPC (CC-BY-SA)

### 🚨 Allerta {COLORE} — {TIPO} (se attiva)
{Dettaglio allerta Protezione Civile ufficiale}

### Consensus Multi-Modello
Modelli: {N} | Macroarea: {ZONA} | Concordanza: Alta/Media/Bassa
{lista modelli con pesi}

### 📅 Ultimi 7 giorni (se rilevante)
Precipitazioni cumulate: {X}mm (norma: {Y}mm → {±Z}%)
Giorni senza pioggia: {N} consecutivi | T media anomalia: {±X}°C
Contesto: {frase — es. "suoli saturi" / "siccità in corso" / "nella norma"}

### 📊 vs Climatologia
T max: {X}°C | Media storica: {Y}°C | Anomalia: {±Z}°C ({dentro norma/anomalo/estremo})
Precipitazioni: {X}mm attesi | Media periodo: {Y}mm | {valutazione}

### 📡 Osservato (stazione {NOME_STAZIONE}, ore {HH})
T: {X}°C | Pioggia ultime 6h: {X}mm | Vento: {X} km/h da {DIR}
{confronto con forecast precedente: scarto modelli}

### Scenario del giorno
{2-3 righe narrative su come si sviluppa la giornata}

### Temperatura
Range: {min}–{max}°C | Consensus: {media}°C ±{σ}°C | Anomalia: {+/-X}°C vs norma

### Precipitazioni
{N}/{TOT} modelli prevedono pioggia | Quantitativi: {range mm} | P: {%}%
{se temporali: CAPE={X} J/kg, LI={Y}, scenario grandine}

### Vento
Sostenuto: {X} km/h da {DIR} | Raffiche: {max} km/h
{flag: FOEHN / BORA / TRAMONTANA / SCIROCCO / LIBECCIO / MAESTRALE / GARBINO / PONENTINO / GRECALE}

### ☀️ UV Index (se rilevante)
Picco: {X} ({Basso/Moderato/Alto/Molto alto/Estremo}) alle {HH}:00
Protezione: {raccomandazione SPF}

### 🌊 Condizioni Marine (se costiero o use case mare)
Onde: {X}m | Beaufort: {N} — {descrizione}
Balneazione: {Ok/Cautela/Sconsigliata} | Nautica: {Ok/Cautela/Sconsigliata}

### 📊 Ensemble Spread (se attivato)
T max: p10={A}°C | mediana={B}°C | p90={C}°C | spread={D}°C → {Bassa/Media/Alta/Molto alta}
Precipitazioni: mediana={X}mm | p90={Y}mm | P(>5mm)={P}% | P(>20mm)={Q}%
Vento raffica: mediana={X} km/h | p90={Y} km/h | P(>70km/h)={P}%
Concordanza ensemble–deterministico: {Alta/Media/Bassa}
Scenario p10 (ottimistico): {descrizione breve}
Scenario p90 (pessimistico): {descrizione breve}

### 💨 Qualità dell'Aria (se attivata)
AQI: {X} — {Buono/Discreto/Moderato/Scarso/Molto scarso/Pessimo} {EMOJI}
PM2.5: {X} µg/m³ | PM10: {X} µg/m³ | NO2: {X} µg/m³ | O3: {X} µg/m³
{se dust: Polvere sahariana: {X} µg/m³ ⚠️ evento naturale}
{se pollini: {Tipo} pollen: {livello}}
Condizioni: {accumulo/dispersione/neutro}
Soggetti sensibili: {raccomandazione}

### ⚠️ Fenomeni speciali
{solo se presenti — con spiegazione del meccanismo fisico}

### ⚠️ Incertezze
Tipo evento: {TIPO} | Affidabilità contestuale: {Alta/Media/Bassa}
{dove i modelli divergono e perché conta praticamente}

### Raccomandazione operativa
{frase diretta — scenario più probabile, cosa aspettarsi, cosa fare}

---
Fonte previsioni: Open-Meteo (CC BY 4.0) | Modelli: {lista}
Osservazioni: {ARPA regionale}
Allerte: Protezione Civile Italiana
Climatologia: ERA5 (media {N} anni)
```

---

## Note Operative

- `timezone=Europe/Rome` sempre per l'Italia (mai `auto`)
- Isole: usa sempre ECMWF come backbone — altri modelli hanno copertura ridotta
- Montagna >1500m: aggiungi `elevation={quota}` per dati corretti
- Se Open-Meteo non raggiungibile: aggrega da portali italiani (vedi `references/arpa_network.md`)
- ECMWF IFS a 9km è open-data completa dal 1 ottobre 2025
- Bias noti dei modelli → consulta sempre `references/model_bias.md` prima di interpretare outlier
