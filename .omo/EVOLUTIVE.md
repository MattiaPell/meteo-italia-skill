# Evolutive proposte — meteo-italia MCP

Documento di proposte (NON implementate in questa fase). Ogni voce ha stima
effort e benefici. Da approvare esplicitamente prima di eseguire.

## E1 — Streaming dei riassunti lunghi
- **Problema**: `open_meteo_forecast_summary` e `meteo_climatology` possono
  ritornare payload voluminosi; l'MCP blocking attende tutto prima di rispondere.
- **Soluzione**: esporre i tool pesanti come streamig (MCP `sendingMessage` /
  progress notification) o restituire il riassunto in chunk.
- **Effort**: Medium (richiede refactor del layer di risposta + client compatibili).
- **Beneficio**: latenza percepita azzerata su report complessi.
- **Stato**: proposta non implementata.

## E2 — Cache TTL sulle chiamate esterne ✅ IMPLEMENTATA
- **Implementazione**: `mcp/src/http.ts` contiene cache in-memory con TTL per host
  (`CACHE_TTL_MS`: 5 min forecast, 1h geocode, 5 min ensemble, default 60s).
  `apiGet` serve hit da cache con flag `cached: true`.
- **Nota**: il piano originale (`meteo-mcp-audit-optimize`) la proponeva come E2;
  è stata realizzata nel piano `meteo-mcp-fat-tools`.

## E3 — Observability / metrics hit-miss ✅ IMPLEMENTATA
- **Implementazione**: `mcp/src/http.ts` tiene `metrics` per host (hits, errors,
  latenciesMs) e `getCacheStats()`. `mcp/src/debug.ts` espone `/api/metrics`.
- **Nota**: resta un bug minore in `http.ts:168-184` dove `recordMetrics` per
  errori 4xx non-ritriabili è unreachable code.

## E4 — Risorse MCP statiche per i tool solo-KB
- **Problema**: `meteo_model_tuning`, `meteo_event_reliability`,
  `meteo_reference_guidelines` riflettono solo la knowledge base locale e
  vengono ricomputati a ogni call.
- **Soluzione**: esporli come MCP `resources` (statici, versionati) invece
  di `tools`, liberando slot tool e abilitando caching lato client.
- **Effort**: Medium (spostamento + aggiornamento SKILL.md).
- **Beneficio**: superficie tool piú pulita, meno calcolo inutile.
- **Stato**: proposta non implementata.

## E5 — Normalizzazione alias modelli end-to-end ✅ PARZIALE
- **Implementazione**: `normalizeModelId` in `mcp/src/reference_tools.ts` unifica
  dash/underscore in `open_meteo_forecast`, `open_meteo_ensemble` e nel lookup
  pesi di `meteo_model_tuning`.
- **Gap**: `mcp/src/summaries.ts` `inferModels()` non usa `normalizeModelId` e il
  set `KNOWN_MODELS` è disallineato rispetto ai nomi reali usati dai tool.

## E6 — Allineamento nomi modello in tutta la knowledge base
- **Problema**: `meteo_reference_guidelines` (models), `meteo_model_tuning` pesi,
  `summaries.ts` e `open_meteo.ts` usano set di id modello parzialmente divergenti
  (es. `iconeu` vs `icon_eu`, `arome` vs `arome_france`, modelli come
  `meteoswiss_icon_seamless` citati ma non documentati).
- **Soluzione**: definire un `MODEL_ALIASES` canonico condiviso e un catalogo
  unico; rimuovere i riferimenti a modelli non documentati.
- **Effort**: Small-Medium.
- **Beneficio**: l'agente non riceve id inconsistenti e il riepilogo per modello
  funziona correttamente.

## Prioritą suggerita (aggiornata)
1. E5/E6 — allineamento nomi modello end-to-end; blocca il riepilogo per modello.
2. E1 / E4 — piú invasivi, valutare per fase successiva.
