---
source: "Mixed"
last_verified: "2026-05-28"
confidence: "medium"
verification_needed:
  - "Endpoint API"
  - "Soglie operative"
  - "ID stazioni"
---

# Rete ARPA/ARPAS Italiana — Osservazioni in Tempo Reale

Mappa regione → ente ARPA → endpoint dati osservativi.

---

## Nord-Ovest

### ARPA Piemonte
- **URL dati:** https://www.arpa.piemonte.it/rischinaturali/tematismi/meteo
- **Stazioni:** rete RUPA (~400 stazioni)
- **Dati disponibili:** T, UR, precipitazioni, vento, pressione — aggiornamento orario
- **API/feed:** https://www.arpa.piemonte.it/opendata (CSV/JSON)
- **Bollettino:** https://www.arpa.piemonte.it/rischinaturali/tematismi/meteo/bollettini-e-avvisi
- **Province:** TO, CN, AT, AL, BI, NO, VCO, VC

### ARPA Valle d'Aosta
- **URL dati:** https://cf.regione.vda.it/stazioni_meteo.php
- **Stazioni:** rete regionale (~50 stazioni, focus montagna)
- **Dati disponibili:** T, neve, vento, precipitazioni
- **Quota stazioni:** 300–3500m — utile per previsioni alpine
- **Province:** AO

### ARPAL (ARPA Liguria)
- **URL dati:** https://www.arpal.liguria.it/homepage/meteo/stazioni-meteorologiche.html
- **Stazioni:** rete OMIRL
- **Dati disponibili:** T, pioggia, vento, mare (boe costiere)
- **API:** https://www.arpal.liguria.it/homepage/meteo/dati-stazioni.html
- **Allerte:** https://www.arpal.liguria.it/homepage/allerte.html
- **Province:** GE, SV, IM, SP

### ARPA Lombardia
- **URL dati:** https://www.arpalombardia.it/Pages/Meteorologia/Osservazioni-e-Misure/Dati-meteorologici.aspx
- **Stazioni:** rete RSIO (~200 stazioni)
- **Dati disponibili:** T, UR, precipitazioni, vento, neve, livelli idrometrici
- **API open data:** https://www.dati.lombardia.it (CKAN, dataset meteo)
- **Bollettino:** https://www.arpalombardia.it/Pages/Meteorologia/Previsioni/Previsioni-Meteo.aspx
- **Province:** MI, BG, BS, CO, CR, LC, LO, MN, MB, PV, SO, VA

---

## Nord-Est

### ARPAV (ARPA Veneto)
- **URL dati:** https://www.arpa.veneto.it/dati-ambientali/dati-in-tempo-reale/meteo
- **Stazioni:** rete telemisura (~200 stazioni)
- **Dati disponibili:** T, precipitazioni, vento, neve, portate idrometriche
- **API:** https://api.arpa.veneto.it (REST JSON) — documentata
- **Bollettino:** https://www.arpa.veneto.it/previsioni/it/html/meteo_veneto.php
- **Allerte:** https://www.arpa.veneto.it/previsioni/it/html/allertamento.php
- **Province:** VE, VR, VI, TV, PD, RO, BL

### ARPAV — stazione Rovigo (riferimento per Polesine)
- Stazioni disponibili: Rovigo città, Adria, Badia Polesine, Porto Viro
- Focus: nebbia padana, esondazioni Po/Adige, temporali adriatici

### ARPA FVG (Friuli-Venezia Giulia)
- **URL dati:** https://www.meteo.fvg.it/clima/osservazioni/
- **Stazioni:** rete OSMER (~100 stazioni)
- **Dati disponibili:** T, precipitazioni, vento (Bora!), umidità, neve
- **API:** https://www.meteo.fvg.it/api/ (JSON, documentata)
- **Bollettino Bora:** aggiornato ogni 3h durante eventi di Bora
- **Province:** TS, GO, UD, PN

### Meteotrentino (PAT — Provincia Autonoma Trento)
- **URL dati:** https://www.meteotrentino.it/tools/meteo/report-stazione/
- **Stazioni:** rete provinciale (~120 stazioni, 200–3000m)
- **Dati disponibili:** T, neve, vento, precipitazioni, altezza neve al suolo
- **API:** https://www.meteotrentino.it/opendata (JSON)
- **Bollettino neve/valanghe:** https://valanghe.aineva.it (AINEVA — ufficiale per valanghe)
- **Province:** TN

### APPA Bolzano (Alto Adige)
- **URL dati:** https://weather.provinz.bz.it/stations.asp
- **Stazioni:** rete provinciale (~150 stazioni)
- **Dati disponibili:** T, neve, vento, precipitazioni (bilingue IT/DE)
- **API:** https://weather.provinz.bz.it/api/
- **Province:** BZ

### ARPA Emilia-Romagna (ARPAE)
- **URL dati:** https://www.arpae.it/it/temi-ambientali/meteo/dati-osservativi/dati-storici
- **Stazioni:** rete Simnabo (~350 stazioni)
- **Dati disponibili:** T, precipitazioni, vento, umidità, livelli idrometrici
- **API Simnabo:** https://simnabo.arpae.it (autenticazione necessaria per dati storici)
- **Open data:** https://dati.arpae.it
- **Bollettino ufficiale:** https://www.arpae.it/it/temi-ambientali/meteo/previsioni-meteo/emilia-romagna
- **Province:** BO, FE, FC, MO, PR, PC, RA, RE, RN

---

## Centro

### ARPA Toscana (LAMMA Consortium)
- **URL dati:** https://www.lamma.toscana.it/meteo/osservazioni-meteo
- **Stazioni:** rete SIR (~350 stazioni)
- **Dati disponibili:** T, precipitazioni, vento, umidità
- **Bollettino:** https://www.lamma.toscana.it/meteo/previsioni
- **Province:** FI, AR, GR, LI, LU, MS, PI, PT, PO, SI

### ARPA Marche
- **URL dati:** https://www.arpa.marche.it/index.php/aggiornamenti-meteo
- **Stazioni:** rete regionale
- **Bollettino:** https://www.arpa.marche.it/index.php/previsioni-meteo
- **Province:** AN, AP, FM, MC, PU

### ARPA Umbria
- **URL dati:** https://www.arpa.umbria.it/monitoraggi/meteo
- **Province:** PG, TR

### ARPA Lazio
- **URL dati:** https://temporeale.regione.lazio.it/ (Centro Funzionale Regionale)
- **Bollettino:** https://www.meteoam.it (Aeronautica Militare — riferimento principale per Lazio)
- **Stazioni:** RM Collegio Romano (RM-172), Roma Ripetta (Idro)
- **Province:** RM, VT, RI, LT, FR

### ARPA Abruzzo
- **URL dati:** https://www.artaabruzzo.it/meteo.php
- **Province:** AQ, CH, PE, TE

---

## Sud

### ARPA Campania
- **URL dati:** http://centrofunzionale.regione.campania.it/ (Dati real-time)
- **Province:** NA, SA, AV, BN, CE

### ARPA Puglia
- **URL dati:** https://www.arpa.puglia.it/web/guest/sinamet
- **Stazioni:** rete SINAMET
- **Province:** BA, BAT, BR, FG, LE, TA

### ARPA Basilicata
- **URL dati:** https://www.arpab.it/meteo/
- **Province:** PZ, MT

### ARPA Calabria
- **URL dati:** https://www.arpacal.it/index.php/it/le-attivita/clima-e-meteo
- **Province:** CS, CZ, KR, RC, VV

### ARPA Molise
- **URL dati:** https://www.arpamolise.it/meteo/
- **Province:** CB, IS

---

## Isole

### ARPA Sicilia (SIAS)
- **URL dati:** https://www.sias.regione.sicilia.it/
- **Stazioni:** rete SIAS (~90 stazioni agrometeorologiche)
- **Dati disponibili:** T, UR, precipitazioni, vento, ETP
- **Province:** AG, CL, CT, EN, ME, PA, RG, SR, TP

### ARPAS Sardegna (SAR-MeteoSar)
- **URL dati:** https://www.arpas.sardegna.it/meteo/
- **Stazioni:** rete regionale + CFVA
- **Dati disponibili:** T, precipitazioni, vento, umidità
- **API:** https://sardegnameteo.it (portale integrato)
- **Province:** CA, CI, MD, NU, OG, OR, OT, SS, VS

---

## Autorità Nazionali e Montagna

### Aeronautica Militare (MeteoAM)
- **Ruolo:** Servizio Meteorologico Nazionale ufficiale dell'Italia. Riferimento per l'aviazione e la navigazione aerea.
- **URL:** https://www.meteoam.it
- **Dati:** Osservazioni (SYNOP/METAR), bollettini testuali, previsioni a breve/medio termine.
- **Riferimento:** Rete di stazioni aeronautiche storiche (Roma Fiumicino, Milano Linate, ecc.).

### AINEVA (Neve e Valanghe)
- **Ruolo:** Associazione delle Regioni e Province Autonome dell'arco alpino e appenninico per il coordinamento della prevenzione del rischio valanghe.
- **URL:** https://www.aineva.it
- **Bollettino Valanghe:** https://valanghe.aineva.it (Standard EAWS)
- **Dati:** Altezza neve, stabilità del manto nevoso, pericolo valanghe (scala 1-5).
- **Rilevanza:** Indispensabile per lo Use Case Montagna/Sci.

---

## Protezione Civile — Allerte

### Endpoint allerte ufficiali
```
# Mappa allerte in formato immagine (WMS)
https://mappe.protezionecivile.gov.it/geowebcache/service/wms
  ?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap
  &LAYERS=com.esri.esri-orange
  &BBOX={bbox}&WIDTH=800&HEIGHT=600
  &SRS=EPSG:4326&FORMAT=image/png

# Feed RSS bollettini
https://www.protezionecivile.gov.it/it/feed/allerte-meteo.rss

# Pagina bollettino testuale (scraping)
https://mappe.protezionecivile.gov.it/
```

### Livelli allerta e significato
| Colore | Livello | Significato operativo |
|--------|---------|----------------------|
| 🟢 Verde | Nessuna allerta | Condizioni nella norma |
| 🟡 Giallo | Ordinaria criticità | Fenomeni previsti, monitorare |
| 🟠 Arancione | Moderata criticità | Possibili danni, prepararsi |
| 🔴 Rosso | Elevata criticità | Pericolo grave, misure attive |

### Tipi di allerta
- **Idrogeologica**: rischio frane, esondazioni fiumi minori
- **Idraulica**: esondazione fiumi principali (Po, Arno, Tevere...)
- **Temporali**: celle temporalesche intense
- **Neve e ghiaccio**: accumuli e gelate
- **Vento forte**: raffiche >70 km/h
- **Mare mosso**: altezza onde >3m
- **Rischio incendi boschivi**: (estate)

---

## 📡 Automated Fetch & Bias Calculation

Per un'analisi di massima accuratezza, l'agente può tentare di recuperare i dati osservati real-time via API per calcolare il bias locale (Osservato vs Previsto).

### ARPAV (Veneto) — REST API
```http
# Ultimi dati orari di una stazione (es. Verona)
GET https://api.arpa.veneto.it/rest/v1/meteo/stazioni/{ID_STAZIONE}/dati?parametro={PARAM}&periodo=ultimo-giorno
```
*ID Comuni: Verona (135), Padova (113), Venezia-Marghera (123), Vicenza (140), Treviso (121), Belluno (104), Rovigo (118).*
*(Vedi references/hydro_italia.md per ID Idrometrici ARPAV: Verona 124, Vicenza 108, Bassano 105, ecc.)*
*Parametri: `temperatura`, `precipitazione`, `vento_media`, `umidita_relativa`, `livello_idrometrico`.*

### ARPA FVG (Friuli-Venezia Giulia) — JSON
```http
# Dati correnti di tutte le stazioni
GET https://www.meteo.fvg.it/api/v1/stazioni/misure/latest.json
```

### Meteotrentino (Trento) — JSON
```http
# Lista stazioni e dati correnti
GET https://www.meteotrentino.it/link/opendata/stazioni.json
```

### APPA Bolzano (Alto Adige) — REST
```http
# Dati correnti di una stazione (es. Bolzano ID 80)
GET https://weather.provinz.bz.it/api/v1/HttpService/getWeatherStationMeasuredData?stationId={ID}
```

### ARPA Lombardia — Socrata/CKAN
```http
# Query su portale Open Data (es. Temperatura stazioni ultime 24h)
GET https://www.dati.lombardia.it/resource/647i-s8de.json?id_sensore={ID_SENSORE}&$order=data%20desc&$limit=24
```
*ID Sensori Milano (Brera): T (642), UR (648), Pioggia (644), Vento (646).*
*ID Sensori Brescia (V. S. Rocchino): T (666), UR (672), Pioggia (668), Vento (670).*

### ⚠️ Logica di Calcolo Bias
1.  **Fetch**: Recupera `T_osservata` dell'ultima ora disponibile dalla stazione ARPA.
2.  **Match**: Prendi `T_prevista` dallo Step A (Open-Meteo) per la stessa ora e coordinata.
3.  **Bias**: `Delta = T_osservata - T_prevista`.
4.  **Correzione**: Se `Delta` > 1.5°C persistente, applica lo scostamento alla previsione per le prossime 6 ore.

---

## Strategia Fallback (se API non raggiungibile)

1. Portali aggregatori italiani: 3bMeteo, iLMeteo, Meteo.it, Meteoblue, Ventusky
2. Per ogni variabile confronta almeno 3 fonti → calcola consensus manuale
3. Per allerte: controlla sempre la pagina Protezione Civile
4. Per dati osservativi: cerca la stazione ARPA regionale più vicina

---

## Stazioni di Riferimento per Città Chiave

| Città | ARPA | Stazione principale | ICAO/WMO | Station ID (Regionale) |
|-------|------|---------------------|----------|------------------------|
| **Milano** | ARPA Lombardia | Milano Brera / Linate | LIML / 16080 | Brera: 642 (T) |
| **Lecco** | ARPA Lombardia | Lecco (V. Amendola) | — / — | 601 (T) |
| **Torino** | ARPA Piemonte | Torino Giardini Reali | — / — | 001272907 |
| **Venezia** | ARPAV | Venezia Tessera / Lido | LIPZ / 16105 | 123 (Marghera) |
| **Rovigo** | ARPAV | Rovigo città | — / 16116 | 118 (Meteo) / 132 (Idro) |
| **Verona** | ARPAV | Verona Villafranca | LIPX / 16090 | 135 (Meteo) / 124 (Idro) |
| **Bologna** | ARPAE | Bologna Savena | — / — | MeteoSystem (Urbana) |
| **Ancona** | ARPA Marche | Falconara / Ancona | LIPY / 16190 | — |
| **Perugia** | ARPA Umbria | Perugia S. Egidio | LIRZ / 16181 | — |
| **Firenze** | LAMMA | Firenze Uffizi | — / — | TOS01004679 (Idro) |
| **Roma** | MeteoAM/CFR | Roma Collegio Romano | — / — | RM-172 |
| **Napoli** | ARPA Campania | Napoli Capodichino | LIRN / 16289 | — |
| **Bari** | ARPA Puglia | Bari Palese | LIBD / 16270 | — |
| **Palermo** | SIAS | Punta Raisi | LICJ / 16405 | — |
| **Cagliari** | ARPAS | Cagliari Elmas | LIEE / 16560 | — |
| **Trieste** | ARPA FVG | Trieste Porto | — / 16110 | OSMER: Trieste |