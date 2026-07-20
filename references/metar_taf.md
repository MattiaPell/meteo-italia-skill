---
source: "MCP-migrated"
last_verified: "2026-05-28"
confidence: "high"
verification_needed:
  - "Nessuna (i dati e le regole sono migrate nel server MCP)"
---

# METAR/TAF Aeroporti — Migrato su MCP

⚠️ **SPOSTATO SU MCP SERVER**:
Le informazioni di questo file sono state completamente migrate nel server MCP per ottimizzare la context window dell'agente.

- **Usa i tool MCP**:
  - `checkwx_metar_taf` (richiede API key) o `aviationweather_metar` (free fallback) per ottenere e decodificare i dati osservativi degli aeroporti.
  - `meteo_reference_guidelines` (categoria: `aviation`) per ottenere l'elenco dei codici ICAO degli aeroporti italiani suddivisi per area e le regole di validazione del forecast.
