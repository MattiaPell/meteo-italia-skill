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
| **Farinosa** | T < -2°C, vento < 15 km/h | Neve fresca, leggera, ideale per sci fuori pista |
| **Crostosa** | Ciclo gelo/disgelo o vento forte | Crosta superficiale che regge o meno lo sci |
| **Pesante** | T ≈ 0°C, umidità alta | Neve bagnata, faticosa da sciare, rischio valanghe a debole coesione |
| **Marcia** | T > 5°C per ore (pomeriggio) | Neve satura d'acqua, "pappa", tipica primaverile |

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

### Quota Neve
- **Zero Termico**: Quota (m slm) dove la temperatura è 0°C.
- **Quota Neve**: In presenza di precipitazioni, la neve solitamente scende 300-400m sotto lo zero termico.
- **Neve da Omotermia**: In valli strette e chiuse, la neve può scendere fino a 600-800m sotto lo zero termico per il raffreddamento da fusione.

### Terminologia Quote
- **Collinare**: 200 – 600 m slm
- **Bassa Montagna**: 600 – 1200 m slm
- **Media Montagna**: 1200 – 2000 m slm
- **Alta Montagna**: > 2000 m slm

---
