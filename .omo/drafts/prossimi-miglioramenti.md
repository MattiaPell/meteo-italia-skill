# Draft: Prossimi Miglioramenti meteo-italia-skill

> ⚠️ **STATO: OBSOLETO** — Questo draft è stato scritto prima della transizione
> MCP-first. Molti gap (resilienza HTTP, cache, metriche, fat tools) sono stati
> già affrontati nel piano `.omo/plans/meteo-mcp-fat-tools.md`. Non usare come
> piano attivo; conservato solo per tracciabilità storica.

## Stato attuale (al momento della stesura)
- SKILL.md: 687 lines, 14 fetch steps (A-N), 10 use cases
- Reference files: 17 files, ~5047 total lines
- PR aperti: #33 (remove CHANGELOG)

## Esclusioni esplicite
- ❌ NO CHANGELOG
- ❌ NO output multilingua IT/EN
- ❌ NO widget template separato
- ❌ NO README con esempi

## Gap identificati

### Critici (da esplorazione diretta)
1. **Zero error handling**: nessun fallback documentato (eccetto aviationweather.gov per METAR). Se api.open-meteo.com va down, skill è inutilizzabile.
2. **Nessuna degradation strategy**: cosa fare se solo alcuni modelli rispondono? Cosa omettere?
3. **Modelli fissi solo in Step C**: tutti gli altri step usano placeholder `{MODEL1,MODEL2,...}` senza istruzioni su quali modelli per quale step.

### Miglioramento
4. **SKILL.md troppo lungo (687 righe)**: prompt LLM costoso, può ridurre triggering accuracy
5. **Sezioni duplicate**: alcuni concetti ripetuti in SKILL.md e reference files
6. **Trigger words potenzialmente incomplete**: mancano pattern di ricerca meteo comuni

### Nice-to-have (esclusi)
- Output multilingua ❌
- Widget template ❌
- README esempi ❌
- CHANGELOG ❌

## Aree di intervento proposte

### Area 1: Resilience & Error Handling (~priorità alta)
- Fallback chain per ogni API
- Degradation strategy documentata
- Timeout/retry guidelines

### Area 2: SKILL.md Optimization (~priorità alta)
- Compaction: 687 → ~400 righe
- Trigger word audit e completamento
- Deduplicazione contenuti con reference files

### Area 3: Multi-Model Guidelines (~priorità media)
- Specificare quali modelli per ogni step
- Matrice modello × variabile
- Cosa fare quando solo 1-2 modelli disponibili

### Area 4: Edge Case Documentation (~priorità bassa)
- Casi limite comuni (stazioni meteo offline, dati parziali)
- Quick reference per situazioni anomale

## Decisioni tecniche
- **Aree selezionate**: 2 (SKILL.md Optimization), 3 (Multi-Model Guidelines), 4 (Edge Case Documentation)
- **Area 1 esclusa**: Resilience & Error Handling (non selezionata)
- **Target compaction**: 687 → ~450 righe (35% reduction), preservando tutte le informazioni
- **Multi-model**: matrix modello × variabile come reference file separato
- **Edge cases**: nuovo file `references/edge_cases.md`

## Domande aperte
- Nessuna — aree confermate dall'utente
