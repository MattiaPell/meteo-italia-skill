---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# METAR/TAF Osservazioni Aeroportuali

Questo file descrive i riferimenti per la consultazione e la decodifica dei bollettini meteorologici aeroportuali d'osservazione (METAR) e di previsione (TAF) per la validazione locale dei modelli.

## Strumenti MCP di Riferimento

Utilizza i seguenti tool per accedere ai dati aeronautici:

### `checkwx_metar_taf` o `aviationweather_metar`

- **Scopo**: Recupera i bollettini METAR/TAF correnti per gli aeroporti italiani e globali. Offre la decodifica automatica di visibilità, vento, temperatura, pressione e copertura nuvolosa.
- **Parametri**: `icao` dell'aeroporto target.

### `meteo_reference_guidelines` (categoria: `aviation`)

- **Scopo**: Fornisce l'elenco dei codici ICAO degli aeroporti italiani divisi per macroarea geografica (es. LIMC per Malpensa, LIRF per Fiumicino, LICC per Catania, ecc.) e le regole di validazione del forecast (es. scostamenti di temperatura >2°C o vento >10kt).
