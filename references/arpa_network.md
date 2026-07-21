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

### `meteo_reference_guidelines` (categoria: `aviation` o `portals`)

- **Scopo**: Metadati sulle reti regionali senza API aperta verificata (Piemonte, Toscana, Lazio, Campania, Emilia-Romagna...): portali di consultazione manuale.
