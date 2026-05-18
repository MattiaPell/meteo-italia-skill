# Fenomeni Meteorologici Locali Italiani — Riconoscimento e Flag

Guida per identificare automaticamente i fenomeni tipici italiani dai dati dei modelli.

---

## FOEHN

### Cos'è
Vento caldo e secco che scende dalle Alpi verso la pianura padana settentrionale.
Si forma quando una perturbazione atlantica porta aria umida sul versante nord alpino:
l'aria precipita sul versante sud perdendo umidità e riscaldandosi adiabatica.

### Dove colpisce
Valle d'Aosta, Piemonte nord (Torino, Cuneo), Lombardia nord (Lecco, Como, Varese),
Alto Adige (valle dell'Adige), Veneto alpino (Belluno)

### Segnali nei dati (flag se presenti ≥3 di questi)
- Vento da N/NNE >30 km/h sulle stazioni alpine
- T in aumento rapido (+5-10°C in poche ore) sul versante meridionale
- UR <25% (spesso <15%)
- Pressione in calo a nord delle Alpi, in aumento a sud
- `weather_code` = 0 (cielo sereno) sul versante padano mentre piove sulle Alpi
- Quota isoipsa 850hPa alta (>1500m geopotenziale)

### Come riportarlo
```
🌬️ FOEHN ATTIVO — Versante alpino meridionale
T anomala: +{X}°C rispetto alla norma | UR: {Y}%
Impatti: secchezza (rischio incendi), visibilità eccellente, T percepita mite
Durata tipica: 12-48h | Cessa con il passaggio del fronte
```

---

## BORA

### Cos'è
Vento freddo, secco e fortissimo da NE/ENE che colpisce il Golfo di Trieste e
l'alto Adriatico. Si forma quando masse d'aria fredda continentale scavalcano
il Carso e accelerano verso il mare (effetto canalizzazione + caduta adiabatica).

### Dove colpisce
Trieste (epicentro), Gorizia, Udine costiero, venezia Giulia, Alto Adriatico,
talvolta Venezia e costa istriana.

### Classificazione
- **Bora chiara**: cielo sereno, aria fredda secca → più prevedibile
- **Bora scura**: cielo coperto, precipitazioni associate → meno prevedibile, più pericolosa

### Segnali nei dati (flag se ≥2 di questi)
- Vento da ENE (60-90°) a Trieste >40 km/h sostenuto
- Raffiche previste >70 km/h
- T in calo brusco (>5°C in 3h)
- UR <40% (Bora chiara) oppure UR alta con precipitazioni (Bora scura)
- Gradiente di pressione N-S tra Slovenia e Adriatico

### Soglie di intensità
| Categoria | Velocità sostenuta | Raffica | Impatti |
|---|---|---|---|
| Debole | 20-40 km/h | 50-70 km/h | Fastidio pedonale |
| Moderata | 40-60 km/h | 70-100 km/h | Stop navi, disagi traffico |
| Forte | 60-80 km/h | 100-130 km/h | Danni, chiusura porto |
| Eccezionale | >80 km/h | >130 km/h | Emergenza (Nevera 2023: >200 km/h) |

### Come riportarlo
```
💨 BORA {INTENSITÀ} — Alto Adriatico / Trieste
Vento: {X} km/h sostenuto | Raffiche attese: {Y} km/h
Tipo: Chiara / Scura
Impatti: {navigazione, traffico, strutture, temperature}
```

---

## TRAMONTANA

### Cos'è
Vento freddo da N/NNW che scende dall'entroterra verso le coste tirreniche e la Sardegna.
Porta aria continentale fredda, cielo limpido, mare agitato.

### Dove colpisce
Liguria di ponente, Toscana (costa), Lazio (costa), Sardegna (tutta), Corsica,
Mar Tirreno

### Segnali nei dati
- Vento da N/NNW >25 km/h
- T in calo moderato (2-5°C)
- UR <45%
- `cloud_cover` <20% (cielo sereno)
- `weather_code` 0-2

### Come riportarlo
```
🌬️ TRAMONTANA — Costa tirrenica / Sardegna
Vento: {X} km/h | Mare: {stato stimato}
Impatti: tempo bello e fresco, mare agitato, visibilità eccellente
```

---

## MAESTRALE (MISTRAL)

### Cos'è
Vento forte, fresco e secco da NW che entra dal Rodano e soffia sul Mediterraneo
centrale. In Italia colpisce duramente la Sardegna e il Mar Tirreno.

### Dove colpisce
Sardegna (soprattutto coste Ovest e Nord), Corsica, Mar Tirreno, Sicilia,
occasionalmente coste tirreniche peninsulari.

### Segnali nei dati (flag se ≥2 di questi)
- Vento da NW (290-330°) >30 km/h (Sardegna)
- Raffiche >70 km/h in mare aperto
- UR in deciso calo
- `weather_code` 0-3 (cielo limpido, ottima visibilità)
- Mare agitato (Beaufort ≥6) sulle coste occidentali sarde

### Come riportarlo
```
🌬️ MAESTRALE — Sardegna / Mar Tirreno
Vento: {X} km/h | Mare: {stato stimato} su coste Ovest
Impatti: calo T (refrigerio estivo), mareggiata su Sardegna occidentale, visibilità eccellente
```

---

## LIBECCIO

### Cos'è
Vento caldo e umido da WSW/SW che porta perturbazioni atlantiche sul Tirreno.
È il principale responsabile delle piogge abbondanti su Liguria, Toscana e Sardegna.

### Dove colpisce
Mar Tirreno, Liguria, Toscana, Lazio tirrenico, Sardegna occidentale

### Segnali nei dati
- Vento da WSW/SW (210-250°) >20 km/h
- UR >70-80%
- Precipitazioni significative sulla costa tirrenica
- T in aumento relativo (aria atlantica mite)
- `weather_code` 51-65 (piogge)

### Come riportarlo
```
🌧️ LIBECCIO — Mar Tirreno
Piogge: {X}mm attesi | Vento: {Y} km/h da WSW
Impatti: precipitazioni abbondanti su Liguria/Toscana/Sardegna ovest, mare mosso
```

---

## SCIROCCO

### Cos'è
Vento caldo, umido e sabbioso da S/SE che origina dal Sahara e attraversa il
Mediterraneo raccogliendo umidità. Porta caldo intenso, cielo lattiginoso (polvere
sahariana), precipitazioni fangose ("pioggia di sabbia"), mare agitato da S.

### Dove colpisce
Sud Italia (Sicilia, Calabria, Campania), Sardegna, Malta, talvolta Centro Italia

### Classificazione stagionale
- **Estate**: Scirocco secco, T >40°C, rischio incendi
- **Autunno/Primavera**: Scirocco umido, precipitazioni + sabbia, T elevata ma non estrema

### Segnali nei dati
- Vento da S/SSE/SE (150-200°) >20 km/h
- T anomala: +5-15°C rispetto alla norma stagionale
- UR >60-70% (scirocco umido) oppure UR <30% (scirocco secco estivo)
- `weather_code` spesso 3 (coperto/lattiginoso) anche senza pioggia
- Particolato PM10 elevato (polvere sahariana — non in Open-Meteo, menziona Copernicus)

### Soglie
- T >35°C + vento da S → **Scirocco intenso** (impatto sanitario)
- T >40°C → **Emergenza calore** (tipico Sicilia/Calabria in luglio-agosto)

### Come riportarlo
```
🌡️ SCIROCCO {SECCO/UMIDO} — Sud Italia / Sicilia
T anomala: {X}°C sopra la norma | Vento: {Y} km/h da {DIR}
Polvere sahariana: probabile (cielo lattiginoso/color rame)
Impatti: {caldo intenso, rischio incendi, piogge fangose, mare agitato da S}
```

---

## GRECALE

### Cos'è
Vento freddo-fresco da NE/ENE che scorre sull'Adriatico. Più moderato della Bora,
porta instabilità sul versante adriatico e coste orientali della Sicilia.

### Dove colpisce
Mar Adriatico, coste pugliesi, Sicilia orientale (Catania, Messina), Malta

### Segnali nei dati
- Vento da NE/ENE (30-70°) >20 km/h
- Precipitazioni sul versante adriatico orientale e est Sicilia
- T in calo moderato
- Mare mosso/agitato sull'Adriatico

### Come riportarlo
```
💨 GRECALE — Adriatico / Sicilia orientale
Vento: {X} km/h da NE | Precipitazioni: {Y}mm costa adriatica
```

---

## GARBINO (FOEHN APPENNINICO)

### Cos'è
Vento di caduta caldo e molto secco che scende dall'Appennino verso il versante
adriatico. È l'equivalente del Foehn alpino ma alimentato da correnti da SW.

### Dove colpisce
Romagna (Rimini, Riccione), Marche (Ancona, Pesaro), Abruzzo (Pescara, Teramo),
Molise.

### Segnali nei dati (flag se ≥3 di questi)
- Vento da SW (220-260°) >25 km/h sul versante adriatico
- T in aumento esplosivo (+5-15°C rispetto alla massa d'aria preesistente)
- UR <30% (spesso <20%)
- "Stau" (nuvole e pioggia) sul versante tirrenico (Toscana/Lazio/Umbria)
- Cielo sereno o con nubi lenticolari sul versante adriatico

### Come riportarlo
```
🔥 GARBINO ATTIVO — Versante Adriatico
T: {X}°C | UR: {Y}% | Raffica: {Z} km/h
Impatti: caldo improvviso e intenso, rischio incendi elevato, stress per colture
```

---

## PONENTINO (BREZZA ROMANA)

### Cos'è
Brezza di mare estiva tipica di Roma e del litorale laziale. Si leva nel primo
pomeriggio portando refrigerio dopo il riscaldamento mattutino.

### Dove colpisce
Roma (area urbana), litorale romano (Ostia, Fregene), pianura pontina.

### Segnali nei dati
- Vento da W/WSW (250-280°) tra le 14:00 e le 20:00
- Velocità 15-30 km/h (decisa ma non burrascosa)
- T in lieve calo o stazionaria mentre l'entroterra scalda
- UR in aumento (aria umida dal mare)
- Stagione: aprile–settembre

### Come riportarlo
```
🌊 PONENTINO ATTIVO — Roma / Litorale Laziale
Vento: {X} km/h da W | Orario previsto: {HH}-{HH}
Impatti: refrigerio serale, aumento UR, moto ondoso leggero
```

---

## NEBBIA PADANA

### Cos'è
Nebbia da irraggiamento o da avvezione che si forma sulla Pianura Padana nelle notti
con cielo sereno, vento assente e aria umida. Fenomeno tipico ottobre-febbraio.

### Zone critiche (ordinate per frequenza)
Lodi, Cremona, Mantova, Ferrara, Rovigo, Pavia, Alessandria, Vercelli,
Forlì-Cesena (pianura), Foggia (Tavoliere), bassa veronese

### Segnali nei dati (flag se ≥3)
- UR >92% alle ore 21-06
- Vento <5 km/h
- T prossima al punto di rugiada (T - Tdew <2°C)
- `cloud_cover` <10% (cielo sereno → irraggiamento notturno)
- Stagione: ottobre-febbraio
- Pianura alluvionale (quota <50m)

### Probabilità nebbia
| Condizioni | Probabilità |
|---|---|
| UR>95% + vento<3 km/h + T-Tdew<1°C | Alta (>70%) |
| UR>90% + vento<5 km/h + T-Tdew<2°C | Media (40-70%) |
| UR>85% + vento<8 km/h | Bassa (<40%) |

### Come riportarlo
```
🌫️ RISCHIO NEBBIA — Pianura Padana / {ZONA}
Probabilità: {Alta/Media/Bassa}
Orario formazione: {HH}-{HH} | Dissoluzione: {ore 09-11 se irraggiamento}
Visibilità stimata: {<100m / 100-500m / 500m-1km}
Impatti: autostrade {A1, A4, A13...}, aeroporti {MXP, VRN, BGY, BLQ...}
```

---

## MCS PADANO (Mesoscale Convective System)

### Cos'è
Sistema temporalesco organizzato su scala mesoscalare che si sviluppa sulla Pianura
Padana, tipicamente in estate. Può portare grandine grossa (>5cm), vento a raffica
>100 km/h (downburst), precipitazioni intense (>50mm/h).

### Stagione: maggio-settembre, picco giugno-agosto

### Segnali nei dati (flag se ≥2)
- CAPE >800 J/kg (significativo), >1500 J/kg (alto), >2500 J/kg (molto alto)
- `lifted_index` < -3 (instabilità elevata), < -6 (estrema)
- Wind shear in quota (differenza vento 850hPa vs 500hPa >15 m/s → MCS organizzato)
- `weather_code` 95-99 previsto
- Zone: Pianura Padana, Prealpi lombardo-venete, Emilia occidentale

### Scenario grandine
- CAPE >1500 J/kg + LI <-4 + wind shear → probabilità grandine **significativa**
- CAPE >2500 J/kg + LI <-6 → probabilità grandine grossa (>2cm)

### Come riportarlo
```
⛈️ RISCHIO MCS / TEMPORALE ORGANIZZATO — Pianura Padana
CAPE: {X} J/kg | LI: {Y} | Shear: {stimato}
Rischio grandine: {Basso/Medio/Alto/Molto alto}
Finestra temporale: {HH}-{HH} (picco convettivo pomeridiano 14-18)
Impatti potenziali: grandine, vento da downburst, allagamenti lampo
```

---

## STAU ALPINO E APPENNINICO

### Cos'è
Piogge orografiche intense sul versante "sopravvento" dei rilievi quando un flusso
umido si scontra contro la catena montuosa.

### Stau Alpino (flusso da S/SW)
- Versante alpino meridionale: Alpi Lepontine, Ortler, Adamello, Alpi Carniche
- Quantitativi: 50-200mm in 24h (record: oltre 500mm)
- Rischio: alluvioni nei fondovalle, frane, piene dei fiumi alpini (Adige, Piave, Tagliamento)

### Stau Appenninico (flusso da W/SW)
- Versante tirrenico: Liguria, Toscana, Calabria tirrenica
- Versante adriatico: in flusso da E/NE (Bora/Grecale)
- Quantitativi: 30-100mm in 12h

### Segnali nei dati
- Vento sostenuto perpendicolare alla catena >20 km/h
- UR >80% in quota
- Precipitazioni concentrate sul versante sopravvento
- Cielo sereno sul versante sottovento (ombra pluviometrica)

---

## MEDICANE (Tropical-Like Cyclone Mediterraneo)

### Cos'è
Sistema simil-tropicale che si forma sul Mediterraneo (raro, ma in aumento).
Porta piogge catastrofiche, vento ciclonica intenso, moto rotatorio ben definito.

### Stagione: ottobre-novembre principalmente, ma possibile settembre-dicembre

### Zone più colpite storicamente
Ionio (Calabria, Sicilia orientale), Mar Libico (Libia, Tunisia, Sicilia meridionale)

### Segnali nei dati
- Nucleo caldo in quota riconoscibile sull'analisi sinottica
- Pressione centrale <990 hPa
- Gradiente di pressione molto forte intorno al centro
- Vento circolare ben organizzato
- Precipitazioni estreme (>100mm/6h) nella zona di convergenza

### Come riportarlo
```
🌀 POSSIBILE MEDICANE / TLC — {ZONA}
Questo fenomeno è RARO e ad alta incertezza previsionale.
Impatti potenziali: ESTREMI — precipitazioni fino a 300+mm, vento >100 km/h
Affidabilità previsione: Media (36-48h), Bassa (>48h)
Fonti da monitorare: ECMWF ensemble, Protezione Civile, MeteoAM
```

---

## TEMPORALE AUTORIGENERANTE (V-SHAPED)

### Cos'è
Sistema temporalesco mesoscalare (MCS) altamente organizzato e stazionario che assume una forma a "V" nelle immagini satellitari e radar. È caratterizzato da una "cella madre" continuamente alimentata da aria calda e umida in ascesa, mentre le nuove celle si formano ripetutamente nello stesso punto (autorigenerazione). In Italia è il principale responsabile delle alluvioni lampo (flash floods) più distruttive.

### Dove colpisce
Liguria (soprattutto centro-levante: Genova, Chiavari, Spezia), Toscana (costa e rilievi retrostanti: Massa, Carrara, Livorno), Sardegna, Sicilia (versante ionico), Calabria.

### Segnali nei dati (flag se presenti ≥3 di questi)
- **Convergenza al suolo** marcata (es. Tramontana fredda vs Scirocco caldo/umido nel Golfo di Genova)
- **Moisture Flux** (flusso di umidità) elevato e persistente nei bassi strati verso la linea di convergenza
- **CAPE** >1000-1500 J/kg persistente nell'area di alimentazione
- **Vento a 500hPa** forte (>40-50 nodi) che "stira" l'incudine del temporale creando la forma a V
- **Stazionarietà**: linea di convergenza che non si sposta per 3+ ore
- **Precipitazioni concentrate**: modelli ad alta risoluzione (ICON D2, AROME) che prevedono >100mm in 3-6h su una fascia stretta

### Come riportarlo
```
⛈️ RISCHIO TEMPORALE V-SHAPED (AUTORIGENERANTE) — {ZONA}
Fenomeno ESTREMO e localizzato ad alto impatto.
Pericolo: Alluvioni lampo, esondazioni repentine, colate di fango.
Segnali: Convergenza {Vento1} vs {Vento2} | CAPE: {X} J/kg | Stazionarietà prevista.
Impatti: Precipitazioni potenzialmente >200mm in 6h.
Affidabilità: Bassa localizzazione (difficile prevedere l'esatto comune), Alta potenziale evento.
```

---

## CUSCINO FREDDO (PO VALLEY COLD POOL)

### Cos'è
Strato di aria fredda e densa che ristagna nei bassi strati della Pianura Padana (o conche appenniniche) durante l'inverno. Grazie alla protezione orografica delle Alpi e degli Appennini, questa massa d'aria resiste all'erosione da parte di venti caldi (Scirocco/Libeccio) che scorrono al di sopra di essa.

### Dove colpisce
Intera Pianura Padana (specie Piemonte, Lombardia, Emilia occidentale), conche di Toscana (Valdarno, piana di Lucca), Umbria (conca Ternana).

### Segnali nei dati (flag se presenti ≥3 di questi)
- **Inversione termica**: T(2m) < T(850hPa) o T(2m) < T(elevation+1000m)
- **Vento calmo**: velocità <5 km/h nei bassi strati (Pianura Padana)
- **Umidità elevata**: UR(2m) >85% con nebbia o nubi basse (Galaverna)
- **Pressione elevata**: regime anticiclonico invernale persistente
- **Contesto**: flusso di aria mite in quota (T850hPa >0°C) mentre al suolo persiste il gelo

### Come riportarlo
```
❄️ CUSCINO FREDDO ATTIVO — Pianura Padana / {ZONA}
T suolo: {X}°C | T 850hPa: {Y}°C → Forte inversione termica
Impatti: Ristagno inquinanti (AQI critico), nebbia persistente, rischio gelicidio se piove.
```

---

## GELICIDIO (FREEZING RAIN)

### Cos'è
Fenomeno pericolosissimo in cui la pioggia, cadendo in uno strato d'aria al suolo con temperatura sottozero (cuscino freddo), congela istantaneamente a contatto con le superfici, creando uno strato di ghiaccio trasparente (vetrone/black ice).

### Meccanismo fisico
Sovrascorrimento di aria calda e umida (fronte caldo) sopra un cuscino freddo preesistente. La neve fonde attraversando lo strato caldo in quota e diventa pioggia superraffreddata prima di toccare il suolo gelido.

### Segnali nei dati (flag se presenti TUTTI i seguenti)
- **Weather code**: 66 (Slight freezing rain) o 67 (Heavy freezing rain)
- **T suolo**: temperature_2m < 0°C
- **T quota**: temperature_850hPa > 0°C (strato di fusione)
- **Precipitazioni**: pioggia prevista dai modelli numerici
- **Zone**: Appennino settentrionale (versante padano), valli interne di Liguria/Toscana, Basso Piemonte.

### Come riportarlo
```
⚠️ ALLERTA GELICIDIO (PIOGGIA CONGELANTESI) — {ZONA}
Fenomeno ad ALTO RISCHIO per viabilità e infrastrutture.
T suolo: {X}°C | T quota: {Y}°C | Pioggia prevista: {Z}mm
Impatti: Formazione di ghiaccio su strade (black ice), rottura rami, danni a linee elettriche.
Raccomandazione: Massima cautela alla guida, rischio cadute pedonali estremo.
```
