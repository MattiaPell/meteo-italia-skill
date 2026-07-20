---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Nowcasting Radar DPC (Dipartimento Protezione Civile)

Questo file descrive i riferimenti per il monitoraggio radar in tempo reale e le regole di blending temporale tra i dati radar e i modelli numerici (NWP).

## Strumenti MCP di Riferimento

Utilizza i seguenti tool per il monitoraggio e l'estrapolazione radar:

### `dpc_radar_vmi`

- **Scopo**: Ottiene l'URL dell'immagine radar VMI (Vertical Maximum Intensity) più recente elaborata dal Dipartimento della Protezione Civile Italiana per l'identificazione immediata delle aree di precipitazione attiva.

### `meteo_reference_guidelines` (categoria: `nowcasting`)

- **Scopo**: Fornisce le tabelle interpretative e le regole di blending:
  - **Tabella Riflettività dBZ VMI**: Associa i valori di riflettività radar (dBZ) all'intensità qualitativa della pioggia (es. <20 dBZ pioviggine -> >55 dBZ temporale estremo con grandine).
  - **Matrice di Blending Radar-NWP**: Definisce il peso progressivo tra osservazione radar ed evoluzione dei modelli (es. 0-15 min: 100% Radar, 15-45 min: 80% Radar / 20% NWP, 45-90 min: 40/60 con correzione temporale di anticipo/ritardo, oltre 120 min: 100% NWP).
