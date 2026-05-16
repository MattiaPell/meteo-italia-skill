# Nowcasting Radar DPC — Interpretazione Prodotti

Guida all'interpretazione dei prodotti della Rete Radar Nazionale gestita dal Dipartimento della Protezione Civile (DPC).

---

## Prodotti Chiave e Soglie

### VMI (Vertical Maximum Intensity)
Massima riflettività sulla verticale (espresso in dBZ). Indica l'intensità istantanea della precipitazione e la presenza di nuclei temporaleschi.

| dBZ | Intensità | Descrizione |
|---|---|---|
| 15–20 | Molto debole | Pioviggine o nubi dense |
| 20–35 | Debole/Moderata | Pioggia ordinaria |
| 35–45 | Forte | Rovesci intensi |
| 45–55 | Molto forte | Temporale, possibile grandine piccola |
| >55 | Estrema | Temporale violento, grandine probabile |

### SRI (Surface Rainfall Intensity)
Intensità di precipitazione al suolo stimata (espresso in mm/h).

| mm/h | Classe | Impatto |
|---|---|---|
| <2 | Debole | Fenomeni trascurabili |
| 2–10 | Moderata | Pioggia costante |
| 10–30 | Forte | Allagamenti locali possibili |
| >30 | Molto forte/Nubifragio | Rischio alluvioni lampo (flash floods) |

### POH (Probability of Hail)
Probabilità di presenza di grandine all'interno della nube (0–100%).
- **<30%**: Rischio basso
- **30–70%**: Rischio moderato (grandine probabile)
- **>70%**: Rischio alto (grandine quasi certa)

### VIL (Vertically Integrated Liquid)
Quantità di acqua liquida integrata sulla verticale (kg/m²).
- **VIL < 10**: Precipitazione liquida ordinaria
- **VIL 10–20**: Possibile grandine piccola
- **VIL > 20**: Alta probabilità di grandine di medie/grandi dimensioni (>2cm) o nubifragio estremo

### ETM (Echo Top Map)
Altezza massima della nube (quota dove la riflettività scende sotto i 18-20 dBZ), in km.
- **ETM < 5 km**: Nubi stratiformi o rovesci deboli
- **ETM 5–8 km**: Temporali ordinari
- **ETM > 10 km**: Temporali a forte sviluppo verticale (supercelle, MCS)
- **ETM > 12 km**: Sconfinamento in stratosfera (temporali estremi)

---

## Analisi del Movimento (Nowcasting 0-3h)

Per stimare l'arrivo di un sistema su un punto target, confrontare gli ultimi 4 frame (T, T-5m, T-10m, T-30m).

### 1. Vettore Movimento
- Identifica il baricentro del nucleo più intenso (dBZ > 45)
- Calcola lo spostamento tra T-30 e T attuale
- **Velocità (km/h)** = (Distanza in km tra i due punti) * 2
- **Direzione** = Angolo del vettore risultante

### 2. Estrapolazione Lineare
- **Tempo stimato di arrivo (ETA)** = Distanza attuale / Velocità media
- *Nota*: L'estrapolazione lineare è affidabile solo per i primi 30-60 minuti.

### 3. Incertezza Temporale
- **0–30 min**: Alta affidabilità (estrapolazione radar)
- **30–90 min**: Media affidabilità (radar + tendenza NWP)
- **>90 min**: Bassa affidabilità (prevale il dato dei modelli numerici)

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
