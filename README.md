# meteo-italia-skill ⛅

Skill per **analisi comparativa multi-modello delle previsioni meteo** specializzata per l'Italia. Integra modelli numerici, osservazioni ARPA, allerte Protezione Civile e climatologia di riferimento.

## Funzionalità

- **Multi-modello**: confronta simultaneamente ECMWF, ICON, GFS, MeteoFrance, DWD, MetOffice, GEM, JMA su Open-Meteo API
- **Geocoding** automatico città italiane con discriminazione omonimi via admin1
- **Fenomeni locali**: riconoscimento automatico di foehn, bora, scirocco, tramontana, libeccio, grandine padana, neve appenninica, temporali adriatici
- **Allerte Protezione Civile** integrate per regione
- **Qualità dell'aria** via CAMS (Open-Meteo)
- **Matrice affidabilità** contestuale per tipo di evento × orizzonte temporale
- **Bias noti** dei modelli sul territorio italiano, calibrati per macroarea

## Struttura

```
meteo-italia-skill/
├── SKILL.md                    # Skill principale (flusso di lavoro completo)
└── references/
    ├── models.md               # Modelli meteo Open-Meteo — coverage, risoluzione, update
    ├── model_bias.md           # Bias sistematici documentati per modello e stagione
    ├── italy_zones.md          # Macroaree italiane → set modelli + pesi configurabili
    ├── arpa_network.md         # Rete ARPA/ARPAS — endpoint osservativi regionali
    ├── climatology.md          # Climatologia ERA5 — benchmark e valori di riferimento
    ├── ensemble_spread.md      # Spread ensemble — incertezza probabilistica
    ├── event_reliability.md    # Affidabilità forecast per evento e orizzonte
    ├── local_phenomena.md      # Flag automatici per fenomeni italiani
    ├── air_quality.md          # Qualità dell'aria — CAMS + Open-Meteo AQ API
    └── italian_portals.md      # Portali meteo italiani di fallback
```

## Modelli Supportati

| Modello | Ente | Copertura | Risoluzione |
|---------|------|-----------|-------------|
| ECMWF IFS | Centro Europeo | Globale | 9 km |
| ICON | DWD (Germania) | Globale + EU | 13 km / 7 km |
| GFS | NOAA (USA) | Globale | 13 km |
| GEFS | NOAA (USA) | Globale ensemble | 25 km |
| Arpège | Météo France | Globale + EU | 10 km / 5 km |
| AROME | Météo France | EU + Francia | 2.5 km |
| ICON-EU | DWD (Germania) | Europa | 7 km |
| MetOffice | UK Met Office | Globale | 10 km |
| GEM | Canada | Globale | 15 km |
| JMA | Giappone | Globale | 20 km |

## Trigger

Domande meteo sull'Italia: previsioni, confronto modelli, affidabilità forecast, allerte, fenomeni locali. Qualsiasi città/regione italiana.

## Licenza

MIT
