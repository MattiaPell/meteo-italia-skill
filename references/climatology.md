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

---

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

---

## Valori Climatologici di Riferimento per Città Chiave

*(ERA5 1991-2020 — periodo di riferimento WMO)*

### Milano (45.47°N, 9.19°E, 122m)
| Mese | T max media | T min media | Precip. media | Giorni pioggia |
|------|-------------|-------------|---------------|----------------|
| Gen | 4.5°C | -1.2°C | 55mm | 8 |
| Feb | 7.2°C | 0.8°C | 51mm | 7 |
| Mar | 12.8°C | 4.5°C | 72mm | 9 |
| Apr | 17.4°C | 8.6°C | 85mm | 11 |
| Mag | 22.5°C | 13.2°C | 92mm | 12 |
| Giu | 26.8°C | 17.1°C | 78mm | 9 |
| Lug | 29.5°C | 19.8°C | 62mm | 7 |
| Ago | 28.7°C | 19.2°C | 75mm | 8 |
| Set | 23.8°C | 15.1°C | 68mm | 8 |
| Ott | 17.2°C | 9.8°C | 88mm | 10 |
| Nov | 9.8°C | 3.5°C | 91mm | 10 |
| Dic | 5.1°C | -0.2°C | 62mm | 8 |

### Venezia / Rovigo (area polesana, ~45.07°N, 11.79°E, 5m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 6.2°C | 0.5°C | 42mm | Nebbia frequente |
| Feb | 9.1°C | 1.8°C | 40mm | |
| Mar | 14.2°C | 5.8°C | 58mm | |
| Apr | 18.8°C | 9.5°C | 72mm | |
| Mag | 23.5°C | 13.8°C | 78mm | |
| Giu | 27.8°C | 18.2°C | 68mm | |
| Lug | 30.5°C | 20.5°C | 52mm | |
| Ago | 29.8°C | 20.1°C | 65mm | |
| Set | 25.1°C | 16.2°C | 62mm | |
| Ott | 18.5°C | 10.8°C | 78mm | |
| Nov | 11.2°C | 5.2°C | 75mm | Nebbia in aumento |
| Dic | 6.8°C | 1.1°C | 50mm | Nebbia frequente |

### Roma (41.90°N, 12.50°E, 21m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 12.1°C | 3.5°C | 71mm | |
| Feb | 13.5°C | 4.2°C | 65mm | |
| Mar | 16.8°C | 6.8°C | 52mm | |
| Apr | 20.5°C | 9.8°C | 51mm | |
| Mag | 25.2°C | 13.5°C | 38mm | |
| Giu | 29.8°C | 17.5°C | 25mm | |
| Lug | 32.5°C | 20.2°C | 18mm | |
| Ago | 32.1°C | 20.1°C | 22mm | |
| Set | 27.8°C | 16.8°C | 62mm | |
| Ott | 21.5°C | 12.5°C | 98mm | |
| Nov | 15.8°C | 7.8°C | 105mm | |
| Dic | 12.2°C | 4.2°C | 88mm | |

### Palermo (38.12°N, 13.36°E, 14m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 15.2°C | 8.5°C | 68mm | |
| Feb | 15.8°C | 8.8°C | 58mm | |
| Mar | 18.2°C | 10.5°C | 45mm | |
| Apr | 21.5°C | 13.2°C | 28mm | |
| Mag | 25.8°C | 17.2°C | 18mm | |
| Giu | 30.1°C | 21.5°C | 8mm | |
| Lug | 33.5°C | 24.2°C | 2mm | |
| Ago | 33.8°C | 24.5°C | 8mm | |
| Set | 29.5°C | 21.2°C | 28mm | |
| Ott | 24.5°C | 17.2°C | 65mm | |
| Nov | 19.8°C | 12.8°C | 85mm | |
| Dic | 16.2°C | 9.8°C | 78mm | |

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

### Probabilità gelata
T min prevista <2°C → segnala rischio gelata (vegetazione, ghiaccio su strade)
T min prevista <0°C → gelata quasi certa in zone aperte e pianura
T min prevista <-3°C → gelata intensa (danni a coltivazioni sensibili)