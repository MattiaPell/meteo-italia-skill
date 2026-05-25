# Dati Idrologici Italia — Fiumi, Livelli e Rischio Alluvioni

Monitoraggio idrometrico in tempo reale e fonti di contesto per valutazione rischio alluvioni.

---

## Panoramica

La copertura di dati idrologici in tempo reale in Italia è frammentata per regione. Il Trentino-Alto Adige dispone di un'API open data completa e strutturata. Per il resto d'Italia, i dati sono disponibili tramite portali regionali (AIPO per il Po, ARPA regionali, Centri Funzionali) o fonti previsionali europee (EFAS).

---

## 🌊 Fiume Po (Bacino Padano)

Il Po è il principale fiume italiano. Il monitoraggio è gestito da **AIPO** (Agenzia Interregionale per il fiume Po) in collaborazione con le ARPA regionali (Piemonte, Lombardia, Emilia-Romagna, Veneto).

### Soglie Idrometriche di Riferimento (AIPO/Arpae)
Le soglie si riferiscono allo zero idrometrico locale.

| Stazione | Provincia | Zero Idr. (m slm) | Soglia 1 (Gialla) | Soglia 2 (Arancione) | Soglia 3 (Rossa) |
|----------|-----------|-------------------|-------------------|-------------------|-------------------|
| **Piacenza** | PC | 42.41 | 5.00 m | 6.00 m | 7.00 m |
| **Cremona** | CR | 34.40 | 2.20 m | 3.20 m | 4.20 m |
| **Casalmaggiore** | CR | 24.31 | 3.80 m | 5.00 m | 6.20 m |
| **Boretto** | RE | 21.64 | 4.50 m | 5.50 m | 6.50 m |
| **Borgoforte** | MN | 14.15 | 5.00 m | 6.00 m | 7.00 m |
| **Pontelagoscuro** | FE | 8.38 | 0.50 m | 1.30 m | 2.50 m |

**Note operative:**
- **Navigazione**: Con livelli > Soglia 1 la navigazione commerciale può essere sospesa.
- **Piene**: Il tempo di corrivazione tra Piacenza e Pontelagoscuro è di circa 2-4 giorni a seconda dell'intensità della piena.

---

## 🌊 Fiume Arno (Firenze)

Monitoraggio a cura del **Centro Funzionale Regione Toscana (CFR)**.

| Stazione | Località | Soglia 1 (Gialla) | Soglia 2 (Rossa) | Note |
|----------|----------|-------------------|-------------------|------|
| **Nave di Rovezzano** | Firenze Est | 3.00 m | 4.50 m | Ingresso in città |
| **Firenze Uffizi** | Centro Storico | 3.00 m | 5.50 m | Punto critico monumentale |
| **Ponte a Signa** | Firenze Ovest | 5.50 m | 8.50 m | Uscita area metropolitana |
| **S. Giovanni alla Vena** | Pisa | 4.50 m | 7.10 m | Pre-foce |

---

## 🌊 Fiume Tevere (Roma)

Monitoraggio a cura del **Centro Funzionale Regione Lazio**.

| Stazione | Località | Livello di Attenzione | Livello di Pre-Allarme | Note |
|----------|----------|-----------------------|------------------------|------|
| **Roma Ripetta** | Centro Storico | 7.00 m | 10.00 m | Chiusura banchine a 7m |
| **Isola Tiberina** | Centro Storico | 6.50 m | 9.00 m | |

**Soglie Roma Ripetta:**
- **> 7.00 m**: Allagamento banchine basse (divieto accesso pedonale).
- **> 10.00 m**: Livello di attenzione per le strutture fluviali.
- **> 12.50 m**: Allagamento banchine alte (piena straordinaria, rif. 2008: 12.55m).

---

## 📡 Rete di Monitoraggio Real-time — Nord-Est

### 1. floods.it (Trentino-Alto Adige)

**Copertura**: bacini Adige, Brenta, Sarca, Chiese.

### Endpoint API

```bash
# Catalogo stazioni (GeoJSON)
GET https://www.floods.it/api/v1/monitoring/index.json

# Dati singola stazione (JSON) — Fetch obbligatorio per analisi
GET https://www.floods.it/api/v1/monitoring/{sensor_id}.json
```

### Esempio Risposta Dati Stazione

```json
{
  "sensor_id": "ADIGE_TRENTO",
  "name": "Adige a Trento",
  "parameter": "livello_idrometrico",
  "unit": "m",
  "data": [
    { "timestamp": "2026-05-19T10:00:00Z", "value": 2.45 },
    { "timestamp": "2026-05-19T09:45:00Z", "value": 2.42 }
  ],
  "thresholds": { "green": 2.00, "yellow": 3.00, "red": 4.00 }
}
```

### Stazioni Principali Trentino

| ID | Fiume | Località | Bacino | Soglia Gialla (m) | Soglia Rossa (m) |
|----|-------|----------|--------|-------------------|------------------|
| ADIGE_TRENTO | Adige | Trento | Adige | 3.00 | 4.00 |
| ADIGE_ROVERETO | Adige | Rovereto | Adige | 2.80 | 3.80 |
| BRENTA_BASSANO | Brenta | Bassano del Grappa | Brenta | 3.50 | 4.50 |
| SARCA_ARCO | Sarca | Arco | Sarca | 2.00 | 3.00 |

### 2. ARPAV (Regione Veneto)
**Copertura**: bacini Adige, Brenta, Po (Delta), Bacchiglione.

| ID Stazione | Fiume | Località | Soglia 1 (m) | Soglia 2 (m) | Soglia 3 (m) |
|-------------|-------|----------|--------------|--------------|--------------|
| **124** | Adige | Verona (Pte Nuovo) | 1.00 m | 1.50 m | 2.00 m |
| **142** | Adige | Boara Pisani | 2.50 m | 3.50 m | 4.50 m |
| **105** | Brenta | Bassano (Barzizza) | 1.50 m | 2.50 m | 3.50 m |
| **108** | Bacchiglione | Vicenza (Ponte degli Angeli) | 4.50 m | 5.50 m | 6.00 m |
| **132** | Po | Ariano (Delta) | 2.50 m | 3.50 m | 4.50 m |

**Note ARPAV**: Le soglie ARPAV si riferiscono al livello idrometrico relativo allo zero della stazione. Per il monitoraggio in tempo reale, l'agente deve consultare l'API REST:
`GET https://api.arpa.veneto.it/rest/v1/meteo/stazioni/{id}/dati?parametro=livello_idrometrico&periodo=ultimo-giorno`.

---

## Fonte Previsionale: EFAS (Copernicus)

Utilizzare per **contesto probabilistico** a 3-10 giorni.
- **Soglia EFAS > 5 anni**: Piena significativa.
- **Soglia EFAS > 20 anni**: Piena eccezionale.

---

## Guida Interpretazione Nimbus

### Combinazione con Dati Meteo

#### Scenario 1: Pioggia Prevista + Livello Alto
```
Livello attuale (es. Po a Piacenza): 4.8m (Soglia 1: 5.0m)
Precipitazioni previste (Step A): >40mm/24h nel bacino a monte (Piemonte)
→ Scenario: Superamento Soglia 1 previsto nelle prossime 12-24h.
```

#### Scenario 2: Suolo Saturo + Pioggia Intensa
```
Soil moisture superficiale (0-1cm): >0.35 m³/m³ (Rischio ruscellamento)
Soil moisture profonda (3-9cm): >0.35 m³/m³ (Bacino saturo)
Precipitazioni: >80mm/24h (Allerta Arancione/Rossa PC)
→ Rischio: Piena lampo (Flash Flood) su reticolo minore e fiumi appenninici.
```

### 🌊 Nimbus Hydrological Intelligence (Blending Logic)

Per una valutazione operativa del rischio alluvione, l'agente deve incrociare i dati di livello con il forecast e lo stato del suolo a diversi livelli.

| Livello Nimbus | Descrizione | Trigger Tecnico | Azione Consigliata |
|:--- | :--- | :--- | :--- |
| **BASSO** 🟢 | Sicuro | Livello < Soglia 1; pioggia prevista < 10mm/24h | Monitoraggio standard |
| **MEDIO** 🟡 | Attenzione | Livello > Soglia 1 **O** pioggia > 30mm/24h su suolo saturo (`soil_moisture_0_to_1cm` > 0.35) | Allertare per possibile innalzamento |
| **ALTO** 🟠 | Pre-Allarme | Livello > Soglia 2 **O** onda di piena in arrivo da stazione a monte **O** saturazione profonda (`soil_moisture_3_to_9cm` > 0.40) | Prepararsi all'esondazione aree golenali |
| **ESTREMO** 🔴 | Emergenza | Livello > Soglia 3 **O** pioggia estrema (> 100mm/24h) su bacini piccoli con suolo già saturo | Evacuazione aree a rischio, stop navigazione |

**Logica di Corrivazione (Propagazione Piena):**
- **Po**: Da Piacenza a Pontelagoscuro ~ 48-72 ore.
- **Adige**: Da Trento a Verona ~ 6-10 ore.
- **Arno**: Da Firenze a Pisa ~ 8-12 ore.

---

## Portali per Consultazione Manuale (Real-time)

| Bacino | Ente | URL |
|--------|------|-----|
| **Po (Intero)** | AIPO | [agenziapo.it](https://www.agenziapo.it/content/monitoraggio-idrografico-0) |
| **Veneto** | ARPAV | [arpa.veneto.it/dati-ambientali/](https://www.arpa.veneto.it/dati-ambientali/dati-in-tempo-reale/idro) |
| **Emilia-Romagna** | ARPAE | [allertameteo.regione.emilia-romagna.it](https://allertameteo.regione.emilia-romagna.it/livello-idrometrico) |
| **Toscana** | CFR | [cfr.toscana.it](https://www.cfr.toscana.it/monitoraggio/stazioni.php?type=idro) |
| **Lazio** | CFR | [regione.lazio.it](https://www.regione.lazio.it/protezione-civile) |

**Nota**: Per i fiumi non coperti da API (Po, Arno, Tevere), l'agente deve indicare lo scenario basandosi sull'ultimo dato disponibile manualmente o sulle allerte della Protezione Civile.
