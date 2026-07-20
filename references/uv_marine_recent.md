---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Indice UV, Stato del Mare e Storico Recente

Questo file descrive i parametri marini, la scala di esposizione ai raggi ultravioletti (UV Index) e il calcolo degli indici fisici d'accumulo meteorologico degli ultimi 7 giorni.

## Strumenti MCP di Riferimento

Usa i seguenti tool per recuperare e analizzare le variabili marine e bioclimatiche:

### `open_meteo_marine`

- **Scopo**: Recupera le previsioni per il moto ondoso (Wave Height), lo swell (onda lunga), la direzione e il periodo dell'onda, nonché la temperatura superficiale del mare (SST) per i settori del bacino Mediterraneo.

### `meteo_bioclimatic_indices`

- **Scopo**: Calcola gli indici bioclimatici di comfort (es. Heat Index/Afa, Wind Chill, Temperatura a Bulbo Umido, Notti Tropicali, bilancio idrico a 7 giorni).

### `meteo_reference_guidelines` (categoria: `marine`)

- **Scopo**: Fornisce le tabelle di riferimento e le scale ufficiali per l'interpretazione:
  - **Scala Douglas**: Classificazione dello stato del mare (Wind Sea da Forza 0 a 9) e dello swell (bassa, media, alta).
  - **Scala Beaufort**: Forza del vento basata sugli effetti visivi sul mare e sulla terraferma.
  - **Tabella Comfort SST**: Rilevanza termica della temperatura dell'acqua per la balneazione (fredda <18°C -> ideale 22-24°C -> calda >25°C).
  - **Matrice Rischio Mareggiate (Traversia)**: Tabella dei settori costieri italiani esposti a venti perpendicolari alla costa (es. Libeccio su costa ligure di levante, Bora su costa romagnola/marchigiana) con relative soglie d'altezza d'onda critica.
