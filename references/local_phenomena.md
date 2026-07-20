---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Riconoscimento dei Fenomeni Locali Italiani

Questo file descrive l'identificazione algoritmica automatica di tutti i fenomeni meteorologici caratteristici della penisola italiana a partire dall'analisi fisica dei dati dei modelli meteo.

## Strumento MCP di Riferimento

Utilizza il tool dedicato per rilevare fenomeni complessi ed effetti orografici locali:

### `meteo_local_phenomena`

- **Scopo**: Esegue controlli fisici e algoritmici incrociando temperature, umidità, vento, pressione, profili atmosferici (850/925 hPa) e geopotenziale per rilevare e descrivere i seguenti fenomeni:
  - **Foehn (Favonio)**: Vento caldo e secco di caduta sulle valli alpine e pianura nord-occidentale.
  - **Bora (Chiara / Scura)**: Vento forte e freddo da ENE sul Golfo di Trieste e alto Adriatico.
  - **Scirocco (Secco / Umido)**: Flusso caldo meridionale, associato a trasporto di sabbia sahariana o elevato rischio incendi.
  - **Nebbia Padana**: Condizioni di forte inversione termica e stabilità idonee a produrre nebbia fitta da irraggiamento in Pianura Padana.
  - **Gelicidio (Freezing Rain)**: Pioggia sopraffusa che gela istantaneamente a contatto con il suolo freddo (<0°C).
  - **Caligo / Lupa di Mare**: Nebbia marittima da avvezione che invade le coste liguri o tirreniche/ioniche.
  - **Maccaja**: Copertura di nubi basse e umide bloccate dalla barriera appenninica in Liguria.
  - **Adriatic Sea Effect (ASE)**: Bande nuvolose e nevose intense causate da aria gelida che scorre sul mare Adriatico caldo.
  - **Galaverna e Brina**: Depositi di ghiaccio da nebbia sopraffusa o brinamento in notti serene.
  - **Acqua Alta (Venezia)**: Rischio marea eccezionale legato a bassa pressione e scirocco intenso.
  - **MCS Padano / V-Shaped Storm**: Rischio di sistemi convettivi a mesoscala o temporali autorigeneranti stazionari ad alto potenziale alluvionale.
