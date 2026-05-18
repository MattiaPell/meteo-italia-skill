# Modelli Meteo Open-Meteo — Riferimento Completo

## Modelli Core Europa/Italia

| ID API | Nome | Risoluzione | Copertura | Aggiorn. | Giorni prev. | Peso Italia |
|--------|------|-------------|-----------|----------|--------------|-------------|
| `ecmwf_ifs025` | ECMWF IFS 0.25° | 25 km | Globale | 6h | 10 | ★★★★★ |
| `ecmwf_ifs_analysis_long_window` | ECMWF IFS HRES 9km | 9 km | Globale | 6h | 10 | ★★★★★ |
| `icon_seamless` | DWD ICON Seamless | 2–13 km | Globale+EU | 1-3h | 7–16 | ★★★★★ |
| `icon_global` | DWD ICON Global | 13 km | Globale | 6h | 16 | ★★★★ |
| `icon_eu` | DWD ICON EU | 7 km | Europa | 3h | 5 | ★★★★★ |
| `icon_d2` | DWD ICON D2 | 2 km | Europa Centrale | 1h | 2 | ★★★★★ |
| `italia_meteo_arpae_icon_2i` | ItaliaMeteo ARPAE ICON 2I | 2.2 km | Italia | 1h | 5 | ★★★★★ |
| `meteofrance_seamless` | Météo-France Seamless | 1.3–40 km | Globale+EU | 1-6h | 4–15 | ★★★★ |
| `arpege_europe` | Météo-France ARPEGE Europe | 11 km | Europa | 3h | 4 | ★★★★ |
| `arome_france` | Météo-France AROME France | 2.5 km | Francia+vicini | 1h | 2 | ★★★ |

## Modelli Globali

| ID API | Nome | Risoluzione | Copertura | Aggiorn. | Giorni prev. | Peso Italia |
|--------|------|-------------|-----------|----------|--------------|-------------|
| `gfs_seamless` | NCEP GFS Seamless | 11–22 km | Globale | 1h | 16 | ★★★★ |
| `gfs025` | NCEP GFS 0.25° | 25 km | Globale | 6h | 16 | ★★★ |
| `ecmwf_aifs025` | ECMWF AIFS (AI model) | 25 km | Globale | 6h | 10 | ★★★★ |
| `gfs_graphcast025` | NCEP GFS GraphCast | 25 km | Globale | 6h | 10 | ★★★ |
| `gem_seamless` | GEM Canada Seamless | 2.5–15 km | Globale | 3-6h | 16 | ★★★ |
| `cma_grapes_global` | CMA GRAPES Global | 15 km | Globale | 6h | 15 | ★★ |
| `bom_access_global` | BOM Australia Global | 15 km | Globale | 6h | 10 | ★★ |
| `jma_seamless` | JMA Seamless | 5–55 km | Globale | 3-6h | 11 | ★★ |

## Modelli Regionali Europei Aggiuntivi

| ID API | Nome | Copertura | Peso Europa |
|--------|------|-----------|-------------|
| `knmi_seamless` | KNMI Seamless | Europa | ★★★★ |
| `knmi_harmonie_arome_europe` | KNMI Harmonie AROME EU | Europa | ★★★★ |
| `dmi_seamless` | DMI Seamless | Europa | ★★★ |
| `dmi_harmonie_arome_europe` | DMI Harmonie AROME EU | Europa | ★★★ |
| `metno_seamless` | MET Norway Nordic | Scandinavia+EU | ★★★ |
| `ukmo_seamless` | UK Met Office Seamless | Globale | ★★★ |
| `meteoswiss_icon_seamless` | MeteoSwiss ICON Seamless | Svizzera+vicini | ★★★★ |
| `geosphere_seamless` | GeoSphere Austria | Austria+vicini | ★★★ |

---

## Selezione Rapida per Regione

### Italia (qualsiasi zona)
**Core set (sempre):**
```
italia_meteo_arpae_icon_2i, icon_d2, icon_eu, icon_seamless, ecmwf_ifs025, meteofrance_seamless, gfs_seamless
```
**Extra per alta incertezza o outlook >5 giorni:**
```
ecmwf_aifs025, gem_seamless, arpege_europe
```

### Italia Nord-Ovest (Liguria, Piemonte, Valle d'Aosta)
Aggiungi: `arome_france`, `meteoswiss_icon_seamless`

### Italia Nord-Est (Veneto, Trentino, FVG)
Aggiungi: `meteoswiss_icon_seamless`, `geosphere_seamless`

### Europa Centrale
**Core:** `icon_seamless`, `icon_eu`, `ecmwf_ifs025`, `knmi_seamless`, `gfs_seamless`

### Europa Nord
Aggiungi: `metno_seamless`, `dmi_seamless`

### Fuori Europa
**Core:** `ecmwf_ifs025`, `gfs_seamless`, `ecmwf_aifs025`, `gem_seamless`

---

## Modelli Ensemble (per stime probabilistiche)

Endpoint separato: `https://ensemble-api.open-meteo.com/v1/ensemble`

| ID API | Membri | Giorni prev. |
|--------|--------|--------------|
| `ecmwf_ifs025` | 51 | 15 |
| `gfs025` | 31 | 35 |
| `icon_eu` | 40 | 7.5 |
| `gem_global` | 21 | 35 |
| `bom_access_global` | 18 | 10 |

Usa l'ensemble API per domande tipo "qual è la probabilità di evento estremo?" o previsioni >7 giorni.

---

## Pesi per Consensus Ponderato (Italia)

Applica questi pesi quando calcoli il consensus:

| Modello | Peso |
|---------|------|
| `italia_meteo_arpae_icon_2i` | 1.5 (modello nazionale) |
| `icon_d2` | 1.3 (alta risoluzione locale) |
| `ecmwf_ifs025` / HRES | 1.3 (riferimento globale) |
| `icon_eu` | 1.0 |
| `icon_seamless` | 1.0 |
| `meteofrance_seamless` | 0.9 |
| `gfs_seamless` | 0.8 |
| modelli AI (aifs, graphcast) | 0.7 |
| altri globali | 0.6 |