# Climatologia ERA5 — Guida all'Uso e Valori di Riferimento

## Come Recuperare i Dati Climatologici

### API Open-Meteo Archive (ERA5, dal 1940)
```
GET https://archive-api.open-meteo.com/v1/archive
  ?latitude={LAT}&longitude={LON}
  &start_date={YYYY-MM-DD}   ← stesso mese/giorno degli anni precedenti
  &end_date={YYYY-MM-DD}
  &daily=temperature_2m_max,temperature_2m_min,precipitation_sum,
         wind_speed_10m_max,et0_fao_evapotranspiration
  &timezone=Europe/Rome
```

### Strategia consigliata
Scarica gli ultimi 30 anni per la stessa settimana del calendario → calcola media e σ.
Per risparmio token: scarica gli ultimi 10 anni (sufficiente per la maggior parte delle analisi).

```
# Esempio: riferimento climatologico per il 15 maggio
start_date: {ANNO-10}-05-10   ← finestra ±5 giorni per robustezza statistica
end_date:   {ANNO-1}-05-20
```

### Output atteso
- `T_max_media`: media delle T massime nel periodo storico
- `T_min_media`: media delle T minime
- `T_max_sigma`: deviazione standard T max
- `precip_media_giornaliera`: mm/giorno medi
- `precip_sigma`: variabilità precipitazioni

## Classificazione Anomalie

| Scarto dalla media | Classificazione | Come riportarlo |
|---|---|---|
| Entro ±0.5σ | Nella norma | "nella norma per il periodo" |
| +0.5 a +1.5σ | Leggermente sopra la norma | "+X°C rispetto alla media" |
| -0.5 a -1.5σ | Leggermente sotto la norma | "-X°C rispetto alla media" |
| +1.5 a +2.5σ | Anomalia significativa | "anomalia calda/fredda significativa" |
| -1.5 a -2.5σ | Anomalia significativa | |
| >+2.5σ | Evento estremo / eccezionale | "evento eccezionale — raro nel periodo" |
| <-2.5σ | Evento estremo / eccezionale | |

## Valori Climatologici di Riferimento per Regione

*(ERA5 1991-2020 — periodo di riferimento WMO)*

Seleziona la regione per visualizzare i dati dei capoluoghi di provincia:

| Macroarea | Regioni |
|-----------|---------|
| **Nord-Ovest** | [Liguria](climatology/liguria.md), [Lombardia](climatology/lombardia.md), [Piemonte](climatology/piemonte.md), [Valle d'Aosta](climatology/valle_aosta.md) |
| **Nord-Est** | [Emilia-Romagna](climatology/emilia_romagna.md), [Friuli-Venezia Giulia](climatology/friuli_venezia_giulia.md), [Trentino-Alto Adige](climatology/trentino_alto_adige.md), [Veneto](climatology/veneto.md) |
| **Centro** | [Lazio](climatology/lazio.md), [Marche](climatology/marche.md), [Toscana](climatology/toscana.md), [Umbria](climatology/umbria.md) |
| **Sud** | [Abruzzo](climatology/abruzzo.md), [Basilicata](climatology/basilicata.md), [Calabria](climatology/calabria.md), [Campania](climatology/campania.md), [Molise](climatology/molise.md), [Puglia](climatology/puglia.md) |
| **Isole** | [Sardegna](climatology/sardegna.md), [Sicilia](climatology/sicilia.md) |

---

## Record Storici Notevoli per Zona (contesto per eventi estremi)

### Temperature
- **Record caldo Italia**: 48.8°C — Siracusa, 11 agosto 2021
- **Record freddo Italia**: -49.6°C — Monte Pizzoc (BL), 5 febbraio 1986 (quota ~1500m)
- **Record caldo pianura padana**: 42.6°C — Ferrara, luglio 2015
- **Record caldo Roma**: 40.9°C — 31 luglio 2021
- **Ondata calore più intensa**: luglio 2022 (diffusa su tutta Italia)

### Precipitazioni
- **Record pioggia in 1h (Italia)**: ~190mm — Genova 2014
- **Record pioggia in 24h (Italia)**: ~948mm — Brugneto (GE), 1970
- **Alluvione Polesine**: novembre 1951 — riferimento storico per Rovigo/Delta Po
- **Alluvione Firenze**: 4 novembre 1966

### Vento
- **Bora più intensa registrata**: >200 km/h — Trieste, Nevera 2023
- **Record vento Italia**: 220 km/h — Cima Paganella (TN), 1967

---

## Indici Derivati Utili

### Heat Index (temperatura percepita con afa)
Usa quando T >27°C e UR >40%:
```
HI ≈ -8.78 + 1.61*T + 2.34*UR - 0.146*T*UR + 0.013*T²*UR + 0.002*T*UR² - ...
(formula NOAA semplificata — accurata ±1.5°C)
```
Soglie: <27°C (ok), 27-32°C (cautela), 32-41°C (attenzione), 41-54°C (pericolo), >54°C (emergenza)

### Wind Chill (temperatura percepita con vento freddo)
Usa quando T <10°C e vento >4.8 km/h:
```
WC = 13.12 + 0.6215*T - 11.37*V^0.16 + 0.3965*T*V^0.16
(V in km/h, T in °C)
```

## Bilancio Idrologico Nimbus (Rain vs ET0)

L'evapotraspirazione potenziale (ET0) confrontata con le precipitazioni indica lo stato idrico reale. Nimbus utilizza il **Bilancio Idrico a 7 giorni** per valutare lo stress delle colture.

**Formula**: `Bilancio = Precipitazioni_7gg (mm) - ET0_7gg (mm)`

| Bilancio (7gg) | Stato Nimbus | Impatto Operativo |
|---|---|---|
| **> +20 mm** | **Surplus Idrico** 🌊 | Terreno saturo, rischio ristagni, stop irrigazione |
| **-10 a +20 mm** | **Equilibrio** ✅ | Condizioni ottimali per la maggior parte delle colture |
| **-30 a -10 mm** | **Deficit Moderato** ⚠️ | Inizio stress idrico per orticole e prati |
| **< -30 mm** | **Stress Idrico Severo** 🔥 | Irrigazione di soccorso necessaria, rapido disseccamento |

**Nota Operativa**: Se `ET0 > 5mm/giorno` (tipico di giornate calde/ventose), il bilancio peggiora rapidamente.

**Soglie Umidità del Suolo (soil_moisture_0_to_1cm):**
- **<0.15 m³/m³**: Suolo molto secco (punto di appassimento)
- **0.15–0.30 m³/m³**: Umidità moderata
- **>0.35 m³/m³**: Suolo molto umido / saturo

---

## 📈 Somma Termica (GDD - Growing Degree Days)

Indice termico per valutare lo sviluppo delle colture e prevedere le fasi fenologiche.

### Formula
```
GDD = max((Tmax + Tmin) / 2 - Tbase, 0)
```

### Soglie Tbase per l'Italia
- **Mais**: 10°C
- **Vite**: 10°C
- **Frumento**: 0°C
- **Olivo**: 10°C

### Applicazione
- **0–300 GDD**: Fase iniziale (risveglio/germogliamento)
- **1200–1600 GDD**: Maturazione per molte varietà di Mais
- **Fioritura Vite**: Tipicamente raggiunta tra 350 e 450 GDD (base 10°C dal 1° gennaio)

---

## Focus Agrometeorologico — Soglie di Germinazione

Riferimento per l'uso della variabile `soil_temperature_6cm` (Step 3A). Soglie ARPAE/ARPAV per le principali colture italiane.

| Coltura | T suolo Min. | T suolo Ottimale | Note |
|---|---|---|---|
| **Mais** | 10°C | 12°C (stabile) | Sotto i 10°C la germinazione si arresta |
| **Pomodoro** | 12°C | 15–18°C | Sensibile ai ritorni di freddo |
| **Barbabietola** | 5–6°C | 10–12°C | Semina precoce possibile |
| **Girasole** | 8°C | 10–12°C | |

**Nota Operativa**: Utilizzare la temperatura del suolo media giornaliera a 6cm per valutare la finestra di semina.

---

## 🍇 Focus Viticoltura (Vitis vinifera)

### Rischio Peronospora (Regola dei Tre Dieci + Wetness)
La regola empirica per l'avvio delle infezioni primarie di *Plasmopara viticola*:
1. **Temperatura**: T minima e media > 10°C.
2. **Germogli**: Lunghezza del tralcio > 10 cm.
3. **Pioggia**: Almeno 10 mm di pioggia caduti in 24-48 ore.
4. **Leaf Wetness**: `leaf_wetness_probability` > 50% per almeno 4-6 ore consecutive accelera l'infezione.
*Nota: Se tutte e quattro le condizioni sono vere, il rischio di infezione è critico.*

### Altre Soglie Vite
- **Fioritura**: Condizioni ideali 15–25°C e UR 50–70%. Piogge battenti o bagnatura fogliare persistente durante la fioritura possono causare colatura (mancata allegagione).
- **Gelate Tardive**: Danni gravi se T < -1/-2°C dopo il germogliamento (marzo-maggio).
- **Oidio (Mal Bianco)**: Favorito da T 20–27°C e UR elevata. A differenza della Peronospora, l'Oidio non richiede bagnatura fogliare liquida (anzi, la pioggia battente può lavare le spore), ma beneficia di `leaf_wetness_probability` tra 10-30% (umidità interstiziale).

---

## 🫒 Focus Olivicoltura (Olea europaea)

### Resistenza al Freddo
- **Danni lievi (foglie/germogli)**: T < -5°C.
- **Danni gravi (legno)**: T < -10°C.
- **Morte della pianta**: T < -12/-15°C (specialmente se persistente).

### Mosca dell'Olivo (*Bactrocera oleae*)
- **Sviluppo ottimale**: T 22–25°C.
- **Lethal Threshold**: T > 30°C associata a UR < 30% causa elevata mortalità di uova e larve di I età.
- **Stop attività**: T > 35°C per più giorni arresta l'attività degli adulti.

---

## Focus Apistico — Soglie di Attività

Riferimento per lo use case Apicoltura (Bee Flight & Nectar). Soglie basate su standard CREA-AA e ARPA regionali.

### Attività di Volo (Bottinatura)
| Parametro | Soglia | Interpretazione |
|---|---|---|
| **Temperatura Aria** | < 10°C | Volo assente (api nel glomere) |
| **Temperatura Aria** | 10–15°C | Attività limitata (voli di purificazione/acqua) |
| **Temperatura Aria** | 16–25°C | **Attività ottimale** di bottinatura |
| **Temperatura Aria** | > 35°C | Attività ridotta (ventilazione alveare) |
| **Vento** | > 25 km/h | Difficoltà di volo, rientro forzato |
| **Pioggia** | Qualsiasi | Stop attività di volo |

### Secrezione Nettarifera (Bloom Context)
Il nettare richiede un bilancio tra umidità e calore.
- **Acacia (Robinia)**: Richiede notti miti (**T min > 12-14°C**) e UR elevata (> 60%). Il vento secco (Foehn/Garbino) "brucia" il nettare.
- **Castagno**: Favorito da clima caldo-umido (UR > 70%), soffre la siccità prolungata.
- **Agrumi**: Sensibili a sbalzi termici e venti forti che causano la caduta dei fiori.

### Rischio Gelate Tardive (Aprile-Maggio)
- **T < 0°C**: Danno irreversibile ai fiori di Acacia e Agrumi (perdita raccolto anno).
- **T < -2°C**: Danno ai germogli di Castagno.

---

## Anomalie di Temperatura Percepita (Apparent T)

Confronta `apparent_temperature` (forecast) con `apparent_temperature` (archive) per valutare lo stress termico reale (Afa/Wind Chill) rispetto al passato.

| Anomalia Percepita | Classificazione | Impatto Sanitario |
|---|---|---|
| +1.0 a +3.0σ | Ondata di calore umida (Afa) | Disagio fisico, rischio per soggetti fragili |
| > +3.0σ | Caldo estremo eccezionale | Pericolo imminente di colpo di calore |
| -1.0 a -3.0σ | Freddo ventoso intenso | Elevato rischio ipotermia/congelamento |
| < -3.0σ | Burian / Gelo eccezionale | Emergenza freddo |

### Probabilità gelata
T min prevista <2°C → segnala rischio gelata (vegetazione, ghiaccio su strade)
T min prevista <0°C → gelata quasi certa in zone aperte e pianura
T min prevista <-3°C → gelata intensa (danni a coltivazioni sensibili)
