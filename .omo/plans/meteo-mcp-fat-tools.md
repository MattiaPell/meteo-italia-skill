# meteo-mcp-fat-tools - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** A weather skill whose data-fetching "brain" moves out of the prompt and into the MCP server. The server will do the heavy lifting itself — filtering Italian places, auto-picking the right forecast detail level, comparing airport readings against the model, counting lightning strikes, computing storm probability ranges, and reading the official civil-protection alert bulletin — then hand the AI already-cooked, structured facts instead of raw JSON. The instruction file shrinks and becomes a coordinator.

**Why this approach:** You chose the "fat MCP" option (tools encapsulate thresholds, weights and conditional logic) and confirmed we should also fix the current build-breaking typos and implement real alert parsing. This keeps the AI's job to synthesis + report writing, which is what it's good at, while the repetitive, error-prone logic lives in tested code.

**What it will NOT do:** It will not make the AI "see" radar or satellite images — those stay as image URLs the AI looks at. It will not generate the final report text or templates (that stays prompt-side). It will not add new data sources or touch the working reference files, the learning log, or the helper scripts.

**Effort:** Large
**Risk:** Medium - the alert bulletin is plain HTML (not a clean API), so parsing relies on its text format staying stable; we keep a portal-link fallback so the tool never hard-fails.

**Decisions to sanity-check:** (1) Alert parsing reads the Bollettino di Criticità HTML page and regex-extracts the colored alert blocks; (2) the forecast tool auto-upgrades detail level when it detects storms; (3) we fix `z.coerce`→`z.coerce` and the `ecmwf_ifs04`→`ecmwf_ifs025` model-name mismatch so the project compiles at all.

Your next move: approve, or run a high-accuracy review first. Full execution detail follows below.

---

> TL;DR (machine): Large / Medium — 6 fat MCP tools + build fixes + SKILL.md trim (912→≤650 lines); alert parser uses HTML regex with portal fallback.

## Scope
### Must have
1. **Fix build blockers** — `z.coerce`→`z.coerce` in `italian_sources.ts` (3 sites) and `open_meteo.ts` (1 site); align model id `ecmwf_ifs04`→`ecmwf_ifs025` between `SKILL.md` and `references/models.md`; add undefined-guard in `summaries.ts` `pickDaily`/`pickHourly`.
2. **Fat `open_meteo_geocode`** — apply Italy filter (`country_code == "IT"`) + >3-results disambiguation, returning a normalized `{candidates, chosen, filteredToItaly, needsDisambiguation, fallbackSuggestion}` shape.
3. **Fat `open_meteo_forecast`** — accept a `level` (1|2|3) or auto-decide from Level-1 result; expand the variable lists per SKILL §A LIVELLO 2/3 internally; return raw + summary.
4. **Fat `checkwx_metar_taf` / `aviationweather_metar`** — parse decoded/raw METAR into `{tempC, windKt, windDir, visibilityM, skyCover, qnhHpa, decodedVsNwp: {tempScarto, windScarto, visFlag}}` and a `taf` summary.
5. **Fat `dmi_lightning`** — given a target lat/lon, compute count, density per 50km², 15-min trend (second call with `observed_after`), and Haversine min-distance; return structured strike stats.
6. **Fat `open_meteo_ensemble`** — compute p10/median/p90, P(>5/20/50mm) from members, and the ensemble-vs-deterministic hierarchy verdict; return a compact stats block.
7. **Parse `pc_allerte_wms`** — fetch the Bollettino di Criticità HTML, regex the `ALLERTA <COLORE>` blocks per risk type (idraulico / temporali / idrogeologico) and region/zone, return `{regione, zona, rischio, colore, livello}` rows; on parse failure fall back to portal URL + explicit error (as today).
8. **Trim `SKILL.md`** — replace the moved logic (geocode validation, Level 1-3 expansion, METAR comparison, lightning counts, ensemble stats, alert parsing) with "Call tool X with params Y → use returned field Z" instructions; keep narrative synthesis, report template, qualitative bias, and vision-based radar/satellite as LLM-side.

### Must NOT have (guardrails, anti-slop, scope boundaries)
- **NO vision parsing** on MCP: DPC radar `dpc_radar_vmi` and EUMETSAT `eumetsat_satellite_info` stay as URL/metadata → LLM vision.
- **NO edits** to `nimbus.md`, working `references/*.md` ARPA sections, `add_frontmatter.py`, `fix_climatology.py`, `fix_uv.py`.
- **NO new API sources** beyond those already wired.
- **NO report generation / template** moved to MCP — report stays prompt-side.
- **NO license / packaging / README-examples** changes.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: **tests-after** (the repo has no test framework; add a `mcp/test/` smoke script run with `node --test` or a plain `node` script) + manual debug-page QA via `METEO_MCP_DEBUG_PORT=3000`.
- Evidence: `.omo/evidence/meteo-mcp-fat-tools/a1/` (build + per-tool JSON output captured from the debug page or `node` smoke script).
- Gate 0 (blocking): `cd mcp && npm install && npm run build` MUST succeed — today it fails on `z.coerce`.

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.
- **Wave 1 (blocking, serial-ish but internally parallelizable):** build-fix + 6 fat-tool refactors + alert parser. Tool refactors are independent of each other (different files/functions) → parallelize.
- **Wave 2:** SKILL.md trim (depends on all Wave-1 tool contracts being finalized so the doc references the right returned fields).
- **Wave 3 (final):** build + debug-page QA sweep + dry-run of trimmed SKILL.md.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| T1 build-fix | — | T2-T7, T8 | T2-T7 (different files) |
| T2 geocode-fat | T1 | T8 | T3-T7 |
| T3 forecast-fat | T1 | T8 | T2,T4-T7 |
| T4 metar-fat | T1 | T8 | T2,T3,T5-T7 |
| T5 lightning-fat | T1 | T8 | T2-T4,T6,T7 |
| T6 ensemble-fat | T1 | T8 | T2-T5,T7 |
| T7 allerte-parse | T1 | T8 | T2-T6 |
| T8 skill-trim | T2-T7 | T9 | — |
| T9 final-qa | T8 | — | — |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

- [ ] 1. Fix MCP build blockers (z.coerce, model id, summarizeForecast guard)
  What to do / Must NOT do: In `mcp/src/italian_sources.ts` change `z.coerce`→`z.coerce` at lines 19, 20, 143 (also delete the stray `coerce` if any). In `mcp/src/open_meteo.ts` change `z.coerce`→`z.coerce` at line 17. In `SKILL.md` change `ecmwf_ifs04` (line 166) and the `ecmwf_ifs025_ensemble_mean` references to match `references/models.md` (use `ecmwf_ifs025` for the 0.25° id; keep `ecmwf_ifs` for HRES 9km). In `mcp/src/summaries.ts` `pickDaily`/`pickHourly` (49-60) guard `arr` before `?.[i]` (e.g. `const arr = ...; if(!arr) return undefined;`). Do NOT touch `http.ts` (already `coerce`). Do NOT change any API behaviour beyond the guard.
  Parallelization: Wave 1 | Blocked by: — | Blocks: T2-T7, T8
  References: mcp/src/italian_sources.ts:19,20,143; mcp/src/open_meteo.ts:17; mcp/src/http.ts:153-159 (correct ref); SKILL.md:166,283; references/models.md:17-18; mcp/src/summaries.ts:49-60
  Acceptance criteria: `cd /home/ubuntu/repositories/meteo-italia-skill/mcp && npm install && npm run build` exits 0; grep for `coerce(` in src returns no match.
  QA scenarios: happy — `npm run build` succeeds, `node -e "require('./dist/http.js')"` loads. failure — reintroduce `coerce` and confirm tsc errors with `Property 'coerce' does not exist`. Evidence .omo/evidence/meteo-mcp-fat-tools/a1/task-1-build.txt
  Commit: Y | fix(mcp): correct z.coerce typo, align ecmwf_ifs025 id, guard summarizeForecast

- [ ] 2. Fat open_meteo_geocode — Italy filter + disambiguation
  What to do / Must NOT do: Wrap the existing `apiGet` geocoding call. After fetch, filter `results` to those with `country_code == "IT"`; build output `{countryFiltered: boolean, candidates: [{name, admin1, lat, lon, elevation}], chosen: <first IT result or null>, needsDisambiguation: <true if >3 IT results>, fallbackSuggestion: <nearest non-IT name+region or null>}`. If zero IT results, set `chosen=null` and populate `fallbackSuggestion`. Do NOT change the upstream URL/params. Keep `structuredContent` shape `{ok,url,status,data,elapsedMs}`.
  Parallelization: Wave 1 | Blocked by: T1 | Blocks: T8
  References: mcp/src/open_meteo.ts:9-32 (current tool); SKILL.md:108-125 (validation rules to encode); mcp/src/http.ts:22-69 (apiGet contract)
  Acceptance criteria: For input `name="Roma"` the returned `data.chosen.country_code == "IT"` and `data.countryFiltered == true`. Unit-assert via smoke script.
  QA scenarios: happy — `name="Milano"` → chosen IT, needsDisambiguation false. failure — `name="Paris"` (no IT) → chosen null, fallbackSuggestion populated, ok still true. Evidence .omo/evidence/meteo-mcp-fat-tools/a1/task-2-geocode.json
  Commit: Y | feat(mcp): geocode applies Italy filter and disambiguation

- [ ] 3. Fat open_meteo_forecast — Level 1-3 auto-expansion
  What to do / Must NOT do: Add optional `level: z.enum(["1","2","3","auto"]).default("auto")` to the forecast tool. On `auto`, do a Level-1 call (daily + 8 core hourly + 3 macroarea models), inspect for `weather_code 80-99 | cape>500 | precip>10 | wind>50`, and if triggered re-issue a Level-2 call adding the advanced variables from SKILL.md:171 (`temperature_850hPa, temperature_500hPa, lifted_index, convective_inhibition, freezing_level_height, visibility, boundary_layer_height`, `past_days=7`). Level-3 only triggers on explicit `level:"3"` (use-case vars from SKILL.md:177-179, `forecast_days=16`). Return both raw and `summarizeForecast` summary. Do NOT hardcode model names that contradict references/models.md (use `ecmwf_ifs025`, `icon_seamless`, `gfs_seamless`).
  Parallelization: Wave 1 | Blocked by: T1 | Blocks: T8
  References: mcp/src/open_meteo.ts:34-66; mcp/src/summaries.ts:13-115; SKILL.md:154-192 (Level rules); references/models.md:13-53
  Acceptance criteria: `level:"auto"` with a stormy city returns `data.levelUsed` in {1,2} and includes `temperature_850hPa` in the Level-2 raw call when triggered; `level:"1"` never requests upper-air vars.
  QA scenarios: happy — Rome, `level:"1"` → only core vars. failure — `level:"auto"` on a known storm → Level-2 vars present, no crash. Evidence .omo/evidence/meteo-mcp-fat-tools/a1/task-3-forecast.json
  Commit: Y | feat(mcp): forecast auto-expands Levels 1-3 from trigger rules

- [ ] 4. Fat checkwx_metar_taf + aviationweather_metar — NWP comparison
  What to do / Must NOT do: After fetching decoded METAR (CheckWX) or raw (AviationWeather), parse into `{stations:[{icao, tempC, windKt, windDir, visibilityM, skyCover, qnhHpa, decodedVsNwp:{tempScarto, windScartoKt, visFlag}}]}`. `tempScarto` = |obsT − nwpT| requires the caller to also pass the NWP T (add optional `nwpTempC` param, default null → scarto null). Map AviationWeather `raw_text` via regex from references/metar_taf.md:372 (`temp /(\d{2})\/(\d{2})/`, wind `/(\d{3})(\d{2})KT/`, vis `visibility_statute_mi`×1.609, QNH `altim_in_hg`×33.864). Return structured; keep raw in `data.raw`. Do NOT call the forecast API from inside the tool.
  Parallelization: Wave 1 | Blocked by: T1 | Blocks: T8
  References: mcp/src/italian_sources.ts:77-132; references/metar_taf.md:344-385; SKILL.md:339-385
  Acceptance criteria: For LIRF decoded input, `data.stations[0].icao == "LIRF"` and `visibilityM` is a number; with `nwpTempC` supplied, `decodedVsNwp.tempScarto` is a number.
  QA scenarios: happy — CheckWX decoded LIRF → parsed fields. failure — AviationWeather raw `LIRF` (no key) → regex parse yields tempC + windKt. Evidence .omo/evidence/meteo-mcp-fat-tools/a1/task-4-metar.json
  Commit: Y | feat(mcp): parse METAR/TAF and compare vs NWP

- [ ] 5. Fat dmi_lightning — counts, density, trend, distance
  What to do / Must NOT do: Add required `targetLat`, `targetLon` params. After fetching GeoJSON features, compute: `count` (total strikes in bbox), `densityPer50km2` = count / (bboxAreaKm2/50), `trend` via optional second call with `observed_after = now-15min` (ratio vs previous 15-min window: +50% intensifying, −50% dissipating, else stable), `minDistanceKm` = min Haversine from target to each strike, `within10km`/`within20km` booleans. Return `{count, densityPer50km2, trend, minDistanceKm, strikesNearTarget}`. Do NOT re-fetch the upstream bbox differently; keep `limit`/`observed_after` pass-through.
  Parallelization: Wave 1 | Blocked by: T1 | Blocks: T8
  References: mcp/src/italian_sources.ts:134-160; references/lightning.md (count>10 active, >20 severe, trend logic, Haversine); SKILL.md:387-417
  Acceptance criteria: With a known strike bbox + target near a strike, `data.count >= 0`, `data.minDistanceKm` is a finite number, `data.trend` ∈ {intensifying,stable,dissipating,unknown}.
  QA scenarios: happy — Nord Italia bbox with target in Milan → count + minDistanceKm finite. failure — empty bbox → count 0, trend "unknown", no crash. Evidence .omo/evidence/meteo-mcp-fat-tools/a1/task-5-lightning.json
  Commit: Y | feat(mcp): compute lightning counts, density, trend, distance

- [ ] 6. Fat open_meteo_ensemble — p10/median/p90 + probabilities
  What to do / Must NOT do: After fetching ensemble members, compute per-variable: `median`, `p10`, `p90` (p10/p90 from sorted member array; spread≈(p90−p10)/2.56 per SKILL.md:298), and probabilities `P(precip>5mm)`, `P(precip>20mm)`, `P(precip>50mm)`, `P(gust>70kmh)` from member hit-rates. Add `hierarchy` verdict (spread low+accord→high confidence; spread high+diverge→trends only) per SKILL.md:546-549. Return compact `{variables:{temperature_2m_max:{p10,median,p90,spread}, precip_sum:{median,p90,P_gt5,P_gt20,P_gt50}, wind_gusts_10m_max:{median,p90,P_gt70}}}` plus `hierarchy`. Do NOT invent models; require `models` param as today.
  Parallelization: Wave 1 | Blocked by: T1 | Blocks: T8
  References: mcp/src/open_meteo.ts:162-192; references/ensemble_spread.md; SKILL.md:275-300,540-550
  Acceptance criteria: For a 2-member+ call, `data.variables.temperature_2m_max.p10 <= median <= p90` and `P_gt5` ∈ [0,1].
  QA scenarios: happy — ecmwf_ifs025_ensemble_mean + gfs025_ensemble_mean, 7-day → valid p10/median/p90. failure — single degenerate member (all equal) → spread 0, no div-by-zero. Evidence .omo/evidence/meteo-mcp-fat-tools/a1/task-6-ensemble.json
  Commit: Y | feat(mcp): derive ensemble p10/median/p90 and probabilities

- [ ] 7. Parse pc_allerte_wms — Bollettino di Criticità HTML
  What to do / Must NOT do: Replace the broken WMS GET with: fetch `https://mappe.protezionecivile.gov.it/it/mappe-rischi/bollettino-di-criticita/` (HTML). Regex-extract blocks of form `ALLERTA <COLORE>:` preceded by `RISCHIO IDRAULICO /`, `RISCHIO TEMPORALI /`, `RISCHIO IDROGEOLOGICO /`, capturing the following `<Regione>: <zone list>`. Normalize colore → {verde,gialla,arancione,rossa} and risk type. Return `{bollettinoDate, alerts:[{regione, zona, rischio, colore, livello}]}`. On any fetch/parse failure, fall back to returning `ok:false` with `portalUrl:"https://mappe.protezionecivile.gov.it/it/mappe-rischi/bollettino-di-criticita/"` + explicit error (preserve today's behaviour). Keep tool name `pc_allerte_wms`. Do NOT depend on the WMS endpoint. Add optional `regione` filter param.
  Parallelization: Wave 1 | Blocked by: T1 | Blocks: T8
  References: mcp/src/italian_sources.ts:7-43 (current broken); web docs: mappe.protezionecivile.gov.it/it/mappe-rischi/bollettino-di-criticita/ (format "ORDINARIA CRITICITÀ PER RISCHIO IDRAULICO / ALLERTA GIALLA: <Regione>: <zone>"); SKILL.md:218-225; references/arpa_network.md
  Acceptance criteria: For today's live bollettino HTML, `data.alerts` is a non-empty array with at least one `{regione, rischio:"idraulico", colore:"gialla"}` row when alerts are active; `livello` maps verde→0,gialla→1,arancione→2,rossa→3.
  QA scenarios: happy — fetch live page → parsed alerts. failure — block network / bad HTML → ok:false, portalUrl present, no throw. Evidence .omo/evidence/meteo-mcp-fat-tools/a1/task-7-allerte.json
  Commit: Y | feat(mcp): parse Bollettino di Criticità into structured alerts

- [ ] 8. Trim SKILL.md — logic moved into tools
  What to do / Must NOT do: For each step whose logic is now in a tool, replace the inline fetch+validation prose with a short "Call `<tool>` with `<params>` → use returned `<field>`" directive. Specifically: §2 Geocoding → `open_meteo_geocode` (use `chosen`/`needsDisambiguation`); §A Levels → `open_meteo_forecast` `level:"auto"`; Step K → `checkwx_metar_taf`/`aviationweather_metar` (use `decodedVsNwp.tempScarto`); Step L → `dmi_lightning` (use `count`/`densityPer50km2`/`trend`/`minDistanceKm`); Step J → `open_meteo_ensemble` (use `p10`/`median`/`p90`/`hierarchy`); Step E → `pc_allerte_wms` (use `alerts[].colore`). Keep: narrative synthesis, report template (§Template Report), qualitative bias (foehn/bora), and vision-based radar (Step I) / satellite (Step N) as LLM-side. Reduce SKILL.md from ~912 to ~550-650 lines. Do NOT delete use-case sections or the Execution Manifest.
  Parallelization: Wave 2 | Blocked by: T2-T7 | Blocks: T9
  References: SKILL.md:51-91 (MCP mapping table), 108-125 (§2), 154-192 (§A), 218-225 (§E), 339-385 (§K), 387-417 (§L), 540-550 (§J); all T2-T7 tool contracts
  Acceptance criteria: grep SKILL.md for the strings "Filtro Italia" and "Dynamic Weighting" still present (kept as guidance), but the per-step raw `GET https://...` fetch templates under moved steps are removed/replaced; SKILL.md line count via `wc -l` ≤ 650.
  QA scenarios: happy — LLM dry-run on "Allerta meteo in Sicilia" uses only tool calls, no raw fetches. failure — confirm Step I (radar) and Step N (satellite) still instruct "analyze the image URL" (not moved). Evidence .omo/evidence/meteo-mcp-fat-tools/a1/task-8-trim.md
  Commit: Y | docs(skill): trim SKILL.md, delegate logic to fat MCP tools

- [ ] 9. Final QA — build + debug-page sweep + SKILL dry-run
  What to do / Must NOT do: Run `cd mcp && npm install && npm run build` (must pass). Start `METEO_MCP_DEBUG_PORT=3000 node dist/index.js` and, via the `/api/debug` POST endpoint, exercise every fat tool with a real Italian target (Roma 41.9,12.5; Milano; a stormy day for Level-2; LIRF for METAR; Nord bbox for lightning; ensemble models; live bollettino for allerte). Capture each response's `data` shape. Then do a SKILL.md dry-run: pick 3 queries ("Che tempo fa a Milano?", "Allerta in Sicilia", "Produzione eolica Puglia") and confirm the trimmed doc references only tool calls for moved logic. Do NOT modify code in this todo — only verify and report gaps.
  Parallelization: Wave 3 | Blocked by: T8 | Blocks: —
  References: mcp/README.md (debug API), all T2-T8 outputs, SKILL.md (post-trim)
  Acceptance criteria: build exits 0; all 6 fat tools return structured `data` for the Roma probe; SKILL.md dry-run shows no raw `GET https://api.open-meteo.com` under moved steps.
  QA scenarios: happy — full sweep green, evidence JSON saved. failure — any tool throws → file a follow-up todo citing the tool. Evidence .omo/evidence/meteo-mcp-fat-tools/a1/task-9-qa.json
  Commit: N | (verification only)

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit
- [ ] F2. Code quality review
- [ ] F3. Real manual QA
- [ ] F4. Scope fidelity

## Commit strategy
- One commit per tool/fix (T1-T8), conventional `type(scope): summary` (see each todo's Commit line). T9 is verification-only (no commit).
- Sequence: T1 (build fix) first so the project compiles; then T2-T7 (parallelizable, separate commits); T8 (docs) after tool contracts freeze; T9 no commit.
- Do NOT squash across scopes; each commit must build on its own (T1 is the gate).

## Success criteria
1. `cd mcp && npm install && npm run build` exits 0 (today it fails on `z.coerce`).
2. All 6 fat tools (`open_meteo_geocode`, `open_meteo_forecast`, `checkwx_metar_taf`+`aviationweather_metar`, `dmi_lightning`, `open_meteo_ensemble`, `pc_allerte_wms`) return structured `data` for a real Italian probe via the `:3000` debug page.
3. `pc_allerte_wms` no longer calls the broken `geowebcache` WMS; it parses the Bollettino di Criticità HTML and returns a non-empty `alerts[]` on a day with active alerts (with portal fallback on failure).
4. `SKILL.md` shrinks from ~912 to ≤650 lines; every removed fetch/validation block is replaced by a "Call `<tool>` → use `<field>`" directive; Steps I (radar) and N (satellite) still instruct LLM-side vision.
5. A SKILL.md dry-run on 3 representative queries uses only tool calls for the moved logic, with zero raw `GET https://api.open-meteo.com` fetch templates under the moved steps.
