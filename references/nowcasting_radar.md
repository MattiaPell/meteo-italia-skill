---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Nowcasting Radar DPC (Dipartimento Protezione Civile)

Questo file descrive i riferimenti per il monitoraggio radar in tempo reale e le regole di blending temporale tra i dati radar e i modelli numerici (NWP).

## Strumenti MCP di Riferimento

Utilizza i seguenti tool per il monitoraggio e l'estrapolazione radar:

### `dpc_radar`

- **Scopo**: Ottiene l'ultimo prodotto della piattaforma Radar-DPC e, con `download=true`, la pre-signed URL del GeoTIFF (valida ~5 minuti). Prodotti: VMI (riflettività max, 5min), SRI (mm/h al suolo), SRT1/CUM3-24 (cumulate), IR_108, TEMP, VIL/ETM/POH, CAPPI_1..10, SITES. REST API ufficiale: https://dpc-radar.readthedocs.io/it/latest/api.html
- **Nota 2026-07**: sostituisce `dpc_radar_vmi`. La risposta di `findLastProductByType` è `{total, lastProducts:[{time, period}]}` dopo l'aggiornamento piattaforma del 12-01-2026; header/parametro `origin` documentato come obbligatorio.

### `meteo_reference_guidelines` (categoria: `nowcasting`)

- **Scopo**: Fornisce le tabelle interpretative e le regole di blending:
  - **Tabella Riflettività dBZ VMI**: Associa i valori di riflettività radar (dBZ) all'intensità qualitativa della pioggia (es. <20 dBZ pioviggine -> >55 dBZ temporale estremo con grandine).
  - **Matrice di Blending Radar-NWP**: Definisce il peso progressivo tra osservazione radar ed evoluzione dei modelli (es. 0-15 min: 100% Radar, 15-45 min: 80% Radar / 20% NWP, 45-90 min: 40/60 con correzione temporale di anticipo/ritardo, oltre 120 min: 100% NWP).
