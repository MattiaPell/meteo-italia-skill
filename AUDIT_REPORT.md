# AUDIT REPORT — meteo-italia-skill

Audit e miglioramento del repository (skill + MCP server). Lavoro eseguito a fasi,
con build + test verificati a ogni fase. Data: 2026-08-29.

---

## Sintesi per fase

### Fase 1 — Robustezza ed error handling

**Trovato**

| Punto | Esito verifica |
|---|---|
| Propagazione `MeteoError` nei tool handler | ✅ **Empiricamente sicuro**: l'SDK MCP 1.29.0 cattura i throw dei handler e li trasforma in risposta `isError: true` con il messaggio d'errore. Il processo stdio **non** crasha. Verificato con test di integrazione (`InMemoryTransport`) in `mcp/src/__tests__/error_propagation.test.ts` (4 test, inclusi throw generico, MeteoError e handler con `outputSchema`). |
| Bug E3 (`recordMetrics` unreachable per 4xx) | ✅ **Già risolto nel codice attuale**: `requestWithRetry` registra le metriche su ogni 4xx/5xx terminale prima di ritornare `ok:false` (`http.ts`, ramo `!retriable` e `attempt == HTTP_MAX_RETRIES`). Nota in `.omo/EVOLUTIVE.md` aggiornata + test di regressione aggiunto (`http.test.ts` › "registra metriche di errore su 4xx terminale"). |
| Gap E5/E6 (normalizzazione modelli) | ✅ **E5 risolto**: `summaries.ts` usa già `normalizeModelId` con matching del suffisso più lungo in `inferModels`. Coperto da 5 test dedicati (`summaries.test.ts`), incluso il caso limite `meteoswiss_icon_seamless` vs `icon_seamless` (falso match evitato), `icon-eu` → `icon_eu`, `gfs025_ensemble_mean` vs `gfs025`, `ecmwf_ifs` escluso da `KNOWN_MODELS`. |
| `runBrief` può lanciare | ⚠️ **Gap reale, corretto**: la firma dichiara `Promise<{ok, error, elapsedMs}>` ma un errore di geocoding/network (MeteoError) si propagava oltre la shape strutturata. Aggiunto try/catch mirato in `runBrief` che ritorna `{ok:false, error:"[CODE] ..."}`. I test dimostrano anche un requisito dei mock: `apiGet` reale è async, quindi i throw arrivano come promise rejected e `Promise.allSettled` li assorbe correttamente. |

**Decisione documentata**: niente try/catch a giro di *tutti* i tool handler —
la protezione del processo è già garantita dall'SDK (provato con test). Il wrapping
è stato aggiunto solo in `runBrief` per preservare il contratto strutturato del
tool più usato.

### Fase 2 — Copertura test

**Prima**: 55 test in 6 file. **Dopo**: **100 test in 10 file** (+45). Suite completa verde.

| File nuovo | Copertura |
|---|---|
| `brief.test.ts` (17 test) | `runBrief`/`runBriefCore` con `apiGet`, DPC (`fetchLatestBulletin`, `fetchRadarLatest`) e i 7 adapter ARPA mockati a livello modulo, fixture async-faithful (`Promise.reject`). Casi: (a) tutte le fonti ok → `fontiOk: 6`, consensus NWP, matching comune; (b) fonti in errore (NWP non-ok → `ok:false` + `errori`, bollettino DPC assente, METAR in timeout, radar+ARPA rifiutati) con `fontiOk` corretto; (c) calcolo divergenze (spread NWP >3°C, scarto METAR >2°C, visibilità <2000m, allerta vs precipitazione <5mm, spread ensemble >4°C) — tutte e 5 rilevate; (d) matching allerte comune → regione (con nota) → nazionale (con nota) → ARPA non coperta (Sicilia). **E2E MCP reale** (`InMemoryTransport` + `registerBrief`): 4 città — Cortina d'Ampezzo (montagna), Venezia (costiera), Milano (pianura padana), Palermo (Sicilia, ARPA non coperta). |
| `summaries.test.ts` (11 test) | `summarizeForecast` (estrazione per suffisso, fallback chiave senza suffisso, normalizzazione dash, CAPE da orario, score/flags con soglie reali) e `inferModels` (suffisso più lungo, normalizzazione, casi E5/E6). |
| `reference_tools.test.ts` (12 test) | Smoke dei 7 tool KB-only (climatology ×2, bioclimatic ×2 con caso schema-invalido, guidelines ×2, pollen, local_phenomena ×2 — NEBBIA_PADANA e BORA, model_tuning ×2 con enum invalido, event_reliability) chiamati attraverso un server MCP reale. |
| `error_propagation.test.ts` (4 test) | Fase 1. |
| `http.test.ts` (+1) | Regressione E3. |

Correzioni ai test emerse durante lo sviluppo (bug reali trovati grazie ai test):
- `summarizeForecast` ritornava `score`/`flags` a runtime ma il **tipo di ritorno non li dichiarava** → tipo aggiornato (build altrimenti falliva sui nuovi test).
- Il flag `pioggia_forte`/`vento_forte` usa la **media** dei modelli (soglie ≥10mm / ≥70kn): fixture iniziale corretta per rispettare la semantica reale.

### Fase 3 — Qualità del codice

1. **Split di `reference_tools.ts`** (1707 righe) in moduli coerenti:

   | Modulo | Righe | Contenuto |
   |---|---|---|
   | `models.ts` | 13 | `normalizeModelId` + `round1` (helper foglia, senza dipendenze circolari; importato da `summaries.ts` e dai moduli verifica) |
   | `climatology.ts` | 90 | `meteo_climatology` |
   | `bioclimatic_indices.ts` | 511 | `meteo_bioclimatic_indices` |
   | `reference_guidelines.ts` | 840 | `meteo_reference_guidelines` |
   | `pollen.ts` | 114 | `meteo_pollen` |
   | `local_phenomena.ts` | 278 | `meteo_local_phenomena` |
   | `model_tuning.ts` | 284 | `meteo_model_tuning` |
   | `event_reliability.ts` | 56 | `meteo_event_reliability` |
   | `verification.ts` | 134 | `meteo_verification` |
   | `year_compare.ts` | 144 | `meteo_year_compare` |
   | `reference_tools.ts` | 17 | barrel di compatibilità (re-export; `index.ts` invariato) |

   Il file più grande di logica di tool scende da 1707 a 840 righe (un solo tool,
   coeso: il catalogo linee guida). **Nessuna breaking change**: stessi 38 tool,
   stessi nomi/schemi (verificato con smoke test del binario: 38 tool registrati).

2. **Tipizzazione `climatology_data.ts`** (8842 righe): aggiunte interfacce
   `ClimatologyMonth` e `ClimatologyStation`, sostituito `Record<string, any[]>`
   con `Record<string, ClimatologyStation[]>`. Il compilatore verifica tutti i
   record (verifica preliminare: zero null/NaN/stringhe nei campi numerici).
   **Trade-off TS vs JSON**: scelto TS compilato — tipi verificati a build time,
   zero parsing runtime, nessun rischio di path-breaking tra `src/` e `dist/` che
   il JSON richiederebbe (`resolveJsonModule` o `readFileSync` fragile). Costo:
   ricompilazione tsc del file grande (~accettabile, era già compilato).

3. **ESLint + Prettier**: `eslint.config.js` (flat config, `typescript-eslint`
   recommended + `eslint-config-prettier`), `.prettierrc.json` (printWidth 120),
   `.prettierignore` (esclude `climatology_data.ts` — dataset statico, riformattarlo
   produrrebbe diff inutili su 8800 righe — più `dist/`, `node_modules/`, lock).
   Script: `npm run lint`, `lint:fix`, `format`, `format:check`.
   **Esito lint: 0 errori.** Fix applicati (22 totali: 4 auto + 18 manuali),
   vedi sezione "Problemi risolti".

4. **`fontiInterrogate` dinamico** in `brief.ts`: calcolato dal numero effettivo
   di task interrogati (`[nwpR, allerteR, radarR, metarR, ensembleR, arpaR].length`)
   invece di hardcoded `6` — resta corretto aggiungendo fonti.

### Fase 4 — CI e igiene repository

- `.github/workflows/ci.yml`: su push/PR che toccano `mcp/**` → `npm ci`,
  `npm run build`, `npm test`, `npm run lint` (Node 20, cache npm).
  `broken-link-audit.yml` invariato.
- `git rm -r --cached .omo/run-continuation/` (20 file di stato sessioni, già
  in `.gitignore` ma tracciati) — commit dedicato `8bc33db`.
- Audit `.gitignore`/tracking: nessun altro file anomalo tracciato (niente
  `dist/`, `node_modules/`, log, `.env`; gli altri file `.omo/` — EVOLUTIVE,
  drafts, plans — sono documentazione, tracciati volutamente).

### Fase 5 — Questo report.

---

## Problemi risolti vs. solo documentati

### Risolti

1. `runBrief` poteva lanciare MeteoError violando il proprio contratto → catch strutturato + test.
2. Gap test su `brief.ts` (tool centrale), `summaries.ts`, `reference_tools` → 45 nuovi test.
3. Tipo di ritorno di `summarizeForecast` incoerente col runtime (score/flags) → corretto.
4. E3: bug `recordMetrics` — già risolto nel codice; test di regressione aggiunto, nota EVOLUTIVE aggiornata.
5. E5: `inferModels` allineato a `normalizeModelId` — già risolto; test espliciti aggiunti, EVOLUTIVE aggiornato.
6. Dead code/unused (lint): import inutilizzati (`apiPostJson` in `italian_sources.ts`, `haversine` in `arpa-fvg.ts`, `ApiResult` in `pollen/verification/year_compare`), variabili mai usate (`obs` in `arpa-fvg.ts`, `sensorIds` in `arpa-lombardia.ts`, `r1` in `cache.test.ts`), 4 `let` → `const`.
7. Parametri handler accettati dallo schema ma mai usati dalla logica: `snowDepthCm` (bioclimatic), `geopotential850hPa` e `liftedIndex` (local_phenomena) → rimossi dal destructure, **schema invariato** (compatibilità chiamanti).
8. `fontiInterrogate` hardcoded → dinamico.
9. Repo igiene: `.omo/run-continuation/` non più tracciato.
10. Nessuna CI per `mcp/**` → workflow aggiunto.

### Solo documentati (con motivazione)

1. **E6 completo** (catalogo modelli canonico): `reference_guidelines` e `model_tuning`
   citano `ecmwf_ifs` come modello/peso, ma Open-Meteo lo non serve più
   (`ecmwf_ifs025` è l'id attivo). Serve una revisione del *contenuto* KB con
   decisione editoriale su quali modelli raccomandare — non un refactoring
   meccanico. Stato aggiornato in `EVOLUTIVE.md`.
2. **Parametri schema senza logica**: `snowDepthCm`/`geopotential850hPa`/`liftedIndex`
   erano probabilmente destinati a regole non ancora implementate. Rimossi dal
   binding, schema mantenuto per non rompere i chiamanti; segnalati come possibili
   feature incomplete.
3. **`parseRawMetar(raw, _nwpTempC?)`**: il parametro `nwpTempC` non è mai usato
   nel corpo (lo scarto lo calcola `parseMetarStation` a valle). Signature
   mantenuta con `_` (3 chiamate); da semplificare in un ciclo futuro.
4. **`@typescript-eslint/no-explicit-any: off`**: i payload upstream (Open-Meteo,
   DPC, ARPA) sono non tipizzati; introdurre tipi per ogni fonte è un progetto a sé
   (vedi "Rimandati").

---

## Metriche prima/dopo

| Metrica | Prima | Dopo |
|---|---|---|
| Test totali | 55 (6 file) | **100** (10 file) |
| File coperti da test | — | `brief.ts`, `summaries.ts`, `reference_tools` (7 tool), `http.ts` (+E3), SDK error path |
| `reference_tools.ts` | 1707 righe | 17 righe (barrel) — 10 moduli dedicati |
| File più grande di codice (non-dati) | `reference_tools.ts` 1707 | `reference_guidelines.ts` 840 (un tool, catalogo KB) |
| `climatology_data.ts` | 8842 righe, `any[]` | 8868 righe, tipizzato `ClimatologyStation[]` |
| Lint | assente | 0 errori (typescript-eslint recommended) |
| CI | solo broken-link-audit | + workflow build/test/lint su `mcp/**` |
| Build + suite completa | ✅ | ✅ (verificate a ogni fase) |

**Verifica end-to-end del deliverable**: smoke test del binario compilato via
client MCP stdio reale — handshake OK, `tools/list` → **38 tool** (invariati),
`meteo_climatology` chiamata con successo sui dati tipizzati.

**Esito CI**: il workflow è stato aggiunto ma **non ancora eseguito** (la prima
esecuzione avverrà al prossimo push/PR su GitHub; non è possibile eseguire
GitHub Actions localmente). Build/test/lint eseguiti localmente con successo.

---

## Rimandati a un ciclo futuro

| Voce | Motivazione (una riga) |
|---|---|
| **Copertura ARPA Sud/Isole** | Fuori scope esplicito per questo ciclo (richiesta del piano). |
| **E6 completo — catalogo `MODEL_ALIASES` canonico** | Richiede decisione editoriale sui modelli da raccomandare nella KB, non solo refactoring. |
| **E1 — streaming dei riassunti lunghi** | Invasivo (refactor layer di risposta + compat client); beneficio latenza, non correttezza. |
| **E4 — tool solo-KB come MCP resources** | Cambio superficie (tool→resource) + aggiornamento SKILL.md; da pianificare con i client. |
| **Tipizzazione dei payload upstream** | Progetto trasversale su ~10 fonti; `no-explicit-any` resta off finché non completato. |
| **Semplificazione firma `parseRawMetar`** | 3 chiamate da aggiornare; nessun impatto funzionale. |
| **Feature incomplete segnalate** (`snowDepthCm`, `geopotential850hPa`, `liftedIndex`, batching `sensorIds` lombardia) | Regole/batching mai implementati; decidere se implementarli o rimuovere dallo schema. |

---

## Breaking changes

**Nessuno.** Nomi tool, schemi input/output e comportamento pubblico invariati
(38 tool verificati via smoke test sul binario). Uniche note di compatibilità:
- `reference_tools.ts` è ora un barrel re-export (API del modulo interna al
  server, non parte dell'interfaccia MCP pubblica).
- I test esistenti non modificati passano senza cambiamenti.
