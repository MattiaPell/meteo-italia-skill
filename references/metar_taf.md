# METAR/TAF — Osservazioni e Previsioni Aeroportuali

Integrazione dati METAR (Meteorological Aerodrome Report) e TAF (Terminal Aerodrome Forecast) per validazione forecast vs osservato e use case aviazione/droni.

---

## Cosa Sono

### METAR
Osservazione meteorologica aeroportuale standard ICAO, emessa ogni 30 minuti (METAR regolare) o su richiesta (SPECI, condizioni significative).

**Frequenza**: ogni 30-60 min per aeroporti maggiori
**Copertura**: ~40 aeroporti italiani con codice ICAO
**Dati**: temperatura, punto di rugiada, vento, visibilità, copertura nuvolosa, pressione (QNH), fenomeni significativi

### TAF
Previsione terminale aeroportuale, emessa ogni 3-6 ore, valida per 24-30 ore.

**Frequenza**: ogni 3-6h (aggiornamento)
**Copertura**: ~20 aeroporti italiani maggiori
**Validità**: 24h (standard) o 30h (aeroporti internazionali)
**Dati**: vento, visibilità, fenomeni, nuvole previsti con cambiamenti (BECMG, TEMPO)

---

## API CheckWX (Primaria)

**Endpoint base**: `https://api.checkwx.com/v2/`
**Autenticazione**: header `X-API-KEY`
**Registrazione gratuita**: https://www.checkwxapi.com/signup
**Free tier**: 3.000 richieste/giorno
**Formato risposta**: JSON (raw, short, o decoded)

### Endpoint Utilizzati

```bash
# METAR decoded — singolo aeroporto
GET https://api.checkwx.com/v2/metar/LIRF/decoded
Headers: X-API-KEY: {YOUR_API_KEY}

# METAR decoded — multipli aeroporti (fino a 10 per richiesta)
GET https://api.checkwx.com/v2/metar/LIRF,LIMC,LIPE/decoded
Headers: X-API-KEY: {YOUR_API_KEY}

# TAF decoded — singolo aeroporto
GET https://api.checkwx.com/v2/taf/LIRF/decoded
Headers: X-API-KEY: {YOUR_API_KEY}

# TAF decoded — multipli aeroporti
GET https://api.checkwx.com/v2/taf/LIRF,LIMC/decoded
Headers: X-API-KEY: {YOUR_API_KEY}

# Info stazione
GET https://api.checkwx.com/v2/station/LIRF
Headers: X-API-KEY: {YOUR_API_KEY}
```

### Esempio Risposta METAR Decoded (LIRF — Roma Fiumicino)

```json
{
  "results": 1,
  "data": [
    {
      "icao": "LIRF",
      "observed": "2026-05-19T10:30:00Z",
      "raw": "LIRF 191030Z 36008KT 9999 FEW025 SCT040 22/14 Q1015 NOSIG",
      "station": {
        "icao": "LIRF",
        "name": "Roma Fiumicino",
        "latitude": 41.80,
        "longitude": 12.25,
        "elevation": 5
      },
      "temperature": {
        "celsius": 22,
        "fahrenheit": 72
      },
      "dewpoint": {
        "celsius": 14,
        "fahrenheit": 57
      },
      "wind": {
        "degrees": 360,
        "speed_kts": 8,
        "speed_mph": 9,
        "speed_kph": 15,
        "gust_kts": null
      },
      "visibility": {
        "miles": "6.21",
        "meters": "10000"
      },
      "altimeter": {
        "hg": 30.00,
        "hpa": 1015
      },
      "clouds": [
        {
          "code": "FEW",
          "base_feet_agl": 2500,
          "base_meters_agl": 762
        },
        {
          "code": "SCT",
          "base_feet_agl": 4000,
          "base_meters_agl": 1219
        }
      ],
      "weather": [],
      "flight_rules": "VFR"
    }
  ]
}
```

### Esempio Risposta TAF Decoded (LIRF)

```json
{
  "results": 1,
  "data": [
    {
      "icao": "LIRF",
      "raw": "TAF LIRF 190500Z 1906/2006 36010KT 9999 FEW030 TEMPO 1906/1909 4000 BR BECMG 1912/1915 27015G25KT",
      "forecast": [
        {
          "change_indicator": "FM",
          "time_becoming": null,
          "probability": null,
          "time_from": "2026-05-19T06:00:00Z",
          "time_to": "2026-05-20T06:00:00Z",
          "wind": {
            "degrees": 360,
            "speed_kts": 10,
            "gust_kts": null
          },
          "visibility": {
            "miles": "6.21",
            "meters": "10000"
          },
          "weather": [],
          "clouds": [
            {
              "code": "FEW",
              "base_feet_agl": 3000
            }
          ]
        },
        {
          "change_indicator": "TEMPO",
          "time_becoming": null,
          "probability": null,
          "time_from": "2026-05-19T06:00:00Z",
          "time_to": "2026-05-19T09:00:00Z",
          "wind": {
            "degrees": 360,
            "speed_kts": 10,
            "gust_kts": null
          },
          "visibility": {
            "miles": "2.49",
            "meters": "4000"
          },
          "weather": ["BR"],
          "clouds": []
        }
      ]
    }
  ]
}
```

---

## Fallback: aviationweather.gov

Quando CheckWX raggiunge il limite giornaliero o è indisponibile.

**Endpoint**: `https://aviationweather.gov/api/data/`
**Autenticazione**: nessuna
**Formato**: METAR raw (testo), non decoded

```bash
# METAR raw — singolo aeroporto
GET https://aviationweather.gov/api/data/metar?ids=LIRF&format=json

# METAR raw — multipli aeroporti
GET https://aviationweather.gov/api/data/metar?ids=LIRF,LIMC,LIPE&format=json

# TAF raw
GET https://aviationweather.gov/api/data/taf?ids=LIRF&format=json
```

**Nota**: aviationweather.gov restituisce METAR raw (es. `LIRF 191030Z 36008KT 9999 FEW025 22/14 Q1015`). L'agente AI può decodificare manualmente il formato METAR standard ICAO.

---

## Codici ICAO Aeroporti Italiani

### Nord-Ovest

| ICAO | Aeroporto | Regione | Elevazione (m) | Note |
|------|-----------|---------|----------------|------|
| LIMC | Milano Malpensa | Lombardia | 234 | Hub internazionale |
| LIML | Milano Linate | Lombardia | 107 | Urbano, nebbia frequente |
| LIME | Bergamo Orio al Serio | Lombardia | 237 | Low-cost, pianura |
| LIMF | Torino Caselle | Piemonte | 301 | Favonio frequente |
| LIMJ | Genova Sestri | Liguria | 4 | Costiero, Maccaja |
| LIMG | Albenga | Liguria | 45 | Riviera ligure |
| LIMW | Cuneo Levaldigi | Piemonte | 385 | Pianura cuneese |

### Nord-Est

| ICAO | Aeroporto | Regione | Elevazione (m) | Note |
|------|-----------|---------|----------------|------|
| LIPZ | Venezia Tessera | Veneto | 2 | Lagunare, nebbia |
| LIPX | Verona Villafranca | Veneto | 68 | Pianura veronese |
| LIPE | Bologna Borgo Panigale | Emilia-Romagna | 37 | Pianura padana |
| LIPY | Ancona Falconara | Marche | 15 | Costiero adriatico |
| LIPB | Bolzano | Alto Adige | 241 | Valle alpina, Foehn |
| LIPK | Forlì | Emilia-Romagna | 31 | Pianura romagnola |
| LIRQ | Firenze Peretola | Toscana | 42 | Conca, inversione termica |
| LIPR | Rimini | Emilia-Romagna | 12 | Costiero adriatico |
| LIPU | Padova | Veneto | 12 | Pianura veneta |

### Centro

| ICAO | Aeroporto | Regione | Elevazione (m) | Note |
|------|-----------|---------|----------------|------|
| LIRF | Roma Fiumicino | Lazio | 5 | Hub internazionale |
| LIRA | Roma Ciampino | Lazio | 130 | Urbano |
| LIRP | Pisa San Giusto | Toscana | 2 | Costiero tirrenico |
| LIRS | Grosseto | Toscana | 5 | Maremma |
| LIRZ | Perugia Sant'Egidio | Umbria | 205 | Collinare |
| LIQS | Siena Ampugnano | Toscana | 192 | Colline senesi |

### Sud e Isole

| ICAO | Aeroporto | Regione | Elevazione (m) | Note |
|------|-----------|---------|----------------|------|
| LIRN | Napoli Capodichino | Campania | 90 | Urbano, Vesuvio |
| LIBD | Bari Palese | Puglia | 54 | Costiero adriatico |
| LIBR | Brindisi Casale | Puglia | 15 | Costiero, vento forte |
| LIBP | Pescara | Abruzzo | 15 | Costiero adriatico |
| LICC | Catania Fontanarossa | Sicilia | 12 | Etna, vento forte |
| LICJ | Palermo Falcone | Sicilia | 19 | Costiero tirrenico |
| LICD | Lampedusa | Sicilia | 21 | Isola, scirocco |
| LICG | Pantelleria | Sicilia | 191 | Isola, vento forte |
| LIEE | Cagliari Elmas | Sardegna | 4 | Costiero |
| LIEA | Alghero Fertilia | Sardegna | 27 | Costiero, maestrale |
| LIEO | Olbia Costa Smeralda | Sardegna | 11 | Costiero |
| LIRG | Reggio Calabria | Calabria | 28 | Stretto di Messina |

---

## Guida Interpretazione Campi Decoded

### Temperatura e Umidità
| Campo | Significato | Soglia Significativa |
|-------|-------------|---------------------|
| `temperature.celsius` | Temperatura dell'aria a 2m | — |
| `dewpoint.celsius` | Punto di rugiada | — |
| T - Td (spread) | Differenza T - punto di rugiada | <3°C → nebbia probabile, <5°C → umidità elevata |

### Vento
| Campo | Significato | Soglia Significativa |
|-------|-------------|---------------------|
| `wind.degrees` | Direzione in gradi (0-360) | — |
| `wind.speed_kts` | Velocità in nodi | >25kt → vento forte, >35kt → raffiche significative |
| `wind.gust_kts` | Raffica massima | >30kt → attenzione, >45kt → pericolo |

### Visibilità
| Campo | Significato | Soglia Significativa |
|-------|-------------|---------------------|
| `visibility.meters` | Visibilità orizzontale | <1000m → nebbia, <5000m → foschia/nebbia leggera |
| `flight_rules` | Regole di volo | IFR → visibilità ridotta, LIFR → molto bassa |

### Nuvole
| Code | Significato | Copertura |
|------|-------------|-----------|
| SKC/CLR | Cielo sereno | 0/8 |
| FEW | Pochi | 1-2/8 |
| SCT | Sparpagliate | 3-4/8 |
| BKN | Rotte | 5-7/8 |
| OVC | Coperto | 8/8 |

**Ceiling**: base della prima nube BKN o OVC. Se <1000ft → IFR, <500ft → LIFR.

### Fenomeni Meteorologici (weather codes)
| Code | Fenomeno | Impatto |
|------|----------|---------|
| RA | Pioggia | Precipitazione in atto |
| SN | Neve | Precipitazione nevosa |
| TS | Temporale | Attività convettiva |
| FG | Nebbia | Visibilità <1000m |
| BR | Foschia | Visibilità 1000-5000m |
| DZ | Pioggerella | Precipitazione leggera |
| SHRA | Rovesci di pioggia | Precipitazione intensa intermittente |
| +TSRA | Temporale forte | Pericolo immediato |

### Pressione (QNH)
| Campo | Significato | Note |
|-------|-------------|------|
| `altimeter.hpa` | Pressione al livello del mare (hPa) | Confronta con pressure_msl dei modelli NWP |
| `altimeter.hg` | Pressione in pollici Hg | Standard aviazione USA |

### Trend TAF
| Indicatore | Significato |
|------------|-------------|
| FM (From) | Cambiamento brusco a orario specifico |
| BECMG (Becoming) | Transizione graduale |
| TEMPO (Temporary) | Condizione temporanea (≤1h) |
| PROB30/40 | Probabilità 30%/40% del fenomeno |
| NOSIG | Nessun cambiamento significativo |

---

## Come Usarlo per Validazione Forecast

### Confronto Temperatura
```
METAR T osservata: 18°C
NWP (Step A) T prevista: 21°C
Scarto: -3°C → modello sovrastima di 3°C
```
**Soglia**: scarto >2°C → applicare correzione locale al forecast pomeridiano. Scarto >4°C → modello inaffidabile per questa zona/giornata.

### Confronto Vento
```
METAR vento osservato: 360°/15kt raffiche 25kt
NWP vento previsto: 350°/10kt
Scarto: +5kt sottostimato, raffiche non previste
```
**Soglia**: scarto velocità >10kt → modello sottostima il vento. Raffiche non previste ma osservate >20kt → attenzione per strutture temporanee.

### Confronto Copertura Nuvolosa
```
METAR nuvole: BKN025 OVC040 (coperto, ceiling 2500ft)
NWP weather_code: 3 (parzialmente nuvoloso)
Divergenza: NWP sottostima la copertura
```
**Soglia**: METAR OVC ma NWP code ≤2 → modello sottostima nuvolosità. METAR SKC ma NWP code ≥4 → modello sovrastima nuvolosità.

### Confronto Visibilità (Nebbia)
```
METAR visibilità: 800m (FG - nebbia)
NWP visibility: 15000m
Divergenza: nebbia non prevista dal modello
```
**Soglia**: METAR visibilità <2000m ma NWP >5000m → nebbia non risolta dal modello. Critico per use case viabilità.

### Validazione TAF vs NWP a Breve Termine
```
TAF TEMPO 06-09: visibilità 4000m, BR (foschia mattutina)
NWP ora 07: weather_code 1 (sereno), visibilità 10000m
Convergenza: TAF più affidabile per le prime 6-12h
```
**Gerarchia**: TAF > NWP per orizzonte 0-6h su aeroporti. TAF è specifico per il punto, NWP è grigliato.

---

## Limitazioni e Note

- **CheckWX free tier**: 3.000 richieste/giorno. Per uso intensivo, ruota su aviationweather.gov (no auth, ma formato raw)
- **Copertura**: ~40 aeroporti italiani. Zone senza aeroporto → usa stazioni ARPA (Step D) come alternativa
- **Aggiornamento**: METAR ogni 30-60 min. Non è real-time istantaneo
- **Posizione**: gli aeroporti sono spesso in periferia o zone pianeggianti. Per zone montane, la differenza può essere significativa (es. Bolzano 241m vs Alpi a 2000m)
- **Codici ICAO non standard**: alcuni aeroporti minori hanno codici non ICAO (es. aviazione generale). Verificare sempre su `references/metar_taf.md` prima di usare un codice
