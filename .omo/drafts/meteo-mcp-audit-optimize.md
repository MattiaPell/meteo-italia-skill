---
slug: meteo-mcp-audit-optimize
status: drafting
intent: unclear
pending-action: write .omo/plans/meteo-mcp-audit-optimize.md
approach: Audit completo del server MCP (13 tool) + knowledge base, raccolta finding verificati, poi piano di ottimizzazione/resilienza + evolutive. Nessuna implementazione in questo stage — output è un work plan eseguibile da worker separato.
---

# Draft: meteo-mcp-audit-optimize

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->

| id | outcome (one line) | status | evidence path |
|---|---|---|---|
| mcp-server | 13 tool registrati, build pulita, stdio + debug express | active | mcp/src/index.ts |
| http-layer | apiGet/apiPostJson senza timeout/retry/AbortController | active | mcp/src/http.ts |
| reference-tools | 1184 righe, 6 tool + dataset, nomi modello divergenti da SKILL.md | active | mcp/src/reference_tools.ts |
| italian-sources | duplicazione haversine + parseRawMetar regex visibilità errata | active | mcp/src/italian_sources.ts |
| summaries | inferModels() euristico fragile su id con underscore | active | mcp/src/summaries.ts |
| debug-server | express.static("public") su cartella inesistente | active | mcp/src/debug.ts:20 |
| build | npm run build pulito, dist/index.js prodotto | active | mcp/package.json |
| tests | ZERO test, nessuno script test, nessun vitest | active | mcp/package.json |

## Open assumptions (announced defaults)
<!-- Intent is UNCLEAR: research resolves ambiguity, defaults are adopted (not asked), and each is surfaced in the plan's human TL;DR for veto. -->
<!-- assumption | adopted default | rationale | reversible? -->

| assumption | adopted default | rationale | reversible? |
|---|---|---|---|
| Scope dell'audit | Solo server MCP + knowledge base; NON tocco la cartella `references/` (già ridotta a placeholder per filosofia MCP-first) | L'utente ha chiesto "verificare il progetto, ottimizzare la parte MCP, proporre evolutive" | sì |
| Standard di qualità | Adotto best-practice MCP: timeout + retry su tutte le chiamate HTTP esterne, validazione zod stretta, test minimi | SKILL.md dichiara contratti (timeout>10s fallback, DMI 429 retry) non rispettati dal codice | sì |
| Resilienza | Tutte le chiamate esterne diventano resilienti (timeout/AbortController/retry con backoff) | Fonti meteo sono inaffidabili; l'MCP serve agenti in produzione | sì |
| Strategia test | Aggiungo vitest + alcuni test mirati su logica pura (haversine, parseRawMetar, inferModels, weight lookup) | Attualmente 0 test; serve una rete di sicurezza minima | sì |
| Evolutive | Proporre 3-5 evolutive concrete (streaming tool, cache, model alias normalization, structured errori, observability) ma NON implementarle qui | Intent unclear → piano, non esecuzione | sì |

## Findings (cited - path:lines)

1. **No timeout/retry/AbortController su chiamate HTTP** — `mcp/src/http.ts` `apiGet`/`apiPostJson`. SKILL.md §"Contratti" promette "timeout >10s → fallback". Non implementato. Rischio: hang dell'agente su fonti lente (DMI, floods.it).
2. **`mcp/src/debug.ts:20`** `express.static("public")` — cartella `mcp/public/` NON esiste. Express emette warning a ogni avvio; il debug server parte ma serve 404 su asset statici. Build ok, ma è un bug silente.
3. **Nomi modello divergenti** — `reference_tools.ts` weight tables usano `"icon-eu"`, `"icon-d2"`, `"meteo-france-arpege"`, `"meteo-france-arome"` mentre SKILL.md / Open-Meteo usano `"icon_eu"`, `"icon_d2"`, `"arpege"`, `"arome"`. Se un agente passa id SKILL.md-compliant, il lookup dei pesi fallisce (ritorna default/undefined).
4. **`parseRawMetar` regex visibilità errata** — `italian_sources.ts`. Il pattern per la visibilità CAVOK/meters non cattura correttamente i valori in metri a 4 cifre; parsing produce `undefined` o valori sbagliati su METAR reali.
5. **Duplicazione haversine** — `italian_sources.ts` definisce haversine localmente; `reference_tools.ts` (o altro modulo) ha una copia. Due implementazioni da mantenere in sync.
6. **`inferModels()` euristico fragile** — `summaries.ts`. Splitta l'id su `_`; per modelli con underscore multipli (es. `metno_nve`, `ukmo_seam`) inferisce nomi sbagliati. Nessun whitelist dei modelli validi.
7. **Shape errori non validata** — risposte JSON esterne (Open-Meteo, DMI, floods) parsate senza zod. Campi mancanti → `undefined` che propaga silenziosamente nei riassunti.
8. **Resilienza DMI 429** — SKILL.md promette "DMI 429 → retry". `http.ts` non ha retry; un 429 uccide la chiamata lightning.
9. **Nessun test** — `mcp/package.json` non ha `test` script, nessun vitest. 1184 righe di logica meteo non coperte.
10. **Cohesion** — `reference_tools.ts` mescola knowledge base (weight tables, bias) + tool MCP + dataset parsing. File troppo grosso (1184 righe); viola single-responsibility.
11. **Tool statici** — alcuni tool non dipendono da input dinamico (es. "macroarea bias", "event reliability matrix") ma sono implementati come tool MCP che riflettono solo la KB. Potrebbero essere precomputati o esposti come risorse statiche MCP.
12. **zod bounds** — gli schema zod dei parametri tool non hanno `.min()/.max()` sui numeri (es. `latitude`, `forecast_days`), accettando valori fuori range geografico/forecast.

## Decisions (with rationale)

- **D1**: Centralizzare HTTP in `http.ts` con wrapper resiliente (timeout 10s, AbortController, retry 2x con backoff esponenziale, rispetto 429/Retry-After). Razionale: SKILL.md già promette questi contratti; li onoriamo una volta sola nel punto unico.
- **D2**: Normalizzare i nomi modello tramite una mappa canonica (`icon_eu` ↔ `icon-eu`, etc.) applicata all'ingresso dei tool e nel lookup pesi. Razionale: evita divergence tra SKILL.md e codice.
- **D3**: Estrarre `haversine` in `mcp/src/geo.ts` condiviso. Razionale: elimina duplicazione (finding 5).
- **D4**: Aggiungere `vitest` + test su logica pura (haversine, parseRawMetar, inferModels con whitelist, weight lookup). Razionale: 0 test oggi (finding 9); minima rete di sicurezza.
- **D5**: Validare risposte esterne con zod (finding 7) e introdurre `MeteoError` strutturato per errori utente-visible (finding silente).
- **D6**: Fix `debug.ts` per servire `public/` se esiste, altrimenti warning una volta sola (non warning per-request). Razionale: bug silente (finding 2).
- **D7**: Le evolutive (streaming, cache, alias normalization, observability) sono PROPOSTE nel piano ma fuori scope di esecuzione immediata — il worker le implementa solo se l'utente approva il batch evolutivo. Razionale: intent unclear, non assume features non richieste.

## Scope IN

- Audit + fixing dei 12 finding nel server MCP (http, debug, italian_sources, summaries, reference_tools).
- Aggiunta test minimi (vitest) su logica pura.
- Normalizzazione nomi modello + mappa canonica.
- Validazione zod su risposte esterne + errori strutturati.
- Proposta documentata di evolutive (non implementate in questo stage).

## Scope OUT (Must NOT have)

- Riscrivere la cartella `references/` (già placeholder per filosofia MCP-first).
- Cambiare la filosofia MCP-first o la struttura SKILL.md.
- Aggiungere nuove fonti dati esterne non richieste.
- Refactor architetturale completo di `reference_tools.ts` (solo split mirato se necessario per i fix).
- Implementare le evolutive proposte (restano proposte fino ad approvazione esplicita).

## Open questions

- L'utente vuole che le evolutive siano implementate nel stesso batch o separate? (Default: separate, proposte solo nel piano.)
- Il debug server `public/` deve essere creato (con una semplice pagina di ispezione) o solo reso silente? (Default: silente + warning una volta.)

## Approval gate
status: awaiting-approval
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->
