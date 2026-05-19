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

## 🌾 Bilancio Idrologico e Agrometeorologia

### ET0 vs Precipitazioni
L'evapotraspirazione potenziale (ET0) confrontata con le precipitazioni indica lo stato idrico del suolo.

| Condizione | Interpretazione | Impatto |
|---|---|---|
| Precip >> ET0 | Surplus idrico | Rischio alluvionamenti, suolo saturo |
| Precip ≈ ET0 | Equilibrio | Condizioni ideali per vegetazione |
| Precip < ET0 | Deficit idrico | Necessaria irrigazione, stress idrico |
| ET0 > 5mm/giorno | Elevata evaporazione | Tipico di giornate calde/ventose, rapido disseccamento |

**Soglie Umidità del Suolo (soil_moisture_0_to_1cm):**
- **<0.15 m³/m³**: Suolo molto secco (punto di appassimento)
- **0.15–0.30 m³/m³**: Umidità moderata
- **>0.35 m³/m³**: Suolo molto umido / saturo

### Soglie di Germinazione (soil_temperature_6cm)
| Coltura | T suolo Min. | T suolo Ottimale |
|---|---|---|
| **Mais** | 10°C | 12°C |
| **Pomodoro** | 12°C | 15–18°C |
| **Barbabietola** | 5–6°C | 10–12°C |
| **Girasole** | 8°C | 10–12°C |
