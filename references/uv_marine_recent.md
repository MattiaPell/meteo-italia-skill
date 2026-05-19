# UV, Mare e Storico Recente — Soglie Interpretative

Guida per l'interpretazione dei dati UV, Marini e dello storico recente (7 giorni).

---

## ☀️ UV Index (UVI) — Scala e Protezione

L'indice UV misura l'intensità della radiazione ultravioletta solare.

| UVI | Categoria | Protezione Necessaria |
|---|---|---|
| 0–2 | Basso | Nessuna (sicuro per tutti) |
| 3–5 | Moderato | Protezione solare (SPF 15+), occhiali, cappello |
| 6–7 | Alto | Protezione alta (SPF 30+), ombra nelle ore centrali |
| 8–10 | Molto alto | Protezione molto alta (SPF 50+), evitare ore 11–16 |
| >11 | Estremo | Massima protezione, restare al chiuso se possibile |

**Fattori correttivi:**
- **Quota**: +10% ogni 1000m di altitudine.
- **Riflessione**: Neve (+80%), sabbia (+15%), acqua (+10%).
- **Nuvole**: Nubi stratiformi riducono l'UVI; nubi sparse possono aumentarlo per riflessione laterale.

---

## 🌊 Stato del Mare — Scala Douglas (Wind Sea)

La Scala Douglas è lo standard nautico per descrivere lo **Stato del Mare** in base all'altezza significativa delle onde (Step 3F, `wave_height`).

| Grado | Descrizione | Altezza Onda (m) | Note Operative |
|---|---|---|---|
| 0 | Calmo (specchio) | 0 | Navigazione sicura |
| 1 | Quasi calmo | 0 – 0.10 | Navigazione sicura |
| 2 | Poco mosso | 0.10 – 0.50 | Navigazione sicura |
| 3 | Mosso | 0.50 – 1.25 | Cautela piccola nautica |
| 4 | Molto mosso | 1.25 – 2.50 | Sconsigliato piccola nautica |
| 5 | Agitato | 2.50 – 4.00 | Pericolo per balneazione e nautica |
| 6 | Molto agitato | 4.00 – 6.00 | Navigazione difficile |
| 7 | Grosso | 6.00 – 9.00 | Solo grandi navi |
| 8 | Molto grosso | 9.00 – 14.00 | Emergenza |
| 9 | Tempestoso | > 14.00 | Condizioni eccezionali |

## 🌊 Mare Morto / Lungo — Scala Douglas (Swell)

Il "Mare Morto" (Swell) è il moto ondoso residuo o proveniente da zone lontane. Interpreta i dati `swell_wave_height` e `swell_wave_period`.

| Altezza Swell | Classe | Descrizione |
|---|---|---|
| 0 – 2 m | Bassa | Onde lunghe e basse |
| 2 – 4 m | Media | Onde lunghe e moderate |
| > 4 m | Alta | Onde lunghe e alte |

| Lunghezza Swell | Periodo (s) | Descrizione |
|---|---|---|
| < 6s | Corta | Onde frequenti |
| 6 – 10s | Media | Onde regolari |
| > 10s | Lunga | Onde distanziate (tipico post-burrasca) |

---

## 🌬️ Vento — Scala Beaufort

Utilizzata per correlare la velocità del vento (Step 3A, `wind_speed_10m`) agli effetti visibili.

| Grado | Vento (km/h) | Descrizione | Effetti al suolo / mare |
|---|---|---|---|
| 0 | <1 | Calma | Fumo sale verticale |
| 1 | 1–5 | Bava di vento | Fumo inclinato |
| 2 | 6–11 | Brezza leggera | Foglie muovono |
| 3 | 12–19 | Brezza tesa | Bandiere spiegate |
| 4 | 20–28 | Vento moderato | Solleva polvere |
| 5 | 29–38 | Vento teso | Piccoli alberi oscillano |
| 6 | 39–49 | Vento fresco | Grandi rami muovono |
| 7 | 50–61 | Vento forte | Difficoltà con ombrelli |
| 8 | 62–74 | Burrasca | Ramoscelli si spezzano |
| 9 | 75–88 | Burrasca forte | Danni alle strutture |

**Soglie Operative:**
- **Bagno/Nuoto**: Sicuro fino a Beaufort 2; cautela con 3; sconsigliato ≥4.
- **Piccola Nautica (<6m)**: Sicura fino a Beaufort 3; cautela con 4; sconsigliato ≥5.

### 🌡️ Temperatura Superficiale del Mare (SST)
Indica il comfort termico per la balneazione nelle coste italiane.

| SST (°C) | Comfort | Note |
|---|---|---|
| <18°C | Molto fredda | Necessaria muta per permanenza prolungata |
| 18–21°C | Fredda | Rinfrescante, ma richiede adattamento |
| 22–24°C | Ideale | Perfetta per la maggior parte dei bagnanti |
| 25–27°C | Calda | Tipica del pieno agosto nel Mediterraneo |
| >28°C | Molto calda | Possibile proliferazione algale / stress ecosistema |

---

## 🌫️ Visibilità (Visibility)
Classificazione della visibilità orizzontale per trasporti e navigazione.

| Visibilità | Classe | Impatti |
|---|---|---|
| <200 m | Nebbia fitta | Forti disagi autostradali (A1, A4), voli a rischio |
| 200–500 m | Nebbia | Guida pericolosa, velocità ridotta obbligatoria |
| 500 m – 1 km | Foschia densa | Disagi locali, cautela in mare |
| 1–4 km | Foschia | Visibilità ridotta, orizzonte non nitido |
| 4–10 km | Discreta | Condizioni medie |
| >10 km | Ottima | Tipica post-fronte, Foehn o Tramontana |

---

## 🌡️ Salute e Caldo Estremo — Soglie Ministero Salute / ARPA

### 🌙 Notti Tropicali (Tropical Nights)
Definita come una giornata in cui la **temperatura minima (`temperature_2m_min`) non scende mai sotto i 20°C**.
- **Impatto**: Stress termico accumulato, difficoltà di recupero dell'organismo durante il sonno.
- **Segnala sempre** se `temperature_2m_min >= 20°C`.

### 🌡️ Heat Index (Indice di Calore / Afa)
Usa la temperatura percepita (`apparent_temperature`) per valutare il disagio fisico.

| Apparent T | Categoria | Pericolo |
|---|---|---|
| 27 – 32°C | Cautela | Possibile affaticamento con esposizione prolungata |
| 32 – 41°C | Estrema cautela | Possibili crampi e colpi di calore |
| 41 – 54°C | Pericolo | Colpo di calore probabile |
| > 54°C | Pericolo estremo | Colpo di calore imminente |

### 🌡️ Bollettino Ondate di Calore (Ministero della Salute)

Standard ufficiale italiano per la prevenzione degli effetti del caldo sulla salute.

| Livello | Colore | Condizioni e Impatto |
|---|---|---|
| **Livello 0** | 🟢 Verde | Condizioni meteorologiche che non comportano rischi per la salute. |
| **Livello 1** | 🟡 Giallo | **Pre-allerta**: condizioni che possono precedere un'ondata di calore. |
| **Livello 2** | 🟠 Arancione | **Rischio**: temperature elevate ed effetti negativi su anziani, bambini e soggetti fragili. |
| **Livello 3** | 🔴 Rosso | **Ondata di Calore**: condizioni ad elevato rischio che persistono per **3 o più giorni consecutivi**. Pericolo per tutta la popolazione. |

### 🌡️ Temperatura a Bulbo Umido (Wet Bulb Temperature - WBT)
La variabile `wet_bulb_temperature_2m` (Step 3A) è il limite fisico del raffreddamento per evaporazione (sudore).

| WBT (°C) | Livello di Rischio | Impatto sulla Salute |
|---|---|---|
| **< 26°C** | **Basso** | Condizioni gestibili con idratazione |
| **26 – 29°C** | **Moderato** | Stress termico significativo per lavori pesanti |
| **30 – 31°C** | **Alto** | Limite di adattabilità per attività fisica intensa |
| **32 – 34°C** | **Molto Alto** | Pericolo di colpo di calore anche a riposo |
| **≥ 35°C** | **Estremo** | Limite teorico di sopravvivenza umana (6h) |

*Nota: Soglie basate su PSU HEAT Project e standard fisiologici WMO.*

---

## 📅 Storico Recente (Ultimi 7 Giorni)

Contestualizza il forecast basandosi su quanto piovuto o quanto caldo ha fatto nell'ultima settimana.

### 1. Precipitazioni Cumulate (7gg)
- **0 mm**: Siccità a breve termine (terreno secco, polvere).
- **1–20 mm**: Nella norma.
- **20–50 mm**: Suoli umidi.
- **>50 mm**: **Suoli saturi**. Rischio idrogeologico elevato anche per piogge moderate nel forecast.

### 2. Anomalie Termiche (7gg)
- **Anomalia > +3°C**: Ondata di calore già in atto → stress termico accumulato.
- **Anomalia < -3°C**: Periodo sottomedia → riscaldamenti attivi, possibile ritardo nel risveglio vegetativo.

### 3. Giorni Consecutivi Senza Pioggia
- **>10 giorni**: Rischio incendi in aumento (estate/inverno secco).
- **>20 giorni**: Stress idrico per l'agricoltura.

---

## Use Case Tips

- **Spiaggia**: Se UVI >6 AND Mare ≥3 (Mosso) → segnalare "Protezione solare alta + Cautela per la balneazione".
- **Agricoltura**: Se Storico 7gg = 0mm AND Vento previsto >20 km/h → segnalare "Elevata evaporazione, irrigazione necessaria".
- **Cantiere**: Se Mare ≥6 (Molto agitato) → segnalare possibili ritardi nei trasporti marittimi di materiali (isole).


---

## 🏔️ Montagna, Neve e Valanghe

### Scala Pericolo Valanghe (EAWS/AINEVA)

| Grado | Pericolo | Stabilità del Manto | Probabilità Distacchi |
|---|---|---|---|
| 1 | 🟢 Debole | Ben consolidato e stabile | Solo con forte sovraccarico su pendii ripidi |
| 2 | 🟡 Moderato | Moderatamente stabile | Possibili con forte sovraccarico su pendii ripidi |
| 3 | 🟠 Marcato | Da moderata a debole | Possibili anche con debole sovraccarico |
| 4 | 🔴 Forte | Debolmente consolidato | Molte valanghe spontanee anche di grandi dimensioni |
| 5 | ⬛ Molto Forte | Instabile | Valanghe catastrofiche molto grandi spontanee |

### Qualità della Neve (Snow Quality)

| Tipo | Condizioni | Descrizione |
|---|---|---|
| **Farinosa** | T < -2°C, vento < 15 km/h | Neve fresca, leggera, ideale per sci fuori pista |
| **Crostosa** | Ciclo gelo/disgelo o vento forte | Crosta superficiale che regge o meno lo sci |
| **Pesante** | T ≈ 0°C, umidità alta | Neve bagnata, faticosa da sciare, rischio valanghe a debole coesione |
| **Marcia** | T > 5°C per ore (pomeriggio) | Neve satura d'acqua, pappa, tipica primaverile |

### Regole Empiriche Quota Neve
- **Zero Termico**: Quota (m slm) dove la temperatura è 0°C.
- **Quota Neve**: In presenza di precipitazioni, la neve solitamente scende 300-400m sotto lo zero termico.
- **Neve da Omotermia**: In valli strette e chiuse (es. valli alpine), la neve può scendere fino a 600-800m sotto lo zero termico per l'effetto del raffreddamento da fusione.

### Terminologia Quote
- **Collinare**: 200 – 600 m slm
- **Bassa Montagna**: 600 – 1200 m slm
- **Media Montagna**: 1200 – 2000 m slm
- **Alta Montagna**: > 2000 m slm
