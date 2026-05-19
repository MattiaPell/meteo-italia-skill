# Macroaree Italia — Modelli e Pesi

## Nord-Ovest (Piemonte, Valle d'Aosta, Liguria, Lombardia occidentale)

**Modelli:**
```
italia_meteo_arpae_icon_2i, icon_d2, icon_seamless, meteoswiss_icon_seamless,
ecmwf_ifs, arome_france, gfs_seamless
```

**Pesi consensus:**
| Modello | Peso |
|---------|------|
| `icon_d2` | 1.4 |
| `ecmwf_ifs` | 1.3 |
| `meteoswiss_icon_seamless` | 1.3 |
| `italia_meteo_arpae_icon_2i` | 1.2 |
| `icon_seamless` | 1.0 |
| `arome_france` | 0.9 |
| `gfs_seamless` | 0.7 |

**Fenomeni locali prioritari:** Foehn (versante alpino S), stau Alpi Marittime/Liguri, temporali convettivi estivi, neve oltre 600m (inverno), cuscino freddo, gelicidio (Appennino Ligure/Piemontese), Caligo (costa ligure, primavera).

**Note:** La Liguria ha dinamiche molto diverse da Piemonte — la costa ligure è esposta a libeccio e riceve precipitazioni intense dai sistemi atlantici. Usare `arome_france` per la fascia costiera.

---

## Nord-Est (Veneto, Friuli-Venezia Giulia, Trentino-Alto Adige, Lombardia orientale)

**Modelli:**
```
italia_meteo_arpae_icon_2i, icon_d2, icon_seamless, meteoswiss_icon_seamless,
geosphere_seamless, ecmwf_ifs, gfs_seamless
```

**Pesi consensus:**
| Modello | Peso |
|---------|------|
| `italia_meteo_arpae_icon_2i` | 1.5 |
| `icon_d2` | 1.4 |
| `ecmwf_ifs` | 1.2 |
| `meteoswiss_icon_seamless` | 1.2 |
| `geosphere_seamless` | 1.1 |
| `icon_seamless` | 1.0 |
| `gfs_seamless` | 0.7 |

**Fenomeni locali prioritari:** Bora (Trieste, Gorizia, Udine — raffiche >100 km/h), foehn (valli alpine), nebbia padana (Veneto pianura, Rovigo, Ferrara), temporali adriatici (Venezia, costa), neve in pianura, cuscino freddo, [Acqua Alta](local_phenomena.md#acqua-alta-venezia--alto-adriatico) (Venezia), alluvioni Mestre/Venezia.

**Note:** La Bora è il fenomeno più caratteristico e pericoloso. Segnalarla sempre quando: vento da ENE >40 km/h a Trieste + pressione in calo. ARPAE ICON 2I è il modello nazionale e ha risoluzione 2.2km — priorità assoluta per eventi intensi in questa zona.

---

## Centro-Nord (Emilia-Romagna, Toscana, Marche settentrionali)

**Modelli:**
```
italia_meteo_arpae_icon_2i, icon_seamless, icon_eu, ecmwf_ifs,
meteofrance_seamless, gfs_seamless
```

**Pesi consensus:**
| Modello | Peso |
|---------|------|
| `italia_meteo_arpae_icon_2i` | 1.5 |
| `ecmwf_ifs` | 1.3 |
| `icon_eu` | 1.1 |
| `icon_seamless` | 1.0 |
| `meteofrance_seamless` | 0.9 |
| `gfs_seamless` | 0.7 |

**Fenomeni locali prioritari:** Temporali convettivi su Appennino Tosco-Emiliano (estate), nebbia padana (pianura emiliana ottobre-febbraio), tramontana su Toscana tirrenica, alluvioni vallate appenniniche (autunno), cuscino freddo, gelicidio (versante emiliano), neve oltre 400m (inverno).

---

## Centro (Lazio, Umbria, Marche meridionali, Abruzzo)

**Modelli:**
```
ecmwf_ifs, icon_seamless, meteofrance_seamless,
arpege_europe, gfs_seamless, icon_eu
```

**Pesi consensus:**
| Modello | Peso |
|---------|------|
| `ecmwf_ifs` | 1.5 |
| `meteofrance_seamless` | 1.2 |
| `icon_seamless` | 1.1 |
| `arpege_europe` | 1.0 |
| `icon_eu` | 1.0 |
| `gfs_seamless` | 0.8 |

**Fenomeni locali prioritari:** Tramontana su Lazio tirrenico, grecale su Marche/Abruzzo, scirocco (Sud Lazio, Campania N), neve su Appennino centrale (frequente, impatto viabilità A24/A25), temporali estivi sui Castelli Romani.

---

## Sud (Campania, Puglia, Basilicata, Calabria, Molise)

**Modelli:**
```
ecmwf_ifs, ecmwf_aifs025, arpege_europe,
icon_seamless, gfs_seamless, meteofrance_seamless
```

**Pesi consensus:**
| Modello | Peso |
|---------|------|
| `ecmwf_ifs` | 1.5 |
| `ecmwf_aifs025` | 1.2 |
| `arpege_europe` | 1.2 |
| `gfs_seamless` | 1.0 |
| `icon_seamless` | 0.9 |
| `meteofrance_seamless` | 0.9 |

**Fenomeni locali prioritari:** Scirocco (intenso, polvere sahariana), grecale su Adriatico meridionale, temporali convettivi estivi (violenti, grandine su Puglia), tramontana su Calabria tirrenica, neve su Sila/Aspromonte/Pollino (impatto viabilità), Lupa di mare (Stretto, primavera).

---

## Sicilia

**Modelli:**
```
ecmwf_ifs, ecmwf_aifs025, arpege_europe,
gfs_seamless, meteofrance_seamless
```

**Pesi consensus:**
| Modello | Peso |
|---------|------|
| `ecmwf_ifs` | 1.6 |
| `ecmwf_aifs025` | 1.3 |
| `arpege_europe` | 1.2 |
| `gfs_seamless` | 1.0 |
| `meteofrance_seamless` | 0.8 |

**Fenomeni locali prioritari:** Scirocco intenso (sabbia dal Sahara, visibilità ridotta, T >40°C in estate), grecale su versante orientale (Catania, Messina), temporali di Tramontana sui Nebrodi/Madonie, neve sull'Etna (tutto l'anno oltre 2000m), alluvioni improvvise (ottobre-novembre), Lupa di mare (Stretto, primavera).

**Nota:** ARPAE ICON 2I ha copertura ridotta sulla Sicilia — usa ECMWF come riferimento principale.

---

## Sardegna

**Modelli:**
```
ecmwf_ifs, ecmwf_aifs025, meteofrance_seamless,
arpege_europe, gfs_seamless
```

**Pesi consensus:**
| Modello | Peso |
|---------|------|
| `ecmwf_ifs` | 1.5 |
| `ecmwf_aifs025` | 1.3 |
| `meteofrance_seamless` | 1.2 |
| `arpege_europe` | 1.0 |
| `gfs_seamless` | 0.9 |

**Fenomeni locali prioritari:** Maestrale (forte e frequente, raffiche 80-100 km/h), scirocco, temporali su Gennargentu (estate), alluvioni Campidano (autunno — evento estremo ottobre 2018 e 2024), siccità estiva severa.

---

## Costa Adriatica (da Trieste a Bari)

**Modelli:**
```
italia_meteo_arpae_icon_2i, icon_d2, icon_seamless, knmi_seamless,
ecmwf_ifs, gfs_seamless
```

**Pesi consensus:**
| Modello | Peso |
|---------|------|
| `italia_meteo_arpae_icon_2i` | 1.4 |
| `icon_d2` | 1.3 |
| `ecmwf_ifs` | 1.2 |
| `knmi_seamless` | 1.1 |
| `icon_seamless` | 1.0 |
| `gfs_seamless` | 0.8 |

**Fenomeni locali prioritari:** Bora (versante nord), grecale (versante sud), temporali adriatici da convergenza (autunno), [Acqua Alta](local_phenomena.md#acqua-alta-venezia--alto-adriatico) a Venezia (Bora + Scirocco + Sessa).

---

## Alpi (tutte le catene alpine italiane)

**Modelli:**
```
icon_d2, meteoswiss_icon_seamless, geosphere_seamless,
italia_meteo_arpae_icon_2i, ecmwf_ifs, icon_seamless
```

**Pesi consensus:**
| Modello | Peso |
|---------|------|
| `icon_d2` | 1.5 |
| `meteoswiss_icon_seamless` | 1.4 |
| `ecmwf_ifs` | 1.2 |
| `geosphere_seamless` | 1.2 |
| `italia_meteo_arpae_icon_2i` | 1.1 |
| `icon_seamless` | 0.9 |

**Fenomeni locali prioritari:** Foehn (Val d'Aosta, Alto Adige), stau alpino (piogge intense versante S in flusso da S/SW), temporali convettivi estivi (pericolosi in quota), valanghe (segnala se neve fresca >30cm + vento), quota neve variabile.

**Nota:** Per quote >2000m usa sempre `elevation={quota}` nella chiamata API per avere dati corretti. La temperatura scende di ~6.5°C ogni 1000m.

---

## Appennino (catena appenninica, tutte le regioni)

**Modelli:**
```
ecmwf_ifs, icon_eu, icon_seamless, italia_meteo_arpae_icon_2i,
meteofrance_seamless, gfs_seamless
```

**Pesi consensus:**
| Modello | Peso |
|---------|------|
| `ecmwf_ifs` | 1.4 |
| `icon_eu` | 1.2 |
| `italia_meteo_arpae_icon_2i` | 1.2 (Nord App.) / 0.9 (Sud App.) |
| `icon_seamless` | 1.0 |
| `meteofrance_seamless` | 0.9 |
| `gfs_seamless` | 0.8 |

**Fenomeni locali prioritari:** Neve oltre 600m (frequente ottobre-aprile), stau appenninico (piogge intense su versante sopravvento), isolamento di paesi in quota, temporali convettivi estivi con grandine.

---

## Riferimenti Incrociati

- Fenomeni locali dettagliati → `local_phenomena.md`
- Bias dei modelli per zona → `model_bias.md`
- Affidabilità per tipo evento → `event_reliability.md`
- Rete ARPA regionale → `arpa_network.md`
- Valori climatologici di riferimento → `climatology.md`