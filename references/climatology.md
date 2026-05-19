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

### Torino (45.19°N, 7.65°E, 287m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 6.2°C | -2.2°C | 59mm | |
| Feb | 7.7°C | -1.6°C | 65mm | |
| Mar | 12.2°C | 1.8°C | 81mm | |
| Apr | 15.6°C | 5.7°C | 119mm | |
| Mag | 19.7°C | 10.2°C | 139mm | |
| Giu | 23.7°C | 14.2°C | 104mm | |
| Lug | 26.3°C | 16.5°C | 63mm | |
| Ago | 25.9°C | 16.6°C | 74mm | |
| Set | 21.2°C | 12.9°C | 116mm | |
| Ott | 15.8°C | 8.7°C | 120mm | |
| Nov | 10.4°C | 3.2°C | 150mm | |
| Dic | 6.6°C | -1.3°C | 67mm | |

### Aosta (45.73°N, 7.31°E, 583m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 4.8°C | -1.9°C | 100mm | |
| Feb | 6.3°C | -1.5°C | 80mm | |
| Mar | 9.5°C | 1.8°C | 89mm | |
| Apr | 12.5°C | 5.5°C | 100mm | |
| Mag | 17.2°C | 9.5°C | 117mm | |
| Giu | 23.1°C | 14.2°C | 109mm | |
| Lug | 26.0°C | 16.8°C | 94mm | |
| Ago | 26.0°C | 16.9°C | 85mm | |
| Set | 21.6°C | 12.9°C | 87mm | |
| Ott | 16.5°C | 8.5°C | 99mm | |
| Nov | 9.5°C | 2.6°C | 130mm | |
| Dic | 5.3°C | -1.2°C | 107mm | |

### Genova (44.40°N, 8.94°E, 20m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 9.6°C | 3.8°C | 98mm | |
| Feb | 10.7°C | 4.0°C | 78mm | |
| Mar | 14.0°C | 6.5°C | 94mm | |
| Apr | 16.9°C | 9.5°C | 109mm | |
| Mag | 20.5°C | 13.4°C | 101mm | |
| Giu | 24.3°C | 17.3°C | 85mm | |
| Lug | 27.1°C | 19.7°C | 54mm | |
| Ago | 27.4°C | 20.2°C | 65mm | |
| Set | 23.4°C | 16.4°C | 125mm | |
| Ott | 18.7°C | 12.8°C | 182mm | |
| Nov | 13.7°C | 8.4°C | 198mm | |
| Dic | 10.3°C | 4.8°C | 126mm | |

### Venezia (45.44°N, 12.33°E, 2m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 6.8°C | 1.2°C | 45mm | |
| Feb | 8.6°C | 1.5°C | 42mm | |
| Mar | 12.5°C | 4.8°C | 54mm | |
| Apr | 16.3°C | 8.2°C | 68mm | |
| Mag | 21.2°C | 12.8°C | 68mm | |
| Giu | 25.1°C | 16.7°C | 72mm | |
| Lug | 28.2°C | 19.1°C | 62mm | |
| Ago | 28.0°C | 18.9°C | 65mm | |
| Set | 23.9°C | 15.2°C | 70mm | |
| Ott | 18.2°C | 10.5°C | 75mm | |
| Nov | 12.2°C | 5.6°C | 82mm | |
| Dic | 7.8°C | 1.9°C | 58mm | |

### Rovigo (45.07°N, 11.79°E, 5m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 6.2°C | -0.5°C | 42mm | Nebbia frequente |
| Feb | 9.1°C | 0.8°C | 40mm | |
| Mar | 14.2°C | 4.2°C | 58mm | |
| Apr | 18.8°C | 8.5°C | 72mm | |
| Mag | 23.5°C | 12.8°C | 78mm | |
| Giu | 27.8°C | 16.2°C | 68mm | |
| Lug | 30.5°C | 18.5°C | 52mm | |
| Ago | 29.8°C | 18.3°C | 65mm | |
| Set | 25.1°C | 14.2°C | 62mm | |
| Ott | 18.5°C | 9.8°C | 78mm | |
| Nov | 11.2°C | 4.2°C | 75mm | Nebbia in aumento |
| Dic | 6.8°C | 0.1°C | 50mm | Nebbia frequente |

### Bologna (44.49°N, 11.34°E, 54m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 8.1°C | 0.5°C | 46mm | |
| Feb | 10.0°C | 0.7°C | 67mm | |
| Mar | 14.4°C | 4.2°C | 63mm | |
| Apr | 18.1°C | 7.9°C | 77mm | |
| Mag | 22.9°C | 12.3°C | 78mm | |
| Giu | 27.7°C | 16.7°C | 60mm | |
| Lug | 30.8°C | 19.3°C | 45mm | |
| Ago | 30.4°C | 19.5°C | 52mm | |
| Set | 24.9°C | 15.1°C | 67mm | |
| Ott | 19.2°C | 10.9°C | 76mm | |
| Nov | 13.2°C | 6.1°C | 93mm | |
| Dic | 8.5°C | 1.4°C | 71mm | |

### Firenze (43.80°N, 11.20°E, 40m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 11.2°C | 2.1°C | 64mm | |
| Feb | 12.7°C | 2.5°C | 64mm | |
| Mar | 16.3°C | 5.3°C | 62mm | |
| Apr | 19.9°C | 8.0°C | 67mm | |
| Mag | 24.5°C | 12.1°C | 66mm | |
| Giu | 29.1°C | 16.0°C | 48mm | |
| Lug | 32.2°C | 18.3°C | 26mm | |
| Ago | 32.5°C | 18.5°C | 40mm | |
| Set | 27.1°C | 14.7°C | 74mm | |
| Ott | 21.6°C | 11.0°C | 104mm | |
| Nov | 15.7°C | 6.7°C | 118mm | |
| Dic | 11.4°C | 2.8°C | 88mm | |

### Bolzano (46.50°N, 11.35°E, 262m)
| Mese | T max media | T min media | Precip. media |
|------|-------------|-------------|---------------|
| Gen | 6.7°C | -2.6°C | 50mm |
| Feb | 8.6°C | -0.7°C | 51mm |
| Mar | 12.8°C | 3.6°C | 72mm |
| Apr | 16.6°C | 6.9°C | 96mm |
| Mag | 21.1°C | 11.4°C | 107mm |
| Giu | 24.9°C | 15.0°C | 94mm |
| Lug | 27.0°C | 16.8°C | 88mm |
| Ago | 26.7°C | 16.8°C | 93mm |
| Set | 22.3°C | 13.2°C | 95mm |
| Ott | 17.5°C | 9.2°C | 126mm |
| Nov | 11.5°C | 4.3°C | 126mm |
| Dic | 7.3°C | -1.0°C | 68mm |

### Trento (46.06°N, 11.12°E, 194m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 6.8°C | -1.3°C | 53mm | |
| Feb | 8.6°C | 0.4°C | 58mm | |
| Mar | 12.6°C | 4.2°C | 76mm | |
| Apr | 16.3°C | 7.9°C | 111mm | |
| Mag | 20.8°C | 12.6°C | 129mm | |
| Giu | 24.5°C | 16.2°C | 123mm | |
| Lug | 26.6°C | 18.1°C | 119mm | |
| Ago | 26.6°C | 18.3°C | 117mm | |
| Set | 22.3°C | 14.6°C | 118mm | |
| Ott | 17.8°C | 10.4°C | 138mm | |
| Nov | 12.0°C | 5.5°C | 144mm | |
| Dic | 7.7°C | 0.8°C | 76mm | |

### Trieste (45.65°N, 13.76°E, 2m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 7.4°C | 1.4°C | 90mm | |
| Feb | 8.8°C | 1.5°C | 96mm | |
| Mar | 12.5°C | 4.5°C | 99mm | |
| Apr | 16.5°C | 8.2°C | 107mm | |
| Mag | 20.8°C | 12.7°C | 120mm | |
| Giu | 25.0°C | 16.7°C | 107mm | |
| Lug | 27.5°C | 18.9°C | 87mm | |
| Ago | 27.8°C | 19.2°C | 110mm | |
| Set | 22.5°C | 15.1°C | 169mm | |
| Ott | 17.6°C | 11.1°C | 184mm | |
| Nov | 12.5°C | 6.8°C | 192mm | |
| Dic | 8.3°C | 2.4°C | 128mm | |

### L'Aquila (42.35°N, 13.40°E, 714m)
| Mese | T max media | T min media | Precip. media |
|------|-------------|-------------|---------------|
| Gen | 6.7°C | -0.4°C | 71mm |
| Feb | 7.5°C | -0.5°C | 71mm |
| Mar | 10.9°C | 2.1°C | 89mm |
| Apr | 14.6°C | 5.3°C | 91mm |
| Mag | 19.0°C | 9.6°C | 80mm |
| Giu | 23.5°C | 13.8°C | 58mm |
| Lug | 26.5°C | 16.6°C | 44mm |
| Ago | 27.1°C | 17.2°C | 38mm |
| Set | 21.7°C | 12.9°C | 72mm |
| Ott | 17.5°C | 9.3°C | 80mm |
| Nov | 12.1°C | 4.9°C | 104mm |
| Dic | 7.6°C | 0.9°C | 96mm |

### Perugia (43.11°N, 12.39°E, 493m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 7.3°C | -0.2°C | 56mm | |
| Feb | 8.5°C | -0.2°C | 67mm | |
| Mar | 12.1°C | 2.3°C | 74mm | |
| Apr | 15.6°C | 5.2°C | 80mm | |
| Mag | 20.1°C | 9.3°C | 70mm | |
| Giu | 25.0°C | 13.6°C | 50mm | |
| Lug | 28.3°C | 16.3°C | 33mm | |
| Ago | 28.5°C | 16.6°C | 36mm | |
| Set | 22.7°C | 12.6°C | 78mm | |
| Ott | 17.6°C | 9.0°C | 91mm | |
| Nov | 12.1°C | 4.8°C | 105mm | |
| Dic | 8.0°C | 0.9°C | 83mm | |

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

### Ancona (43.61°N, 13.51°E, 16m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 10.1°C | 4.4°C | 47mm | |
| Feb | 11.5°C | 4.9°C | 55mm | |
| Mar | 15.0°C | 7.6°C | 59mm | |
| Apr | 18.5°C | 10.6°C | 54mm | |
| Mag | 23.0°C | 15.0°C | 56mm | |
| Giu | 27.3°C | 19.0°C | 52mm | |
| Lug | 29.6°C | 21.5°C | 35mm | |
| Ago | 29.6°C | 21.8°C | 39mm | |
| Set | 25.4°C | 17.7°C | 86mm | |
| Ott | 20.7°C | 14.0°C | 69mm | |
| Nov | 15.5°C | 9.7°C | 87mm | |
| Dic | 11.2°C | 5.5°C | 71mm | |

### Napoli (40.88°N, 14.28°E, 72m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 11.6°C | 5.4°C | 107mm | |
| Feb | 12.1°C | 5.3°C | 101mm | |
| Mar | 14.5°C | 7.0°C | 103mm | |
| Apr | 17.3°C | 9.4°C | 95mm | |
| Mag | 21.4°C | 13.2°C | 63mm | |
| Giu | 25.6°C | 17.4°C | 34mm | |
| Lug | 28.5°C | 20.2°C | 19mm | |
| Ago | 29.2°C | 20.9°C | 23mm | |
| Set | 25.0°C | 17.6°C | 90mm | |
| Ott | 20.9°C | 14.0°C | 132mm | |
| Nov | 16.3°C | 10.3°C | 174mm | |
| Dic | 12.6°C | 6.7°C | 133mm | |

### Potenza (40.64°N, 15.80°E, 819m)
| Mese | T max media | T min media | Precip. media |
|------|-------------|-------------|---------------|
| Gen | 8.0°C | 0.9°C | 65mm |
| Feb | 8.6°C | 0.7°C | 62mm |
| Mar | 11.7°C | 2.9°C | 76mm |
| Apr | 15.1°C | 5.5°C | 73mm |
| Mag | 19.7°C | 9.7°C | 56mm |
| Giu | 24.6°C | 13.7°C | 40mm |
| Lug | 27.6°C | 16.2°C | 28mm |
| Ago | 28.0°C | 16.9°C | 26mm |
| Set | 22.7°C | 13.3°C | 51mm |
| Ott | 18.6°C | 10.0°C | 61mm |
| Nov | 13.4°C | 5.8°C | 70mm |
| Dic | 9.0°C | 2.3°C | 74mm |

### Campobasso (41.56°N, 14.65°E, 701m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 7.5°C | 0.4°C | 73mm | |
| Feb | 8.4°C | 0.5°C | 66mm | |
| Mar | 11.6°C | 2.9°C | 80mm | |
| Apr | 15.1°C | 5.8°C | 80mm | |
| Mag | 19.6°C | 10.0°C | 70mm | |
| Giu | 24.5°C | 14.3°C | 51mm | |
| Lug | 27.5°C | 16.8°C | 38mm | |
| Ago | 28.0°C | 17.5°C | 35mm | |
| Set | 22.6°C | 13.5°C | 56mm | |
| Ott | 18.0°C | 9.8°C | 69mm | |
| Nov | 12.8°C | 5.6°C | 87mm | |
| Dic | 8.5°C | 1.7°C | 83mm | |

### Bari (41.13°N, 16.75°E, 44m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 11.9°C | 6.8°C | 60mm | |
| Feb | 12.3°C | 6.7°C | 56mm | |
| Mar | 14.6°C | 8.4°C | 59mm | |
| Apr | 17.5°C | 10.9°C | 57mm | |
| Mag | 21.7°C | 15.0°C | 39mm | |
| Giu | 26.0°C | 19.2°C | 33mm | |
| Lug | 28.7°C | 21.8°C | 25mm | |
| Ago | 29.2°C | 22.2°C | 24mm | |
| Set | 25.1°C | 18.8°C | 57mm | |
| Ott | 21.0°C | 15.2°C | 65mm | |
| Nov | 16.7°C | 11.6°C | 70mm | |
| Dic | 12.9°C | 8.2°C | 61mm | |

### Catanzaro (38.90°N, 16.59°E, 320m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 12.2°C | 5.6°C | 103mm | |
| Feb | 12.7°C | 5.4°C | 101mm | |
| Mar | 15.2°C | 7.1°C | 101mm | |
| Apr | 17.9°C | 9.5°C | 89mm | |
| Mag | 22.4°C | 13.4°C | 77mm | |
| Giu | 27.4°C | 17.7°C | 48mm | |
| Lug | 29.9°C | 20.4°C | 50mm | |
| Ago | 30.2°C | 20.9°C | 45mm | |
| Set | 25.7°C | 17.7°C | 88mm | |
| Ott | 21.6°C | 14.3°C | 97mm | |
| Nov | 17.0°C | 10.5°C | 114mm | |
| Dic | 13.3°C | 6.9°C | 102mm | |

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

### Catania (37.49°N, 15.07°E, 7m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 14.2°C | 7.5°C | 75mm | |
| Feb | 14.7°C | 7.4°C | 60mm | |
| Mar | 16.8°C | 9.0°C | 58mm | |
| Apr | 19.3°C | 11.4°C | 45mm | |
| Mag | 23.8°C | 15.3°C | 28mm | |
| Giu | 28.6°C | 19.6°C | 19mm | |
| Lug | 31.7°C | 22.4°C | 8mm | |
| Ago | 32.0°C | 23.2°C | 14mm | |
| Set | 27.6°C | 20.0°C | 52mm | |
| Ott | 23.4°C | 16.7°C | 71mm | |
| Nov | 19.0°C | 12.7°C | 68mm | |
| Dic | 15.4°C | 9.2°C | 66mm | |

### Cagliari (39.24°N, 9.06°E, 1m)
| Mese | T max media | T min media | Precip. media | Note |
|------|-------------|-------------|---------------|------|
| Gen | 13.6°C | 7.3°C | 37mm | |
| Feb | 14.1°C | 7.0°C | 39mm | |
| Mar | 16.5°C | 8.6°C | 45mm | |
| Apr | 19.0°C | 10.7°C | 48mm | |
| Mag | 23.2°C | 13.9°C | 34mm | |
| Giu | 28.1°C | 17.9°C | 10mm | |
| Lug | 31.3°C | 20.6°C | 2mm | |
| Ago | 31.7°C | 21.3°C | 7mm | |
| Set | 27.2°C | 18.7°C | 32mm | |
| Ott | 23.1°C | 15.8°C | 43mm | |
| Nov | 18.0°C | 11.9°C | 62mm | |
| Dic | 14.7°C | 8.8°C | 53mm | |

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

## Bilancio Idrologico (ET0 vs Precipitazioni)

L'evapotraspirazione potenziale (ET0) confrontata con le precipitazioni indica lo stato idrico del suolo.

| Condizione | Interpretazione | Impatto |
|---|---|---|
| Precip >> ET0 | Surplus idrico | Rischio alluvionamenti, suolo saturo |
| Precip ≈ ET0 | Equilibrio | Condizioni ideali per vegetazione |
| Precip < ET0 | Deficit idrico | Necessaria irrigazione, stress idrico |
| ET0 > 5mm/giorno | Elevata evaporazione | Tipico di giornate calde/ventose, rapido disseccamento |

**Soglie Umidità del Suolo (soil_moisture_0_to_1cm):**
- **<0.15 m³/m³**: Suolo molto secco (punto di appassimento)
- **0.15–0.30 m³/m³**: Umidità moderata
- **>0.35 m³/m³**: Suolo molto umido / saturo

### Probabilità gelata
T min prevista <2°C → segnala rischio gelata (vegetazione, ghiaccio su strade)
T min prevista <0°C → gelata quasi certa in zone aperte e pianura
T min prevista <-3°C → gelata intensa (danni a coltivazioni sensibili)

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

## Anomalie di Temperatura Percepita (Apparent T)

Confronta `apparent_temperature` (forecast) con `apparent_temperature` (archive) per valutare lo stress termico reale (Afa/Wind Chill) rispetto al passato.

| Anomalia Percepita | Classificazione | Impatto Sanitario |
|---|---|---|
| +1.0 a +3.0σ | Ondata di calore umida (Afa) | Disagio fisico, rischio per soggetti fragili |
| > +3.0σ | Caldo estremo eccezionale | Pericolo imminente di colpo di calore |
| -1.0 a -3.0σ | Freddo ventoso intenso | Elevato rischio ipotermia/congelamento |
| < -3.0σ | Burian / Gelo eccezionale | Emergenza freddo |
