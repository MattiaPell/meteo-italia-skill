---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Ensemble Spread e Incertezza Forecast

Questo file descrive come determinare l'incertezza e l'affidabilità delle previsioni a medio termine (3-16 giorni) utilizzando lo spread probabilistico dei modelli ensemble.

## Strumento MCP di Riferimento

Utilizza il tool dedicato per analizzare lo spread probabilistico:

### `open_meteo_ensemble`

- **Scopo**: Recupera i dati di ensemble (es. ECMWF ENS o GFS GEFS) contenenti percentili, deviazione standard (spread) e probabilità di superamento soglia per temperatura, vento, pioggia e neve.
- **Parametri**: Latitudine, longitudine, orizzonte temporale, modelli richiesti.
- **Linee Guida Interpretative**:
  - **Spread basso**: Elevata confidenza nella previsione (accordo tra i membri dell'ensemble).
  - **Spread alto**: Bassa confidenza, scenario meteorologico incerto o presenza di forte divergenza tra i modelli deterministici.
