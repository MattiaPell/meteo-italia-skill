# Portali Meteo Italiani — Fallback e Fonti Ufficiali

Da usare quando l'API Open-Meteo non è raggiungibile direttamente dall'ambiente.

## Portali Principali (affidabilità per consenso)

| Portale | URL | Modello backend | Affidabilità |
|---------|-----|-----------------|--------------|
| **3bMeteo** | 3bmeteo.com | WRF + GFS + ECMWF | ★★★★★ |
| **iLMeteo** | ilmeteo.it | Proprietario + ECMWF | ★★★★★ |
| **Meteo.it** | meteo.it | ECMWF + GFS | ★★★★ |
| **ARPAE** | arpae.it | ARPAE ICON 2I (ufficiale) | ★★★★★ |
| **Meteo AM** | meteoam.it | Aeronautica Militare (ufficiale) | ★★★★★ |
| **Meteoblue** | meteoblue.com | ICON + ECMWF + NMM | ★★★★ |
| **Ventusky** | ventusky.com | GFS/ICON/ECMWF (comparazione) | ★★★★ |
| **Windy** | windy.com | ECMWF + GFS + ICON (comparazione) | ★★★★ |

## Fonti Ufficiali per Allerte

| Ente | URL | Copertura |
|------|-----|-----------|
| **Protezione Civile** | mappe.protezionecivile.gov.it | Italia intera — allerte ufficiali |
| **ARPAE** | arpae.it/bollettini | Emilia-Romagna (modello ufficiale) |
| **ARPA Veneto** | arpa.veneto.it/meteo | Veneto |
| **ARPA Lombardia** | arpalombardia.it | Lombardia |
| **ARPA Piemonte** | arpa.piemonte.it | Piemonte e Valle d'Aosta |
| **Meteotrentino** | meteotrentino.it | Trentino-Alto Adige |
| **ARPA FVG** | meteo.fvg.it | Friuli-Venezia Giulia |
| **LaMMA** | lamma.toscana.it | Toscana |
| **Servizio Meteo Sardegna** | sardegnameteo.it | Sardegna |

## Strategia di Aggregazione (quando API non disponibile)

1. Recupera dati da almeno 3 portali diversi per la città target
2. Per ogni variabile (T max, T min, precipitazioni, vento) confronta i valori
3. Calcola consensus manuale: media e range dei valori trovati
4. Segnala la fonte e il livello di concordanza nel report
5. Per eventi critici: cita sempre la fonte ufficiale (Protezione Civile, ARPAE, MeteoAM)

## Come Leggere i Dati dai Portali

**Temperatura:** sempre in °C; verifica se è T aria o percepita
**Precipitazioni:** in mm; alcuni portali danno totale giornaliero, altri per fascia oraria
**Vento:** verifica se è sostenuto o raffica; direzione in gradi o lettere (N/NE/E...)
**Probabilità pioggia:** percentuale — >50% è da considerare "pioggia prevista"

## Note su Windy e Ventusky

Questi portali mostrano più modelli sovrapposti — ottimi per confronto visuale:
- Windy: seleziona ECMWF, GFS, ICON singolarmente dalla dropdown
- Ventusky: mostra ECMWF/GFS/ICON/GEM con slider temporale
- Utili per capire a colpo d'occhio se c'è accordo o divergenza tra modelli

---

> **Nota**: Per la rete ARPA completa con tutti gli endpoint regionali, usa `arpa_network.md`.
> Questo file rimane come riferimento per i portali aggregatori privati (3bMeteo, iLMeteo, ecc.)