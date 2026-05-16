# Ensemble Spread — Incertezza Probabilistica

Due endpoint Open-Meteo distinti, entrambi gratuiti, no API key:
- **Ensemble API**: tutti i membri individuali (fino a 51) → percentili custom
- **Ensemble Mean API**: mean + spread precalcolati → più leggero, ideale per la skill

---

## Quando Attivare l'Ensemble

Attiva **sempre** per:
- Orizzonte forecast >3 giorni
- Evento potenzialmente significativo (grandine, neve, vento forte, alluvione)
- Allerta PC ≥ gialla
- Quando i modelli deterministici divergono (σ >2°C su T, o >50% su precipitazioni)

Attiva **se richiesto**:
- Qualsiasi analisi dove l'utente vuole capire l'incertezza

**Non serve** per:
- Orizzonte <24h (deterministici sufficienti, ensemble ha ciclo 6-12h)
- Risposta sintetica rapida ("piove stasera?")

---

## Ensemble Mean API — Raccomandato per la Skill

Endpoint più efficiente: restituisce mean e spread precalcolati, archivio lungo.

```http
GET https://ensemble-api.open-meteo.com/v1/ensemble-mean
  ?latitude={LAT}
  &longitude={LON}
  &models=ecmwf_ifs025_ensemble_mean,icon_seamless_eps_mean,gfs025_ensemble_mean
  &hourly=temperature_2m_mean,temperature_2m_spread,
          precipitation_mean,precipitation_spread,
          wind_speed_10m_mean,wind_speed_10m_spread,
          wind_gusts_10m_mean,wind_gusts_10m_spread,
          precipitation_probability_mean,
          cape_mean,cape_spread,
          snowfall_mean,snowfall_spread
  &daily=temperature_2m_max_mean,temperature_2m_max_spread,
         temperature_2m_min_mean,temperature_2m_min_spread,
         precipitation_sum_mean,precipitation_sum_spread,
         wind_speed_10m_max_mean,wind_speed_10m_max_spread
  &timezone=Europe/Rome
  &forecast_days=16
```

### Modelli disponibili (Ensemble Mean API)
| ID modello | Membri | Giorni | Risoluzione | Priorità Italia |
|---|---|---|---|---|
| `ecmwf_ifs025_ensemble_mean` | 51 | 15 | 25 km | ★★★★★ |
| `ecmwf_aifs025_ensemble_mean` | 50 | 15 | 25 km | ★★★★ |
| `icon_seamless_eps_mean` | 40 | 7.5 | 13 km | ★★★★★ |
| `icon_eu_eps_mean` | 40 | 5 | 7 km | ★★★★★ |
| `gfs025_ensemble_mean` | 31 | 16 | 25 km | ★★★ |
| `gem_global_ensemble_mean` | 21 | 16 | 25 km | ★★★ |
| `bom_access_global_ensemble_mean` | 18 | 10 | 25 km | ★★ |

**Set raccomandato per Italia** (bilanciamento qualità/velocità):
```
ecmwf_ifs025_ensemble_mean, icon_eu_eps_mean, gfs025_ensemble_mean
```

---

## Ensemble API — Tutti i Membri (per analisi avanzata)

Usa quando hai bisogno di percentili specifici o distribuzione completa.

```http
GET https://ensemble-api.open-meteo.com/v1/ensemble
  ?latitude={LAT}
  &longitude={LON}
  &models=ecmwf_ifs025
  &hourly=temperature_2m,precipitation,wind_gusts_10m,cape
  &timezone=Europe/Rome
  &forecast_days=10
```

La risposta include ogni membro come array separato:
```json
{
  "hourly": {
    "time": [...],
    "temperature_2m_member01": [...],
    "temperature_2m_member02": [...],
    ...
    "temperature_2m_member51": [...]
  }
}
```

### Calcolo percentili dai membri raw
```python
import numpy as np

# Per ogni slot temporale t:
members = [m[t] for m in all_members]
p10 = np.percentile(members, 10)
p25 = np.percentile(members, 25)
median = np.percentile(members, 50)
p75 = np.percentile(members, 75)
p90 = np.percentile(members, 90)
spread = np.std(members)  # = (p90 - p10) / 2.56 approssimativamente
```

### Modelli disponibili (Ensemble API)
| ID modello | Membri | Giorni |
|---|---|---|
| `ecmwf_ifs025` | 51 | 15 |
| `ecmwf_aifs025` | 50 | 15 |
| `icon_seamless_eps` | 40 | 7.5 |
| `icon_eu_eps` | 40 | 5 |
| `icon_d2_eps` | 20 | 2 |
| `gfs_seamless_ensemble` | 31 | 16 |
| `gfs025_ensemble` | 31 | 35 |
| `gem_global_ensemble` | 21 | 16 |

---

## Interpretazione dello Spread

### Spread temperatura (°C)
| Spread (σ o p90-p10) | Incertezza | Significato operativo |
|---|---|---|
| <1°C | Molto bassa | Forecast affidabile — pianifica con fiducia |
| 1–2°C | Bassa | Buona affidabilità — margine piccolo |
| 2–4°C | Media | Incertezza significativa — scenario probabile ma con varianti |
| 4–6°C | Alta | Forecast incerto — verifica domani |
| >6°C | Molto alta | Situazione caotica — solo tendenza generale |

### Spread precipitazioni (mm)
| Spread (p90-p10) | Incertezza |
|---|---|
| <2mm | Bassa |
| 2–10mm | Media |
| 10–30mm | Alta |
| >30mm | Molto alta — possibile evento estremo o assenza totale |

### Spread vento (km/h)
| Spread (p90-p10) | Incertezza |
|---|---|
| <10 km/h | Bassa |
| 10–25 km/h | Media |
| 25–50 km/h | Alta |
| >50 km/h | Molto alta |

---

## Probabilità da Ensemble — Calcoli Chiave

Con i membri individuali (Ensemble API) o tramite spread (approssimazione):

### Probabilità pioggia > soglia
```python
# Con membri raw
prob_pioggia_5mm = sum(1 for m in members if m > 5) / len(members) * 100

# Soglie utili
prob_pioggia_1mm   # tracce di pioggia
prob_pioggia_5mm   # pioggia ordinaria
prob_pioggia_20mm  # pioggia abbondante
prob_pioggia_50mm  # pioggia intensa — rischio idrogeologico
```

### Probabilità temperatura < soglia (gelate)
```python
prob_gelo = sum(1 for m in members if m < 0) / len(members) * 100
prob_gelo_severo = sum(1 for m in members if m < -3) / len(members) * 100
```

### Probabilità vento > soglia
```python
prob_vento_forte = sum(1 for m in members if m > 50) / len(members) * 100
prob_vento_pericoloso = sum(1 for m in members if m > 75) / len(members) * 100
```

### Approssimazione con solo mean+spread (Ensemble Mean API)
Se non scarichi i membri raw, puoi approssimare le probabilità assumendo
distribuzione gaussiana (valida per temperatura, non per precipitazioni):
```
P(X > soglia) = 1 - Φ((soglia - mean) / spread)
dove Φ è la CDF normale standard
```
Per le precipitazioni (distribuzione asimmetrica) usa invece direttamente
i percentili p25/p50/p75/p90 come proxy delle probabilità.

---

## Come Integrare Ensemble e Deterministici

### Gerarchia operativa
1. **Consensus deterministico** (fetch A del SKILL.md) → scenario più probabile
2. **Ensemble mean** → conferma o corregge il consensus deterministico
3. **Ensemble spread** → quantifica l'incertezza del consensus
4. **Risultante**: media pesata ensemble mean + consensus deterministico

### Quando ensemble e deterministici divergono
- Ensemble mean diverso dal consensus deterministico di >2°C o >30%:
  → segnala esplicitamente la divergenza
  → l'ensemble è statisticamente più robusto (più membri)
  → ma il deterministic ad alta risoluzione può cogliere fenomeni locali che l'ensemble perde

### Regola pratica
```
Se spread basso E consensus deterministico concorda con ensemble mean:
  → alta fiducia nel forecast
  
Se spread alto E consensus deterministico ≈ ensemble mean:
  → situazione genuinamente incerta (natura caotica del sistema)
  
Se spread basso MA consensus deterministico diverge da ensemble mean:
  → possibile errore nel modello deterministico — fidati dell'ensemble
  
Se spread alto E consensus deterministico diverge da ensemble mean:
  → situazione molto incerta — solo tendenze generali affidabili
```

---

## Visualizzazione Spread nel Report

### Banda di confidenza testuale (per report senza grafici)
```
T max domani:
  Scenario favorevole (p90): {X}°C
  Scenario mediano (p50):    {Y}°C  ← usa questo come "previsione"
  Scenario sfavorevole (p10): {Z}°C
  Spread p10-p90: {W}°C → incertezza {Bassa/Media/Alta}
```

### Barra visuale testuale
```
Temperatura max: 18°C ±4°C
  [▓▓▓▓▓▓▓▒▒▒░░░░░]
   12°C  18°C    24°C
   p10   p50     p90
```

### Per grafici (artifact React/recharts)
Usa `area` chart con:
- Linea centrale = ensemble mean (o median)
- Banda interna = p25–p75 (50% dei membri)
- Banda esterna = p10–p90 (80% dei membri)
- Overlay = deterministic run ad alta risoluzione (ARPAE ICON 2I per Italia)

---

## Spread per Tipo di Evento — Interpretazione Specifica

### Neve
- `snowfall_mean` > 0 + `snowfall_spread` basso → neve quasi certa
- `snowfall_mean` > 0 + `snowfall_spread` alto → incertezza su quota/intensità
- Segnala sempre p10 e p90 in cm → "tra {p10} e {p90} cm di neve previsti"

### Temporali / CAPE
- `cape_mean` >500 + `cape_spread` basso → instabilità diffusa, quasi certa
- `cape_mean` >500 + `cape_spread` alto → instabilità localizzata, incerta
- Con spread alto su CAPE: "possibili temporali ma localizzati — incertezza alta"

### Vento
- `wind_gusts_10m_spread` >20 km/h → attenzione: alcuni membri prevedono raffiche molto superiori al mean
- Segnala sempre il p90 delle raffiche (non solo il mean) per sicurezza

### Ondate di calore/freddo
- Spread basso su T per 3+ giorni consecutivi → ondata confermata dall'ensemble
- p10 ancora >35°C → evento quasi certo per qualsiasi scenario

---

## Template Sezione Ensemble nel Report

```
### 📊 Analisi Ensemble ({N} modelli, {TOT} membri totali)

**Temperatura max {DATA}:**
p10: {X}°C | Mediana: {Y}°C | p90: {Z}°C
Spread: {W}°C → Incertezza: {Bassa/Media/Alta/Molto alta}

**Precipitazioni {DATA}:**
Mediana: {X}mm | p75: {Y}mm | p90: {Z}mm
Probabilità >5mm: {P}% | Probabilità >20mm: {Q}%

**Vento max (raffica):**
Mediana: {X} km/h | p90: {Y} km/h
Probabilità >70 km/h: {P}%

**Concordanza ensemble-deterministico:**
{Alta / Media / Bassa — con spiegazione se divergono}

**Scenario peggiore (p90):** {descrizione}
**Scenario migliore (p10):** {descrizione}
**Scenario più probabile (mediana):** {descrizione}

Fonte: ECMWF ENS (51 membri) + ICON EPS EU (40 membri) + GFS ENS (31 membri)
```

---

## Note Operative

- L'Ensemble Mean API ha archivio **più lungo** del raw ensemble → utile per confronti storici
- `spread` nell'Ensemble Mean API = deviazione standard tra i membri (non p90-p10)
  → p90-p10 ≈ spread × 2.56 (per distribuzione gaussiana)
- Per precipitazioni la distribuzione è asimmetrica → non usare la gaussiana
- ECMWF ENS si aggiorna 2 volte al giorno (00 e 12 UTC) — usa il run più recente
- ICON EPS EU copre solo 5 giorni ma ha risoluzione 7km — ottimo per l'Italia a breve termine
- Il `weather_code_mean` è la moda dei weather code tra i membri — utile per scenario dominante