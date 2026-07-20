---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Affidabilità Contestuale (Forecast Reliability)

Questo file descrive la consultazione della matrice di accuratezza previsionale in base al tipo di evento meteorologico e alla distanza temporale.

## Strumento MCP di Riferimento

Utilizza il tool dedicato per recuperare la matrice di accuratezza:

### `meteo_event_reliability`

- **Scopo**: Fornisce la matrice di affidabilità dei forecast suddivisa per tipologia di fenomeno e orizzonte temporale.
- **Parametri**: Nessuno (restituisce la tabella statica validata).
- **Classificazione degli Eventi**:
  - **Precipitazioni frontali / Neve**: Alta affidabilità nel breve termine (0-48h), calo graduale.
  - **Temporali convettivi**: Affidabilità medio-bassa anche a 24h, richiede tassativamente nowcasting (radar + fulmini) per precisione locale.
  - **Ondate di calore / Freddo**: Elevata predicibilità anche a medio termine (fino a 5-7 giorni).
  - **Nebbia**: Bassa predicibilità a medio termine, fortemente influenzata dalla microscala.
