---
source: "Mixed"
last_verified: "2026-05-28"
confidence: "medium"
verification_needed:
  - "Endpoint API"
  - "Soglie operative"
  - "ID stazioni"
---

# Montagna, Neve e Valanghe — Soglie e Intelligence

Guida per l'analisi dei fenomeni d'alta quota e del rischio valanghe in Italia.

---

## 🏔️ Scala Pericolo Valanghe (EAWS/AINEVA)

| Grado | Pericolo | Stabilità del Manto | Probabilità Distacchi |
|---|---|---|---|
| 1 | 🟢 Debole | Ben consolidato e stabile | Solo con forte sovraccarico su pendii ripidi |
| 2 | 🟡 Moderato | Moderatamente stabile | Possibili con forte sovraccarico su pendii ripidi |
| 3 | 🟠 Marcato | Da moderata a debole | Possibili anche con debole sovraccarico |
| 4 | 🔴 Forte | Debolmente consolidato | Molte valanghe spontanee anche di grandi dimensioni |
| 5 | ⬛ Molto Forte | Instabile | Valanghe catastrofiche molto grandi spontanee |

*Fonte: AINEVA / EAWS (European Avalanche Warning Services)*

---

## ❄️ Qualità della Neve (Snow Quality)

| Tipo | Condizioni | Descrizione |
|---|---|---|
| **Farinosa** | `snowfall` > 0, T < -3°C, Vento < 15 km/h | Neve fresca, leggera, ideale per sci fuori pista |
| **Crostosa** | Ciclo gelo/disgelo (+/-0°C) o Vento > 25 km/h | Crosta superficiale che regge o meno lo sci |
| **Pesante** | T ≈ 0°C, UR > 80% (Umidità alta) | Neve bagnata, faticosa da sciare, rischio valanghe a debole coesione |
| **Marcia** | T > 5°C per 3+ ore | Neve satura d'acqua, "pappa", tipica primaverile |

### 🛠️ Matrice di Rilevamento Snow Quality (Intelligence)

Usa questa logica per determinare la qualità della neve dai dati API:

| Qualità Neve | Precipitazione | T aria (2m) | Vento (10m) | UR (2m) |
|--------------|----------------|-------------|-------------|---------|
| **Farinosa** (Powder) | `snowfall` > 0 | < -3°C | < 15 km/h | < 70% |
| **Crostosa** (Crust) | `snowfall` = 0 | Ciclo +/- 0°C | > 25 km/h | — |
| **Pesante** (Wet) | `snowfall` > 0 | -1 a +1°C | — | > 85% |
| **Marcia** (Spring) | — | > +4°C | — | — |
| **Ghiacciata** (Ice) | — | < -5°C | — | — |

**Nota**: Il passaggio da Farinosa a Crostosa è accelerato dal vento forte (wind-drifted snow).

---

## 🌡️ Indici Termici di Montagna

### Wind Chill (Vento Freddo)
Raffreddamento percepito sulla pelle per effetto del vento.

| Wind Chill | Categoria | Pericolo |
|---|---|---|
| 0 a -10°C | Fastidio | Lievi disagi per esposizione prolungata |
| -10 a -25°C | Freddo Intenso | Rischio moderato di congelamento |
| -25 a -45°C | Freddo Estremo | Pericolo grave, congelamento in pochi minuti |
| < -45°C | Emergenza | Pericolo imminente |

---

## 📐 Regole Empiriche e Quote

### 📐 Raffinamento Quota Neve (Snow-Line Intelligence)

La determinazione dell'esatta quota neve richiede correttivi rispetto al semplice Zero Termico (Z.T.), specialmente nell'orografia complessa italiana.

#### 1. Correttivo per Intensità Precipitazione (Raffreddamento da Fusione)
La fusione della neve sottrae calore all'aria circostante, abbassando lo zero termico durante l'evento.

| Intensità (mm/h o cm/h) | Correzione Quota Neve | Effetto |
| :--- | :--- | :--- |
| **Debole** (< 2 mm/h) | Z.T. - 200m | Quota neve standard |
| **Moderata** (2–5 mm/h) | Z.T. - 400m | Abbassamento significativo |
| **Forte / Nubifragio** (> 5 mm/h) | Z.T. - 600/800m | **Omotermia**: neve fino a quote collinari |

#### 2. Correttivo Orografico (Effetto Valle/Conca)
Nelle valli strette (es. Valle d'Aosta, Valtellina, valli Dolomitiche), il ristagno di aria fredda e il raffreddamento da fusione sono amplificati.
- **Valli strette**: Sottrai ulteriori **100–200m** alla quota neve prevista.
- **Valli aperte / Pianura**: Nessun correttivo aggiuntivo.

#### 3. Correttivo per Umidità (UR)
La neve fonde più difficilmente in aria secca.
- **UR < 70%**: La neve può scendere fino a +1.5°C / +2.0°C (Neve "secca").
- **UR > 90%**: La neve fonde già a +0.5°C (Neve "pesante/bagnata").

#### ⚠️ Formula Nimbus per Quota Neve Prevista
`Quota Neve = Zero_Termico_Modello - (300m + Correttivo_Intensità + Correttivo_Valle)`

**Esempio**: Zero Termico a 1500m, pioggia forte prevista in una valle stretta:
`1500 - (300 + 300 + 200) = 700m`. La neve arriverà a 700m nonostante lo Z.T. a 1500m.

### Terminologia Quote
- **Collinare**: 200 – 600 m slm
- **Bassa Montagna**: 600 – 1200 m slm
- **Media Montagna**: 1200 – 2000 m slm
- **Alta Montagna**: > 2000 m slm

---
