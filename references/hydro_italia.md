# Dati Idrologici Italia — Fiumi, Livelli e Rischio Alluvioni

Monitoraggio idrometrico in tempo reale e fonti di contesto per valutazione rischio alluvioni.

---

## Panoramica

La copertura di dati idrologici in tempo reale in Italia è frammentata per regione. Il Trentino-Alto Adige dispone di un'API open data completa e strutturata. Per il resto d'Italia, i dati sono disponibili tramite portali regionali (varia per regione) o fonti previsionali europee (EFAS).

---

## Fonte Primaria: floods.it (Trentino-Alto Adige)

**Ente**: Provincia Autonoma di Trento
**Copertura**: bacini Adige, Brenta, Sarca, Chiese (Trentino-Alto Adige)
**Aggiornamento**: 15 minuti (real-time)
**Autenticazione**: nessuna (open data)
**Licenza**: CC BY 4.0

### API Endpoints

```bash
# Catalogo stazioni (GeoJSON)
GET https://www.floods.it/api/v1/monitoring/index.json

# Catalogo stazioni (CSV)
GET https://www.floods.it/api/v1/monitoring/index.csv

# Dati singola stazione (JSON)
GET https://www.floods.it/api/v1/monitoring/{sensor_id}.json

# Dati singola stazione (CSV)
GET https://www.floods.it/api/v1/monitoring/{sensor_id}.json
```

### Esempio Risposta (Catalogo GeoJSON)

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [11.1217, 46.0679]
      },
      "properties": {
        "id": "ADIGE_TRENTO",
        "name": "Adige a Trento",
        "parameter": "livello_idrometrico",
        "unit": "m",
        "basin": "Adige",
        "last_update": "2026-05-19T10:00:00Z"
      }
    }
  ]
}
```

### Esempio Risposta (Dati Stazione JSON)

```json
{
  "sensor_id": "ADIGE_TRENTO",
  "name": "Adige a Trento",
  "parameter": "livello_idrometrico",
  "unit": "m",
  "data": [
    {
      "timestamp": "2026-05-19T10:00:00Z",
      "value": 2.45
    },
    {
      "timestamp": "2026-05-19T09:45:00Z",
      "value": 2.42
    }
  ],
  "thresholds": {
    "green": 2.00,
    "yellow": 3.00,
    "red": 4.00
  }
}
```

### Stazioni Principali

| ID | Fiume | Località | Bacino | Soglia Gialla (m) | Soglia Rossa (m) |
|----|-------|----------|--------|-------------------|------------------|
| ADIGE_TRENTO | Adige | Trento | Adige | 3.00 | 4.00 |
| ADIGE_ROVERETO | Adige | Rovereto | Adige | 2.80 | 3.80 |
| BRENTA_BASSANO | Brenta | Bassano del Grappa | Brenta | 3.50 | 4.50 |
| SARCA_ARCO | Sarca | Arco | Sarca | 2.00 | 3.00 |
| CHIESE_LAGO | Chiese | Lago di Ledro | Chiese | 1.50 | 2.50 |

---

## Fonte Secondaria: ISPRA Nazionale

**Ente**: Istituto Superiore per la Protezione e la Ricerca Ambientale
**Copertura**: nazionale
**Tipo dati**: storico e aggregato (non real-time)

### Portale IdroGEO

- **URL**: https://idrogeo.isprambiente.it/
- **API**: https://idrogeo.isprambiente.it/api/
- **Dati disponibili**: frane, alluvioni storiche, dissesto idrogeologico
- **Formato**: JSON/GeoJSON
- **Utilizzo**: contesto storico del rischio idrogeologico, non osservazioni in tempo reale

### Annuario Dati Idrologici

- **URL**: https://www.isprambiente.gov.it/it/pubblicazioni/annuari
- **Dati disponibili**: serie storiche di precipitazioni, portate, livelli idrometrici
- **Utilizzo**: benchmark e climatologia idrologica

### Limitazioni ISPRA

ISPRA non fornisce un'API real-time per i livelli idrometrici. I dati sono:
- Storici (annuari, pubblicazioni)
- Aggregati (statistiche regionali)
- Non adatti per nowcasting alluvioni

Per dati real-time fuori Trentino, usare le fonti regionali o EFAS (vedi sotto).

---

## Fonte Terziaria: EFAS (European Flood Awareness System)

**Ente**: Copernicus Emergency Management Service / ECMWF
**Copertura**: Europa (Italia inclusa)
**Tipo dati**: previsioni probabilistiche di piena (non osservazioni)
**Aggiornamento**: 2 volte al giorno
**Autenticazione**: registrazione gratuita (Copernicus Data Space)

### Accesso

- **Portale**: https://www.efas.eu/
- **API**: https://efas-api.ecmwf.int/ (richiede autenticazione ECMWF)
- **Dati disponibili**:
  - Short-range ensemble forecast (SREF) — 10 giorni
  - Medium-range ensemble forecast (MREF) — 30 giorni
  - Flood maps probabilistici

### Utilizzo nella Skill

EFAS è utile come **contesto previsionale** per il rischio alluvioni:
- Se EFAS indica probabilità >50% di piena per un bacino → allerta preventiva
- Combinare con precipitazioni previste (Step A) per scenario peggiorativo
- Non usare come sostituto di osservazioni real-time (non lo sono)

---

## Guida Interpretazione

### Soglie di Livello Idrometrico

Ogni stazione ha soglie specifiche (verde/giallo/rosso). In generale:

| Livello | Significato | Azione |
|---------|-------------|--------|
| **Verde** (< soglia verde) | Normale | Nessun allarme |
| **Giallo** (tra verde e giallo) | Attenzione | Monitorare trend |
| **Arancione** (tra giallo e rosso) | Pre-allerta | Preparazione |
| **Rosso** (> soglia rossa) | Allerta | Pericolo immediato |

### Combinazione con Dati Meteo

#### Scenario 1: Pioggia Prevista + Livello Alto
```
Livello attuale: 2.8m (soglia gialla: 3.0m)
Precipitazioni previste (Step A): >30mm/24h
→ Scenario peggiorativo: livello supererà soglia gialla
```

#### Scenario 2: Suolo Saturo + Pioggia
```
Soil moisture (Step A): >0.35 m³/m³ (suolo saturo)
Precipitazioni previste: >50mm/24h
→ Rischio elevato: deflusso superficiale rapido, possibile piena lampo
```

#### Scenario 3: Trend in Salita
```
Livello 6h fa: 2.2m
Livello 3h fa: 2.5m
Livello attuale: 2.8m
→ Trend: +0.6m in 6h → livello in rapida salita
```

### Classificazione Rischio Alluvione

| Condizioni | Classificazione |
|------------|-----------------|
| Livello < verde + pioggia prevista <10mm/24h | Basso |
| Livello verde-giallo + pioggia 10-30mm/24h | Moderato |
| Livello giallo + pioggia >30mm/24h | Elevato |
| Livello rosso + pioggia >50mm/24h + suolo saturo | Critico |
| EFAS probabilità piena >50% + condizioni sopra | Emergenza |

---

## Fonti Regionali Alternative

Per regioni fuori Trentino, consultare i portali regionali:

| Regione | Ente | URL Dati |
|---------|------|----------|
| Veneto | ARPAV | https://www.arpa.veneto.it/dati-ambientali/dati-in-tempo-reale/idro |
| Lombardia | ARPA Lombardia | https://www.dati.lombardia.it (CKAN) |
| Emilia-Romagna | ARPAE | https://dati.arpaee.it/ |
| Toscana | SIR (Sistema Idrologico Regionale) | https://www.sir.toscana.it/ |
| Lazio | Regione Lazio | https://www.regione.lazio.it/ambiente/acqua |
| Piemonte | ARPA Piemonte | https://www.arpa.piemonte.it/opendata |

**Nota**: questi portali non hanno API REST standardizzate. Spesso richiedono scraping o accesso a dati CSV/Excel.

---

## Limitazioni e Note

- **Copertura real-time limitata**: solo Trentino-Alto Adige ha un'API open data completa e strutturata
- **Per il resto d'Italia**: usare precipitazioni ARPA (Step D) + allerta PC (Step E) + EFAS previsionale come proxy
- **Soglie variabili**: ogni stazione ha soglie diverse — non usare valori assoluti, sempre confrontare con le soglie specifiche della stazione
- **Aggiornamento**: floods.it aggiorna ogni 15 minuti. Non è istantaneo
- **Storico**: per analisi storiche del rischio idrogeologico, usare ISPRA IdroGEO
