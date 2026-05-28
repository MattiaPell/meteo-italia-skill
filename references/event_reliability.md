---
source: "LLM-generated"
last_verified: "2026-05-28"
confidence: "low"
verification_needed:
  - "Probabilità corretta"
  - "Orizzonte temporale"
---

# Affidabilità Contestuale per Tipo di Evento — Italia

Matrice evento × orizzonte temporale per stimare l'affidabilità reale del forecast,
indipendente dalla sola distanza temporale.

---

## Matrice Principale

| Tipo evento | 0-6h | 6-24h | 1-3gg | 4-7gg | >7gg |
|---|---|---|---|---|---|
| **Fronte atlantico** | Alta | Alta | Buona | Media | Bassa |
| **Neve frontale** | Alta | Alta | Buona | Media | Bassa |
| **Temporale convettivo isolato** | Media | Bassa | Molto bassa | No | No |
| **MCS organizzato (Padana)** | Alta | Buona | Media | Bassa | No |
| **Ondata di calore** | Alta | Alta | Alta | Media | Bassa |
| **Ondata di freddo** | Alta | Alta | Alta | Media | Bassa |
| **Bora** | Alta | Alta | Buona | Media | Bassa |
| **Foehn** | Alta | Alta | Buona | Bassa | No |
| **Tramontana** | Alta | Alta | Buona | Media | Bassa |
| **Scirocco** | Alta | Alta | Buona | Media | Bassa |
| **Nebbia padana** | Media | Media | Bassa | Molto bassa | No |
| **Neve in pianura** | Alta | Media | Bassa | Molto bassa | No |
| **Grandine** | Media | Bassa | Molto bassa | No | No |
| **Alluvione (eventi estremi)** | Alta | Buona | Media | Bassa | No |
| **Acqua Alta (Venezia)** | Alta | Buona | Media | Bassa | No |
| **Siccità / assenza pioggia** | Alta | Alta | Alta | Buona | Media |

---

## Come Usare la Matrice

1. **Identifica il tipo di evento** dai dati (weather_code, CAPE, pattern vento, ecc.)
2. **Trova l'orizzonte** dell'analisi richiesta
3. **Leggi l'affidabilità contestuale** → aggiungila sempre nel report
4. Se affidabilità è "Bassa" o "No": segnala esplicitamente che il forecast è indicativo

### Esempio pratico
> Utente: "Grandine sabato?" (orizzonte 4 giorni)
> → Tipo evento: grandine (convettivo)
> → Affidabilità a 4gg: **No** (non prevedibile con affidabilità)
> → Report: "I modelli mostrano potenziale instabilità sabato (CAPE elevato),
>    ma la grandine è un fenomeno convettivo non prevedibile oltre 48h.
>    Verificare venerdì mattina con aggiornamento modelli."

---

## Spiegazione dei Livelli

| Livello | Probabilità che il forecast sia corretto | Azione consigliata |
|---|---|---|
| **Alta** | >80% | Fidati del forecast, pianifica di conseguenza |
| **Buona** | 65-80% | Forecast affidabile, tieni d'occhio gli aggiornamenti |
| **Media** | 50-65% | Scenario probabile ma con incertezza significativa |
| **Bassa** | 35-50% | Solo tendenza indicativa, non pianificare su dettagli |
| **Molto bassa** | 20-35% | Solo pattern sinottico generale affidabile |
| **No** | <20% | Non prevedibile con i modelli attuali |

---

## Segnali che Aumentano l'Affidabilità

- **Tutti i modelli concordano**: +1 livello di affidabilità
- **ECMWF ensemble compatto** (spread ridotto): +1 livello
- **Pattern sinottico stabile e ben definito**: +1 livello
- **Evento già in atto o nelle prossime 3h**: Alta per definizione

## Segnali che Riducono l'Affidabilità

- **Alta variabilità tra modelli** (σ > 30% del valore medio): -1 livello
- **Evento dipende da convettività locale** (grandine, temporale isolato): -1 livello
- **Situazione sinottica caotica** (cut-off low, depressione mediterranea): -1 livello
- **Estate sul Mediterraneo centrale**: -1 livello (alta convettività imprevedibile)

---

## Fenomeni Particolarmente Difficili da Prevedere in Italia

### Temporali sul Tirreno e in Liguria
I sistemi V-shaped che si formano sul Golfo di Genova sono tra i più difficili da prevedere.
Anche a 6h di distanza possono sorprendere per intensità e posizione.
→ Usa sempre ensemble e segnala alta incertezza anche a breve termine.

### Bora Scura vs Bora Chiara
La Bora "chiara" (con cielo sereno) è più prevedibile della Bora "scura" (con precipitazioni).
La presenza di precipitazioni associate alla Bora aumenta l'incertezza sui quantitativi.

### Quota neve in Appennino
La quota neve in Appennino è particolarmente difficile da prevedere perché:
- I rilievi sono più bassi e la temperatura di transizione pioggia/neve è vicina all'isoterma 0°C
- Piccole variazioni di traiettoria del fronte cambiano drasticamente la quota neve
→ Dai sempre un range di ±200-300m sulla quota neve appenninica.

### Alluvioni lampo in Calabria e Sicilia
Fenomeni a scala sub-chilometrica, spesso innescati da sistemi TLC (Tropical-Like Cyclone / Medicane).
Quasi impossibili da localizzare con precisione anche a 12h.
→ Segnala sempre la zona a rischio, non il comune specifico.