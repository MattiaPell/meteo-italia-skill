---
source: "Mixed"
last_verified: "2026-05-28"
confidence: "medium"
verification_needed:
  - "Endpoint API"
  - "Soglie operative"
  - "ID stazioni"
---

# Nowcasting Radar DPC — Interpretazione Prodotti

Guida all'interpretazione dei prodotti della Rete Radar Nazionale gestita dal Dipartimento della Protezione Civile (DPC).

---

## Prodotto Principale: VMI (Vertical Maximum Intensity)

Il **VMI** rappresenta la massima riflettività sulla verticale (espresso in dBZ). È l'unico prodotto utilizzato in questa sessione per il nowcasting istantaneo.

| dBZ | Intensità | Descrizione |
|---|---|---|
| 15–20 | Molto debole | Pioviggine o nubi dense |
| 20–35 | Debole/Moderata | Pioggia ordinaria |
| 35–45 | Forte | Rovesci intensi |
| 45–55 | Molto forte | Temporale, possibile grandine piccola |
| >55 | Estrema | Temporale violento, grandine probabile |

*Nota: Altri prodotti (SRI, VIL, POH, ETM) non sono disponibili in questa configurazione per ottimizzare le chiamate API.*

---

## Analisi Qualitativa (Nowcasting 0-3h)

In produzione, l'analisi si basa sulla singola immagine **VMI** (Vertical Maximum Intensity) più recente.

### 1. Interpretazione Vision
Se l'agente ha capacità Vision, deve analizzare l'immagine per:
- **Identificare i nuclei**: Localizzare le aree con riflettività significativa.
- **Valutare l'intensità**: Usare la scala dBZ (giallo >35, rosso >45, viola >55).
- **Prossimità**: Stimare la distanza e la direzione dei nuclei rispetto alle coordinate target.

### 2. Blending Radar–NWP (ICON-D2)
Il radar fornisce la "verità al suolo" istantanea. Poiché non è possibile calcolare vettori di movimento precisi da un singolo frame in questa sessione, si utilizza il radar per validare o correggere il trend del modello ad alta risoluzione (**ICON-D2**):

| Orizzonte (min) | Strategia Operativa |
|---|---|
| **0–15** | **Radar Dominante**: Se il radar mostra un nucleo sul target, la pioggia è certa, indipendentemente dal modello. |
| **15–45** | **Validazione NWP**: Se il radar conferma il sistema previsto dal modello, aumenta la fiducia nel forecast ICON-D2. |
| **45–90** | **Correzione Temporale**: Se il radar mostra il sistema "in ritardo" o "in anticipo" rispetto alla posizione prevista dal modello per l'ora corrente, trasla temporalmente il forecast NWP. |
| **>90** | **NWP Dominante**: Affidarsi esclusivamente ai modelli numerici per l'evoluzione a medio termine. |

**Logica di correzione:**
Se il radar mostra un sistema a 20km dal target che il modello prevedeva già in transito → segnala un possibile ritardo dell'evento di 30-60 minuti rispetto alla tabella oraria NWP.

---

## Limitazioni Tecniche

1. **Beam Blocking**: Le montagne (Alpi/Appennini) possono schermare il segnale radar. In valli profonde il dato può essere sottostimato o assente.
2. **Cono d'ombra**: Zone molto vicine al sito radar possono avere dati mancanti.
3. **Attenuazione**: Precipitazioni estremamente intense tra il radar e il bersaglio possono "oscurare" ciò che sta oltre.
4. **Bright Band**: Lo scioglimento della neve a una certa quota può causare una fascia di riflettività artificialmente alta (sovrastima SRI).

---

## Note Legali e Licenza
Citare sempre la fonte: **"Radar-DPC, Dipartimento della Protezione Civile (CC-BY-SA 4.0)"**
I dati sono rilasciati con finalità di protezione civile e non per usi professionali critici senza supervisione esperta.
