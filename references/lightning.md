---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Rilevamento Fulmini (Lightning Detection)

Questo file descrive gli strumenti per il monitoraggio in tempo reale dei fulmini (lightning strikes) per l'analisi immediata dei fenomeni convettivi violenti (nowcasting).

## Strumenti MCP di Riferimento

Utilizza i seguenti tool per il tracciamento dei fulmini:

### `dmi_lightning`

- **Scopo**: Recupera gli strike di fulmini in tempo reale dall'API del Danish Meteorological Institute (DMI) o da fallback gratuiti, raggruppati per ora e con distanza calcolata in km (nearestKm) rispetto alla coordinata target.
- **Parametri**: `latitude`, `longitude`, `hours` (orizzonte temporale recente).

### `meteo_reference_guidelines` (categoria: `lightning`)

- **Scopo**: Fornisce le soglie di densità dei fulmini, le scale di pericolo in base alla distanza e la gestione dei rischi ambientali (es. Dry Lightning / fulmini secchi in zone ad alto rischio incendi boschivi).
