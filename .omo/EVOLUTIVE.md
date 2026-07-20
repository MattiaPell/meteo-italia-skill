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

## E2 — Cache TTL sulle chiamate esterne
- **Problema**: Open-Meteo / DMI / floods.it sono richiesti ripetutamente
  per le stesse coordinate entro pochi minuti (stesso agente, multi-tool).
- **Soluzione**: cache in-memory con TTL per-URL (es. 5 min per forecast,
  1h per geocode, 15 min per allerte). Chiave = URL normalizzata.
- **Effort**: Small (decorator su `apiGet`/`apiPostJson` in http.ts).
- **Beneficio**: meno rate-limit, risposte piú rapide, minor carico API.

## E3 — Observability / metrics hit-miss
- **Problema**: nessun segnale su quante chiamate falliscono o quanto
  impieghino; il debug server mostra solo l'ultima richiesta.
- **Soluzione**: contatori in-process (hit/miss cache, count per-status HTTP,
  p50/p95 latency) esposti su `/api/metrics` nel debug server.
- **Effort**: Small.
- **Beneficio**: diagnostica proattiva, rilevazione degrado fonti.

## E4 — Risorse MCP statiche per i tool solo-KB
- **Problema**: `meteo_model_tuning`, `meteo_event_reliability`,
  `meteo_reference_guidelines` riflettono solo la knowledge base locale e
  vengono ricomputati a ogni call.
- **Soluzione**: esporli come MCP `resources` (statici, versionati) invece
  di `tools`, liberando slot tool e abilitando caching lato client.
- **Effort**: Medium (spostamento + aggiornamento SKILL.md).
- **Beneficio**: superficie tool piú pulita, meno calcolo inutile.

## E5 — Normalizzazione alias modelli end-to-end
- **Stato attuale**: `normalizeModelId` (T7) unifica dash/underscore solo
  nel lookup bias. Estendere la normalizzazione a TUTTI gli input modello
  (forecast, ensemble, summary) e ai weight table, con una mappa canonica
  `MODEL_ALIASES` condivisa.
- **Effort**: Small.
- **Beneficio**: elimina ogni discrepanza nome tra SKILL.md, Open-Meteo, KB.

## Prioritą suggerita
1. E2 (cache) — alto impatto, basso sforzo
2. E3 (observability) — alto valore diagnostico
3. E5 (alias end-to-end) — completa T7
4. E1 / E4 — piú invasivi, valutare per fase successiva
