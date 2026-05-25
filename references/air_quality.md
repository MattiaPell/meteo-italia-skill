# Qualità dell'Aria — CAMS via Open-Meteo

Previsioni qualità dell'aria gratuite via Open-Meteo Air Quality API,
basata su CAMS European (11km, ensemble 11 modelli incluso MINNI-ENEA Italia)
e CAMS Global (45km).
No API key, CC BY 4.0, fino a 5 giorni di forecast.

---

## Quando Attivare la Sezione Qualità dell'Aria

Attiva **sempre** per:
- Pianura Padana (ottobre–marzo) — zona più inquinata d'Europa
- Use case salute/anziani/bambini/sport all'aria aperta
- Inversione termica prevista (vento <5 km/h + cielo sereno + T min bassa)
- Episodio di scirocco con polvere sahariana (Dust elevato)
- Incendi in atto nella zona (PM10 da wildfire)

Attiva **se richiesto** o **AQI previsto ≥ Moderato**:
- Qualsiasi altra zona italiana

---

## API Call

```http
GET https://air-quality-api.open-meteo.com/v1/air-quality
  ?latitude={LAT}
  &longitude={LON}
  &hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,
          ozone,dust,ammonia,european_aqi,european_aqi_pm2_5,
          european_aqi_pm10,european_aqi_no2,european_aqi_o3,
          alder_pollen,birch_pollen,grass_pollen,
          mugwort_pollen,olive_pollen,ragweed_pollen
  &current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,dust
  &domains=cams_europe
  &timezone=Europe/Rome
  &forecast_days=5
```

**`domains` consigliati:**
- `cams_europe` — 11km, ensemble 11 modelli, priorità per l'Italia ★★★★★
- `cams_global` — 45km, coverage globale, usalo come fallback o per confronto

---

## Indice AQI Europeo (EEA) — Scala e Soglie

Open-Meteo restituisce direttamente `european_aqi` (0–500+):

| AQI | Livello | Colore | PM2.5 (µg/m³) | PM10 (µg/m³) | NO2 (µg/m³) | O3 (µg/m³) |
|-----|---------|--------|----------------|--------------|-------------|------------|
| 0–20 | Buono | 🟢 | 0–10 | 0–20 | 0–40 | 0–50 |
| 20–40 | Discreto | 🟡 | 10–20 | 20–40 | 40–90 | 50–100 |
| 40–60 | Moderato | 🟠 | 20–25 | 40–50 | 90–120 | 100–130 |
| 60–80 | Scarso | 🔴 | 25–50 | 50–100 | 120–230 | 130–240 |
| 80–100 | Molto scarso | 🟣 | 50–75 | 100–150 | 230–340 | 240–380 |
| >100 | Pessimo | ⚫ | >75 | >150 | >340 | >380 |

**PM**: media mobile 24h | **Gas**: valore orario

---

## Pollutants — Guida all'Interpretazione

### PM2.5 e PM10 (Particolato)
- **Principale problema Italia**: Pianura Padana in inverno (riscaldamento + inversione)
- **Sorgenti**: traffico, riscaldamento (biomassa/gasolio), industria, agricoltura (NH3 + PM)
- **Limite UE**: PM2.5 annuo 25 µg/m³ (OMS consiglia 5 µg/m³)
- **Flag Pianura Padana**: PM10 >50 µg/m³ → "blocco traffico attivo" probabile nei capoluoghi
- **PM10 da polvere sahariana**: segnala separatamente (vedi `dust`) — non è smog locale

### PM10 da Incendi (Wildfires)
Variabile: `pm10_wildfires` (Step G)
- **Descrizione**: quota di PM10 trasportata da fumi di incendi boschivi, spesso rilevabile anche a centinaia di km dall'origine.
- **Soglia di attenzione**: > 10 µg/m³ imputabili a fumo.
- **Impatto**: il fumo di incendio contiene composti organici complessi più irritanti del PM urbano standard.
- **Strategia Nimbus**: Se `pm10_wildfires` > 20% del `pm10` totale, flaggare come "Evento da fumo/incendio" per differenziarlo dal traffico.

### NO2 (Biossido di azoto)
- **Sorgente primaria**: traffico veicolare, in particolare diesel
- **Picchi**: ore di punta 07-09 e 17-19, lunedì peggiore
- **Critica**: Milano, Torino, Roma sistematicamente oltre i limiti OMS
- **Inversione termica**: NO2 si accumula sotto l'inversione → picchi mattutini

### O3 (Ozono troposferico)
- **Stagionalità**: problema estivo (aprile–settembre), picco nelle ore calde (12-17)
- **Formazione**: radiazione solare + NOx + VOC → più alto in aree suburbane che in centro
- **Contro-intuitivo**: spesso più alto in periferia che in centro città (dove NO lo consuma)
- **Soglia allerta**: 180 µg/m³ (1h) = allerta pubblica; 240 µg/m³ = soglia emergenza

### SO2 (Biossido di zolfo)
- **Sorgenti Italia**: centrali termoelettriche a carbone (in calo), raffinerie, vulcani (Etna!)
- **Flag Sicilia**: durante attività eruttiva Etna, SO2 può raggiungere livelli elevati
  → segnala sempre se `sulphur_dioxide` >200 µg/m³ in Sicilia/Calabria meridionale

### NH3 (Ammoniaca)
- **Sorgente principale**: zootecnia e fertilizzanti agricoli
- **Zone critiche**: Pianura Padana (Po Valley — tra le zone più critiche d'Europa)
- **Stagionalità**: picco in primavera (spandimento liquami) e autunno
- **Ruolo PM**: NH3 + acido nitrico → nitrato d'ammonio (PM2.5 secondario)

### Dust (Polvere desertica)
- **Origine**: Sahara (Algeria, Libia, Tunisia, Marocco)
- **Trasporto**: Scirocco → Sud Italia, Sicilia, Sardegna; casi estremi → tutta Italia
- **Impatto**: PM10 può raddoppiare in poche ore; cielo giallo/arancio; deposizione su auto
- **Segnale**: `dust` >50 µg/m³ + vento da S/SE → flag "Polvere sahariana"
- **Nota normativa**: il PM da polvere naturale può essere sottratto dal conteggio per le
  valutazioni di conformità ai limiti UE — menzionalo se PM10 alto + dust alto

### Pollini (solo Europa, stagione pollinica)
Disponibili via API: `alder_pollen`, `birch_pollen`, `grass_pollen`,
`mugwort_pollen`, `olive_pollen`, `ragweed_pollen`.

**Soglie AIA (Associazione Italiana Aerobiologia) — grani/m³:**
Queste soglie sono specifiche per il territorio italiano e più stringenti degli standard generici.

| Polline | Bassa | Media | Alta |
|---------|-------|-------|------|
| **Graminacee** (`grass`) | 0.6 – 9.9 | 10 – 29.9 | > 30 |
| **Betulle/Ontano** (`birch`/`alder`) | 0.6 – 15.9 | 16 – 49.9 | > 50 |
| **Olivo** (`olive`) | 0.6 – 4.9 | 5 – 24.9 | > 25 |
| **Ambrosia/Artemisia** (`ragweed`/`mugwort`) | 0.1 – 4.9 | 5 – 24.9 | > 25 |
| **Parietaria** (Urticaceae)* | 2.0 – 19.9 | 20 – 69.9 | > 70 |
| **Cipresso** (Cupressaceae)* | 4.0 – 29.9 | 30 – 89.9 | > 90 |

*\*Nota: Parietaria e Cipresso non sono ancora disponibili come variabili numeriche individuali nell'API Open-Meteo, ma sono fondamentali per il contesto italiano.*

**Calendario pollinico Italia (AIA):**
| Polline | Nord Italia | Centro-Sud |
|---------|-------------|------------|
| Ontano (`alder`) | gen–mar | dic–feb |
| Betulla (`birch`) | mar–apr | feb–mar |
| Graminacee (`grass`) | apr–giu | mar–mag |
| Olivo (`olive`) | mag–giu | apr–mag |
| Artemisia (`mugwort`) | lug–set | lug–ago |
| Ambrosia (`ragweed`) | ago–set | ago–set |

**Nota su Bagnatura Fogliare e Pollini**:
La bagnatura fogliare (Proxy: `relative_humidity_2m` > 90% o `precipitation` > 0) agisce come un limitatore naturale per la dispersione dei pollini.
- **Bagnatura attiva**: i pollini rimangono "ancorati" alle superfici umide, riducendo drasticamente la concentrazione atmosferica anche con vento moderato.
- **Washout**: la bagnatura fogliare persistente è spesso associata a pioviggine o alta UR che abbatte i pollini in sospensione (wet deposition).

---

## Connessione Meteo → Qualità dell'Aria

Questa è la parte più utile per l'integrazione con il forecast meteorologico:

### Altezza del Mixing Layer (Strato di Rimescolamento)
La variabile `boundary_layer_height` (Step 3A) indica lo spessore dell'atmosfera in cui gli inquinanti vengono rimescolati e diluiti.

| Boundary Layer Height | Rischio Accumulo | Scenario |
|---|---|---|
| **< 300 m** | **Estremo** | Inquinanti intrappolati vicino al suolo (tipico inversione notturna) |
| **300 – 500 m** | **Alto** | Ventilazione scarsa, ristagno PM10/NO2 |
| **500 – 1000 m** | **Moderato** | Condizioni di dispersione medie |
| **> 1000 m** | **Basso** | Ottima dispersione verticale (aria pulita) |

### Scenari di accumulo (aria stagnante)
**Condizioni trigger** (controlla dai dati NWP):
- `boundary_layer_height` < 300-500 m persistente
- Vento <5 km/h per >12h consecutive
- `cloud_cover` <20% (cielo sereno → irraggiamento notturno → inversione)
- T min < T max - 10°C (escursione termica elevata → inversione termica probabile)
- Anticiclone persistente (pressione >1020 hPa stabile)

→ Flag: **"Condizioni favorevoli all'accumulo di inquinanti"**
→ AQI previsto da CAMS: confronta con scenario attuale

### Scenari di dispersione (aria pulita)
- Vento >20 km/h
- Precipitazioni >5mm (washout PM)
- Massa d'aria atlantica in ingresso (tramontana, libeccio)

→ Flag: **"Episodio di pulizia atmosferica"** — AQI in miglioramento

### Scirocco + Dust
- Vento da S/SE + `dust` elevato → distingui sempre PM naturale da PM antropico
- In questi casi l'AQI può essere alto ma non per inquinamento locale

### Foehn e qualità dell'aria
- Foehn attivo → AQI eccellente in quota, ma possibile accumulo a valle nelle zone protette

---

## 🌫️ Protocollo Aria Bacino Padano (Misure Temporanee)

Nelle regioni del Bacino Padano (Lombardia, Piemonte, Veneto, Emilia-Romagna), vige un accordo per l'adozione di misure temporanee al superamento continuativo del limite di PM10.

| Livello Allerta | Trigger (PM10) | Misure Tipiche |
|---|---|---|
| **Livello 0 (Verde)** | < 50 µg/m³ | Nessuna restrizione temporanea |
| **Livello 1 (Arancio)** | **> 50 µg/m³** per **2gg** cons. | Blocchi traffico (Euro 4/5 diesel), stop riscaldamento legna, divieto abbruciamenti |
| **Livello 2 (Rosso)** | **> 75 µg/m³** per **2gg** cons. | Restrizioni estese a veicoli commerciali, stop riscaldamento legna (<4 stelle) |

**Verifica Operativa**: Se il forecast CAMS mostra PM10 persistentemente alto (Step G) E le condizioni meteo favoriscono l'accumulo (Step 3A), segnalare lo stato del protocollo.

---

## Zone Critiche Italia per Qualità dell'Aria

### 🔴 Pianura Padana (tutto l'anno, peggio in inverno)
Province soggette al Protocollo: Milano, Torino, Bergamo, Brescia, Cremona, Lodi, Mantova, Pavia, Alessandria, Venezia, Treviso, Vicenza, Padova, Rovigo, Ferrara, Bologna, Modena.

**In inverno**: PM2.5 tra i più alti d'Europa (oltre 50 µg/m³ nelle giornate peggiori).
**In estate**: O3 elevato (fotossidazione degli NOx da traffico).

### 🟠 Grandi città (traffico)
Roma, Napoli, Palermo, Catania: NO2 elevato nelle ore di punta.

### 🟡 Zone vulcaniche (SO2)
Sicilia (Etna, Vulcano), Campania (Campi Flegrei — monitorare H2S e SO2).

---

## Fonti Nazionali per Osservazioni in Tempo Reale

| Ente | URL | Dati |
|------|-----|------|
| **ISPRA** | ispra.it | Rete nazionale — report annuali |
| **SNPA** | snpambiente.it | Coordinamento ARPA nazionali |
| **ARPA Lombardia** | arpalombardia.it/aria | Dati orari stazioni fisse |
| **ARPA Piemonte** | arpa.piemonte.it/aria | Dati orari + indice IQA |
| **ARPAE** | arpae.it/aria | Emilia-Romagna |
| **ARPA Veneto** | arpa.veneto.it/aria | Veneto — include Rovigo |
| **ARPA Toscana/LAMMA** | arpat.toscana.it | |
| **ARPA Campania** | arpacampania.it | |
| **EEA AirBase** | discomap.eea.europa.eu | Tutti i dati europei aggregati |

---

## Template Sezione Qualità dell'Aria nel Report

```
### 💨 Qualità dell'Aria — {LUOGO} — {DATA}

**Indice AQI Europeo attuale**: {X} — {Buono/Discreto/Moderato/Scarso/Molto scarso/Pessimo} {EMOJI}
**Previsione picco giornaliero**: AQI {X} alle {HH}:00

**Inquinanti principali:**
| Pollutante | Valore | Limite 24h | Stato |
|---|---|---|---|
| PM2.5 | {X} µg/m³ | 15 µg/m³ (OMS) | {stato} |
| PM10 | {X} µg/m³ | 45 µg/m³ (OMS) | {stato} |
| NO2 | {X} µg/m³ | 25 µg/m³ (OMS) | {stato} |
| O3 | {X} µg/m³ | 100 µg/m³ (OMS) | {stato} |
{se dust elevato: | Polvere sahariana | {X} µg/m³ | — | ⚠️ Evento naturale |}
{se pollini elevati: | {Pollini} | {X} grani/m³ | — | {stato} |}

**Condizioni atmosferiche:**
{scenario dispersione/accumulo in base ai dati meteo}
{flag inversione termica / foehn / scirocco / aria atlantica}

**Raccomandazioni:**
- Popolazione generale: {raccomandazione}
- Soggetti sensibili (anziani, bambini, cardiopatici, asmatici): {raccomandazione}
- Sport intenso all'aperto: {ok / sconsigliato nelle ore {HH}-{HH}}
{se polline: - Allergici a {tipo}: {livello esposizione}}

Fonte: CAMS European Air Quality Forecast via Open-Meteo (CC BY 4.0)
Soglie Pollini: AIA (Associazione Italiana Aerobiologia)
Modelli: ensemble 11 modelli CAMS (incl. MINNI-ENEA Italia), risoluzione 11km
```

---

## Note Operative

- `domains=cams_europe` per l'Italia → sempre preferibile a `cams_global`
- I dati polline sono disponibili **solo in Europa** e **solo durante la stagione pollinica**
  → se fuori stagione l'API restituisce null/zero, non segnalarlo come errore
- CAMS ha risoluzione 11km → non cattura variazioni sub-chilometriche
  (es. traffico intenso su una singola strada, area industriale puntuale)
- Per osservazioni in tempo reale usa le reti ARPA regionali (vedi `arpa_network.md`)
- Il `dust` da polvere sahariana va **sempre distinto** dal PM antropico nel report
- Aggiornamento previsioni CAMS: D0 (0-24h) ore 05:50 UTC, D1-D3 entro le 11:00 UTC
