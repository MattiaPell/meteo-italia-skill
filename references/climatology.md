---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Climatologia ERA5

Questo file descrive l'accesso e l'utilizzo dei dati climatologici di riferimento (normali 1991-2020) per calcolare le anomalie di temperatura e precipitazione sul territorio italiano.

## Strumenti MCP di Riferimento

Usa i seguenti tool per l'analisi climatologica e bioclimatica:

### `meteo_climatology`

- **Scopo**: Interroga le medie storiche ERA5 (1991-2020) per oltre 100 città e stazioni di riferimento italiane.
- **Parametri di Input**:
  - `latitude`, `longitude` (opzionali): Identifica la stazione più vicina tramite calcolo della distanza (Haversine).
  - `cityName` (opzionale): Filtra per nome della città (es. "Milano", "Roma").
  - `region` (opzionale): Filtra per regione italiana.
  - `month` (opzionale): Restituisce i dati di un mese specifico (1-12) invece dell'intero anno.
- **Dati restituiti**: Temperatura media, massima e minima climatologica, precipitazioni medie cumulate e parametri di deviazione standard (sigma) per determinare l'eccezionalità di un'anomalia.

### `meteo_bioclimatic_indices`

- **Scopo**: Calcola gli indici agrometeorologici e bioclimatici (es. Heat Index, Wind Chill, Growing Degree Days GDD, bilancio idrico a 7gg) confrontandoli con le soglie storiche per contesti specifici (apicoltura, viticoltura, selvicoltura, ecc.).
