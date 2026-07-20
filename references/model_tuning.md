---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Calibrazione Modelli e Macroaree (Model Tuning)

Questo file di riferimento descrive l'utilizzo del tool MCP per la calibrazione dei modelli meteorologici, la pesatura dei consensus per macroarea geografica e l'applicazione delle correzioni per l'isola di calore urbana (UHI).

## Strumento MCP di Riferimento

Utilizza il tool MCP dedicato per ottenere pesi, bias sistematici e correzioni dinamiche:

### `meteo_model_tuning`

#### Parametri di Input:
- `macroarea` (string, obbligatorio): Macroarea geografica italiana (`nord_ovest`, `nord_est`, `centro_nord`, `centro`, `sud`, `sicilia`, `sardegna`, `costa_adriatica`, `alpi`, `appennino`).
- `cityName` (string, opzionale): Nome della città per applicare la correzione UHI (es. `Milano`, `Roma`, `Torino`, `Napoli`, `Bologna`, `Firenze`, `Bari`, `Palermo`).
- `cloudCover` (number, opzionale): Copertura nuvolosa in % per valutare le condizioni UHI.
- `windSpeedKmH` (number, opzionale): Velocità del vento in km/h per valutare le condizioni UHI.
- `modelId` (string, opzionale): ID di un modello specifico per filtrare i bias sistematici noti (es. `ecmwf_ifs`, `icon_d2`, `italia_meteo_arpae_icon_2i`, `gfs`).

#### Informazioni restituite:
1. **Pesi di Consensus per Macroarea**: Ponderazione ottimale dei modelli (es. priorità a `italia_meteo_arpae_icon_2i` e `icon_d2` nel Nord-Est).
2. **Bias Sistematici dei Modelli**: Errori sistematici noti (es. sovrastima della pioggia orografica in condizioni di sbarramento).
3. **Correzione Isola di Calore Urbana (UHI)**: Delta termici per le temperature minime notturne e massime diurne in condizioni di cielo sereno e vento calmo.
4. **Scenari di Pesatura Dinamica**: Regole di correzione dei pesi in base a scenari specifici (temporalesco, frontale, nebbioso, nevoso, vento forte).
