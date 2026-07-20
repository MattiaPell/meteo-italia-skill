---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Qualità dell'Aria

Questo file di riferimento descrive l'utilizzo dei tool MCP per il monitoraggio della qualità dell'aria e l'analisi dell'indice CAMS in tempo reale.

## Strumenti MCP di Riferimento

Utilizza i seguenti tool per recuperare dati, soglie e informazioni sulla qualità dell'aria:

### `open_meteo_air_quality`

- **Scopo**: Recupera le previsioni e le osservazioni in tempo reale dei principali inquinanti atmosferici forniti dal servizio CAMS (Copernicus Atmosphere Monitoring Service) tramite Open-Meteo.
- **Parametri**: Richiede latitudine e longitudine della località target.

### `meteo_reference_guidelines` (categoria: `air_quality`)

- **Scopo**: Fornisce le tabelle di riferimento e le scale ufficiali per l'interpretazione dei dati.
- **Dettagli restituiti**:
  - **Scala AQI Europea**: Classificazione da "Buono" a "Pessimo" basata sulle concentrazioni di PM2.5, PM10, NO2 e O3.
  - **Soglie Pollini AIA**: Concentrazioni di riferimento per l'allerta pollini (Graminacee, Betulle, Olivo, ecc.).
  - **Calendario Pollinico**: Periodi di fioritura principali per macroarea.
  - **Altezza dello Strato di Rimescolamento (Boundary Layer)**: Valutazione del potenziale di accumulo o dispersione degli inquinanti.
