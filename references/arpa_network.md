---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Rete ARPA e Monitoraggio Regionale

Questo file descrive i riferimenti per la consultazione dei dati osservativi real-time provenienti dalle reti delle Agenzie Regionali per la Protezione dell'Ambiente (ARPA/ARPAS).

## Strumenti MCP di Riferimento

Utilizza i seguenti strumenti per accedere alle osservazioni regionali:

### Copertura API verificata (2026-07)

| Regione | Tool | Fonte |
|---|---|---|
| Veneto | `arpav_bollettino`, `arpav_idro` | ARPAV REST + XML open data (CC BY 4.0) |
| Trentino | `meteotrentino_osservazioni` | dati.meteotrentino.it service.asmx (CC BY) |
| Emilia-Romagna | `arpae_bollettino` | apps.arpae.it REST Eve (dati.arpae.it) |
| Friuli-Venezia Giulia | `arpafvg_previsioni`, `arpafvg_stazione` | OSMER dev.meteo.fvg.it (XML) |
| Marche | `arpa_marche_stazioni`, `arpa_marche_stazione`, `arpa_marche_grandezze` | AMAP apimeteo.regione.marche.it (JSON, CC BY) |
| Lombardia | `arpa_lombardia_stazioni`, `arpa_lombardia_osservazioni` | dati.lombardia.it Socrata (CC BY 4.0) |
| Piemonte | `arpa_piemonte_stazioni` | utility.arpa.piemonte.it Django REST (CC BY) |
| Altre regioni | — (dichiarare `nonCoperto`) | Fallback: METAR + radar DPC + portali |

### `arpav_bollettino`

- **Scopo**: Previsione del Centro Meteorologico ARPAV per le 15 zone del Veneto (stato del cielo, precipitazioni, temperature in quota, attendibilità).
- **Parametri**: `zona` (match parziale), `giorno` (0=oggi).

### `arpav_idro`

- **Scopo**: Livelli idrometrici rete Veneto (103 stazioni, ultime 48h, trend 6h).
- **Parametri**: `provincia`, `nome`, `latitude`+`longitude`, `limit`.

### `meteotrentino_osservazioni`

- **Scopo**: Dati recenti stazioni meteo P.A. Trento (tmin/tmax, pioggia, ultima temperatura) dalla stazione più vicina o per codice.
- **Parametri**: `codice` (es. T0383) oppure `latitude`+`longitude`.

### `arpae_bollettino`

- **Scopo**: Bollettino meteorologico ARPAE Emilia-Romagna con previsioni fino a 4 giorni (regionale, tabellare, provinciale per BO/FE/FC/MO/PC/PR/RA/RE/RN).
- **Parametri**: `giorno` (oggi/domani/dopodomani/quartogiorno), `provincia` (sigla).

### `arpafvg_previsioni`

- **Scopo**: Previsioni OSMER ARPA FVG con situazione generale, zone, probabilità precipitazioni/temporali, simboli mattina/pomeriggio/sera. Bilingue it/en/de/sl/fur. Aggiornato 2x/giorno.
- **Parametri**: `data` (YYYYMMDD), `lingua`.

### `arpafvg_stazione`

- **Scopo**: Ultime osservazioni stazione meteo FVG/OSMER (temperatura, vento, pioggia, umidità, neve). Cerca per codice o più vicina a lat/lon.
- **Parametri**: `codice` (es. G201, C551) oppure `latitude`+`longitude`.

### `arpa_marche_stazioni` / `arpa_marche_stazione` / `arpa_marche_grandezze`

- **Scopo**: Rete AMAP Agrometeo Marche: elenco stazioni con coordinate, dettaglio sensori, grandezze misurate.
- **Parametri**: `provincia`, `codice`.

### `arpa_lombardia_stazioni` / `arpa_lombardia_osservazioni`

- **Scopo**: Rete ARPA Lombardia: stazioni idro-nivo-meteo e osservazioni recenti via Socrata Open Data API.
- **Parametri**: `provincia`, `tipologia`, `minuti`, `limit`.

### `arpa_piemonte_stazioni`

- **Scopo**: Rete ARPA Piemonte: 336 stazioni meteorologiche con coordinate, comune, provincia.
- **Parametri**: `provincia` (TO, CN, NO, AL, AT, BI, VB, VC, VCO).

### `meteo_reference_guidelines` (categoria: `aviation` o `portals`)

- **Scopo**: Metadati sulle reti regionali senza API aperta verificata (Toscana, Lazio, Campania, Sicilia...): portali di consultazione manuale.
