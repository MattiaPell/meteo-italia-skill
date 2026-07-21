---
source: "MCP"
last_verified: "2026-05-28"
confidence: "high"
---

# Monitoraggio Idrologico Italia

Questo file descrive i riferimenti per il monitoraggio idrometrico dei principali bacini fluviali nazionali in tempo reale e la valutazione del rischio idraulico.

## Strumenti MCP di Riferimento

Usa i seguenti tool per monitorare i fiumi e confrontare i livelli con le soglie di allertamento:

### `floods_it_monitoring`

- **Scopo**: Recupera in tempo reale i livelli idrometrici e le portate per le stazioni del Trentino-Alto Adige (Adige, Sarca, ecc.).
- **Parametri**: ID della stazione idrometrica.

### `arpav_idro`

- **Scopo**: Livelli idrometrici delle 103 stazioni ARPAV (Adige, Piave, Brenta, Bacchiglione, Po...) dalle ultime 48h, con trend a 6h. Fonte XML open data ARPAV aggiornata in continuo.
- **Parametri**: `provincia` (BL/PD/RO/TV/VE/VR/VI), `nome` (match fiume/stazione/comune), oppure `latitude`+`longitude` per la stazione più vicina, `limit`.
- **Nota 2026-07**: il vecchio endpoint `/rest/v1/meteo/stazioni/{id}/dati` risponde 404; il tool ora usa `https://www.arpa.veneto.it/api/risorse/data-meteo/xml/Ultime48ore.xml`.

### `meteo_reference_guidelines` (categoria: `hydro`)

- **Scopo**: Fornisce le soglie idrometriche ufficiali stabilite dagli enti di bacino (AIPO, CFR Toscana, ecc.) per i fiumi principali d'Italia:
  - **Po**: Stazioni di Piacenza, Cremona, Casalmaggiore, Boretto, Borgoforte, Pontelagoscuro.
  - **Arno**: Nave di Rovezzano, Uffizi, Ponte a Signa, S. Giovanni alla Vena.
  - **Tevere**: Roma Ripetta, Isola Tiberina.
  - **Reno**: Casalecchio Chiusa (Soglie: 0.80m, 1.60m, 2.20m).
  - **Volturno**: Indicazioni per Capua (Bollettino Multirischi Campania).
- **Tempi di corrivazione**: Stime per l'onda di piena (es. Trento -> Verona: 6-10 ore).
