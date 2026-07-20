---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Immagini Satellite Meteosat

Questo file descrive l'accesso e l'interpretazione visiva delle immagini del satellite geostazionario Meteosat (EUMETSAT) per la validazione spaziale a brevissimo termine della copertura nuvolosa.

## Strumenti MCP di Riferimento

Utilizza i seguenti tool per l'analisi satellitare:

### `eumetsat_satellite_info`

- **Scopo**: Recupera i metadati descrittivi, i timestamp e le informazioni sullo stato dei canali attivi della costellazione Meteosat MSG/MTG.

### `meteo_reference_guidelines` (categoria: `satellite`)

- **Scopo**: Fornisce le linee guida per la selezione dei canali spettrali pre-renderizzati disponibili su EUMETView:
  - **IR10.8**: Infrarosso termico, indispensabile per misurare la temperatura del top delle nubi, l'attività temporalesca (overshooting tops) e per l'uso notturno.
  - **VIS0.6**: Visibile, ad alta risoluzione diurna per localizzare banchi di nebbia, nubi basse o sollevamento di polveri.
  - **WV0.62**: Vapor d'acqua, utile per tracciare correnti a getto (jet streams), aree di secchezza in quota e dinamiche sinottiche.
- **Regole di Interpretazione**: Pattern grafici per identificare fronti, celle convettive isolate o nebbia da irraggiamento.
