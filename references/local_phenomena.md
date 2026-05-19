# Fenomeni Meteorologici Locali Italiani — Riconoscimento e Flag

Guida per identificare automaticamente i fenomeni tipici italiani dai dati dei modelli.

---

## FOEHN (FAVONIO)

### Cos'è
Vento caldo e secco che scende dalle Alpi verso la pianura padana settentrionale (chiamato Favonio in italiano).
Si forma quando una perturbazione atlantica porta aria umida sul versante nord alpino:
l'aria precipita sul versante sud perdendo umidità e riscaldandosi adiabaticamente.

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
🌬️ FOEHN (FAVONIO) ATTIVO — Versante alpino meridionale
T anomala: +{X}°C rispetto alla norma | UR: {Y}%
Impatti: secchezza (rischio incendi), visibilità eccellente, T percepita mite
Durata tipica: 12-48h | Cessa con il passaggio del fronte
```

---

## BORA

### Cos'è
Vento freddo, secco e fortissimo da NE/ENE che colpisce il Golfo di Trieste e
l'alto Adriatico. Si forma quando masse d'aria fredda continentale scavalcano
il Carso e accelerano verso il mare (effetto canalizzazione + compressione adiabatica).

### Dove colpisce
Trieste (epicentro), Gorizia, Udine costiero, Venezia Giulia, Alto Adriatico,
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

## LEVANTE

### Cos'è
Vento umido e temperato che spira da Est (90°). È spesso causato da una depressione a sud dell'Italia che richiama aria umida dal mare verso il versante tirrenico.

### Dove colpisce
Porta nubi basse e piogge su Liguria, Toscana, Lazio e Sardegna orientale (effetto stau). Causa mare mosso su coste adriatiche e ioniche.

### Segnali nei dati
- Vento da E (70–110°) >20 km/h
- UR in aumento (>75%)
- Copertura nuvolosa bassa (`cloud_cover_low` > 70%)
- Precipitazioni sul versante tirrenico o Sardegna orientale

### Come riportarlo
```
🌬️ LEVANTE — Mar Tirreno / Adriatico
Vento: {X} km/h da Est | UR: {Y}%
Impatti: Piogge costiere, nubi basse, mare mosso su versante orientale.
```

---

## OSTRO (MEZZOGIORNO)

### Cos'è
Vento caldo e umido che spira da Sud (180°). Spesso rappresenta la fase di transizione tra Scirocco e Libeccio. Porta aria mite/calda verso la Penisola.

### Dove colpisce
Coste meridionali, Sicilia e Sardegna. Può risalire fino al Tirreno centrale.

### Segnali nei dati
- Vento da S (160–200°) >15-20 km/h
- T in aumento (advezione calda)
- UR moderata o alta

### Come riportarlo
```
🌬️ OSTRO — Sud Italia / Tirreno
Vento: {X} km/h da Sud | T: {Y}°C
Impatti: Aumento termico, mare mosso da Sud.
```

---

## PONENTE

### Cos'è
Vento fresco e asciutto che spira da Ovest (270°). Porta spesso un miglioramento del tempo dopo il passaggio di un fronte atlantico, con visibilità eccellente.

### Dove colpisce
Coste tirreniche e Sardegna occidentale. È la brezza pomeridiana dominante in estate su molti litorali tirrenici (vedi anche Ponentino).

### Segnali nei dati
- Vento da W (250–290°) >20 km/h
- UR in calo (<60%)
- `weather_code` 0-2 (sereno/poco nuvoloso)
- Visibilità eccellente (>10-15 km)

### Come riportarlo
```
🌬️ PONENTE — Costa Tirrenica / Sardegna
Vento: {X} km/h da Ovest | Visibilità: {Y} km
Impatti: Tempo in miglioramento, aria secca, mare mosso su coste occidentali.
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
- **Inversione termica bassa**: T(2m) < T(925hPa) → indica ristagno d'aria e nebbia al suolo
- **Cloud cover low**: >75% (presenza di strati o nebbia persistente)
- `cloud_cover` <10% (cielo sereno → irraggiamento notturno in formazione)
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
- **CIN (Convective Inhibition)**: < 50 J/kg (assenza di "tappo" che impedisce la convezione)
- `lifted_index` < -3 (instabilità elevata), < -6 (estrema)
- Wind shear in quota (differenza vento 850hPa vs 500hPa >55 km/h → MCS organizzato)
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
Porta piogge catastrofiche, vento ciclonico intenso, moto rotatorio ben definito.

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
- **CIN**: < 50 J/kg (facilità di innesco dei nuclei temporaleschi)
- **Vento a 500hPa** forte (>75-90 km/h) che "stira" l'incudine del temporale creando la forma a V
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

## CUSCINO FREDDO (Po Valley Cold Pool)

### Cos'è
Strato di aria fredda e densa che ristagna nei bassi strati della Pianura Padana (o conche appenniniche), protetto dalla catena alpina e appenninica. Si forma tipicamente in inverno durante periodi di alta pressione e calma di vento. Grazie alla protezione orografica delle Alpi e degli Appennini, questa massa d'aria resiste all'erosione da parte di venti caldi (Scirocco/Libeccio) che scorrono al di sopra di essa. Può causare forti inversioni termiche e persistenza di nebbie e inquinanti.

### Dove colpisce
Intera Pianura Padana (specie Piemonte, Lombardia, Emilia occidentale, Veneto), conche di Toscana (Valdarno, piana di Lucca), Umbria (conca Ternana).

### Segnali nei dati (flag se presenti ≥3 di questi)
- **Inversione termica**: T(2m) < T(925hPa) o T(2m) < T(850hPa)
- **Intensità inversione**: Delta T (T925hPa - T2m) > 5°C → **Inversione forte/persistente**
- **Stagione**: Inverno (novembre–febbraio)
- **Vento calmo**: velocità <5 km/h nei bassi strati (Pianura Padana)
- **Umidità elevata**: UR(2m) >85% con nebbia o nubi basse (Galaverna)
- **Mixing Layer**: `boundary_layer_height` < 300m (aria intrappolata e scarsa ventilazione verticale)
- **Pressione elevata**: regime anticiclonico invernale persistente (`pressure_msl` > 1020 hPa)
- **Zona**: Macroaree Nord-Ovest, Nord-Est, Centro-Nord (pianura)
- **Contesto**: flusso di aria mite in quota (T850hPa >0°C) mentre al suolo persiste il gelo

### Come riportarlo
```
❄️ CUSCINO FREDDO ATTIVO — Pianura Padana / {ZONA}
Stabilità estrema: aria fredda intrappolata nei bassi strati.
T suolo: {X}°C | T 850hPa: {Y}°C → Forte inversione termica
Impatti: Ristagno inquinanti (AQI critico), nebbia persistente, rischio gelicidio se piove, T rigide anche con sole in quota.
```
*Fonte: ARPA Lombardia / ARPAE (Cuscino freddo e inversioni termiche)*

---

## GELICIDIO (Freezing Rain)

### Cos'è
Fenomeno pericolosissimo in cui la pioggia, cadendo in uno strato d'aria al suolo con temperatura sottozero (cuscino freddo), congela istantaneamente a contatto con le superfici, creando uno strato di ghiaccio trasparente (vetrone/black ice). Si verifica tipicamente quando aria calda e umida da Sud (Scirocco/Libeccio) scorre sopra un "Cuscino Freddo" preesistente.

### Meccanismo fisico
Sovrascorrimento di aria calda e umida (fronte caldo) sopra un cuscino freddo preesistente. La neve fonde attraversando lo strato caldo in quota e diventa pioggia superraffreddata prima di toccare il suolo gelido.

### Dove colpisce
Appennino settentrionale (versante padano), valli appenniniche, Pianura Padana (soprattutto Emilia e basso Piemonte), valli interne di Liguria/Toscana, conche interne del Centro.

### Segnali nei dati (flag se presenti TUTTI i seguenti)
- **Weather code / Precipitazione**: `weather_code` 66 (Slight freezing rain / debole) o 67 (Heavy freezing rain / forte)
- **T superficie**: `soil_temperature_0cm` < 0°C (fondamentale per il congelamento istantaneo)
- **T aria**: `temperature_2m` < 0°C (solitamente tra -1°C e -5°C)
- **T quota / Sovrascorrimento caldo**: `temperature_850hPa` > 0°C (strato di fusione); vento da S/SW (`wind_direction_850hPa` 150–250°) in quota
- **Precipitazioni**: pioggia prevista dai modelli numerici
- **Macroarea**: Nord-Ovest, Nord-Est, Centro-Nord

### Come riportarlo
```
⚠️ ALLERTA GELICIDIO (PIOGGIA CONGELANTESI) — {ZONA}
Fenomeno ad ALTO RISCHIO / PERICOLO ESTREMO per viabilità e infrastrutture.
T superficie: {X}°C | T aria: {Y}°C | T quota: {Z}°C | Pioggia: {W}mm
Impatti: Formazione di ghiaccio su strade (black ice / vetrone), rottura rami, danni a linee elettriche, rischio caduta cavi.
Raccomandazione: Evitare spostamenti, massima cautela alla guida, rischio cadute pedonali estremo.
```
*Fonte: WMO Codes 66/67 | Protezione Civile (Gelicidio / Pioggia congelante)*

---

## NEBBIA MARITTIMA (CALIGO / LUPA DI MARE)

### Cos'è
Nebbia da avvezione che si forma sul mare e invade la costa. Si origina in primavera quando masse d'aria calda e umida scorrono sopra la superficie marina ancora fredda (inverno appena terminato): il raffreddamento dal basso porta alla condensazione del vapore acqueo in nebbia fitta.

### Varianti Locali
- **Caligo**: tipica della Liguria (Genova, Savona) e occasionalmente dell'Alto Adriatico.
- **Lupa di Mare**: tipica dello Stretto di Messina (Sicily/Calabria) e delle coste del basso Adriatico/Ionio.

### Stagione: Marzo–Maggio (picco Aprile)

### Segnali nei dati (flag se ≥3)
- **SST < T(2m)**: Temperatura mare (Step 3F) inferiore alla temperatura aria di almeno 2-4°C
- **UR(2m) >90%** sulla costa
- **Vento debole**: brezza di mare leggera (<10-15 km/h) che "spinge" la nebbia verso terra
- **Stagione**: Primavera (Marzo-Maggio)
- **Cloud cover**: bassa o nulla (cielo sereno sopra la nebbia)

### Come riportarlo
```
🌫️ NEBBIA MARITTIMA ({NOME_LOCALE}) — Costa {ZONA}
Fenomeno: Nebbia da avvezione (aria calda su mare freddo)
Visibilità: <200m sulla costa | Entroterra: Sereno
Impatti: Disagi a navigazione, porti e aeroporti costieri (GOA, PMO, REG).
Note: Fenomeno improvviso che può causare cali termici di 5-10°C in pochi minuti.
```

---

## MACCAJA

### Cos'è
Fenomeno tipico della Liguria e del Golfo di Genova caratterizzato da nubi basse e compatte, nebbie costiere e alta umidità. Si forma quando venti meridionali (spesso Scirocco) trasportano aria calda e umida sopra la superficie marina più fredda, o quando l'aria satura viene bloccata dall'Appennino.

### Dove colpisce
Liguria (settore centro-occidentale), occasionalmente Toscana costiera e Versilia.

### Segnali nei dati (flag se presenti ≥3 di questi)
- **SST < T(2m)**: Temperatura mare inferiore alla temperatura aria (anche con scarto ridotto)
- **UR(2m) > 85-90%** sulla costa
- **Vento da S/SE/SW**: Bassa intensità (<15-20 km/h)
- **Stagione**: Primavera e Autunno
- **Cloud cover low**: >75% (nubi basse/nebbia) mentre nell'entroterra è sereno
- **Escursione termica**: Molto ridotta tra giorno e notte

### Come riportarlo
```
☁️ MACCAJA ATTIVA — Costa Ligure / {ZONA}
Cielo: Coperto da nubi basse | UR: {X}% | Vento da: {DIR}
Impatti: Umidità elevata, visibilità ridotta sulla costa, T stazionaria.
Nota: Fenomeno tipico che permane anche con alta pressione.
```

---

## BURIAN (Vento Siberiano)

### Cos'è
Vento gelido proveniente dalle steppe siberiane che porta ondate di freddo estremo in Italia. Attraversa la porta della Bora e dilaga su tutta la penisola.

### Dove colpisce
Tutta Italia, con picchi di freddo e neve su versante Adriatico e Nord.

### Segnali nei dati (flag se presenti TUTTI i seguenti)
- **T 850hPa < -10/-12°C**
- **Vento da E/NE**: Costante e sostenuto
- **UR in calo**: Aria continentale molto secca originariamente, ma si carica di umidità sull'Adriatico (vedi ASE)
- **Stagione**: Inverno (Gennaio-Marzo)
- **Anomalia termica**: >-10°C rispetto alla media

### Come riportarlo
```
❄️ ALLERTA BURIAN — ONDATA DI GELO SIBERIANO
T 850hPa: {X}°C | T suolo: {Y}°C | Vento: NE costante
Impatti: Gelo intenso, bufere di neve su versante adriatico, rischio danni a tubature e agricoltura.
```

---

## ADRIATIC SEA EFFECT (ASE) / NEVE ADRIATICA

### Cos'è
Fenomeno simile al "Lake-Effect Snow" nordamericano. Si verifica quando aria gelida e secca di origine artica o continentale (Bora/Grecale) scorre sopra le acque relativamente calde del Mar Adriatico. L'aria si carica di calore e umidità dal mare, instabilizzandosi e formando bande nuvolose strette e intense che scaricano neve abbondante sulle coste esposte e sull'Appennino retrostante.

### Dove colpisce
Marche (soprattutto centro-sud: Ancona, Macerata, Fermo, Ascoli), Abruzzo (Teramo, Pescara, Chieti), Molise, Puglia (Gargano, Barese). Talvolta raggiunge la Romagna.

### Segnali nei dati (flag se presenti ≥3 di questi)
- **Delta T (SST - T850hPa) > 13-15°C**: Differenza marcata tra temperatura del mare (Step 3F) e aria a 850hPa.
- **Vento da NE/ENE**: Direzione tra 30° e 80° (`wind_direction_850hPa`) con fetch lungo sul mare.
- **Umidità in aumento**: `relative_humidity_850hPa` > 70% in prossimità della costa adriatica.
- **T suolo**: `temperature_2m` prossima o inferiore a 0°C (per neve al piano).
- **Stagione**: Dicembre–Marzo.

### Come riportarlo
```
❄️ ADRIATIC SEA EFFECT (ASE) IN ATTO/PREVISTO — Versante Adriatico
Meccanismo: Aria gelida su mare caldo → Bande nevose intense.
Delta T Mare-Quota: {X}°C | Vento: {DIR} da NE.
Impatti: Nevicate improvvise e intermittenti (anche forti), accumuli significativi su coste e colline.
Nota: Fenomeno spesso sottostimato dai modelli globali; affidarsi a modelli ad alta risoluzione (ICON D2, ARPAE).
```
*Fonte: ARPA Marche / MeteoNetwork (Sea Effect Snow Adriatico)*

---

## MAREGGIATA (Coastal Storm)

### Cos'è
Invasione della costa da parte del mare a causa di onde eccezionali generate da venti forti (Libecciata, Sciroccata) con fetch lungo. Causa erosione costiera e danni a strutture balneari e portuali.

### Dove colpisce
Tutte le coste italiane esposte; in particolare Liguria (Libeccio), Sardegna (Maestrale), Adriatico (Bora/Scirocco).

### Segnali nei dati (flag se presenti ≥3 di questi)
- **Douglas Sea State ≥ 5**: Altezza significativa onde (`wave_height`) > 2.5m.
- **Vento sostenuto > 40-50 km/h** perpendicolare alla costa (Step 3A).
- **Fetch lungo**: Vento costante sulla stessa direzione per 12+ ore.
- **Bassa Pressione**: `pressure_msl` < 1005 hPa (sovra-elevazione del livello marino).

### Come riportarlo
```
🌊 RISCHIO MAREGGIATA — Costa {ZONA}
Stato del mare: Grado {N} (Douglas) | Altezza onde: {X}m
Vento: {DIR} a {Y} km/h | Tendenza: {Aumento/Diminuzione}
Impatti: Erosione costiera, danni a stabilimenti e porticcioli, allagamenti litoranei.
```

---

## MARROBBIO (Meteotsunami)

### Cos'è
Improvvisa e rapida variazione del livello del mare (fino a 1-1.5m in pochi minuti) non dovuta a cause sismiche, ma a fluttuazioni della pressione atmosferica che risuonano con la batimetria costiera.

### Dove colpisce
Sicilia sud-occidentale (Mazara del Vallo è l'epicentro), occasionalmente altre zone del Mediterraneo.

### Segnali nei dati (flag se presenti ≥2 di questi)
- **Variazioni rapide di pressione**: Salti di pressione (Step 3A, `pressure_msl`) rilevati dai modelli orari.
- **Vento da SW o SE**: Direzione favorevole alla propagazione dell'onda nel Canale di Sicilia.
- **Configurazione sinottica**: Presenza di fronti o linee d'instabilità in rapido movimento (Step 3A, `weather_code` 80-99).
- **Contesto**: Canale di Sicilia (lat 37.0–38.0, lon 12.0–13.5).

### Come riportarlo
```
🌊 POSSIBILE MARROBBIO — Costa Sud-Ovest Sicilia
Attenzione: Fenomeno improvviso di variazione del livello del mare (Meteotsunami).
Segnali: Instabilità atmosferica marcata | Vento da: {DIR}
Impatti: Repentino innalzamento/abbassamento del livello nei porti e foci fluviali (Mazara).
```
*Fonte: ARPA Sicilia / ISPRA (Meteotsunami nel Mediterraneo)*

---

## ACQUA ALTA (Venezia / Alto Adriatico)

### Cos'è
Fenomeno di sovralzo del livello del mare nell'Adriatico Settentrionale che causa l'allagamento di Venezia, Chioggia e altre località costiere. È causato dalla combinazione di marea astronomica (ciclica) e contributo meteorologico (storm surge). L'effetto è amplificato dalla forma a "catino" dell'Adriatico e dal fenomeno della **Sessa** (oscillazione libera del bacino).

### Stagione: Settembre–Aprile (picco Novembre–Dicembre)

### Segnali nei dati (flag se presenti ≥2 di questi)
- **Bassa Pressione**: `pressure_msl` < 1000-1005 hPa sul Nord Adriatico. Ogni hPa in meno rispetto alla media (1013 hPa) comporta un innalzamento teorico del livello marino di ~1 cm (effetto barometrico inverso).
- **Scirocco persistente**: Vento da SE (`wind_direction_10m` 120-160°) con velocità sostenuta > 30-40 km/h lungo tutto l'asse Adriatico per 12+ ore.
- **Bora locale**: Vento da NE nel Golfo di Venezia che può ostacolare il deflusso delle acque dalle lagune (effetto accumulo locale).
- **Sessa**: Presenza di un forte gradiente di pressione N-S tra l'Adriatico Settentrionale e Meridionale nei giorni precedenti.

### Soglie di Marea (Rif. Zero Mareografico Punta della Salute - ZMPS)
| Livello | Soglia | Impatto a Venezia | Azione |
|---|---|---|---|
| **Sostenuta** | 80–109 cm | Allagamento aree più basse (Piazza San Marco) | Info popolazione |
| **Molto Sostenuta** | 110–139 cm | Allagamento significativo (>12% città) | **Attivazione MOSE** |
| **Eccezionale** | ≥ 140 cm | Allagamento esteso (>59% città) | Emergenza |

### Come riportarlo
```
🌊 RISCHIO ACQUA ALTA — Venezia / Laguna / Alto Adriatico
Contributo Meteorologico: {Stimato} cm | Pressione: {X} hPa
Vento: {DIR} (Scirocco) a {Y} km/h | Persistenza: {H} ore
Scenario: {Marea Sostenuta / Molto Sostenuta / Eccezionale}
Nota: Dal 2020 il sistema MOSE protegge la città per maree ≥ 110 cm. Seguire bollettino CPSM Venezia.
```
*Fonte: CPSM Venezia / ISPRA (Previsione maree e contributi meteorologici)*

---

## GALAVERNA, CALABROSA e BRINA

### GALAVERNA (Soft Rime)
**Cos'è**: Deposito di aghi o scaglie di ghiaccio bianco opaco che si forma per la solidificazione di goccioline di nebbia sopraffusa su superfici a temperatura negativa.
**Segnali nei dati**:
- **T aria (2m)**: < 0°C (spesso < -2°C)
- **Nebbia**: `visibility` < 1km e `relative_humidity_2m` > 95%
- **Vento**: Debole o assente (< 5 km/h)
- **T superficie**: `soil_temperature_0cm` < 0°C

### CALABROSA (Hard Rime)
**Cos'è**: Crosta di ghiaccio granuloso, grigio-bianco, molto resistente, che si forma in presenza di nebbia fitta e vento forte.
**Segnali nei dati**:
- **T aria (2m)**: Tra -2°C e -10°C
- **Nebbia**: `visibility` < 500m e `relative_humidity_2m` > 95%
- **Vento**: Sostenuto (> 15-20 km/h)
- **Accrescimento**: In direzione opposta al vento

### BRINA (Hoar Frost)
**Cos'è**: Cristalli di ghiaccio che si formano per brinamento (sublimazione diretta) del vapore acqueo su superfici raffreddate per irraggiamento. Non richiede nebbia.
**Segnali nei dati**:
- **T aria (2m)**: < 2°C (ma T superficie deve essere < 0°C)
- **T superficie**: `soil_temperature_0cm` < 0°C
- **Cielo**: Sereno (`cloud_cover` < 20%)
- **Umidità**: `relative_humidity_2m` > 80%
- **Vento**: Assente o bava di vento (< 3 km/h)

### Come riportarlo
```
❄️ {FENOMENO} IN ATTO/PREVISTO — {ZONA}
Meccanismo: {Descrizione fisica breve}
T aria: {X}°C | T superficie: {Y}°C | Visibilità: {Z}m
Impatti: Scenari suggestivi ("paesaggio bianco"), ghiaccio su rami e cavi, strade scivolose (brina).
```
