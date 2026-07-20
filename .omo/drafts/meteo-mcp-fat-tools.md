---
slug: meteo-mcp-fat-tools
status: approved
intent: clear
review_required: false
pending-action: write .omo/plans/meteo-mcp-fat-tools.md
approach: >-
  Spostare la logica oggi prompt-side in SKILL.md dentro tool MCP "fat" (opzione B),
  dopo aver sistato i bug di compilazione bloccanti. Tool restituiscono dati gia
  strutturati/normalizzati (geocoding filtrato Italia, forecast a 3 livelli,
  METAR confrontato col NWP, fulmini conteggiati, ensemble spread calcolato,
  allerte PC parsate da HTML). SKILL.md si assottiglia a orchestrazione + report.
---

# Draft: meteo-mcp-fat-tools

## Components (topology ledger)
| id | outcome | status | evidence |
| --- | --- | --- | --- |
| prereq-fix | MCP compila (z.coerce, nomi modello, summarizeForecast) | active | mcp/src/*.ts:19,20,143,17; SKILL.md:166,283; mcp/src/summaries.ts:49-60 |
| geocode-fat | geocode ritorna solo IT + disambiguazione omonimi | active | mcp/src/open_meteo.ts:9-32; SKILL.md:108-125 |
| forecast-fat | forecast applica da solo Livelli 1-3 condizionali | active | mcp/src/open_meteo.ts:34-66; SKILL.md:154-192 |
| metar-fat | METAR/TAF restituisce scarto °C vs NWP, vento, VFR/IFR | active | mcp/src/italian_sources.ts:77-132; references/metar_taf.md |
| lightning-fat | DMI ritorna conteggio, densita, trend, distanza Haversine | active | mcp/src/italian_sources.ts:134-160; references/lightning.md |
| ensemble-fat | ensemble ritorna p10/mediana/p90, P(>20mm), gerarchia | active | mcp/src/open_meteo.ts:162-192; references/ensemble_spread.md |
| allerte-parse | pc_allerte_wms parsifica bollettino PC → livello colore per regione/zona | active | mcp/src/italian_sources.ts:7-43; web: mappe.protezionecivile.gov.it/it/mappe-rischi/bollettino-di-criticita/ |
| skill-trim | SKILL.md diventa orchestrazione, logica rimossa nei tool | active | SKILL.md:51-91,108-498 |

## Open assumptions (announced defaults)
| assumption | adopted default | rationale | reversible? |
| --- | --- | --- | --- |
| parsing allerte | fetch HTML bollettino + regex blocchi "ALLERTA <COLORE>: <Regione>: <zone>" | endpoint WMS odierno non e' quello corretto (doc ufficiale punta a radar-geowebcache); bollettino e' testo HTML | si |
| fallback allerte | su parse fallito → ritorna URL portale + errore esplicito (come oggi) | robustezza | si |
| scope tool "fat" | Livelli 1-3 + geocode IT + METAR/Lightning/Ensemble/Allerte parsati; NON radar-vision ne' satellite-vision ne' template report | vincolo fisico: vision LLM non spostabile | si |

## Findings (cited)
- `z.coerce` in italian_sources.ts:19,20,143 e open_meteo.ts:17 → Zod non ha `coerce` (e' `coerce`). `npm run build` (tsc) FALLISCE oggi. http.ts:153-159 sono gia' corretti.
- SKILL.md:166 usa `ecmwf_ifs04`, :283 usa `ecmwf_ifs025`, ma references/models.md:17 usa `ecmwf_ifs`. Nomi incoerenti → typo `ecmwf_ifs04` (valido Open-Meteo e' `ecmwf_ifs025`).
- summarizeForecast pickDaily/pickHourly (summaries.ts:49-60) accedono `arr?.[i]` dove arr puo' essere undefined → possibile "Cannot read properties of undefined".
- pc_allerte_wms odierno (italian_sources.ts:27) punta a `mappe.protezionecivile.gov.it/geowebcache/service/wms` che NON e' il servizio WMS corretto (doc Radar-DPC: `radar-geowebcache.protezionecivile.gov.it/service/wms`); il bollettino di criticita e' HTML su `/it/mappe-rischi/bollettino-di-criticita/`, formato "ORDINARIA CRITICITA' PER RISCHIO IDRAULICO / ALLERTA GIALLA: <Regione>: <zone>".
- Esiste repo ufficiale `pcm-dpc/DPC-Bollettini-Criticita-Idrogeologica-Idraulica` con dati strutturati (fallback futuro, non in scope).
- DMI lightning endpoint odierno (italian_sources.ts:151) usa `/v2/lightningdata/collections/observation/items` (OGC API-Features) — corretto; serve solo parsing downstream.
- CheckWX `/v2/{type}/{codes}/decoded` (italian_sources.ts:104) corretto; serve parsing downstream dei campi decoded.

## Decisions
1. Opzione B (MCP "fat"): tool incapsulano soglie/pesi/logica condizionale; SKILL.md si assottiglia. (utente ha scelto B)
2. Fix bug pre-requsiti dentro il piano (utente: "2 si").
3. Vero parsing allerte PC con fallback portale (utente: "3 si").
4. NON spostare su MCP: generazione report testuale, template, bias qualitativi, validazione vision radar/satellite.

## Scope IN
- Fix compilazione MCP (coerce, nomi modello, summarizeForecast guard).
- Tool fat: geocode (filtro IT + disambiguazione), forecast (Livelli 1-3), METAR/TAF (confronto NWP), DMI lightning (conteggio/trend/distanza), ensemble (p10/p90/gerarchia), allerte PC (parse HTML + fallback).
- SKILL.md: rimuovere logica spostata, trasformare step in "chiama tool X (parametri Y)".

## Scope OUT (Must NOT have)
- Nessun parsing vision (radar DPC / satellite EUMETSAT restano URL → LLM).
- Nessuna modifica a nimbus.md, references/ ARPA che gia' funzionano, add_frontmatter.py/fix_*.py.
- Nessuna nuova fonte API oltre quelle gia' in uso.
- Nessuna generazione report / template spostata su MCP.
- Nessun cambio licenza/packaging/README esempi.

## Open questions
- Nessuna (forche risolte: B / si bug / si parsing).

## Approval gate
status: approved
- Utente ha approvato il brief ("si") il <turn corrente>.
- pending-action completato: scrivere .omo/plans/meteo-mcp-fat-tools.md.
