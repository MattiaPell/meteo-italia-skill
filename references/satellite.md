---
source: "Mixed"
last_verified: "2026-05-28"
confidence: "medium"
verification_needed:
  - "Endpoint API"
  - "Soglie operative"
  - "ID stazioni"
---

# Immagini Satellite Meteosat — Validazione Visiva Nowcasting

Immagini satellitari per validazione visiva del contesto sinottico, nebbia, fronti e sistemi convettivi.

---

## Panoramica

Le immagini satellitari Meteosat forniscono una vista dall'alto della copertura nuvolosa su scala sinottica e mesoscala. Utili per validare visivamente le previsioni NWP e il nowcasting radar.

**Copertura**: Europa, Atlantico, Africa (Meteosat Second Generation)
**Aggiornamento**: 15 minuti (SEVIRI), 5 minuti (Rapid Scanning)
**Risoluzione**: 1-3 km (dipende dal canale)
**Canali**: 12 bande spettrali (visibile, infrarosso, vapore acqueo)

---

## Fonte Primaria: EUMETSAT Data Store

**Ente**: European Organisation for the Exploitation of Meteorological Satellites
**Copertura**: globale (Meteosat per Europa/Africa, Himawari per Asia, GOES per Americhe)
**Autenticazione**: registrazione gratuita richiesta
**Formato**: NetCDF/HRIT (dati grezzi), PNG/JPG (immagini processate)

### Registrazione

1. Creare account su [EUMETSAT Earth Observation Portal](https://eoportal.eumetsat.int/)
2. Ottenere API credentials su https://api.eumetsat.int/api-key/
3. Ricevere `CONSUMER_KEY` e `CONSUMER_SECRET`

### Collection Principale per Cloud Imagery

**Collection ID**: `EO:EUM:DAT:MSG:HRSEVIRI`
- High Rate SEVIRI Level 1.5 Image Data
- 12 canali spettrali (visibile + infrarosso)
- Refresh 15 minuti
- Copertura: Europa, Atlantico, Africa

### Canali Utili per l'Analisi

| Canale | Lunghezza d'onda | Utilizzo |
|--------|-----------------|----------|
| **VIS0.6** | 0.6 μm (visibile) | Nuvole diurne, spessore ottico |
| **VIS0.8** | 0.8 μm (visibile) | Vegetazione, nuvole |
| **NIR1.6** | 1.6 μm (near-IR) | Discriminazione ghiaccio/acqua nelle nuvole |
| **IR3.9** | 3.9 μm (IR) | Nebbia notturna (differenza con IR10.8), incendi |
| **WV6.2** | 6.2 μm (vapore acqueo) | Umidità alta atmosfera, jet stream |
| **WV7.3** | 7.3 μm (vapore acqueo) | Umidità media atmosfera |
| **IR8.7** | 8.7 μm (IR) | Dust sahariano, aerosol |
| **IR9.7** | 9.7 μm (IR) | Ozono stratosferico |
| **IR10.8** | 10.8 μm (IR) | **Canale principale** — nuvole giorno/notte, temperatura tops |
| **IR12.0** | 12.0 μm (IR) | Discriminazione nuvole alte/basse |
| **IR13.4** | 13.4 μm (IR) | CO2, altezza nuvole |
| **HRV** | 0.5-0.9 μm (alta ris.) | Dettaglio nuvole, 1 km risoluzione |

### Python Library (eumdac)

```python
import eumdac
from datetime import datetime, timedelta

# Autenticazione
consumer_key = "YOUR_CONSUMER_KEY"
consumer_secret = "YOUR_CONSUMER_SECRET"
token = eumdac.Token((consumer_key, consumer_secret))

# Accesso alla collezione SEVIRI
datastore = eumdac.DataStore(token)
collection = datastore.get_collection("EO:EUM:DAT:MSG:HRSEVIRI")

# Ricerca prodotti ultimi 30 minuti
start = datetime.utcnow() - timedelta(minutes=30)
end = datetime.utcnow()
products = collection.search(start, end)

# Download ultimo prodotto
latest = products[0]
with latest.open() as f:
    # Processa il file NetCDF/HRIT
    pass
```

**Nota**: richiede processing dei dati grezzi. Per uso in un agente AI, preferire le immagini pre-renderizzate (vedi EUMETView sotto).

---

## Fonte Fallback: EUMETView (Immagini Pre-renderizzate)

**URL**: https://eumetview.eumetsat.int/
**Autenticazione**: nessuna per immagini statiche
**Formato**: PNG/JPG pre-renderizzate
**Aggiornamento**: 15 minuti

### URL Immagini Statiche

EUMETView fornisce immagini pre-renderizzate dei canali SEVIRI. Costruire URL per l'ultimo frame disponibile:

```
# Canale IR10.8 (infrarosso — nuvole giorno/notte)
https://eumetview.eumetsat.int/static-images/latest/IR108.jpg

# Canale VIS0.6 (visibile — solo diurno)
https://eumetview.eumetsat.int/static-images/latest/VIS06.jpg

# Canale WV6.2 (vapore acqueo)
https://eumetview.eumetsat.int/static-images/latest/WV062.jpg

# Canale HRV (alta risoluzione — solo diurno)
https://eumetview.eumetsat.int/static-images/latest/HRV.jpg
```

**Nota**: verificare la disponibilità degli URL — EUMETView potrebbe cambiare la struttura. In caso di 404, usare il portale web https://eumetview.eumetsat.int/ per navigazione manuale.

---

## Fonte Alternativa: NASA GIBS/Worldview

**URL**: https://worldview.earthdata.nasa.gov/
**Autenticazione**: nessuna per accesso base
**Copertura**: globale
**Aggiornamento**: ~3 ore (MODIS/VIIRS)
**Formato**: WMS/WMTS (immagini PNG)

### WMS Endpoint

```
GET https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms
  ?service=WMS&version=1.1.1&request=GetMap
  &layers=MODIS_Terra_CorrectedReflectance_TrueColor
  &bbox={W},{S},{E},{N}
  &width=1000&height=800
  &format=image/png
  &time={YYYY-MM-DD}
```

**Utilizzo**: contesto globale, non nowcasting. Refresh ~3 ore vs 15 min di Meteosat.

---

## Guida Interpretazione per Nowcasting

### 1. Fronti Atlantici

**Canale**: IR10.8
**Pattern**: bande nuvolose continue e organizzate, orientate SW-NE
**Interpretazione**:
- Fronte freddo: banda stretta e ben definita, spesso con celle convettive incorporate
- Fronte caldo: banda larga e stratificata, nuvole alte (cirri) in anticipo
- Fronte occluso: struttura a spirale attorno al centro di bassa pressione

**Integrazione con NWP**: se IR10.8 mostra fronte in posizione diversa dal previsto → NWP ha errore di timing o posizione.

### 2. Temporali e Celle Convettive

**Canali**: IR10.8 + WV6.2 + VIS0.6 (diurno)
**Pattern**: celle isolate o cluster con tops molto freddi (IR10.8 < -60°C)
**Segnali di severità**:
- **Overshooting top**: protuberanza sopra l'incudine → sviluppo verticale estremo
- **V-shaped pattern**: forma a V con il vertice a monte → supercella
- **Cold ring**: anello freddo attorno al centro → temporale in fase matura
- **Enhanced-V**: V molto freddo e definito → grandine probabile

**Integrazione con radar (Step I)**: satellite mostra il contesto sinottico, radar mostra il dettaglio locale. Convergenza = alta fiducia.

### 3. Nebbia

**Canali**: IR3.9 + IR10.8 (differenza)
**Pattern diurno (VIS0.6)**: strato uniforme bianco a bassa quota, segue la topografia
**Pattern notturno (IR3.9 - IR10.8)**: nebbia appare più calda (grigia) nel canale IR3.9 rispetto a IR10.8

**Dove cercare**:
- Val Padana: nebbia da irraggiamento (notturna/mattutina), dissoluzione con il sole
- Zone costiere: nebbia da avvezione (tutto il giorno), persistente
- Valli alpine: nebbia di valle (notturna), segue il fondovalle

**Integrazione con METAR (Step K)**: se METAR mostra visibilità <1000m e satellite mostra strato nuvoloso basso → nebbia confermata.

### 4. Dust Sahariano

**Canale**: IR8.7 (assorbe dust) + IR10.8 (non assorbe)
**Pattern**: area marrone/rossastra nelle immagini false-color, confine netto tra aria pulita e aria con dust
**Integrazione con CAMS (Step H)**: satellite conferma visivamente il dust previsto da CAMS.

### 5. Neve al Suolo

**Canali**: NIR1.6 + VIS0.6
**Pattern**: la neve riflette molto nel visibile ma assorbe nel NIR1.6 → appare bianca in VIS, scura in NIR
**Utilizzo**: distinguere nuvole da neve al suolo (entrambe bianche in VIS)

---

## Limitazioni e Note

- **EUMETSAT Data Store**: richiede registrazione, dati grezzi da processare (NetCDF/HRIT). Complesso per uso in un agente AI senza processing automatico
- **EUMETView**: immagini pre-renderizzate più pratiche, ma URL possono cambiare. Verificare sempre la disponibilità
- **NASA GIBS**: refresh ~3 ore, non adatto per nowcasting. Utile solo per contesto sinottico
- **Copertura notturna**: i canali visibili (VIS0.6, VIS0.8, HRV) non funzionano di notte. Usare IR10.8 per analisi notturna
- **Risoluzione**: 1-3 km per SEVIRI. Non sufficiente per dettagli locali (usare radar DPC Step I per quello)
- **L'agente AI può descrivere qualitativamente l'immagine**. Per analisi quantitative usare i dati numerici degli Step A-J. Il satellite serve solo come validazione visiva di contesto.
