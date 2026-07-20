---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Rete ARPA e Monitoraggio Regionale

Questo file descrive i riferimenti per la consultazione dei dati osservativi real-time provenienti dalle reti delle Agenzie Regionali per la Protezione dell'Ambiente (ARPA/ARPAS).

## Strumenti MCP di Riferimento

Utilizza i seguenti strumenti per accedere alle osservazioni regionali:

### `arpav_idro`

- **Scopo**: Interroga in tempo reale la rete idrometrica della regione Veneto (ARPAV) per monitorare i livelli dei principali fiumi (Adige, Brenta, Bacchiglione, Po).
- **Parametri**: `stationId` corrispondente alla stazione idro di interesse.

### `meteo_reference_guidelines` (categoria: `aviation` o `portals`)

- **Scopo**: Ottiene i metadati generali sulle reti regionali, inclusi endpoint secondari e codifiche per l'interazione con altre ARPA regionali (es. Piemonte, Toscana, Lazio, Campania, Emilia-Romagna).
