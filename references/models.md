---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Modelli Meteorologici Open-Meteo

Questo file descrive le specifiche tecniche e l'organizzazione dei modelli numerici di previsione del tempo (NWP) accessibili tramite Open-Meteo.

## Strumento MCP di Riferimento

Utilizza il seguente tool per ottenere linee guida e pesi sui modelli:

### `meteo_reference_guidelines` (categoria: `models`)

- **Scopo**: Fornisce la tabella dettagliata dei modelli meteo core europei, regionali, globali ed ensemble, tra cui:
  - **ECMWF IFS**: Risoluzione 9km, punto di riferimento globale.
  - **DWD ICON-D2**: Risoluzione 2km, eccellente per il breve termine e i temporali convettivi.
  - **ItaliaMeteo ARPAE ICON-2I**: Risoluzione 2.2km, modello regionale ottimizzato per la penisola italiana.
  - **Météo-France AROME / ARPEGE**: Modelli ad altissima risoluzione per aree alpine e di confine.
  - **NCEP GFS**: Modello globale di supporto.
- **Pesi di consensus**: Assegna pesi di affidabilità predefiniti a ciascun modello in base all'orizzonte temporale e allo scenario meteo.
