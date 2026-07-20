# meteo-mcp-audit-optimize - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** Un server meteo più robusto che non si blocca mai su fonti esterne lente, nomi modello coerenti tra documentazione e codice, errori leggibili invece di silenzi, e una rete di test minima. Più una lista di miglioramenti futuri proposti (non ancora fatti).

**Why this approach:** Invece di riscrivere tutto, sistemiamo i 12 punti deboli già verificati (timeout mancanti, cartella debug inesistente, nomi modello divergenti, parsing METAR errato, zero test) uno per uno, convalidando ogni fix. Le nuove funzionalità restano solo proposte finché non le approvi.

**What it will NOT do:** Non tocca la cartella della knowledge base (già ridotta a segnaposto per scelta di design). Non cambia la filosofia del progetto. Non aggiunge nuove fonti dati. Non implementa le evolutive proposte in questa fase.

**Effort:** Medium
**Risk:** Low - fix mirati e test aggiunti; nessun cambio architetturale ampio
**Decisions I made for you:** (1) Scope limitato al server MCP, non alla KB. (2) Standard: timeout+retry su tutte le chiamate HTTP, validazione zod stretta, test minimi con vitest. (3) Le evolutive sono proposte, non eseguite. Veta pure se non concordi.

Your next move: approva questo piano, oppure chiedi di implementare anche le evolutive proposte. Il dettaglio di esecuzione è sotto.

---
> TL;DR (machine): Medium effort, Low risk — 12 finding fixes + vitest scaffold on MCP server; evolutive proposed only.

## Scope
### Must have
- Wrapper HTTP resiliente in `mcp/src/http.ts`: timeout 10s, AbortController, retry 2x con backoff esponenziale, gestione 429/Retry-After (D1).
- Fix `mcp/src/debug.ts:20` cartella `public/` inesistente: servire se esiste, altrimenti warning una volta sola (D6).
- Normalizzazione nomi modello via mappa canonica in `reference_tools.ts` + ingresso tool (D2).
- Estrazione `haversine` in `mcp/src/geo.ts` condiviso; rimuovere duplicato (D3).
- Fix `parseRawMetar` regex visibilità in `italian_sources.ts` (F4).
- `inferModels()` con whitelist modelli validi in `summaries.ts` (F6).
- Validazione zod su risposte esterne + `MeteoError` strutturato (D5, F7).
- zod `.min()/.max()` su parametri tool (F12).
- vitest + test mirati su logica pura: haversine, parseRawMetar, inferModels, weight lookup (D4, F9).
- Proposta documentata di evolutive (streaming, cache, alias normalization, observability) — fuori esecuzione (D7).

### Must NOT have (guardrails, anti-slop, scope boundaries)
- Non riscrivere `references/` (già placeholder MCP-first).
- Non cambiare filosofia MCP-first né SKILL.md.
- Non aggiungere fonti dati esterne non richieste.
- Non refactor completo di `reference_tools.ts` (solo split mirato per i fix).
- Non implementare le evolutive proposte in questa fase.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after + framework vitest (MCP server ha 0 test oggi; aggiungiamo rete minima post-fix).
- Evidence: .omo/evidence/meteo-mcp-audit-optimize/task-<N>.<ext>
- Comandi di verifica: `npm run build` (tsc zero errori) + `npm test` (vitest pass).

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.

**Wave 1** (infrastruttura resiliente, indipendente):
- T1 http.ts wrapper resiliente
- T2 geo.ts haversine condiviso + rimozione duplicato
- T3 zod bounds su parametri tool
- T4 MeteoError + validazione zod risposte (nuovo `errors.ts` + tocco `http.ts`)
- T5 vitest scaffold + test logica pura

**Wave 2** (fix specifici dipendenti da Wave 1):
- T6 debug.ts fix public/
- T7 reference_tools.ts normalizzazione nomi + mappa canonica
- T8 italian_sources.ts parseRawMetar fix
- T9 summaries.ts inferModels whitelist

**Wave 3** (verifica + proposte):
- T10 build + test green
- T11 proposta evolutive (documento, non codice)

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| T1 | - | T4, T7 | T2, T3, T5 |
| T2 | - | T8 (uses haversine) | T1, T3, T5 |
| T3 | - | - | T1, T2, T5 |
| T4 | T1 | - | T2, T3, T5 |
| T5 | - | T10 | T1, T2, T3, T4 |
| T6 | - | - | T1-T5 |
| T7 | T1 | - | T6, T8, T9 |
| T8 | T2 | - | T6, T7, T9 |
| T9 | - | - | T6, T7, T8 |
| T10 | T1-T9 | F1-F4 | - |
| T11 | - | - | T6-T10 |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

- [ ] 1. mcp/src/http.ts: Add resilient apiGet/apiPostJson wrapper
  What to do: implement timeout 10s via AbortController, retry 2x con backoff esponenziale (base 500ms), rispetto header 429/Retry-After, errore lanciato come MeteoError su esaurimento retry. Must NOT do: non cambiare la firma pubblica usata da index.ts senza aggiornare i call site; non usare `any`.
  Parallelization: Wave 1 | Blocked by: - | Blocks: T4, T7
  References: mcp/src/http.ts (apiGet/apiPostJson), mcp/src/index.ts (call site), SKILL.md §Contratti (timeout>10s fallback, DMI 429 retry)
  Acceptance criteria: `npm run build` pulito; test che con fetch mock (timeout) ritenta 2x poi throw MeteoError.
  QA scenarios: happy=chiamata 200 veloce; failure=fetch che resolve dopo 11s → timeout + retry + MeteoError. Evidence .omo/evidence/meteo-mcp-audit-optimize/task-1.http.ts
  Commit: Y | fix(mcp-http): resilient HTTP with timeout/retry/429

- [ ] 2. mcp/src/geo.ts: Extract shared haversine, remove duplicate
  What to do: creare geo.ts con `haversine(a,b)` pura e testabile; importarla in italian_sources.ts e ovunque sia duplicata; rimuovere la copia locale. Must NOT do: non alterare il calcolo numerico, solo spostamento.
  Parallelization: Wave 1 | Blocked by: - | Blocks: T8
  References: mcp/src/italian_sources.ts (haversine locale), grep haversine negli altri moduli
  Acceptance criteria: build pulito; grep `haversine` trova 1 definizione + import.
  QA scenarios: happy=haversine(Milano,Roma) ≈ 477km; failure=input null → throw. Evidence .omo/evidence/meteo-mcp-audit-optimize/task-2.geo.ts
  Commit: Y | refactor(mcp-geo): extract shared haversine

- [ ] 3. mcp tool params: Add zod .min()/.max() bounds
  What to do: su tutti gli schema zod dei tool in index.ts/reference_tools.ts aggiungere bounds: latitude [-90,90], longitude [-180,180], forecast_days [1,16], elevation, past_days, etc. Must NOT do: non cambiare nomi parametri né default.
  Parallelization: Wave 1 | Blocked by: - | Blocks: -
  References: mcp/src/index.ts (schema tool), mcp/src/reference_tools.ts
  Acceptance criteria: build pulito; test zod che latitude=91 rifiuta.
  QA scenarios: happy=latitude 45.4 ok; failure=latitude 200 → errore validazione. Evidence .omo/evidence/meteo-mcp-audit-optimize/task-3.zod-bounds
  Commit: Y | fix(mcp-tools): add zod bounds to params

- [ ] 4. mcp/src/errors.ts + http.ts: Structured MeteoError + zod response validation
  What to do: creare errors.ts con classe MeteoError (code, message, cause); validare risposte JSON esterne (Open-Meteo, DMI, floods) con zod prima dell'uso; su shape inattesa lanciare MeteoError leggibile. Must NOT do: non introdurre `any`; non cambiare formato output tool esistente se non per errori.
  Parallelization: Wave 1 | Blocked by: T1 | Blocks: -
  References: mcp/src/http.ts, mcp/src/open_meteo.ts, mcp/src/italian_sources.ts (parse risposte)
  Acceptance criteria: build pulito; test che risposta JSON con campo mancante → MeteoError con messaggio chiaro.
  QA scenarios: happy=risposta completa parsata; failure=risposta troncata → MeteoError. Evidence .omo/evidence/meteo-mcp-audit-optimize/task-4.errors
  Commit: Y | fix(mcp-errors): structured errors + zod response validation

- [ ] 5. vitest scaffold + pure-logic tests
  What to do: aggiungere vitest a mcp/package.json (devDep + script test), creare mcp/src/__tests__/ con test per haversine, parseRawMetar, inferModels, weight lookup. Must NOT do: non testare chiamate di rete reali; usare solo logica pura/mock.
  Parallelization: Wave 1 | Blocked by: - | Blocks: T10
  References: mcp/package.json, mcp/src/italian_sources.ts, mcp/src/summaries.ts, mcp/src/reference_tools.ts
  Acceptance criteria: `npm test` passa; almeno 1 test per funzione citata.
  QA scenarios: happy=test green; failure=test che fallisce se haversine torna NaN. Evidence .omo/evidence/meteo-mcp-audit-optimize/task-5.vitest
  Commit: Y | test(mcp): add vitest + pure-logic tests

- [ ] 6. mcp/src/debug.ts: Fix missing public/ directory
  What to do: cambiare riga 20 da `express.static("public")` a controllo: se `fs.existsSync(publicDir)` servire, altrimenti log warning una volta sola all'avvio (non per-request). Must NOT do: non creare cartella public/ fittizia; non rompere il debug server.
  Parallelization: Wave 2 | Blocked by: - | Blocks: -
  References: mcp/src/debug.ts:20, mcp/src/index.ts (avvio debug)
  Acceptance criteria: build pulito; avvio server senza warning ripetuti; se public/ assente, 1 warning.
  QA scenarios: happy=server parte; failure=public/ mancante → 1 warning, non crash. Evidence .omo/evidence/meteo-mcp-audit-optimize/task-6.debug
  Commit: Y | fix(mcp-debug): guard missing public/ dir

- [ ] 7. mcp/src/reference_tools.ts: Model name normalization + canonical map
  What to do: introdurre `MODEL_ALIASES` map (icon_eu↔icon-eu, icon_d2↔icon-d2, arpege↔meteo-france-arpege, arome↔meteo-france-arome, etc.); applicare normalization all'ingresso tool e nel lookup dei weight table. Must NOT do: non rimuovere weight table; non cambiare valori pesi.
  Parallelization: Wave 2 | Blocked by: T1 | Blocks: -
  References: mcp/src/reference_tools.ts (weight tables), SKILL.md (nomi modello), mcp/src/index.ts (tool input)
  Acceptance criteria: build pulito; test che lookup peso con id `icon_eu` trova il peso di `icon-eu`.
  QA scenarios: happy=agente passa `arome` → peso corretto; failure=id sconosciuto → fallback documentato. Evidence .omo/evidence/meteo-mcp-audit-optimize/task-7.model-alias
  Commit: Y | fix(mcp-refs): normalize model names via alias map

- [ ] 8. mcp/src/italian_sources.ts: Fix parseRawMetar visibility regex
  What to do: correggere la regex visibilità in parseRawMetar per catturare correttamente CAVOK e metri a 4 cifre; usare haversine da geo.ts se applicabile. Must NOT do: non cambiare formato output METAR; solo parsing.
  Parallelization: Wave 2 | Blocked by: T2 | Blocks: -
  References: mcp/src/italian_sources.ts (parseRawMetar), test METAR reali (es. LIRF, LIML)
  Acceptance criteria: build pulito; test che METAR con `6000` → visibility 6000m, `CAVOK` → visibilità illimitata.
  QA scenarios: happy=METAR LIRF parsato; failure=METAR con visibilità 4 cifre → valore corretto non undefined. Evidence .omo/evidence/meteo-mcp-audit-optimize/task-8.metar
  Commit: Y | fix(mcp-metar): correct visibility regex in parseRawMetar

- [ ] 9. mcp/src/summaries.ts: inferModels() with model whitelist
  What to do: sostituire lo split su `_` fragile con una whitelist `KNOWN_MODELS`; per id non noti, ritornare nome originale o fallback sicuro invece di inferenza errata. Must NOT do: non cambiare output riassunto se non per nomi modello.
  Parallelization: Wave 2 | Blocked by: - | Blocks: -
  References: mcp/src/summaries.ts (inferModels), Open-Meteo model list
  Acceptance criteria: build pulito; test che `metno_nve` e `ukmo_seam` non producono nomi tagliati.
  QA scenarios: happy=modello valido → nome corretto; failure=id con underscore multipli → non rotto. Evidence .omo/evidence/meteo-mcp-audit-optimize/task-9.infer
  Commit: Y | fix(mcp-summaries): whitelist-based inferModels

- [ ] 10. mcp: Build + test green gate
  What to do: eseguire `npm install`, `npm run build`, `npm test`; riparare eventuali rotture dai T1-T9. Must NOT do: non aggirare errori tsc con `as any`/`@ts-ignore`.
  Parallelization: Wave 3 | Blocked by: T1-T9 | Blocks: F1-F4
  References: mcp/package.json
  Acceptance criteria: `npm run build` exit 0; `npm test` tutti green.
  QA scenarios: happy=pipeline verde; failure=errore tsc → fix fino a green. Evidence .omo/evidence/meteo-mcp-audit-optimize/task-10.gate
  Commit: N | (solo verifica)

- [ ] 11. docs: Propose evolutive (document, not implement)
  What to do: scrivere `.omo/EVOLUTIVE.md` con 3-5 proposte concrete: (a) streaming tool per riassunti lunghi, (b) cache TTL su chiamate esterne, (c) observability/metrics su hit/miss, (d) risorse MCP statiche per tool solo-KB. Must NOT do: non implementare; solo proposta con effort/stima.
  Parallelization: Wave 3 | Blocked by: - | Blocks: -
  References: draft findings F11, D7
  Acceptance criteria: file esiste con ≥3 proposte, ciascuna con descrizione + stima effort.
  QA scenarios: n/a (documento). Evidence .omo/evidence/meteo-mcp-audit-optimize/task-11.evolutive
  Commit: Y | docs(mcp): propose evolutive

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit
- [ ] F2. Code quality review
- [ ] F3. Real manual QA
- [ ] F4. Scope fidelity

## Commit strategy
- Ogni todo marcato Commit: Y produce un commit atomico (Conventional Commits) sul branch corrente.
- Nessun commit forzato, nessun push senza richiesta esplicita.
- Task T10 (gate) non committato da solo; i fix nei T1-T9 sono già committati per-todo.

## Success criteria
- `npm run build` exit 0 (tsc zero errori) su mcp/.
- `npm test` (vitest) tutti i test passano.
- I 12 finding del draft sono risolti o documentati come out-of-scope.
- debug server avvia senza warning ripetuti se public/ assente.
- Nomi modello coerenti tra SKILL.md e lookup pesi (test T7 verde).
- Documento evolutive presente (T11).
- Dual review (F1-F4) approvato prima di dichiarare completo.
