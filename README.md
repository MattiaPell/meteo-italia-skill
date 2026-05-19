# Meteo Italia Skill ⛅

Skill per **analisi comparativa multi-modello delle previsioni meteo** specializzata per il territorio italiano. Integra modelli numerici, osservazioni ARPA, allerte Protezione Civile e climatologia di riferimento.

Progettata principalmente per agenti AI (OpenClaw, Hermes...): l'agente carica `SKILL.md` come istruzioni operative per eseguire analisi meteo complete e strutturate.

## Installazione

```bash
npx skills install MattiaPell/meteo-italia-skill
```
oppure scarica la repository e importala manualmente.

## Configurazione

Alcune funzionalità avanzate richiedono chiavi API (facoltative ma consigliate):

- **METAR/TAF (CheckWX)**: Per la validazione con dati aeroportuali, imposta la chiave API in un file `.env` o come variabile d'ambiente:
  ```
  CHECKWX_API_KEY=tua_chiave_qui
  ```
  Puoi ottenerne una gratuita su [checkwxapi.com](https://www.checkwxapi.com/).

Tutte le altre API (Open-Meteo, DPC Radar, DMI Lightning, floods.it, EUMETSAT) sono ad accesso libero o non richiedono autenticazione per l'uso previsto in questa skill.

## Come funziona

L'agente AI segue il flusso definito in `SKILL.md`:

1. **Determina parametri** — luogo, periodo, variabili, use case
2. **Geocoding** — risoluzione città italiane via Open-Meteo Geocoding API
3. **Fetch parallelo** — previsioni multi-modello + qualità aria + allerte
4. **Analisi contestuale** — bias noti, fenomeni locali, spread ensemble, climatologia
5. **Report finale** — output strutturato con widget visuale

## Funzionalità

| Funzionalità | Descrizione |
|---|---|
| **Multi-modello** | Confronta simultaneamente fino a 10 modelli su Open-Meteo API |
| **Geocoding** | Ricerca città italiane con discriminazione omonimi via `admin1` (regione) |
| **Fenomeni locali** | Riconoscimento automatico di foehn, bora, scirocco, tramontana, libeccio, grandine padana, neve appenninica, temporali adriatici |
| **Allerte PC** | Integrazione allerte Protezione Civile per regione |
| **Qualità aria** | Dati CAMS via Open-Meteo AQ API |
| **Matrice affidabilità** | Affidabilità forecast per tipo di evento × orizzonte temporale |
| **Bias noti** | Calibrazione per macroarea italiana con bias documentati per modello e stagione |
| **METAR/TAF** | Validazione forecast con dati aeroportuali osservati (CheckWX API) |
| **Lightning Detection** | Nowcasting temporali con fulmini in tempo reale (DMI API) |
| **Dati Idrologici** | Monitoraggio fiumi e rischio alluvioni (floods.it + ISPRA + EFAS) |
| **Immagini Satellite** | Validazione visiva nowcasting con Meteosat (EUMETSAT) |

## Modelli Supportati

| Modello | Ente | Copertura | Risoluzione |
|---|---|---|---|
| ECMWF IFS | Centro Europeo | Globale | 9 km |
| ICON | DWD (Germania) | Globale + EU | 13 km / 7 km |
| GFS | NOAA (USA) | Globale | 13 km |
| GEFS | NOAA (USA) | Globale ensemble | 25 km |
| Arpège | Météo France | Globale + EU | 10 km / 5 km |
| AROME | Météo France | EU + Francia | 2.5 km |
| ICON-EU | DWD (Germania) | Europa | 7 km |
| MetOffice | UK Met Office | Globale | 10 km |
| GEM | Canada | Globale | 15 km |
| JMA | Giappone | Globale | 20 km |

## Riferimenti

La cartella `references/` contiene la knowledge base di supporto per l'agente:

| File | Contenuto |
|---|---|
| [models.md](references/models.md) | Modelli meteo Open-Meteo — coverage, risoluzione, update |
| [model_bias.md](references/model_bias.md) | Bias sistematici documentati per modello e stagione |
| [italy_zones.md](references/italy_zones.md) | Macroaree italiane → set modelli + pesi configurabili |
| [arpa_network.md](references/arpa_network.md) | Rete ARPA/ARPAS — endpoint osservativi regionali |
| [climatology.md](references/climatology.md) | Climatologia ERA5 1991-2020 — 32 città italiane, indici derivati, record storici |
| [ensemble_spread.md](references/ensemble_spread.md) | Spread ensemble — incertezza probabilistica |
| [event_reliability.md](references/event_reliability.md) | Affidabilità forecast per evento e orizzonte |
| [local_phenomena.md](references/local_phenomena.md) | Flag automatici per fenomeni italiani |
| [mountain.md](references/mountain.md) | Montagna, Neve e Valanghe (AINEVA) e Agro-meteo |
| [air_quality.md](references/air_quality.md) | Qualità dell'aria — CAMS + Open-Meteo AQ API |
| [italian_portals.md](references/italian_portals.md) | Portali meteo italiani di fallback |
| [nowcasting_radar.md](references/nowcasting_radar.md) | Nowcasting radar — precipitazioni in tempo reale |
| [uv_marine_recent.md](references/uv_marine_recent.md) | UV index e condizioni marine recenti |
| [metar_taf.md](references/metar_taf.md) | METAR/TAF aeroporti italiani — validazione forecast (CheckWX API) |
| [lightning.md](references/lightning.md) | Lightning detection — nowcasting temporali (DMI Open Data API) |
| [hydro_italia.md](references/hydro_italia.md) | Dati idrologici — fiumi e rischio alluvioni (floods.it + ISPRA + EFAS) |
| [satellite.md](references/satellite.md) | Immagini satellite Meteosat — validazione visiva (EUMETSAT) |

## Use Case

| Use Case | Focus |
|----------|-------|
| 🏔️ Montagna / Escursionismo / Sci | Quota neve, temporali pomeridiani, UV in quota, valanghe (AINEVA), fulmini in cresta |
| 🐝 Apicoltura / Impollinazione | Finestre di volo, secrezione nettarifero, gelate tardive |
| ⚽ Evento sportivo / All'aperto | Probabilità pioggia nella finestra, vento strutture, fulmini (sospensione) |
| 🌾 Agricoltura / Campagna | Gelate, grandine, bilancio idrico, umidità fogliare, allagamento campi |
| 🏗️ Cantiere / Lavori all'aperto | Vento gru, pioggia calcestruzzo, visibilità METAR, allagamento scavi |
| 🚗 Viabilità / Trasporti | Neve, nebbia, gelicidio, acquaplaning, vento laterale, allagamento strade |
| 🏖️ Mare / Spiaggia / Nautica | Douglas Scale, Beaufort, swell, UV, fulmini costa, satellite nuvolosità |
| 🌡️ Salute / Caldo estremo / Allergie | Heat Index, Notti Tropicali, AQI, pollini |
| ⚡ Energia — Eolico e Solare | Produzione stimata, cut-in/cut-out vento, irraggiamento, nuvolosità |
| 🏖️ Turismo — Beach/Ski Index | SST, UV, vento, neve fresca, snow depth, score 0-100 |

## Trigger

Domande meteo sull'Italia: previsioni, confronto modelli, affidabilità forecast, allerte, fenomeni locali. Qualsiasi città/regione italiana.

Esempi di domande che attivano la skill:

- _"Che tempo fa a Milano?"_
- _"Previsioni weekend in Toscana"_
- _"Confronta ECMWF e ICON per Roma"_
- _"Allerta meteo in Sicilia"_
- _"Neve sugli Appennini?"_
- _"Accordo modelli per il Nord-Est"_
- _"Produzione eolica prevista in Puglia"_
- _"Beach index per la Sardegna questo weekend"_
- _"Ski index per Cortina"_

## Licenza

MIT
