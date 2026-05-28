---
source: "LLM-generated"
last_verified: "2026-05-28"
confidence: "low"
verification_needed:
  - "Entità bias"
  - "Delta T UHI"
---

# Bias Noti dei Modelli — Italia

Deviazioni sistematiche documentate dei modelli numerici sul territorio italiano.
Usa questa tabella per correggere/pesare i forecast quando un modello è outlier.

---

## ARPAE ICON 2I (modello nazionale)

| Bias | Zona | Entità | Note |
|------|------|--------|------|
| Anticipa precipitazioni | Versante adriatico | 1-3h | Inizia a piovere prima di quanto previsto |
| Sovrastima pioggia orografica | Prealpi venete, Appennino emiliano | +20-40% | Su flussi da S/SW contro rilievi |
| Sottostima Bora | Trieste | -10-20 km/h raffica | Tende a smorzare i picchi di raffica |
| Ottimo per nebbia padana | Pianura Padana | — | Migliore tra tutti i modelli per previsione nebbia |
| Sottostima calore urbano | Milano, Bologna | -1-2°C T max | Non cattura bene l'isola di calore |

---

## ECMWF IFS (riferimento globale)

| Bias | Zona | Entità | Note |
|------|------|--------|------|
| Tende a smussare precipitazioni intense | Tutto il territorio | -10-20% picchi | Eccelle nelle tendenze, meno nei picchi estremi |
| Anticipa ondate di calore | Centro-Sud | 12-24h | Individua le ondate prima degli altri modelli |
| Preciso su fronti atlantici | Nord Italia | — | Modello di riferimento per situazioni sinottiche |
| Sottostima precipitazioni locali convettive | Liguria, Calabria | Variabile | I sistemi convettivi organizzati locali sfuggono alla risoluzione |
| Ottimo oltre 5 giorni | Tutto | — | Il più affidabile nel medio-lungo termine |

---

## DWD ICON D2 (alta risoluzione, max 2 giorni)

| Bias | Zona | Entità | Note |
|------|------|--------|------|
| Sovrastima raffiche di vento | Coste e valli alpine | +5-15 km/h | Troppo generoso nelle raffiche in terreno complesso |
| Ottimo per temporali convettivi | Pianura Padana, Prealpi | — | Migliore risoluzione spaziale per celle temporalesche |
| Tende a sovrastimare neve fresca | Alpi | +5-15cm | Sovrastima quota neve e accumuli |
| Ottimo per Foehn | Valli alpine | — | Cattura bene la discesa del Foehn |

---

## GFS NOAA (modello globale USA)

| Bias | Zona | Entità | Note |
|------|------|--------|------|
| Sovrastima scirocco | Sud Italia, Sicilia | +10-20 km/h | Tende a esagerare l'intensità dello scirocco |
| Sottostima precipitazioni orografiche | Liguria, Calabria tirrenica | -20-30% | Risoluzione insufficiente per coste ripide |
| Caldo eccessivo in estate | Centro-Sud | +1-2°C T max | Bias caldo sistematico in estate al Sud |
| Buono per pattern a lungo termine | Tutto | — | Utile per tendenze oltre 7 giorni |
| Ciclo di aggiornamento 6h | Tutto | — | Meno reattivo ai cambiamenti rapidi rispetto a ICON |

---

## Météo-France ARPEGE Europe

| Bias | Zona | Entità | Note |
|------|------|--------|------|
| Ottimo per Nord-Ovest | Liguria, Piemonte | — | Eccelle nei sistemi atlantici che entrano da ovest |
| Anticipa perturbazioni atlantiche | Nord Italia | 3-6h | Individua i fronti in arrivo con anticipo |
| Sottostima eventi mediterranei | Sud Italia, Sicilia | Variabile | Meno preciso per i sistemi che si formano nel Mediterraneo |

---

## MeteoSwiss ICON Seamless

| Bias | Zona | Entità | Note |
|------|------|--------|------|
| Eccellente per Alpi | Tutte le Alpi italiane | — | Modello di riferimento per previsioni alpine |
| Ottimo per Foehn alpino | Valli del Sud Tirolo, Val d'Aosta | — | Migliore previsione del Foehn tra tutti i modelli |
| Buona stima quota neve | Alpi | — | Più preciso di ICON D2 su quota neve a 3-5 giorni |
| Copertura limitata | Solo Alpi e Prealpine | — | Non usare per Centro-Sud Italia |

---

## ECMWF AIFS (modello AI)

| Bias | Zona | Entità | Note |
|------|------|--------|------|
| Ottimo per tendenze a 5-10 giorni | Tutto | — | Sorprendentemente buono nel medio termine |
| Tende a smoothing estremi | Tutto | Variabile | I valori estremi (T max, vento max) risultano smussati |
| Non cattura bene convettività locale | Tutto | — | Limito noto dell'architettura neural network |
| In rapido miglioramento | — | — | Aggiornato frequentemente, rivalutare bias periodicamente |

---

## 🏙️ Isola di Calore Urbana (Urban Heat Island - UHI)

I modelli numerici (NWP) con risoluzione > 2km spesso non catturano l'effetto di accumulo termico delle aree urbane cementificate, specialmente durante la notte.

### Matrice di Correzione UHI per Grandi Città

| Città | Delta T Max (Giorno) | Delta T Min (Notte) | Note |
| :--- | :--- | :--- | :--- |
| **Milano** (Area Urbana) | +0.5°C | **+2.0°C / +3.0°C** | Massimo effetto in estate con calma di vento |
| **Roma** (Centro Storico) | +1.0°C | **+1.5°C / +2.5°C** | Effetto mitigato dal Ponentino in periferia |
| **Torino** | +0.5°C | **+2.0°C** | Ristagno termico in inverno e estate |
| **Napoli** | +0.5°C | **+1.5°C** | Effetto mitigato dalla brezza di mare |
| **Bologna** | +1.0°C | **+2.0°C** | Particolarmente intenso in estate |
| **Firenze** | +1.0°C | **+2.5°C** | Effetto conca amplifica l'accumulo |
| **Bari** | +1.0°C | **+4.0°C** | UHI intensa in estate, mitigata in costa |
| **Palermo** | +1.0°C | **+2.5°C** | Effetto amplificato da orografia (conca) |

### ⚠️ Logica di Applicazione Correzione Urbana
1.  **Check Località**: Se il punto target è in area densamente urbanizzata (Capoluoghi di Provincia).
2.  **Check Condizioni**: L'UHI è massimo con **Cielo Sereno** (`cloud_cover` < 20%) e **Vento Calmo** (< 5 km/h).
3.  **Aggiunta Termica**: Se le condizioni (2) sono vere, aggiungi il **Delta T Min** alle previsioni di temperatura minima notturna del modello.
4.  **Soglia Notti Tropicali**: Se `T_min_NWP = 18°C`, con correzione UHI (+2°C) diventa **20°C** (Notte Tropicale confermata).

---

## Regole Generali per Interpretare gli Outlier

1. **Un modello solo è outlier >1.5σ** → probabilmente rumore; peso ridotto ma non ignorare
2. **Due modelli concordano contro gli altri** → possibile split genuino; segnala incertezza
3. **ECMWF outlier al rialzo su precipitazioni** → spesso accurato, non ignorare
4. **GFS outlier su scirocco al Sud** → applicare correzione -15 km/h sulle raffiche
5. **ARPAE ICON 2I outlier su precipitazioni Adriatico** → applicare shift -2h sull'orario
6. **Tutti i modelli concordano** → alta fiducia, anche se il valore sembra estremo
