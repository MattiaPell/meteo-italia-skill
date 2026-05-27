---
name: meteo-italia
description: >
  Analisi meteo multi-modello Italia. Previsioni, confronto ECMWF/ICON/GFS, fenomeni locali (foehn, bora, scirocco), allerte PC, qualità aria, nowcasting temporali. Trigger: qualsiasi domanda meteo su città/regione italiana.
---

# Weather Forecast Analysis — Italia

## Trigger Keywords
"meteo", "previsioni", "pioggia", "neve", "allerta", "vento", "bora", "scirocco", "foehn", "temporale", "grandine", "mare", "montagna", "ghiaccio", "nebbia", "acqua alta", "modelli meteo".

---

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
| Response Mode | **Lite** (query semplici) o **Pro** (analisi/use case) |
| Use case | Generico (vedi sezione Use Case per specializzazioni) |

Identifica subito: **macroarea** (→ set modelli) + **regione amministrativa** (→ ARPA + allerte PC).

### 2. Geocoding

```http
GET https://geocoding-api.open-meteo.com/v1/search
  ?name={CITTA}&count=10&language=it&format=json
```

**Logica di validazione obbligatoria:**
1.  **Filtro Italia**: Scorri `results` e seleziona il primo con `country_code == "IT"`. Se `results[0]` non è "IT", scarta e passa ai successivi.
2.  **Fallback Estero**: Se nessun risultato ha `country_code == "IT"`, chiedi conferma all'utente:
    *"Non ho trovato {CITTA} in Italia. Intendevi {risultato_più_vicino} ({regione})?"*
3.  **Disambiguazione**: Se trovi >3 risultati con `country_code == "IT"`, mostra una scelta all'utente prima di procedere:
    *"{CITTA} ({admin1}) o {CITTA} ({admin2})?"*

Annota lat, lon, quota (`elevation`) del risultato scelto — serve per neve e mountain bias.

### 3. Fetch sequenziale prioritizzato

L'esecuzione del workflow segue una sequenza prioritizzata suddivisa in 3 Tier. L'agente deve completare il **TIER 1** prima di procedere al **TIER 2**.

**Regola di gestione del contesto:** Se il contesto supera 80k token dopo il TIER 1, esegui solo gli step TIER 2 con condizione TRUE. Salta completamente il TIER 3.

| Tier | Step | Nome | Condizione | Riferimento |
|---|---|---|---|---|
| **TIER 1** | A | Previsioni numeriche (Open-Meteo) | Sempre | references/models.md, references/italy_zones.md |
| | B | Climatologia ERA5 | Sempre (10y baseline) | references/climatology.md |
| | E | Allerta Protezione Civile | Sempre | references/arpa_network.md |
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

#### A — Previsioni numeriche (Open-Meteo)
Vedi `references/models.md` per il set corretto per macroarea.

```http
GET https://api.open-meteo.com/v1/forecast
  ?latitude={LAT}&longitude={LON}
  &models={MODEL1,MODEL2,...}
  &hourly=temperature_2m,apparent_temperature,dewpoint_2m,precipitation,
          precipitation_probability,snowfall,wind_speed_10m,wind_direction_10m,
          wind_gusts_10m,cloud_cover,cloud_cover_low,cloud_cover_mid,
          cloud_cover_high,visibility,weather_code,
          relative_humidity_2m,freezing_level_height,boundary_layer_height,
          pressure_msl,uv_index,snow_depth,cape,lifted_index,
          convective_inhibition,soil_temperature_0cm,soil_temperature_6cm,
          soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,
          temperature_925hPa,wind_speed_925hPa,wind_direction_925hPa,
          relative_humidity_925hPa,temperature_850hPa,wind_speed_850hPa,
          wind_direction_850hPa,relative_humidity_850hPa,temperature_500hPa,
          wind_speed_500hPa,wind_direction_500hPa,relative_humidity_500hPa,
          {GRUPPO_ENERGY}, {GRUPPO_AGRO}, {GRUPPO_PRO}
  &daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,
         apparent_temperature_min,precipitation_sum,snowfall_sum,
         precipitation_probability_max,wind_speed_10m_max,
         wind_gusts_10m_max,weather_code,uv_index_max,
         et0_fao_evapotranspiration
  &timezone=Europe/Rome
  &past_days=7
  &forecast_days={N}
```

**Ottimizzazione parametri orari:**
- **Base**: `temperature_2m,apparent_temperature,dewpoint_2m,precipitation,precipitation_probability,snowfall,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,weather_code,relative_humidity_2m,freezing_level_height,boundary_layer_height,pressure_msl,uv_index,snow_depth,cape,lifted_index,convective_inhibition,soil_temperature_0cm,soil_moisture_0_to_1cm,soil_moisture_3_to_9cm,temperature_925hPa,wind_speed_925hPa,wind_direction_925hPa,relative_humidity_925hPa,temperature_850hPa,wind_speed_850hPa,wind_direction_850hPa,relative_humidity_850hPa,geopotential_height_850hPa,temperature_500hPa,wind_speed_500hPa,wind_direction_500hPa,relative_humidity_500hPa,geopotential_height_500hPa`
- **{GRUPPO_ENERGY}** (Solo se trigger Energia/Eolico/Solare): `wind_speed_80m,wind_direction_80m,wind_speed_120m,wind_direction_120m,shortwave_radiation,direct_radiation,diffuse_radiation,direct_normal_irradiance,terrestrial_radiation`
- **{GRUPPO_AGRO}** (Solo se trigger Agricoltura/Api): `soil_temperature_6cm,soil_temperature_18cm,soil_moisture_1_to_3cm,et0_fao_evapotranspiration`
- **{GRUPPO_PRO}** (Solo per analisi esperte/temporali/inversioni): `wet_bulb_temperature_2m,geopotential_height_1000hPa,geopotential_height_925hPa,geopotential_height_700hPa`

**Analisi storico recente (past_days=7):** Calcola precipitazioni cumulate 7gg, giorni consecutivi senza pioggia, anomalia T media e **Bilancio Idrico Nimbus** (Precipitazioni - ET0). Includi nel report se: pioggia prevista >20mm, allerta ≥gialla, ondata calore/freddo in corso, o use case Agricoltura/Api.

#### C — Storico recente (ultimi 7gg)
Analisi derivata dal parametro `past_days=7` nel fetch A.
Calcola precipitazioni cumulate 7gg, giorni consecutivi senza pioggia, anomalia T media e **Bilancio Idrico Nimbus** (Precipitazioni - ET0). Includi nel report se: pioggia prevista >20mm, allerta ≥gialla, ondata calore/freddo in corso, o use case Agricoltura/Api.
Vedi `references/uv_marine_recent.md` per soglie e interpretazione.

#### G — UV Index
Già incluso nel fetch A (`uv_index`, `uv_index_clear_sky`, `uv_index_max`).
Includi la sezione UV nel report se: `uv_index_max` >5, use case spiaggia/montagna, o richiesta esplicita.
Vedi scala UV e raccomandazioni in `references/uv_marine_recent.md`.

#### B — Climatologia ERA5
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

#### E — Allerta Protezione Civile
```http
GET https://mappe.protezionecivile.gov.it/geowebcache/service/wms
  (vedi references/arpa_network.md per parametri corretti)
```
Oppure consulta il bollettino testuale su `mappe.protezionecivile.gov.it`.
Estrai: livello allerta attivo per la regione, tipo (idrogeologico, temporali, neve, vento, ecc.).

#### TIER 2 (Condizionali ad alta priorità)

#### D — Osservazioni ARPA
Consulta `references/arpa_network.md` per endpoint e stazioni della regione target.
Recupera: T attuale, precipitazioni ultime 6/24h, vento, umidità dalla stazione più vicina.
Se disponibile, confronta con il forecast delle ore precedenti → stima bias locale del giorno.

#### F — Dati marini (solo se coordinata costiera o use case mare/nautica)
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

**Licenza obbligatoria**: citare sempre "Radar-DPC, Dipartimento di Protezione Civile (CC-BY-SA)"

#### K — METAR/TAF (condizionale)

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

**Fallback (aviationweather.gov — raw, no auth):**
```http
GET https://aviationweather.gov/api/data/metar?ids=LIRF,LIMC,LIPE&format=json
```

**Interpretazione — confronto forecast vs osservato:**
1. **Temperatura**: METAR T osservata vs NWP T prevista. Scarto >2°C → modello sovrastima/sottostima. Scarto >4°C → modello inaffidabile per questa zona/giornata
2. **Vento**: METAR vento osservato vs NWP previsto. Scarto velocità >10kt → modello sottostima il vento. Raffiche osservate >20kt ma non previste → attenzione per strutture temporanee
3. **Visibilità/Nebbia**: METAR visibilità <2000m ma NWP >5000m → nebbia non risolta dal modello. Critico per use case viabilità
4. **Copertura nuvolosa**: METAR OVC ma NWP weather_code ≤2 → modello sottostima nuvolosità
5. **Pressione**: METAR QNH (altimeter.hpa) vs NWP pressure_msl — verifica coerenza sinottica

**Gerarchia validazione:** TAF > NWP per orizzonte 0-6h su aeroporti. TAF è specifico per il punto, NWP è grigliato. Per zone senza aeroporto → usa stazioni ARPA (Step D).

**Nota:** CheckWX free tier: 3.000 req/giorno. Per uso intensivo, ruota su aviationweather.gov (formato raw, decodifica manuale).

Vedi `references/metar_taf.md` for lista completa ICAO, guida interpretazione campi decoded, e soglie di validazione.

#### L — Lightning Detection (Nowcasting Temporali)

**Attiva sempre per:** allerta PC ≥ gialla per temporali (Step E), CAPE >800 J/kg da Step A, use case mare/nautica/montagna/events outdoor. **Altrimenti:** attiva se `weather_code` attuale 80-99 (rovesci/temporali in atto).

**Fetch DMI Open Data (GeoJSON, no auth):**
```http
GET https://opendataapi.dmi.dk/data/observations/lightning
  ?limit=1000
  &bbox={BBOX}
```
Dove BBOX varia per macroarea (usa `references/italy_zones.md` per determinare quale):
- Nord Italia: `bbox=6.5,44.0,14.0,47.0`
- Centro Italia: `bbox=9.0,41.0,14.5,44.5`
- Sud Italia e Isole: `bbox=7.5,36.5,18.5,42.0`
- Italia intera: `bbox=6.5,36.5,18.5,47.0`

**Fetch comparativo per trend (opzionale):** seconda chiamata con `&observed_after={NOW-15MIN}` per valutare intensificazione/dissolvimento.

**Interpretazione:**
1. **Conta fulmini** nell'area entro 50km dal punto target. Soglie: >10 fulmini in 50km² = temporale attivo, >20 = temporale severo
2. **Verifica trend**: confronto con fetch 15 min precedente. +50% = intensificazione, -50% = dissolvimento
3. **Integrazione con Step A (CAPE/LI)**: CAPE >1500 + fulmini >10/15min → supercella probabile
4. **Integrazione con Step I (radar DPC)**: nuclei intensi (>45 dBZ) in Vision + fulmini → grandine probabile (>70%)
5. **Dry lightning**: fulmini >5/15min ma precipitazioni osservate <1mm → rischio incendi (segnala esplicitamente)

**Distanza e movimento:** calcola distanza dal punto target (Haversine). <5km = pericolo immediato. Confronta posizione fulmini t-15min vs t-30min per stimare direzione e velocità di movimento.

**Nota:** DMI API pubblica, nessuna autenticazione. Rate limit: ~60 req/min stimato. Precisione localizzazione ±1-5km.

Vedi `references/lightning.md` per guida nowcasting completa, densità fulmini, integrazione con radar, e alternative API.

#### M — Dati Idrologici (Bacino del Po e Grandi Fiumi)

**Attiva sempre per:** allerta PC ≥ gialla per rischio idrogeologico/idraulico (Step E), precipitazioni previste >30mm/24h da Step A, precipitazioni cumulate 7gg >100mm (dallo storico in C), use case agricoltura/cantieri/viabilità/nautica. **Altrimenti:** disattiva.

**Fetch real-time (floods.it e ARPAV — open data):**

1. **Trentino-Alto Adige (floods.it):**
```http
GET https://www.floods.it/api/v1/monitoring/index.json
# Se sensor_id trovato:
GET https://www.floods.it/api/v1/monitoring/{sensor_id}.json
```

2. **Veneto (ARPAV API):**
```http
GET https://api.arpa.veneto.it/rest/v1/meteo/stazioni/{ID_STAZIONE}/dati?parametro=livello_idrometrico&periodo=ultimo-giorno
```
*(Vedi references/arpa_network.md per ID stazioni: Verona 124, Vicenza 108, Bassano 105, ecc.)*

Filtra le stazioni entro 50km dal punto target. **Copertura API Real-time:** Trentino-Alto Adige e Veneto.

**Fallback Idrologico (Aree non coperte):**
Per le zone geografiche non coperte dai sensori real-time (fuori Trentino/Veneto), stima il rischio idraulico potenziale utilizzando i parametri di Step A e C:
- **Criticità Alta**: `soil_moisture_0_to_1cm` > 0.35 m³/m³ (suolo saturo) **E** precipitazioni cumulate 7gg > 100mm.
- **Aggravante**: Previsione pioggia > 30mm/24h.
Segnala come: "Rischio Idraulico stimato via Nimbus (dati locali non disponibili)".

**Fetch ARPAV (Regione Veneto — stazioni Adige, Brenta, Bacchiglione):**
```http
GET https://api.arpa.veneto.it/rest/v1/meteo/stazioni/{ID_STAZIONE}/dati?parametro=livello_idrometrico&periodo=ultimo-giorno
```
*ID Stazioni Veneto: Verona (124), Boara Pisani (142), Bassano (105), Vicenza (108), Ariano (132).*

**Interpretazione e Dati Manuali (Po, Arno, Tevere):**
Consulta `references/hydro_italia.md` per le soglie critiche di:
1.  **Fiume Po**: Stazioni di Piacenza, Cremona, Casalmaggiore, Boretto, Borgoforte, Pontelagoscuro.
2.  **Fiume Arno**: Firenze (Nave di Rovezzano, Uffizi) e Pisa.
3.  **Fiume Tevere**: Roma (Ripetta, Isola Tiberina).

**Logica di Analisi:**
1. **Livello attuale vs soglie**: confronta `value` con soglie Gialla/Arancione/Rossa (AIPO/CFR).
2. **Trend (ultime 3-6 ore)**: in salita/discesa/stabile.
3. **Combinato con Step A (precipitazioni)**: se previsti >30mm/24h E livello > soglia gialla → scenario peggiorativo (Rischio Idraulico Nimbus).
4. **Combinato con Step A (soil_moisture_0_to_1cm)**: se >0.35 m³/m³ → suolo saturo, deflusso superficiale rapido.
5. **Combinato con lo storico recente in C**: piogge cumulate 7gg >100mm → bacino già carico.

**Nota:** floods.it e ARPAV sono le principali API real-time strutturate integrate. Per gli altri bacini, integrare con osservazioni ARPA (Step D) e portali AIPO/CFR citati in references.

Vedi `references/hydro_italia.md` per endpoint completi, stazioni principali, soglie interpretative, e fonti regionali alternative.

#### N — Satellite Meteosat (Validazione Visiva)

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

### 🏔️ Montagna / Escursionismo / Sci
Trigger: "montagna", "escursione", "trekking", "sci", "alpinismo", "rifugio"
Focus: quota neve (`freezing_level_height`), visibilità, temporali pomeridiani (orario picco 14-17),
vento in quota (stima: +50% rispetto 10m ogni 1000m), temperature a quota target, rischio valanghe (neve fresca + vento).
**Mountain Intelligence**: Includi sempre il **Pericolo Valanghe (Scala AINEVA 1-5)** e la **Qualità della Neve** (Farinosa, Crostosa, Pesante, Marcia) se applicabile. (Vedi `references/mountain.md`).
Aggiungi: `elevation={quota_target}` nella chiamata API.
**UV obbligatorio**: in quota UV aumenta ~10% ogni 1000m — includi sempre sezione UV (Vedi `references/uv_marine_recent.md`, Step G).
**Valanghe**: Consulta sempre il bollettino ufficiale **AINEVA** (valanghe.aineva.it) in presenza di neve fresca >30cm o forte vento.
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

### 🏖️ Mare / Spiaggia / Nautica
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

### 📋 Execution Manifest (OBBLIGATORIO)
Da compilare SEMPRE prima di qualsiasi analisi. Se lo **Step A** è in stato "**🧠 Stima interna**", è obbligatorio inserire il banner di avviso in cima al report.

| Step | Nome | Stato | Fonte | Timestamp |
|---|---|---|---|---|
| A | Previsioni numeriche | ✅ / ⚠️ / ❌ / 🧠 | | |
| B | Climatologia ERA5 | | | |
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
## 📋 Execution Manifest [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{Tabella Manifest}

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
## 📋 Execution Manifest [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
{Tabella Manifest}

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
{Dettaglio allerta Protezione Civile ufficiale}

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

### 🌊 Rischio Idraulico — Po e Grandi Fiumi (Step M) [🟢 REALE | 🟡 PARZIALE | 🔴 STIMA]
Fiume: {NOME} a {LOCALITÀ} | Livello: {X}m
Soglie: {Gialla: X | Arancione: Y | Rossa: Z}
Stato: {🟢 Basso / 🟡 Medio / 🟠 Alto / 🔴 Estremo} (Rischio Idraulico Nimbus)
Trend 6h: {in salita / stabile / in discesa} ({±X}m)
{se livello > soglia gialla + pioggia prevista: ⚠️ scenario peggiorativo}
{se suolo saturo + pioggia >50mm: ⚠️ rischio piena lampo / esondazione}
{se fuori Trentino/Veneto: "Dati real-time via API limitati al Trentino e Veneto. Altri bacini: Analisi via soglie AIPO/CFR/PC."}

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
Allerte: Protezione Civile Italiana | Radar: DPC (CC-BY-SA)
Climatologia: ERA5 (media {N} anni) | Pollini: AIA
Idrologia: floods.it (Trentino/Veneto) | Satellite: EUMETSAT
```

---

## Note Operative

- `timezone=Europe/Rome` sempre per l'Italia (mai `auto`)
- Isole: usa sempre ECMWF come backbone — altri modelli hanno copertura ridotta
- Montagna >1500m: aggiungi `elevation={quota}` per dati corretti
- **Strategia Fallback**: Se Open-Meteo non è raggiungibile, aggrega dati da portali italiani (3bMeteo, iLMeteo, etc. — vedi `references/italian_portals.md`). In questo caso, **è obbligatorio inserire un alert esplicito** nel report per informare l'utente che sono state utilizzate fonti esterne non-API.
- ECMWF IFS a 9km è open-data completa dal 1 ottobre 2025
- Bias noti dei modelli → consulta sempre `references/model_bias.md` prima di interpretare outlier
- **Badge Confidence**: Assegna il colore in base alla fonte: 🟢 REALE (dati fetchati in questa sessione), 🟡 PARZIALE (dati parziali o da cache), 🔴 STIMA (generato dalla conoscenza interna del modello). Non omettere mai il badge confidence. Preferisci dichiarare 🔴 STIMA piuttosto che omettere la sezione.
