# Lightning Detection — DMI Open Data API

Rilevamento fulmini in tempo reale per nowcasting temporali e valutazione rischio incendi.

---

## Panoramica

Il **Danmarks Meteorologiske Institut (DMI)** fornisce un'API open data per osservazioni di fulmini in Europa, inclusa l'Italia. Nessun requisito di autenticazione.

**Copertura**: Europa (Italia inclusa)
**Aggiornamento**: near-real-time (~1-5 min di ritardo)
**Formato**: GeoJSON FeatureCollection
**Autenticazione**: nessuna
**Rate limit**: ~60 req/min (stimato)

---

## API DMI Open Data

### Endpoint Principale

```http
GET https://opendataapi.dmi.dk/data/observations/lightning
  ?limit={N}
  &bbox={W},{S},{E},{N}
```

### Bounding Box Pre-calcolati per Macroaree Italiane

| Macroarea | Bounding Box | Copertura |
|-----------|-------------|-----------|
| **Nord Italia** | `bbox=6.5,44.0,14.0,47.0` | Alpi, Pianura Padana, Liguria, Nord-Est |
| **Centro Italia** | `bbox=9.0,41.0,14.5,44.5` | Toscana, Umbria, Marche, Lazio, Abruzzo |
| **Sud Italia e Isole** | `bbox=7.5,36.5,18.5,42.0` | Campania, Puglia, Calabria, Sicilia, Sardegna |
| **Italia intera** | `bbox=6.5,36.5,18.5,47.0` | Tutto il territorio nazionale |

### Esempi di Richiesta

```bash
# Fulmini nel Nord Italia (ultimi 1000)
GET https://opendataapi.dmi.dk/data/observations/lightning?limit=1000&bbox=6.5,44.0,14.0,47.0

# Fulmini in Centro Italia (ultimi 500)
GET https://opendataapi.dmi.dk/data/observations/lightning?limit=500&bbox=9.0,41.0,14.5,44.5

# Trend: fulmini negli ultimi 15 minuti (confronto con fetch precedente)
GET https://opendataapi.dmi.dk/data/observations/lightning?limit=1000&bbox=6.5,36.5,18.5,47.0&observed_after=2026-05-19T10:15:00Z
```

### Struttura Risposta (GeoJSON)

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [12.4964, 41.9028]
      },
      "properties": {
        "amp": -15.5,
        "created": "2026-05-19T10:30:00Z",
        "observed": "2026-05-19T10:29:58Z",
        "sensors": "1,2,3,6",
        "strokes": 1,
        "type": 1
      }
    }
  ]
}
```

### Campi Chiave

| Campo | Tipo | Descrizione | Utilizzo Nowcasting |
|-------|------|-------------|---------------------|
| `geometry.coordinates` | [lon, lat] | Posizione del fulmine | Calcolo distanza da punto target |
| `properties.amp` | float | Intensità in kiloampere (kA), negativo = nube-suolo | Valore assoluto >20kA → fulmine intenso |
| `properties.observed` | timestamp | Ora di osservazione (RFC3339, UTC) | Clustering temporale |
| `properties.strokes` | int | Numero di colpi (multi-stroke) | >1 → fulmine complesso, più pericoloso |
| `properties.sensors` | string | ID stazioni che hanno rilevato | Più sensori = maggiore accuratezza |
| `properties.type` | int | 1 = nube-suolo, 2 = nube-nube | Type 1 = più pericoloso per persone/strutture |

---

## Guida Nowcasting Temporali

### 1. Densità Fulmini

Calcola il numero di fulmini per unità di area e tempo:

```
Densità = N_fulmini / (Area_km² × Tempo_min)
```

| Densità | Classificazione | Azione |
|---------|----------------|--------|
| <1 fulmine/50km²/15min | Attività isolata | Monitorare |
| 1-5 fulmini/50km²/15min | Temporale moderato | Allerta moderata |
| 5-10 fulmini/50km²/15min | Temporale attivo | Allerta elevata |
| >10 fulmini/50km²/15min | Temporale intenso | Pericolo immediato |
| >20 fulmini/50km²/15min | Temporale severo | Emergenza |

### 2. Trend Temporale

Confronta il conteggio fulmini negli ultimi 15 min con il conteggio nei 15 min precedenti:

| Trend | Interpretazione |
|-------|-----------------|
| +50% o più | Intensificazione — il temporale si sta rafforzando |
| ±50% | Stabile — il temporale è nella fase matura |
| -50% o più | Dissolvimento — il temporale si sta indebolendo |
| 0 → N fulmini | Inizio attività — il temporale si sta formando |

### 3. Integrazione con Altri Dati

#### Fulmini + CAPE (Step A)
| CAPE | Fulmini | Interpretazione |
|------|---------|-----------------|
| >1500 J/kg | >10/15min | Supercella probabile — grandine intensa, vento distruttivo |
| 800-1500 J/kg | 5-10/15min | Temporale convettivo organizzato |
| <800 J/kg | <5/15min | Temporale debole o isolato |

#### Fulmini + Radar DPC (Step I)
| Radar VIL | Fulmini | Interpretazione |
|-----------|---------|-----------------|
| >25 kg/m² | >10/15min | Grandine probabile (probabilità >70%) |
| >15 kg/m² | 5-10/15min | Pioggia intensa, possibile grandine |
| <15 kg/m² | >10/15min | Temporale elettrico, poca pioggia |

#### Fulmini + Precipitazioni (Step A)
| Precipitazione prevista | Fulmini osservati | Interpretazione |
|------------------------|-------------------|-----------------|
| >10mm/h | Sì | Convergenza — temporale confermato |
| >10mm/h | No | Possibile ritardo del temporale (1-2h) |
| <5mm/h | >10/15min | Dry lightning — rischio incendi |

### 4. Dry Lightning (Fulmini Secchi)

Fulmini senza precipitazione significativa al suolo. Critico per il rischio incendi.

**Condizioni di attivazione:**
- Fulmini >5/15min in area
- Precipitazioni osservate (ARPA/Step D) <1mm nell'ultima ora
- UR <40% (aria secca)
- T >30°C (estate)

**Impatto:** rischio incendi elevato — segnalare esplicitamente nel report.

### 5. Distanza dal Punto Target

Calcola la distanza dal punto target usando la formula di Haversine:

```
Distanza (km) = 6371 × arccos(sin(lat1)×sin(lat2) + cos(lat1)×cos(lat2)×cos(lon2-lon1))
```

| Distanza | Classificazione |
|----------|-----------------|
| <5 km | Fulmine molto vicino — pericolo immediato |
| 5-15 km | Fulmine vicino — temporale in zona |
| 15-30 km | Fulmine nelle vicinanze — temporale in avvicinamento/allontanamento |
| >30 km | Fulmine lontano — temporale distante |

### 6. Direzione di Movimento

Confronta la posizione dei fulmini nei ultimi 15 min con quella dei 15-30 min precedenti:

```
Vettore movimento = Centroide(t-15min) - Centroide(t-30min)
Velocità = Distanza / 15min × 60 (km/h)
```

Integra con il vento a 850hPa (Step A) per verificare la coerenza della direzione.

---

## Alternative API

### Blitzortung.org
- **Accesso**: richiede possesso di una stazione di rilevamento (hardware)
- **Copertura**: globale, buona in Europa
- **Formato**: JSON
- **Nota**: non adatto per uso generico senza stazione propria

### Meteomatics
- **Accesso**: commerciale (API key a pagamento)
- **Copertura**: globale
- **Formato**: JSON
- **Endpoint**: `https://api.meteomatics.com/.../lightning_strikes`
- **Nota**: alternativa se DMI API diventa indisponibile

### EUMETSAT MTG-LI (Lightning Imager)
- **Accesso**: richiede registrazione EUMETSAT
- **Copertura**: Europa + Mediterraneo
- **Formato**: NetCDF (dati grigliati, complessi da processare)
- **Nota**: futuro — satellite MTG non ancora pienamente operativo

---

## Limitazioni e Note

- **DMI API pubblica**: nessuna autenticazione richiesta, ma l'endpoint potrebbe cambiare senza preavviso. Monitorare la disponibilità
- **Precisione localizzazione**: ±1-5 km (dipende dalla densità della rete di sensori)
- **Copertura**: migliore nel Nord/Centro Europa, leggermente ridotta nel Sud Italia
- **Aggiornamento**: near-real-time, non istantaneo. Ritardo tipico 1-5 minuti
- **Tipo di fulmine**: l'API non distingue sempre tra nube-suolo e nube-nube. Usare `properties.type` quando disponibile
- **Storico**: l'API fornisce solo dati recenti (ultime ore). Per analisi storiche, usare i dati CAPE/cape_spread (Step A/J) come proxy dell'attività convettiva
