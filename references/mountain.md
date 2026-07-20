---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Montagna, Neve e Agrometeorologia

Questo file descrive i riferimenti per la valutazione delle condizioni in alta quota, la stima della quota neve e l'indice di pericolo valanghe.

## Strumenti MCP di Riferimento

Usa i seguenti tool per monitorare l'ambiente montano e agrometeorologico:

### `meteo_bioclimatic_indices`

- **Scopo**: Calcola indici complessi per la montagna e l'agricoltura:
  - **Qualità della Neve**: Classificazione in Neve Farinosa (ottima), Crostosa, Pesante, Marcia o Ghiacciata in base a temperature, vento e umidità.
  - **Quota Neve Nimbus**: Calcola la quota effettiva della neve cumulata (Snow-Line) applicando i correttivi per l'intensità della precipitazione, l'orografia (valli alpine strette, omotermia) e l'umidità dell'aria a partire dallo Zero Termico (Freezing Level).
  - **Wind Chill**: Freddo percepito per effetto del vento ad alta quota.

### `meteo_reference_guidelines` (categoria: `mountain`)

- **Scopo**: Fornisce la scala ufficiale europea del pericolo valanghe (AINEVA / EAWS) da Grado 1 (Debole) a Grado 5 (Molto Forte) con i relativi fattori di stabilità e sollecitazione.
