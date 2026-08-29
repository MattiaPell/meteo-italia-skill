/** Normale climatica mensile (ERA5 1991-2020) per una stazione. */
export interface ClimatologyMonth {
  /** Abbreviazione italiana del mese: "Gen", "Feb", ... "Dic". */
  month: string;
  tmax: number;
  tmin: number;
  /** Precipitazione cumulata mensile in mm. */
  precip: number;
}

/** Stazione/climatologia nel dataset: coordinate, quota e 12 mesi. */
export interface ClimatologyStation {
  name: string;
  lat: number;
  lon: number;
  elevation: number;
  months: ClimatologyMonth[];
}

/**
 * Normali climatologiche ERA5 1991-2020 per ~100 stazioni italiane,
 * chiave = regione (lowercase). Dati statici compilati in TS (non JSON):
 * verificati dal compilatore a build time, zero parsing a runtime e nessuna
 * preoccupazione di packaging (il JSON richiederebbe resolveJsonModule o
 * readFileSync con path fragile tra src e dist).
 */
export const climatologyData: Record<string, ClimatologyStation[]> = {
  "abruzzo": [
    {
      "name": "L'Aquila",
      "lat": 42.35,
      "lon": 13.4,
      "elevation": 714.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.7,
          "tmin": -0.4,
          "precip": 71.0
        },
        {
          "month": "Feb",
          "tmax": 7.5,
          "tmin": -0.5,
          "precip": 71.0
        },
        {
          "month": "Mar",
          "tmax": 10.9,
          "tmin": 2.1,
          "precip": 89.0
        },
        {
          "month": "Apr",
          "tmax": 14.6,
          "tmin": 5.3,
          "precip": 91.0
        },
        {
          "month": "Mag",
          "tmax": 19.0,
          "tmin": 9.6,
          "precip": 80.0
        },
        {
          "month": "Giu",
          "tmax": 23.5,
          "tmin": 13.8,
          "precip": 58.0
        },
        {
          "month": "Lug",
          "tmax": 26.5,
          "tmin": 16.6,
          "precip": 44.0
        },
        {
          "month": "Ago",
          "tmax": 27.1,
          "tmin": 17.2,
          "precip": 38.0
        },
        {
          "month": "Set",
          "tmax": 21.7,
          "tmin": 12.9,
          "precip": 72.0
        },
        {
          "month": "Ott",
          "tmax": 17.5,
          "tmin": 9.3,
          "precip": 80.0
        },
        {
          "month": "Nov",
          "tmax": 12.1,
          "tmin": 4.9,
          "precip": 104.0
        },
        {
          "month": "Dic",
          "tmax": 7.6,
          "tmin": 0.9,
          "precip": 96.0
        }
      ]
    },
    {
      "name": "Pescara",
      "lat": 42.43,
      "lon": 14.18,
      "elevation": 11.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.2,
          "tmin": 1.8,
          "precip": 48.0
        },
        {
          "month": "Feb",
          "tmax": 11.9,
          "tmin": 2.2,
          "precip": 52.0
        },
        {
          "month": "Mar",
          "tmax": 14.4,
          "tmin": 3.9,
          "precip": 57.0
        },
        {
          "month": "Apr",
          "tmax": 17.7,
          "tmin": 6.7,
          "precip": 57.0
        },
        {
          "month": "Mag",
          "tmax": 22.3,
          "tmin": 11.0,
          "precip": 32.0
        },
        {
          "month": "Giu",
          "tmax": 26.3,
          "tmin": 14.8,
          "precip": 46.0
        },
        {
          "month": "Lug",
          "tmax": 29.2,
          "tmin": 17.2,
          "precip": 34.0
        },
        {
          "month": "Ago",
          "tmax": 29.0,
          "tmin": 17.3,
          "precip": 55.0
        },
        {
          "month": "Set",
          "tmax": 25.6,
          "tmin": 14.4,
          "precip": 61.0
        },
        {
          "month": "Ott",
          "tmax": 20.7,
          "tmin": 10.5,
          "precip": 72.0
        },
        {
          "month": "Nov",
          "tmax": 15.5,
          "tmin": 5.9,
          "precip": 80.0
        },
        {
          "month": "Dic",
          "tmax": 12.4,
          "tmin": 3.2,
          "precip": 63.0
        }
      ]
    },
    {
      "name": "Chieti",
      "lat": 42.35,
      "lon": 14.16,
      "elevation": 330.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.5,
          "tmin": 3.2,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 10.2,
          "tmin": 3.2,
          "precip": 62.0
        },
        {
          "month": "Mar",
          "tmax": 13.5,
          "tmin": 5.2,
          "precip": 68.0
        },
        {
          "month": "Apr",
          "tmax": 17.2,
          "tmin": 8.5,
          "precip": 65.0
        },
        {
          "month": "Mag",
          "tmax": 22.0,
          "tmin": 12.8,
          "precip": 48.0
        },
        {
          "month": "Giu",
          "tmax": 26.5,
          "tmin": 16.8,
          "precip": 42.0
        },
        {
          "month": "Lug",
          "tmax": 29.8,
          "tmin": 19.8,
          "precip": 35.0
        },
        {
          "month": "Ago",
          "tmax": 29.8,
          "tmin": 20.0,
          "precip": 45.0
        },
        {
          "month": "Set",
          "tmax": 25.2,
          "tmin": 16.5,
          "precip": 65.0
        },
        {
          "month": "Ott",
          "tmax": 19.8,
          "tmin": 12.5,
          "precip": 82.0
        },
        {
          "month": "Nov",
          "tmax": 14.5,
          "tmin": 8.2,
          "precip": 92.0
        },
        {
          "month": "Dic",
          "tmax": 10.5,
          "tmin": 4.8,
          "precip": 78.0
        }
      ]
    },
    {
      "name": "Teramo",
      "lat": 42.66,
      "lon": 13.7,
      "elevation": 265.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.8,
          "tmin": 2.5,
          "precip": 72.0
        },
        {
          "month": "Feb",
          "tmax": 10.8,
          "tmin": 2.8,
          "precip": 68.0
        },
        {
          "month": "Mar",
          "tmax": 14.2,
          "tmin": 4.8,
          "precip": 70.0
        },
        {
          "month": "Apr",
          "tmax": 18.0,
          "tmin": 8.0,
          "precip": 75.0
        },
        {
          "month": "Mag",
          "tmax": 22.8,
          "tmin": 12.2,
          "precip": 60.0
        },
        {
          "month": "Giu",
          "tmax": 27.5,
          "tmin": 16.2,
          "precip": 52.0
        },
        {
          "month": "Lug",
          "tmax": 30.5,
          "tmin": 19.0,
          "precip": 40.0
        },
        {
          "month": "Ago",
          "tmax": 30.5,
          "tmin": 19.2,
          "precip": 50.0
        },
        {
          "month": "Set",
          "tmax": 25.8,
          "tmin": 15.8,
          "precip": 72.0
        },
        {
          "month": "Ott",
          "tmax": 20.2,
          "tmin": 11.5,
          "precip": 88.0
        },
        {
          "month": "Nov",
          "tmax": 14.8,
          "tmin": 7.2,
          "precip": 105.0
        },
        {
          "month": "Dic",
          "tmax": 10.8,
          "tmin": 3.8,
          "precip": 85.0
        }
      ]
    }
  ],
  "basilicata": [
    {
      "name": "Potenza",
      "lat": 40.64,
      "lon": 15.8,
      "elevation": 819.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 8.0,
          "tmin": 0.9,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 8.6,
          "tmin": 0.7,
          "precip": 62.0
        },
        {
          "month": "Mar",
          "tmax": 11.7,
          "tmin": 2.9,
          "precip": 76.0
        },
        {
          "month": "Apr",
          "tmax": 15.1,
          "tmin": 5.5,
          "precip": 73.0
        },
        {
          "month": "Mag",
          "tmax": 19.7,
          "tmin": 9.7,
          "precip": 56.0
        },
        {
          "month": "Giu",
          "tmax": 24.6,
          "tmin": 13.7,
          "precip": 40.0
        },
        {
          "month": "Lug",
          "tmax": 27.6,
          "tmin": 16.2,
          "precip": 28.0
        },
        {
          "month": "Ago",
          "tmax": 28.0,
          "tmin": 16.9,
          "precip": 26.0
        },
        {
          "month": "Set",
          "tmax": 22.7,
          "tmin": 13.3,
          "precip": 51.0
        },
        {
          "month": "Ott",
          "tmax": 18.6,
          "tmin": 10.0,
          "precip": 61.0
        },
        {
          "month": "Nov",
          "tmax": 13.4,
          "tmin": 5.8,
          "precip": 70.0
        },
        {
          "month": "Dic",
          "tmax": 9.0,
          "tmin": 2.3,
          "precip": 74.0
        }
      ]
    },
    {
      "name": "Matera",
      "lat": 40.66,
      "lon": 16.6,
      "elevation": 401.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.8,
          "tmin": 3.2,
          "precip": 62.0
        },
        {
          "month": "Feb",
          "tmax": 10.5,
          "tmin": 3.2,
          "precip": 58.0
        },
        {
          "month": "Mar",
          "tmax": 13.5,
          "tmin": 5.2,
          "precip": 55.0
        },
        {
          "month": "Apr",
          "tmax": 16.8,
          "tmin": 7.8,
          "precip": 52.0
        },
        {
          "month": "Mag",
          "tmax": 21.8,
          "tmin": 12.2,
          "precip": 38.0
        },
        {
          "month": "Giu",
          "tmax": 26.8,
          "tmin": 16.5,
          "precip": 25.0
        },
        {
          "month": "Lug",
          "tmax": 30.2,
          "tmin": 19.5,
          "precip": 15.0
        },
        {
          "month": "Ago",
          "tmax": 30.5,
          "tmin": 19.8,
          "precip": 22.0
        },
        {
          "month": "Set",
          "tmax": 26.2,
          "tmin": 16.5,
          "precip": 48.0
        },
        {
          "month": "Ott",
          "tmax": 20.8,
          "tmin": 12.8,
          "precip": 65.0
        },
        {
          "month": "Nov",
          "tmax": 15.2,
          "tmin": 8.5,
          "precip": 75.0
        },
        {
          "month": "Dic",
          "tmax": 11.2,
          "tmin": 4.8,
          "precip": 70.0
        }
      ]
    }
  ],
  "calabria": [
    {
      "name": "Catanzaro",
      "lat": 38.9,
      "lon": 16.59,
      "elevation": 320.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.2,
          "tmin": 5.6,
          "precip": 103.0
        },
        {
          "month": "Feb",
          "tmax": 12.7,
          "tmin": 5.4,
          "precip": 101.0
        },
        {
          "month": "Mar",
          "tmax": 15.2,
          "tmin": 7.1,
          "precip": 101.0
        },
        {
          "month": "Apr",
          "tmax": 17.9,
          "tmin": 9.5,
          "precip": 89.0
        },
        {
          "month": "Mag",
          "tmax": 22.4,
          "tmin": 13.4,
          "precip": 77.0
        },
        {
          "month": "Giu",
          "tmax": 27.4,
          "tmin": 17.7,
          "precip": 48.0
        },
        {
          "month": "Lug",
          "tmax": 29.9,
          "tmin": 20.4,
          "precip": 50.0
        },
        {
          "month": "Ago",
          "tmax": 30.2,
          "tmin": 20.9,
          "precip": 45.0
        },
        {
          "month": "Set",
          "tmax": 25.7,
          "tmin": 17.7,
          "precip": 88.0
        },
        {
          "month": "Ott",
          "tmax": 21.6,
          "tmin": 14.3,
          "precip": 97.0
        },
        {
          "month": "Nov",
          "tmax": 17.0,
          "tmin": 10.5,
          "precip": 114.0
        },
        {
          "month": "Dic",
          "tmax": 13.3,
          "tmin": 6.9,
          "precip": 102.0
        }
      ]
    },
    {
      "name": "Reggio Calabria",
      "lat": 38.11,
      "lon": 15.66,
      "elevation": 31.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 13.0,
          "tmin": 7.8,
          "precip": 151.0
        },
        {
          "month": "Feb",
          "tmax": 13.9,
          "tmin": 8.1,
          "precip": 119.0
        },
        {
          "month": "Mar",
          "tmax": 15.0,
          "tmin": 8.7,
          "precip": 171.0
        },
        {
          "month": "Apr",
          "tmax": 18.1,
          "tmin": 11.2,
          "precip": 84.0
        },
        {
          "month": "Mag",
          "tmax": 21.8,
          "tmin": 14.6,
          "precip": 85.0
        },
        {
          "month": "Giu",
          "tmax": 26.8,
          "tmin": 19.0,
          "precip": 64.0
        },
        {
          "month": "Lug",
          "tmax": 30.1,
          "tmin": 22.0,
          "precip": 39.0
        },
        {
          "month": "Ago",
          "tmax": 29.8,
          "tmin": 22.4,
          "precip": 53.0
        },
        {
          "month": "Set",
          "tmax": 26.3,
          "tmin": 19.7,
          "precip": 89.0
        },
        {
          "month": "Ott",
          "tmax": 22.4,
          "tmin": 16.5,
          "precip": 126.0
        },
        {
          "month": "Nov",
          "tmax": 18.5,
          "tmin": 13.2,
          "precip": 131.0
        },
        {
          "month": "Dic",
          "tmax": 14.9,
          "tmin": 9.9,
          "precip": 140.0
        }
      ]
    },
    {
      "name": "Cosenza",
      "lat": 39.3,
      "lon": 16.25,
      "elevation": 238.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.5,
          "tmin": 3.5,
          "precip": 125.0
        },
        {
          "month": "Feb",
          "tmax": 12.5,
          "tmin": 3.5,
          "precip": 115.0
        },
        {
          "month": "Mar",
          "tmax": 15.2,
          "tmin": 5.2,
          "precip": 105.0
        },
        {
          "month": "Apr",
          "tmax": 18.8,
          "tmin": 8.0,
          "precip": 85.0
        },
        {
          "month": "Mag",
          "tmax": 23.8,
          "tmin": 12.2,
          "precip": 55.0
        },
        {
          "month": "Giu",
          "tmax": 28.8,
          "tmin": 16.5,
          "precip": 35.0
        },
        {
          "month": "Lug",
          "tmax": 32.2,
          "tmin": 19.5,
          "precip": 20.0
        },
        {
          "month": "Ago",
          "tmax": 32.5,
          "tmin": 19.8,
          "precip": 30.0
        },
        {
          "month": "Set",
          "tmax": 28.2,
          "tmin": 16.5,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 22.8,
          "tmin": 12.5,
          "precip": 115.0
        },
        {
          "month": "Nov",
          "tmax": 17.2,
          "tmin": 8.5,
          "precip": 155.0
        },
        {
          "month": "Dic",
          "tmax": 12.8,
          "tmin": 5.0,
          "precip": 145.0
        }
      ]
    },
    {
      "name": "Crotone",
      "lat": 39.08,
      "lon": 17.13,
      "elevation": 8.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 13.2,
          "tmin": 6.5,
          "precip": 92.0
        },
        {
          "month": "Feb",
          "tmax": 13.8,
          "tmin": 6.2,
          "precip": 82.0
        },
        {
          "month": "Mar",
          "tmax": 15.8,
          "tmin": 7.8,
          "precip": 75.0
        },
        {
          "month": "Apr",
          "tmax": 18.8,
          "tmin": 10.2,
          "precip": 55.0
        },
        {
          "month": "Mag",
          "tmax": 23.2,
          "tmin": 14.5,
          "precip": 35.0
        },
        {
          "month": "Giu",
          "tmax": 28.2,
          "tmin": 18.8,
          "precip": 15.0
        },
        {
          "month": "Lug",
          "tmax": 31.2,
          "tmin": 21.8,
          "precip": 10.0
        },
        {
          "month": "Ago",
          "tmax": 31.5,
          "tmin": 22.2,
          "precip": 18.0
        },
        {
          "month": "Set",
          "tmax": 27.8,
          "tmin": 19.2,
          "precip": 55.0
        },
        {
          "month": "Ott",
          "tmax": 22.8,
          "tmin": 15.5,
          "precip": 85.0
        },
        {
          "month": "Nov",
          "tmax": 18.2,
          "tmin": 11.5,
          "precip": 105.0
        },
        {
          "month": "Dic",
          "tmax": 14.5,
          "tmin": 8.0,
          "precip": 115.0
        }
      ]
    },
    {
      "name": "Vibo Valentia",
      "lat": 38.67,
      "lon": 16.1,
      "elevation": 476.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 10.8,
          "tmin": 5.2,
          "precip": 115.0
        },
        {
          "month": "Feb",
          "tmax": 11.2,
          "tmin": 5.0,
          "precip": 105.0
        },
        {
          "month": "Mar",
          "tmax": 13.5,
          "tmin": 6.5,
          "precip": 95.0
        },
        {
          "month": "Apr",
          "tmax": 16.5,
          "tmin": 8.8,
          "precip": 75.0
        },
        {
          "month": "Mag",
          "tmax": 21.2,
          "tmin": 12.8,
          "precip": 52.0
        },
        {
          "month": "Giu",
          "tmax": 25.8,
          "tmin": 17.2,
          "precip": 28.0
        },
        {
          "month": "Lug",
          "tmax": 28.8,
          "tmin": 20.0,
          "precip": 15.0
        },
        {
          "month": "Ago",
          "tmax": 29.0,
          "tmin": 20.2,
          "precip": 25.0
        },
        {
          "month": "Set",
          "tmax": 25.5,
          "tmin": 17.5,
          "precip": 72.0
        },
        {
          "month": "Ott",
          "tmax": 20.8,
          "tmin": 14.0,
          "precip": 105.0
        },
        {
          "month": "Nov",
          "tmax": 15.8,
          "tmin": 10.2,
          "precip": 135.0
        },
        {
          "month": "Dic",
          "tmax": 12.2,
          "tmin": 6.8,
          "precip": 125.0
        }
      ]
    }
  ],
  "campania": [
    {
      "name": "Napoli",
      "lat": 40.88,
      "lon": 14.28,
      "elevation": 72.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.6,
          "tmin": 5.4,
          "precip": 107.0
        },
        {
          "month": "Feb",
          "tmax": 12.1,
          "tmin": 5.3,
          "precip": 101.0
        },
        {
          "month": "Mar",
          "tmax": 14.5,
          "tmin": 7.0,
          "precip": 103.0
        },
        {
          "month": "Apr",
          "tmax": 17.3,
          "tmin": 9.4,
          "precip": 95.0
        },
        {
          "month": "Mag",
          "tmax": 21.4,
          "tmin": 13.2,
          "precip": 63.0
        },
        {
          "month": "Giu",
          "tmax": 25.6,
          "tmin": 17.4,
          "precip": 34.0
        },
        {
          "month": "Lug",
          "tmax": 28.5,
          "tmin": 20.2,
          "precip": 19.0
        },
        {
          "month": "Ago",
          "tmax": 29.2,
          "tmin": 20.9,
          "precip": 23.0
        },
        {
          "month": "Set",
          "tmax": 25.0,
          "tmin": 17.6,
          "precip": 90.0
        },
        {
          "month": "Ott",
          "tmax": 20.9,
          "tmin": 14.0,
          "precip": 132.0
        },
        {
          "month": "Nov",
          "tmax": 16.3,
          "tmin": 10.3,
          "precip": 174.0
        },
        {
          "month": "Dic",
          "tmax": 12.6,
          "tmin": 6.7,
          "precip": 133.0
        }
      ]
    },
    {
      "name": "Salerno",
      "lat": 40.68,
      "lon": 14.77,
      "elevation": 4.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 13.0,
          "tmin": 7.5,
          "precip": 120.0
        },
        {
          "month": "Feb",
          "tmax": 13.5,
          "tmin": 7.5,
          "precip": 110.0
        },
        {
          "month": "Mar",
          "tmax": 15.5,
          "tmin": 9.0,
          "precip": 100.0
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 11.5,
          "precip": 85.0
        },
        {
          "month": "Mag",
          "tmax": 22.5,
          "tmin": 15.0,
          "precip": 60.0
        },
        {
          "month": "Giu",
          "tmax": 26.5,
          "tmin": 19.0,
          "precip": 35.0
        },
        {
          "month": "Lug",
          "tmax": 29.5,
          "tmin": 22.0,
          "precip": 20.0
        },
        {
          "month": "Ago",
          "tmax": 30.0,
          "tmin": 22.5,
          "precip": 30.0
        },
        {
          "month": "Set",
          "tmax": 27.0,
          "tmin": 19.5,
          "precip": 85.0
        },
        {
          "month": "Ott",
          "tmax": 22.5,
          "tmin": 16.0,
          "precip": 130.0
        },
        {
          "month": "Nov",
          "tmax": 17.5,
          "tmin": 12.0,
          "precip": 160.0
        },
        {
          "month": "Dic",
          "tmax": 14.0,
          "tmin": 9.0,
          "precip": 140.0
        }
      ]
    },
    {
      "name": "Avellino",
      "lat": 40.91,
      "lon": 14.79,
      "elevation": 348.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.8,
          "tmin": 2.5,
          "precip": 145.0
        },
        {
          "month": "Feb",
          "tmax": 10.8,
          "tmin": 2.5,
          "precip": 135.0
        },
        {
          "month": "Mar",
          "tmax": 13.8,
          "tmin": 4.2,
          "precip": 120.0
        },
        {
          "month": "Apr",
          "tmax": 17.2,
          "tmin": 6.8,
          "precip": 105.0
        },
        {
          "month": "Mag",
          "tmax": 21.8,
          "tmin": 10.8,
          "precip": 75.0
        },
        {
          "month": "Giu",
          "tmax": 26.5,
          "tmin": 14.8,
          "precip": 45.0
        },
        {
          "month": "Lug",
          "tmax": 29.8,
          "tmin": 17.5,
          "precip": 30.0
        },
        {
          "month": "Ago",
          "tmax": 30.2,
          "tmin": 18.0,
          "precip": 40.0
        },
        {
          "month": "Set",
          "tmax": 26.5,
          "tmin": 15.2,
          "precip": 95.0
        },
        {
          "month": "Ott",
          "tmax": 21.2,
          "tmin": 11.2,
          "precip": 155.0
        },
        {
          "month": "Nov",
          "tmax": 15.2,
          "tmin": 7.2,
          "precip": 195.0
        },
        {
          "month": "Dic",
          "tmax": 10.8,
          "tmin": 3.8,
          "precip": 175.0
        }
      ]
    },
    {
      "name": "Benevento",
      "lat": 41.13,
      "lon": 14.78,
      "elevation": 135.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.2,
          "tmin": 2.8,
          "precip": 115.0
        },
        {
          "month": "Feb",
          "tmax": 12.5,
          "tmin": 2.8,
          "precip": 105.0
        },
        {
          "month": "Mar",
          "tmax": 15.8,
          "tmin": 4.8,
          "precip": 95.0
        },
        {
          "month": "Apr",
          "tmax": 19.2,
          "tmin": 7.5,
          "precip": 85.0
        },
        {
          "month": "Mag",
          "tmax": 24.2,
          "tmin": 11.8,
          "precip": 62.0
        },
        {
          "month": "Giu",
          "tmax": 29.2,
          "tmin": 15.8,
          "precip": 38.0
        },
        {
          "month": "Lug",
          "tmax": 32.5,
          "tmin": 18.5,
          "precip": 22.0
        },
        {
          "month": "Ago",
          "tmax": 32.8,
          "tmin": 18.8,
          "precip": 32.0
        },
        {
          "month": "Set",
          "tmax": 28.5,
          "tmin": 15.5,
          "precip": 72.0
        },
        {
          "month": "Ott",
          "tmax": 22.8,
          "tmin": 11.8,
          "precip": 115.0
        },
        {
          "month": "Nov",
          "tmax": 16.5,
          "tmin": 7.8,
          "precip": 145.0
        },
        {
          "month": "Dic",
          "tmax": 12.2,
          "tmin": 4.2,
          "precip": 135.0
        }
      ]
    },
    {
      "name": "Caserta",
      "lat": 41.07,
      "lon": 14.33,
      "elevation": 68.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.2,
          "tmin": 4.2,
          "precip": 115.0
        },
        {
          "month": "Feb",
          "tmax": 13.2,
          "tmin": 4.2,
          "precip": 105.0
        },
        {
          "month": "Mar",
          "tmax": 16.2,
          "tmin": 6.0,
          "precip": 95.0
        },
        {
          "month": "Apr",
          "tmax": 19.5,
          "tmin": 8.8,
          "precip": 85.0
        },
        {
          "month": "Mag",
          "tmax": 24.2,
          "tmin": 13.2,
          "precip": 62.0
        },
        {
          "month": "Giu",
          "tmax": 28.8,
          "tmin": 17.2,
          "precip": 38.0
        },
        {
          "month": "Lug",
          "tmax": 31.8,
          "tmin": 20.0,
          "precip": 22.0
        },
        {
          "month": "Ago",
          "tmax": 32.2,
          "tmin": 20.2,
          "precip": 32.0
        },
        {
          "month": "Set",
          "tmax": 28.5,
          "tmin": 17.2,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 23.2,
          "tmin": 13.2,
          "precip": 115.0
        },
        {
          "month": "Nov",
          "tmax": 17.5,
          "tmin": 9.2,
          "precip": 145.0
        },
        {
          "month": "Dic",
          "tmax": 13.2,
          "tmin": 5.5,
          "precip": 135.0
        }
      ]
    }
  ],
  "emilia_romagna": [
    {
      "name": "Bologna",
      "lat": 44.49,
      "lon": 11.34,
      "elevation": 54.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 8.1,
          "tmin": 0.5,
          "precip": 46.0
        },
        {
          "month": "Feb",
          "tmax": 10.0,
          "tmin": 0.7,
          "precip": 67.0
        },
        {
          "month": "Mar",
          "tmax": 14.4,
          "tmin": 4.2,
          "precip": 63.0
        },
        {
          "month": "Apr",
          "tmax": 18.1,
          "tmin": 7.9,
          "precip": 77.0
        },
        {
          "month": "Mag",
          "tmax": 22.9,
          "tmin": 12.3,
          "precip": 78.0
        },
        {
          "month": "Giu",
          "tmax": 27.7,
          "tmin": 16.7,
          "precip": 60.0
        },
        {
          "month": "Lug",
          "tmax": 30.8,
          "tmin": 19.3,
          "precip": 45.0
        },
        {
          "month": "Ago",
          "tmax": 30.4,
          "tmin": 19.5,
          "precip": 52.0
        },
        {
          "month": "Set",
          "tmax": 24.9,
          "tmin": 15.1,
          "precip": 67.0
        },
        {
          "month": "Ott",
          "tmax": 19.2,
          "tmin": 10.9,
          "precip": 76.0
        },
        {
          "month": "Nov",
          "tmax": 13.2,
          "tmin": 6.1,
          "precip": 93.0
        },
        {
          "month": "Dic",
          "tmax": 8.5,
          "tmin": 1.4,
          "precip": 71.0
        }
      ]
    },
    {
      "name": "Cesena",
      "lat": 44.14,
      "lon": 12.24,
      "elevation": 44.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.0,
          "tmin": 1.0,
          "precip": 55.0
        },
        {
          "month": "Feb",
          "tmax": 11.0,
          "tmin": 2.0,
          "precip": 50.0
        },
        {
          "month": "Mar",
          "tmax": 15.0,
          "tmin": 5.0,
          "precip": 60.0
        },
        {
          "month": "Apr",
          "tmax": 18.0,
          "tmin": 8.0,
          "precip": 65.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 12.0,
          "precip": 60.0
        },
        {
          "month": "Giu",
          "tmax": 27.0,
          "tmin": 16.0,
          "precip": 50.0
        },
        {
          "month": "Lug",
          "tmax": 30.0,
          "tmin": 19.0,
          "precip": 40.0
        },
        {
          "month": "Ago",
          "tmax": 30.0,
          "tmin": 19.0,
          "precip": 55.0
        },
        {
          "month": "Set",
          "tmax": 25.0,
          "tmin": 15.0,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 20.0,
          "tmin": 11.0,
          "precip": 85.0
        },
        {
          "month": "Nov",
          "tmax": 14.0,
          "tmin": 6.0,
          "precip": 95.0
        },
        {
          "month": "Dic",
          "tmax": 10.0,
          "tmin": 2.0,
          "precip": 70.0
        }
      ]
    },
    {
      "name": "Ferrara",
      "lat": 44.84,
      "lon": 11.62,
      "elevation": 9.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.8,
          "tmin": -0.2,
          "precip": 48.0
        },
        {
          "month": "Feb",
          "tmax": 9.5,
          "tmin": 1.2,
          "precip": 45.0
        },
        {
          "month": "Mar",
          "tmax": 14.5,
          "tmin": 4.8,
          "precip": 60.0
        },
        {
          "month": "Apr",
          "tmax": 19.0,
          "tmin": 8.8,
          "precip": 75.0
        },
        {
          "month": "Mag",
          "tmax": 23.8,
          "tmin": 13.0,
          "precip": 80.0
        },
        {
          "month": "Giu",
          "tmax": 28.0,
          "tmin": 16.8,
          "precip": 65.0
        },
        {
          "month": "Lug",
          "tmax": 30.8,
          "tmin": 19.0,
          "precip": 48.0
        },
        {
          "month": "Ago",
          "tmax": 30.2,
          "tmin": 18.8,
          "precip": 60.0
        },
        {
          "month": "Set",
          "tmax": 25.5,
          "tmin": 14.8,
          "precip": 68.0
        },
        {
          "month": "Ott",
          "tmax": 19.0,
          "tmin": 10.2,
          "precip": 82.0
        },
        {
          "month": "Nov",
          "tmax": 12.0,
          "tmin": 4.5,
          "precip": 78.0
        },
        {
          "month": "Dic",
          "tmax": 7.2,
          "tmin": 0.5,
          "precip": 52.0
        }
      ]
    },
    {
      "name": "Forl\u00ec",
      "lat": 44.22,
      "lon": 12.04,
      "elevation": 34.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 8.0,
          "tmin": 0.0,
          "precip": 50.0
        },
        {
          "month": "Feb",
          "tmax": 10.0,
          "tmin": 1.0,
          "precip": 45.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 4.0,
          "precip": 60.0
        },
        {
          "month": "Apr",
          "tmax": 18.0,
          "tmin": 8.0,
          "precip": 65.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 12.0,
          "precip": 60.0
        },
        {
          "month": "Giu",
          "tmax": 27.0,
          "tmin": 16.0,
          "precip": 50.0
        },
        {
          "month": "Lug",
          "tmax": 30.0,
          "tmin": 18.0,
          "precip": 40.0
        },
        {
          "month": "Ago",
          "tmax": 30.0,
          "tmin": 18.0,
          "precip": 55.0
        },
        {
          "month": "Set",
          "tmax": 25.0,
          "tmin": 15.0,
          "precip": 70.0
        },
        {
          "month": "Ott",
          "tmax": 20.0,
          "tmin": 11.0,
          "precip": 80.0
        },
        {
          "month": "Nov",
          "tmax": 13.0,
          "tmin": 5.0,
          "precip": 90.0
        },
        {
          "month": "Dic",
          "tmax": 9.0,
          "tmin": 1.0,
          "precip": 65.0
        }
      ]
    },
    {
      "name": "Modena",
      "lat": 44.65,
      "lon": 10.93,
      "elevation": 34.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.0,
          "tmin": -1.0,
          "precip": 50.0
        },
        {
          "month": "Feb",
          "tmax": 10.0,
          "tmin": 0.0,
          "precip": 55.0
        },
        {
          "month": "Mar",
          "tmax": 15.0,
          "tmin": 4.0,
          "precip": 60.0
        },
        {
          "month": "Apr",
          "tmax": 19.0,
          "tmin": 8.0,
          "precip": 75.0
        },
        {
          "month": "Mag",
          "tmax": 24.0,
          "tmin": 13.0,
          "precip": 75.0
        },
        {
          "month": "Giu",
          "tmax": 28.0,
          "tmin": 17.0,
          "precip": 60.0
        },
        {
          "month": "Lug",
          "tmax": 31.0,
          "tmin": 20.0,
          "precip": 45.0
        },
        {
          "month": "Ago",
          "tmax": 31.0,
          "tmin": 20.0,
          "precip": 50.0
        },
        {
          "month": "Set",
          "tmax": 26.0,
          "tmin": 16.0,
          "precip": 65.0
        },
        {
          "month": "Ott",
          "tmax": 20.0,
          "tmin": 11.0,
          "precip": 85.0
        },
        {
          "month": "Nov",
          "tmax": 13.0,
          "tmin": 5.0,
          "precip": 95.0
        },
        {
          "month": "Dic",
          "tmax": 8.0,
          "tmin": 0.0,
          "precip": 75.0
        }
      ]
    },
    {
      "name": "Parma",
      "lat": 44.8,
      "lon": 10.32,
      "elevation": 55.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.9,
          "tmin": 1.1,
          "precip": 57.0
        },
        {
          "month": "Feb",
          "tmax": 9.8,
          "tmin": 2.2,
          "precip": 55.0
        },
        {
          "month": "Mar",
          "tmax": 15.5,
          "tmin": 5.9,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 19.5,
          "tmin": 9.5,
          "precip": 76.0
        },
        {
          "month": "Mag",
          "tmax": 24.6,
          "tmin": 14.0,
          "precip": 73.0
        },
        {
          "month": "Giu",
          "tmax": 29.2,
          "tmin": 18.1,
          "precip": 56.0
        },
        {
          "month": "Lug",
          "tmax": 31.8,
          "tmin": 20.4,
          "precip": 37.0
        },
        {
          "month": "Ago",
          "tmax": 31.3,
          "tmin": 20.4,
          "precip": 48.0
        },
        {
          "month": "Set",
          "tmax": 25.6,
          "tmin": 15.9,
          "precip": 67.0
        },
        {
          "month": "Ott",
          "tmax": 18.7,
          "tmin": 11.5,
          "precip": 96.0
        },
        {
          "month": "Nov",
          "tmax": 11.9,
          "tmin": 6.6,
          "precip": 84.0
        },
        {
          "month": "Dic",
          "tmax": 7.3,
          "tmin": 2.0,
          "precip": 63.0
        }
      ]
    },
    {
      "name": "Rimini",
      "lat": 44.06,
      "lon": 12.56,
      "elevation": 6.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.5,
          "tmin": 3.1,
          "precip": 61.0
        },
        {
          "month": "Feb",
          "tmax": 10.4,
          "tmin": 3.7,
          "precip": 102.0
        },
        {
          "month": "Mar",
          "tmax": 13.6,
          "tmin": 6.0,
          "precip": 81.0
        },
        {
          "month": "Apr",
          "tmax": 17.5,
          "tmin": 9.6,
          "precip": 63.0
        },
        {
          "month": "Mag",
          "tmax": 21.1,
          "tmin": 13.2,
          "precip": 87.0
        },
        {
          "month": "Giu",
          "tmax": 26.3,
          "tmin": 17.9,
          "precip": 45.0
        },
        {
          "month": "Lug",
          "tmax": 28.9,
          "tmin": 20.6,
          "precip": 45.0
        },
        {
          "month": "Ago",
          "tmax": 28.8,
          "tmin": 20.6,
          "precip": 47.0
        },
        {
          "month": "Set",
          "tmax": 24.5,
          "tmin": 17.1,
          "precip": 92.0
        },
        {
          "month": "Ott",
          "tmax": 19.5,
          "tmin": 12.9,
          "precip": 91.0
        },
        {
          "month": "Nov",
          "tmax": 14.6,
          "tmin": 8.9,
          "precip": 95.0
        },
        {
          "month": "Dic",
          "tmax": 10.6,
          "tmin": 4.2,
          "precip": 60.0
        }
      ]
    },
    {
      "name": "Piacenza",
      "lat": 45.05,
      "lon": 9.69,
      "elevation": 61.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.0,
          "tmin": -2.0,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 9.0,
          "tmin": -1.0,
          "precip": 60.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 3.0,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 18.0,
          "tmin": 7.0,
          "precip": 85.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 12.0,
          "precip": 80.0
        },
        {
          "month": "Giu",
          "tmax": 27.0,
          "tmin": 16.0,
          "precip": 65.0
        },
        {
          "month": "Lug",
          "tmax": 30.0,
          "tmin": 18.0,
          "precip": 45.0
        },
        {
          "month": "Ago",
          "tmax": 30.0,
          "tmin": 18.0,
          "precip": 55.0
        },
        {
          "month": "Set",
          "tmax": 25.0,
          "tmin": 14.0,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 19.0,
          "tmin": 10.0,
          "precip": 100.0
        },
        {
          "month": "Nov",
          "tmax": 12.0,
          "tmin": 4.0,
          "precip": 110.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": -1.0,
          "precip": 75.0
        }
      ]
    },
    {
      "name": "Ravenna",
      "lat": 44.42,
      "lon": 12.2,
      "elevation": 4.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 8.0,
          "tmin": 0.0,
          "precip": 45.0
        },
        {
          "month": "Feb",
          "tmax": 10.0,
          "tmin": 1.0,
          "precip": 40.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 4.0,
          "precip": 50.0
        },
        {
          "month": "Apr",
          "tmax": 18.0,
          "tmin": 8.0,
          "precip": 55.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 12.0,
          "precip": 55.0
        },
        {
          "month": "Giu",
          "tmax": 27.0,
          "tmin": 16.0,
          "precip": 50.0
        },
        {
          "month": "Lug",
          "tmax": 30.0,
          "tmin": 18.0,
          "precip": 40.0
        },
        {
          "month": "Ago",
          "tmax": 30.0,
          "tmin": 18.0,
          "precip": 60.0
        },
        {
          "month": "Set",
          "tmax": 25.0,
          "tmin": 15.0,
          "precip": 70.0
        },
        {
          "month": "Ott",
          "tmax": 20.0,
          "tmin": 11.0,
          "precip": 75.0
        },
        {
          "month": "Nov",
          "tmax": 13.0,
          "tmin": 5.0,
          "precip": 85.0
        },
        {
          "month": "Dic",
          "tmax": 9.0,
          "tmin": 1.0,
          "precip": 60.0
        }
      ]
    },
    {
      "name": "Reggio Emilia",
      "lat": 44.7,
      "lon": 10.63,
      "elevation": 58.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.0,
          "tmin": -1.0,
          "precip": 55.0
        },
        {
          "month": "Feb",
          "tmax": 10.0,
          "tmin": 0.0,
          "precip": 55.0
        },
        {
          "month": "Mar",
          "tmax": 15.0,
          "tmin": 4.0,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 19.0,
          "tmin": 8.0,
          "precip": 80.0
        },
        {
          "month": "Mag",
          "tmax": 24.0,
          "tmin": 13.0,
          "precip": 75.0
        },
        {
          "month": "Giu",
          "tmax": 28.0,
          "tmin": 17.0,
          "precip": 60.0
        },
        {
          "month": "Lug",
          "tmax": 31.0,
          "tmin": 20.0,
          "precip": 45.0
        },
        {
          "month": "Ago",
          "tmax": 31.0,
          "tmin": 20.0,
          "precip": 50.0
        },
        {
          "month": "Set",
          "tmax": 26.0,
          "tmin": 16.0,
          "precip": 65.0
        },
        {
          "month": "Ott",
          "tmax": 20.0,
          "tmin": 11.0,
          "precip": 85.0
        },
        {
          "month": "Nov",
          "tmax": 13.0,
          "tmin": 5.0,
          "precip": 95.0
        },
        {
          "month": "Dic",
          "tmax": 8.0,
          "tmin": 0.0,
          "precip": 70.0
        }
      ]
    }
  ],
  "friuli_venezia_giulia": [
    {
      "name": "Trieste",
      "lat": 45.65,
      "lon": 13.76,
      "elevation": 2.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.4,
          "tmin": 1.4,
          "precip": 90.0
        },
        {
          "month": "Feb",
          "tmax": 8.8,
          "tmin": 1.5,
          "precip": 96.0
        },
        {
          "month": "Mar",
          "tmax": 12.5,
          "tmin": 4.5,
          "precip": 99.0
        },
        {
          "month": "Apr",
          "tmax": 16.5,
          "tmin": 8.2,
          "precip": 107.0
        },
        {
          "month": "Mag",
          "tmax": 20.8,
          "tmin": 12.7,
          "precip": 120.0
        },
        {
          "month": "Giu",
          "tmax": 25.0,
          "tmin": 16.7,
          "precip": 107.0
        },
        {
          "month": "Lug",
          "tmax": 27.5,
          "tmin": 18.9,
          "precip": 87.0
        },
        {
          "month": "Ago",
          "tmax": 27.8,
          "tmin": 19.2,
          "precip": 110.0
        },
        {
          "month": "Set",
          "tmax": 22.5,
          "tmin": 15.1,
          "precip": 169.0
        },
        {
          "month": "Ott",
          "tmax": 17.6,
          "tmin": 11.1,
          "precip": 184.0
        },
        {
          "month": "Nov",
          "tmax": 12.5,
          "tmin": 6.8,
          "precip": 192.0
        },
        {
          "month": "Dic",
          "tmax": 8.3,
          "tmin": 2.4,
          "precip": 128.0
        }
      ]
    },
    {
      "name": "Gorizia",
      "lat": 45.94,
      "lon": 13.62,
      "elevation": 84.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.8,
          "tmin": 0.8,
          "precip": 95.0
        },
        {
          "month": "Feb",
          "tmax": 9.8,
          "tmin": 1.2,
          "precip": 85.0
        },
        {
          "month": "Mar",
          "tmax": 14.2,
          "tmin": 4.5,
          "precip": 92.0
        },
        {
          "month": "Apr",
          "tmax": 18.2,
          "tmin": 8.5,
          "precip": 105.0
        },
        {
          "month": "Mag",
          "tmax": 23.2,
          "tmin": 13.2,
          "precip": 115.0
        },
        {
          "month": "Giu",
          "tmax": 27.2,
          "tmin": 17.2,
          "precip": 105.0
        },
        {
          "month": "Lug",
          "tmax": 29.8,
          "tmin": 19.5,
          "precip": 85.0
        },
        {
          "month": "Ago",
          "tmax": 29.8,
          "tmin": 19.8,
          "precip": 95.0
        },
        {
          "month": "Set",
          "tmax": 25.2,
          "tmin": 15.8,
          "precip": 135.0
        },
        {
          "month": "Ott",
          "tmax": 19.8,
          "tmin": 11.5,
          "precip": 155.0
        },
        {
          "month": "Nov",
          "tmax": 13.5,
          "tmin": 6.5,
          "precip": 175.0
        },
        {
          "month": "Dic",
          "tmax": 8.8,
          "tmin": 1.8,
          "precip": 115.0
        }
      ]
    },
    {
      "name": "Pordenone",
      "lat": 45.96,
      "lon": 12.66,
      "elevation": 24.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.2,
          "tmin": -0.5,
          "precip": 85.0
        },
        {
          "month": "Feb",
          "tmax": 9.5,
          "tmin": 0.2,
          "precip": 80.0
        },
        {
          "month": "Mar",
          "tmax": 14.2,
          "tmin": 3.8,
          "precip": 95.0
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 8.2,
          "precip": 125.0
        },
        {
          "month": "Mag",
          "tmax": 23.5,
          "tmin": 13.0,
          "precip": 135.0
        },
        {
          "month": "Giu",
          "tmax": 27.5,
          "tmin": 17.0,
          "precip": 125.0
        },
        {
          "month": "Lug",
          "tmax": 30.2,
          "tmin": 19.2,
          "precip": 95.0
        },
        {
          "month": "Ago",
          "tmax": 30.0,
          "tmin": 19.0,
          "precip": 105.0
        },
        {
          "month": "Set",
          "tmax": 25.5,
          "tmin": 15.2,
          "precip": 125.0
        },
        {
          "month": "Ott",
          "tmax": 19.5,
          "tmin": 10.5,
          "precip": 145.0
        },
        {
          "month": "Nov",
          "tmax": 13.2,
          "tmin": 5.5,
          "precip": 165.0
        },
        {
          "month": "Dic",
          "tmax": 8.2,
          "tmin": 0.5,
          "precip": 105.0
        }
      ]
    },
    {
      "name": "Udine",
      "lat": 46.06,
      "lon": 13.23,
      "elevation": 113.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.5,
          "tmin": -0.2,
          "precip": 95.0
        },
        {
          "month": "Feb",
          "tmax": 9.8,
          "tmin": 0.8,
          "precip": 90.0
        },
        {
          "month": "Mar",
          "tmax": 14.5,
          "tmin": 4.5,
          "precip": 105.0
        },
        {
          "month": "Apr",
          "tmax": 18.8,
          "tmin": 8.8,
          "precip": 135.0
        },
        {
          "month": "Mag",
          "tmax": 23.8,
          "tmin": 13.5,
          "precip": 145.0
        },
        {
          "month": "Giu",
          "tmax": 27.8,
          "tmin": 17.5,
          "precip": 135.0
        },
        {
          "month": "Lug",
          "tmax": 30.5,
          "tmin": 19.8,
          "precip": 105.0
        },
        {
          "month": "Ago",
          "tmax": 30.5,
          "tmin": 19.8,
          "precip": 115.0
        },
        {
          "month": "Set",
          "tmax": 25.8,
          "tmin": 15.8,
          "precip": 155.0
        },
        {
          "month": "Ott",
          "tmax": 20.2,
          "tmin": 11.2,
          "precip": 175.0
        },
        {
          "month": "Nov",
          "tmax": 13.8,
          "tmin": 6.2,
          "precip": 195.0
        },
        {
          "month": "Dic",
          "tmax": 8.8,
          "tmin": 0.8,
          "precip": 125.0
        }
      ]
    }
  ],
  "lazio": [
    {
      "name": "Roma",
      "lat": 41.9,
      "lon": 12.5,
      "elevation": 21.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.1,
          "tmin": 3.5,
          "precip": 71.0
        },
        {
          "month": "Feb",
          "tmax": 13.5,
          "tmin": 4.2,
          "precip": 65.0
        },
        {
          "month": "Mar",
          "tmax": 16.8,
          "tmin": 6.8,
          "precip": 52.0
        },
        {
          "month": "Apr",
          "tmax": 20.5,
          "tmin": 9.8,
          "precip": 51.0
        },
        {
          "month": "Mag",
          "tmax": 25.2,
          "tmin": 13.5,
          "precip": 38.0
        },
        {
          "month": "Giu",
          "tmax": 29.8,
          "tmin": 17.5,
          "precip": 25.0
        },
        {
          "month": "Lug",
          "tmax": 32.5,
          "tmin": 20.2,
          "precip": 18.0
        },
        {
          "month": "Ago",
          "tmax": 32.1,
          "tmin": 20.1,
          "precip": 22.0
        },
        {
          "month": "Set",
          "tmax": 27.8,
          "tmin": 16.8,
          "precip": 62.0
        },
        {
          "month": "Ott",
          "tmax": 21.5,
          "tmin": 12.5,
          "precip": 98.0
        },
        {
          "month": "Nov",
          "tmax": 15.8,
          "tmin": 7.8,
          "precip": 105.0
        },
        {
          "month": "Dic",
          "tmax": 12.2,
          "tmin": 4.2,
          "precip": 88.0
        }
      ]
    },
    {
      "name": "Frosinone",
      "lat": 41.64,
      "lon": 13.35,
      "elevation": 291.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.2,
          "tmin": 2.5,
          "precip": 115.0
        },
        {
          "month": "Feb",
          "tmax": 12.5,
          "tmin": 2.8,
          "precip": 105.0
        },
        {
          "month": "Mar",
          "tmax": 15.5,
          "tmin": 4.8,
          "precip": 95.0
        },
        {
          "month": "Apr",
          "tmax": 18.8,
          "tmin": 7.8,
          "precip": 100.0
        },
        {
          "month": "Mag",
          "tmax": 23.5,
          "tmin": 12.2,
          "precip": 75.0
        },
        {
          "month": "Giu",
          "tmax": 28.2,
          "tmin": 16.2,
          "precip": 45.0
        },
        {
          "month": "Lug",
          "tmax": 31.8,
          "tmin": 19.0,
          "precip": 32.0
        },
        {
          "month": "Ago",
          "tmax": 31.8,
          "tmin": 19.2,
          "precip": 40.0
        },
        {
          "month": "Set",
          "tmax": 27.2,
          "tmin": 15.5,
          "precip": 85.0
        },
        {
          "month": "Ott",
          "tmax": 21.5,
          "tmin": 11.5,
          "precip": 135.0
        },
        {
          "month": "Nov",
          "tmax": 15.8,
          "tmin": 7.2,
          "precip": 175.0
        },
        {
          "month": "Dic",
          "tmax": 11.8,
          "tmin": 3.5,
          "precip": 145.0
        }
      ]
    },
    {
      "name": "Latina",
      "lat": 41.47,
      "lon": 12.9,
      "elevation": 21.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.5,
          "tmin": 4.8,
          "precip": 95.0
        },
        {
          "month": "Feb",
          "tmax": 13.2,
          "tmin": 4.8,
          "precip": 85.0
        },
        {
          "month": "Mar",
          "tmax": 15.8,
          "tmin": 6.5,
          "precip": 75.0
        },
        {
          "month": "Apr",
          "tmax": 18.8,
          "tmin": 9.0,
          "precip": 72.0
        },
        {
          "month": "Mag",
          "tmax": 23.2,
          "tmin": 13.2,
          "precip": 52.0
        },
        {
          "month": "Giu",
          "tmax": 27.5,
          "tmin": 17.2,
          "precip": 28.0
        },
        {
          "month": "Lug",
          "tmax": 30.5,
          "tmin": 20.0,
          "precip": 15.0
        },
        {
          "month": "Ago",
          "tmax": 30.8,
          "tmin": 20.2,
          "precip": 22.0
        },
        {
          "month": "Set",
          "tmax": 27.5,
          "tmin": 17.5,
          "precip": 65.0
        },
        {
          "month": "Ott",
          "tmax": 22.5,
          "tmin": 13.5,
          "precip": 105.0
        },
        {
          "month": "Nov",
          "tmax": 17.2,
          "tmin": 9.2,
          "precip": 130.0
        },
        {
          "month": "Dic",
          "tmax": 13.2,
          "tmin": 5.8,
          "precip": 115.0
        }
      ]
    },
    {
      "name": "Rieti",
      "lat": 42.4,
      "lon": 12.86,
      "elevation": 405.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.2,
          "tmin": -0.5,
          "precip": 105.0
        },
        {
          "month": "Feb",
          "tmax": 10.8,
          "tmin": -0.2,
          "precip": 95.0
        },
        {
          "month": "Mar",
          "tmax": 14.2,
          "tmin": 2.2,
          "precip": 85.0
        },
        {
          "month": "Apr",
          "tmax": 17.5,
          "tmin": 5.2,
          "precip": 90.0
        },
        {
          "month": "Mag",
          "tmax": 22.5,
          "tmin": 9.5,
          "precip": 75.0
        },
        {
          "month": "Giu",
          "tmax": 27.2,
          "tmin": 13.2,
          "precip": 55.0
        },
        {
          "month": "Lug",
          "tmax": 30.8,
          "tmin": 16.0,
          "precip": 35.0
        },
        {
          "month": "Ago",
          "tmax": 30.8,
          "tmin": 16.2,
          "precip": 45.0
        },
        {
          "month": "Set",
          "tmax": 25.8,
          "tmin": 12.8,
          "precip": 80.0
        },
        {
          "month": "Ott",
          "tmax": 19.8,
          "tmin": 8.8,
          "precip": 115.0
        },
        {
          "month": "Nov",
          "tmax": 14.0,
          "tmin": 4.5,
          "precip": 145.0
        },
        {
          "month": "Dic",
          "tmax": 9.8,
          "tmin": 0.8,
          "precip": 130.0
        }
      ]
    },
    {
      "name": "Viterbo",
      "lat": 42.42,
      "lon": 12.1,
      "elevation": 326.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 10.2,
          "tmin": 1.8,
          "precip": 75.0
        },
        {
          "month": "Feb",
          "tmax": 11.5,
          "tmin": 2.0,
          "precip": 72.0
        },
        {
          "month": "Mar",
          "tmax": 14.8,
          "tmin": 4.2,
          "precip": 68.0
        },
        {
          "month": "Apr",
          "tmax": 18.2,
          "tmin": 7.0,
          "precip": 75.0
        },
        {
          "month": "Mag",
          "tmax": 23.2,
          "tmin": 11.2,
          "precip": 62.0
        },
        {
          "month": "Giu",
          "tmax": 28.2,
          "tmin": 15.2,
          "precip": 42.0
        },
        {
          "month": "Lug",
          "tmax": 31.8,
          "tmin": 18.2,
          "precip": 25.0
        },
        {
          "month": "Ago",
          "tmax": 32.0,
          "tmin": 18.5,
          "precip": 38.0
        },
        {
          "month": "Set",
          "tmax": 27.2,
          "tmin": 14.8,
          "precip": 65.0
        },
        {
          "month": "Ott",
          "tmax": 21.2,
          "tmin": 11.0,
          "precip": 95.0
        },
        {
          "month": "Nov",
          "tmax": 15.2,
          "tmin": 6.5,
          "precip": 115.0
        },
        {
          "month": "Dic",
          "tmax": 10.8,
          "tmin": 3.0,
          "precip": 92.0
        }
      ]
    }
  ],
  "liguria": [
    {
      "name": "Genova",
      "lat": 44.4,
      "lon": 8.94,
      "elevation": 20.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.6,
          "tmin": 3.8,
          "precip": 98.0
        },
        {
          "month": "Feb",
          "tmax": 10.7,
          "tmin": 4.0,
          "precip": 78.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 6.5,
          "precip": 94.0
        },
        {
          "month": "Apr",
          "tmax": 16.9,
          "tmin": 9.5,
          "precip": 109.0
        },
        {
          "month": "Mag",
          "tmax": 20.5,
          "tmin": 13.4,
          "precip": 101.0
        },
        {
          "month": "Giu",
          "tmax": 24.3,
          "tmin": 17.3,
          "precip": 85.0
        },
        {
          "month": "Lug",
          "tmax": 27.1,
          "tmin": 19.7,
          "precip": 54.0
        },
        {
          "month": "Ago",
          "tmax": 27.4,
          "tmin": 20.2,
          "precip": 65.0
        },
        {
          "month": "Set",
          "tmax": 23.4,
          "tmin": 16.4,
          "precip": 125.0
        },
        {
          "month": "Ott",
          "tmax": 18.7,
          "tmin": 12.8,
          "precip": 182.0
        },
        {
          "month": "Nov",
          "tmax": 13.7,
          "tmin": 8.4,
          "precip": 198.0
        },
        {
          "month": "Dic",
          "tmax": 10.3,
          "tmin": 4.8,
          "precip": 126.0
        }
      ]
    },
    {
      "name": "Imperia",
      "lat": 43.88,
      "lon": 8.03,
      "elevation": 10.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.0,
          "tmin": 6.5,
          "precip": 85.0
        },
        {
          "month": "Feb",
          "tmax": 12.5,
          "tmin": 6.5,
          "precip": 75.0
        },
        {
          "month": "Mar",
          "tmax": 14.8,
          "tmin": 8.5,
          "precip": 72.0
        },
        {
          "month": "Apr",
          "tmax": 17.5,
          "tmin": 11.2,
          "precip": 70.0
        },
        {
          "month": "Mag",
          "tmax": 21.2,
          "tmin": 14.8,
          "precip": 55.0
        },
        {
          "month": "Giu",
          "tmax": 25.2,
          "tmin": 18.8,
          "precip": 38.0
        },
        {
          "month": "Lug",
          "tmax": 28.2,
          "tmin": 21.8,
          "precip": 15.0
        },
        {
          "month": "Ago",
          "tmax": 28.5,
          "tmin": 22.2,
          "precip": 25.0
        },
        {
          "month": "Set",
          "tmax": 25.5,
          "tmin": 19.2,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 20.8,
          "tmin": 15.2,
          "precip": 115.0
        },
        {
          "month": "Nov",
          "tmax": 16.2,
          "tmin": 10.8,
          "precip": 145.0
        },
        {
          "month": "Dic",
          "tmax": 12.8,
          "tmin": 7.5,
          "precip": 105.0
        }
      ]
    },
    {
      "name": "La Spezia",
      "lat": 44.11,
      "lon": 9.83,
      "elevation": 3.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.2,
          "tmin": 4.8,
          "precip": 135.0
        },
        {
          "month": "Feb",
          "tmax": 12.2,
          "tmin": 5.2,
          "precip": 120.0
        },
        {
          "month": "Mar",
          "tmax": 15.2,
          "tmin": 7.8,
          "precip": 115.0
        },
        {
          "month": "Apr",
          "tmax": 18.2,
          "tmin": 10.5,
          "precip": 125.0
        },
        {
          "month": "Mag",
          "tmax": 22.8,
          "tmin": 14.5,
          "precip": 85.0
        },
        {
          "month": "Giu",
          "tmax": 26.8,
          "tmin": 18.2,
          "precip": 55.0
        },
        {
          "month": "Lug",
          "tmax": 29.8,
          "tmin": 21.0,
          "precip": 28.0
        },
        {
          "month": "Ago",
          "tmax": 30.2,
          "tmin": 21.2,
          "precip": 45.0
        },
        {
          "month": "Set",
          "tmax": 26.5,
          "tmin": 17.8,
          "precip": 125.0
        },
        {
          "month": "Ott",
          "tmax": 21.8,
          "tmin": 14.2,
          "precip": 185.0
        },
        {
          "month": "Nov",
          "tmax": 16.2,
          "tmin": 9.5,
          "precip": 225.0
        },
        {
          "month": "Dic",
          "tmax": 12.2,
          "tmin": 5.8,
          "precip": 175.0
        }
      ]
    },
    {
      "name": "Savona",
      "lat": 44.31,
      "lon": 8.48,
      "elevation": 4.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 10.5,
          "tmin": 4.5,
          "precip": 95.0
        },
        {
          "month": "Feb",
          "tmax": 11.5,
          "tmin": 4.8,
          "precip": 85.0
        },
        {
          "month": "Mar",
          "tmax": 14.2,
          "tmin": 7.2,
          "precip": 90.0
        },
        {
          "month": "Apr",
          "tmax": 17.2,
          "tmin": 10.0,
          "precip": 105.0
        },
        {
          "month": "Mag",
          "tmax": 21.2,
          "tmin": 13.8,
          "precip": 92.0
        },
        {
          "month": "Giu",
          "tmax": 25.2,
          "tmin": 17.8,
          "precip": 75.0
        },
        {
          "month": "Lug",
          "tmax": 28.2,
          "tmin": 20.5,
          "precip": 42.0
        },
        {
          "month": "Ago",
          "tmax": 28.5,
          "tmin": 20.8,
          "precip": 55.0
        },
        {
          "month": "Set",
          "tmax": 25.2,
          "tmin": 17.5,
          "precip": 115.0
        },
        {
          "month": "Ott",
          "tmax": 20.5,
          "tmin": 13.5,
          "precip": 165.0
        },
        {
          "month": "Nov",
          "tmax": 15.2,
          "tmin": 9.0,
          "precip": 185.0
        },
        {
          "month": "Dic",
          "tmax": 11.5,
          "tmin": 5.5,
          "precip": 125.0
        }
      ]
    }
  ],
  "lombardia": [
    {
      "name": "Milano",
      "lat": 45.47,
      "lon": 9.19,
      "elevation": 122.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 4.5,
          "tmin": -1.2,
          "precip": 55.0
        },
        {
          "month": "Feb",
          "tmax": 7.2,
          "tmin": 0.8,
          "precip": 51.0
        },
        {
          "month": "Mar",
          "tmax": 12.8,
          "tmin": 4.5,
          "precip": 72.0
        },
        {
          "month": "Apr",
          "tmax": 17.4,
          "tmin": 8.6,
          "precip": 85.0
        },
        {
          "month": "Mag",
          "tmax": 22.5,
          "tmin": 13.2,
          "precip": 92.0
        },
        {
          "month": "Giu",
          "tmax": 26.8,
          "tmin": 17.1,
          "precip": 78.0
        },
        {
          "month": "Lug",
          "tmax": 29.5,
          "tmin": 19.8,
          "precip": 62.0
        },
        {
          "month": "Ago",
          "tmax": 28.7,
          "tmin": 19.2,
          "precip": 75.0
        },
        {
          "month": "Set",
          "tmax": 23.8,
          "tmin": 15.1,
          "precip": 68.0
        },
        {
          "month": "Ott",
          "tmax": 17.2,
          "tmin": 9.8,
          "precip": 88.0
        },
        {
          "month": "Nov",
          "tmax": 9.8,
          "tmin": 3.5,
          "precip": 91.0
        },
        {
          "month": "Dic",
          "tmax": 5.1,
          "tmin": -0.2,
          "precip": 62.0
        }
      ]
    },
    {
      "name": "Bergamo",
      "lat": 45.69,
      "lon": 9.67,
      "elevation": 249.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.0,
          "tmin": -1.0,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 8.0,
          "tmin": 0.0,
          "precip": 60.0
        },
        {
          "month": "Mar",
          "tmax": 13.0,
          "tmin": 4.0,
          "precip": 75.0
        },
        {
          "month": "Apr",
          "tmax": 17.0,
          "tmin": 8.0,
          "precip": 95.0
        },
        {
          "month": "Mag",
          "tmax": 22.0,
          "tmin": 12.0,
          "precip": 105.0
        },
        {
          "month": "Giu",
          "tmax": 26.0,
          "tmin": 16.0,
          "precip": 100.0
        },
        {
          "month": "Lug",
          "tmax": 29.0,
          "tmin": 18.0,
          "precip": 85.0
        },
        {
          "month": "Ago",
          "tmax": 28.0,
          "tmin": 18.0,
          "precip": 95.0
        },
        {
          "month": "Set",
          "tmax": 24.0,
          "tmin": 14.0,
          "precip": 95.0
        },
        {
          "month": "Ott",
          "tmax": 18.0,
          "tmin": 9.0,
          "precip": 115.0
        },
        {
          "month": "Nov",
          "tmax": 11.0,
          "tmin": 4.0,
          "precip": 125.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": 0.0,
          "precip": 75.0
        }
      ]
    },
    {
      "name": "Brescia",
      "lat": 45.54,
      "lon": 10.21,
      "elevation": 149.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.5,
          "tmin": -1.0,
          "precip": 52.0
        },
        {
          "month": "Feb",
          "tmax": 9.0,
          "tmin": 0.5,
          "precip": 50.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 4.0,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 18.2,
          "tmin": 8.0,
          "precip": 82.0
        },
        {
          "month": "Mag",
          "tmax": 22.8,
          "tmin": 12.2,
          "precip": 95.0
        },
        {
          "month": "Giu",
          "tmax": 27.0,
          "tmin": 15.8,
          "precip": 85.0
        },
        {
          "month": "Lug",
          "tmax": 29.8,
          "tmin": 18.0,
          "precip": 62.0
        },
        {
          "month": "Ago",
          "tmax": 29.2,
          "tmin": 17.8,
          "precip": 72.0
        },
        {
          "month": "Set",
          "tmax": 24.5,
          "tmin": 13.8,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 18.5,
          "tmin": 9.2,
          "precip": 92.0
        },
        {
          "month": "Nov",
          "tmax": 11.5,
          "tmin": 3.5,
          "precip": 88.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": -0.5,
          "precip": 58.0
        }
      ]
    },
    {
      "name": "Como",
      "lat": 45.81,
      "lon": 9.08,
      "elevation": 201.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.0,
          "tmin": 0.0,
          "precip": 70.0
        },
        {
          "month": "Feb",
          "tmax": 9.0,
          "tmin": 1.0,
          "precip": 65.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 4.0,
          "precip": 90.0
        },
        {
          "month": "Apr",
          "tmax": 18.0,
          "tmin": 8.0,
          "precip": 130.0
        },
        {
          "month": "Mag",
          "tmax": 22.0,
          "tmin": 12.0,
          "precip": 150.0
        },
        {
          "month": "Giu",
          "tmax": 26.0,
          "tmin": 16.0,
          "precip": 130.0
        },
        {
          "month": "Lug",
          "tmax": 29.0,
          "tmin": 18.0,
          "precip": 100.0
        },
        {
          "month": "Ago",
          "tmax": 28.0,
          "tmin": 18.0,
          "precip": 115.0
        },
        {
          "month": "Set",
          "tmax": 24.0,
          "tmin": 14.0,
          "precip": 125.0
        },
        {
          "month": "Ott",
          "tmax": 18.0,
          "tmin": 10.0,
          "precip": 140.0
        },
        {
          "month": "Nov",
          "tmax": 12.0,
          "tmin": 5.0,
          "precip": 145.0
        },
        {
          "month": "Dic",
          "tmax": 8.0,
          "tmin": 1.0,
          "precip": 80.0
        }
      ]
    },
    {
      "name": "Cremona",
      "lat": 45.13,
      "lon": 10.02,
      "elevation": 47.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.0,
          "tmin": -1.0,
          "precip": 55.0
        },
        {
          "month": "Feb",
          "tmax": 9.0,
          "tmin": 0.0,
          "precip": 50.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 4.0,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 18.0,
          "tmin": 8.0,
          "precip": 80.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 13.0,
          "precip": 85.0
        },
        {
          "month": "Giu",
          "tmax": 27.0,
          "tmin": 17.0,
          "precip": 70.0
        },
        {
          "month": "Lug",
          "tmax": 30.0,
          "tmin": 19.0,
          "precip": 55.0
        },
        {
          "month": "Ago",
          "tmax": 29.0,
          "tmin": 19.0,
          "precip": 65.0
        },
        {
          "month": "Set",
          "tmax": 25.0,
          "tmin": 15.0,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 19.0,
          "tmin": 10.0,
          "precip": 90.0
        },
        {
          "month": "Nov",
          "tmax": 12.0,
          "tmin": 4.0,
          "precip": 95.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": 0.0,
          "precip": 65.0
        }
      ]
    },
    {
      "name": "Lecco",
      "lat": 45.85,
      "lon": 9.39,
      "elevation": 214.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.0,
          "tmin": 0.0,
          "precip": 75.0
        },
        {
          "month": "Feb",
          "tmax": 9.0,
          "tmin": 1.0,
          "precip": 70.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 4.0,
          "precip": 100.0
        },
        {
          "month": "Apr",
          "tmax": 18.0,
          "tmin": 8.0,
          "precip": 140.0
        },
        {
          "month": "Mag",
          "tmax": 22.0,
          "tmin": 12.0,
          "precip": 160.0
        },
        {
          "month": "Giu",
          "tmax": 26.0,
          "tmin": 16.0,
          "precip": 140.0
        },
        {
          "month": "Lug",
          "tmax": 29.0,
          "tmin": 18.0,
          "precip": 110.0
        },
        {
          "month": "Ago",
          "tmax": 28.0,
          "tmin": 18.0,
          "precip": 125.0
        },
        {
          "month": "Set",
          "tmax": 24.0,
          "tmin": 14.0,
          "precip": 135.0
        },
        {
          "month": "Ott",
          "tmax": 18.0,
          "tmin": 10.0,
          "precip": 150.0
        },
        {
          "month": "Nov",
          "tmax": 12.0,
          "tmin": 5.0,
          "precip": 155.0
        },
        {
          "month": "Dic",
          "tmax": 8.0,
          "tmin": 1.0,
          "precip": 85.0
        }
      ]
    },
    {
      "name": "Lodi",
      "lat": 45.31,
      "lon": 9.5,
      "elevation": 87.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.0,
          "tmin": -1.0,
          "precip": 60.0
        },
        {
          "month": "Feb",
          "tmax": 9.0,
          "tmin": 0.0,
          "precip": 55.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 4.0,
          "precip": 70.0
        },
        {
          "month": "Apr",
          "tmax": 18.0,
          "tmin": 8.0,
          "precip": 85.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 13.0,
          "precip": 90.0
        },
        {
          "month": "Giu",
          "tmax": 27.0,
          "tmin": 17.0,
          "precip": 75.0
        },
        {
          "month": "Lug",
          "tmax": 30.0,
          "tmin": 19.0,
          "precip": 60.0
        },
        {
          "month": "Ago",
          "tmax": 29.0,
          "tmin": 19.0,
          "precip": 70.0
        },
        {
          "month": "Set",
          "tmax": 25.0,
          "tmin": 15.0,
          "precip": 80.0
        },
        {
          "month": "Ott",
          "tmax": 19.0,
          "tmin": 10.0,
          "precip": 95.0
        },
        {
          "month": "Nov",
          "tmax": 12.0,
          "tmin": 4.0,
          "precip": 100.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": 0.0,
          "precip": 70.0
        }
      ]
    },
    {
      "name": "Mantova",
      "lat": 45.16,
      "lon": 10.79,
      "elevation": 19.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.0,
          "tmin": -1.0,
          "precip": 45.0
        },
        {
          "month": "Feb",
          "tmax": 9.0,
          "tmin": 0.0,
          "precip": 45.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 4.0,
          "precip": 55.0
        },
        {
          "month": "Apr",
          "tmax": 19.0,
          "tmin": 8.0,
          "precip": 70.0
        },
        {
          "month": "Mag",
          "tmax": 24.0,
          "tmin": 13.0,
          "precip": 75.0
        },
        {
          "month": "Giu",
          "tmax": 28.0,
          "tmin": 17.0,
          "precip": 65.0
        },
        {
          "month": "Lug",
          "tmax": 31.0,
          "tmin": 19.0,
          "precip": 45.0
        },
        {
          "month": "Ago",
          "tmax": 30.0,
          "tmin": 19.0,
          "precip": 55.0
        },
        {
          "month": "Set",
          "tmax": 25.0,
          "tmin": 15.0,
          "precip": 60.0
        },
        {
          "month": "Ott",
          "tmax": 19.0,
          "tmin": 10.0,
          "precip": 75.0
        },
        {
          "month": "Nov",
          "tmax": 12.0,
          "tmin": 4.0,
          "precip": 80.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": 0.0,
          "precip": 55.0
        }
      ]
    },
    {
      "name": "Monza",
      "lat": 45.58,
      "lon": 9.27,
      "elevation": 162.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.0,
          "tmin": -1.0,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 8.0,
          "tmin": 0.0,
          "precip": 60.0
        },
        {
          "month": "Mar",
          "tmax": 13.0,
          "tmin": 4.0,
          "precip": 80.0
        },
        {
          "month": "Apr",
          "tmax": 17.0,
          "tmin": 8.0,
          "precip": 95.0
        },
        {
          "month": "Mag",
          "tmax": 22.0,
          "tmin": 12.0,
          "precip": 105.0
        },
        {
          "month": "Giu",
          "tmax": 26.0,
          "tmin": 16.0,
          "precip": 95.0
        },
        {
          "month": "Lug",
          "tmax": 29.0,
          "tmin": 18.0,
          "precip": 75.0
        },
        {
          "month": "Ago",
          "tmax": 28.0,
          "tmin": 18.0,
          "precip": 85.0
        },
        {
          "month": "Set",
          "tmax": 24.0,
          "tmin": 14.0,
          "precip": 85.0
        },
        {
          "month": "Ott",
          "tmax": 18.0,
          "tmin": 9.0,
          "precip": 110.0
        },
        {
          "month": "Nov",
          "tmax": 11.0,
          "tmin": 4.0,
          "precip": 115.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": 0.0,
          "precip": 75.0
        }
      ]
    },
    {
      "name": "Pavia",
      "lat": 45.19,
      "lon": 9.15,
      "elevation": 77.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.0,
          "tmin": -1.0,
          "precip": 60.0
        },
        {
          "month": "Feb",
          "tmax": 9.0,
          "tmin": 0.0,
          "precip": 55.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 4.0,
          "precip": 70.0
        },
        {
          "month": "Apr",
          "tmax": 18.0,
          "tmin": 8.0,
          "precip": 85.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 13.0,
          "precip": 90.0
        },
        {
          "month": "Giu",
          "tmax": 27.0,
          "tmin": 17.0,
          "precip": 75.0
        },
        {
          "month": "Lug",
          "tmax": 30.0,
          "tmin": 19.0,
          "precip": 60.0
        },
        {
          "month": "Ago",
          "tmax": 29.0,
          "tmin": 19.0,
          "precip": 70.0
        },
        {
          "month": "Set",
          "tmax": 25.0,
          "tmin": 15.0,
          "precip": 80.0
        },
        {
          "month": "Ott",
          "tmax": 19.0,
          "tmin": 10.0,
          "precip": 95.0
        },
        {
          "month": "Nov",
          "tmax": 12.0,
          "tmin": 4.0,
          "precip": 100.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": 0.0,
          "precip": 70.0
        }
      ]
    },
    {
      "name": "Sondrio",
      "lat": 46.17,
      "lon": 9.87,
      "elevation": 307.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 5.0,
          "tmin": -3.0,
          "precip": 45.0
        },
        {
          "month": "Feb",
          "tmax": 8.0,
          "tmin": -1.0,
          "precip": 40.0
        },
        {
          "month": "Mar",
          "tmax": 13.0,
          "tmin": 3.0,
          "precip": 60.0
        },
        {
          "month": "Apr",
          "tmax": 17.0,
          "tmin": 7.0,
          "precip": 90.0
        },
        {
          "month": "Mag",
          "tmax": 21.0,
          "tmin": 11.0,
          "precip": 110.0
        },
        {
          "month": "Giu",
          "tmax": 25.0,
          "tmin": 15.0,
          "precip": 105.0
        },
        {
          "month": "Lug",
          "tmax": 27.0,
          "tmin": 17.0,
          "precip": 95.0
        },
        {
          "month": "Ago",
          "tmax": 27.0,
          "tmin": 17.0,
          "precip": 100.0
        },
        {
          "month": "Set",
          "tmax": 22.0,
          "tmin": 13.0,
          "precip": 95.0
        },
        {
          "month": "Ott",
          "tmax": 16.0,
          "tmin": 8.0,
          "precip": 105.0
        },
        {
          "month": "Nov",
          "tmax": 10.0,
          "tmin": 2.0,
          "precip": 110.0
        },
        {
          "month": "Dic",
          "tmax": 5.0,
          "tmin": -2.0,
          "precip": 60.0
        }
      ]
    },
    {
      "name": "Varese",
      "lat": 45.82,
      "lon": 8.82,
      "elevation": 382.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.0,
          "tmin": 0.0,
          "precip": 75.0
        },
        {
          "month": "Feb",
          "tmax": 9.0,
          "tmin": 1.0,
          "precip": 70.0
        },
        {
          "month": "Mar",
          "tmax": 13.0,
          "tmin": 4.0,
          "precip": 95.0
        },
        {
          "month": "Apr",
          "tmax": 17.0,
          "tmin": 8.0,
          "precip": 140.0
        },
        {
          "month": "Mag",
          "tmax": 21.0,
          "tmin": 12.0,
          "precip": 160.0
        },
        {
          "month": "Giu",
          "tmax": 25.0,
          "tmin": 16.0,
          "precip": 140.0
        },
        {
          "month": "Lug",
          "tmax": 28.0,
          "tmin": 18.0,
          "precip": 110.0
        },
        {
          "month": "Ago",
          "tmax": 27.0,
          "tmin": 18.0,
          "precip": 125.0
        },
        {
          "month": "Set",
          "tmax": 23.0,
          "tmin": 14.0,
          "precip": 135.0
        },
        {
          "month": "Ott",
          "tmax": 17.0,
          "tmin": 10.0,
          "precip": 150.0
        },
        {
          "month": "Nov",
          "tmax": 11.0,
          "tmin": 5.0,
          "precip": 160.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": 1.0,
          "precip": 90.0
        }
      ]
    }
  ],
  "marche": [
    {
      "name": "Ancona",
      "lat": 43.61,
      "lon": 13.51,
      "elevation": 16.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 10.1,
          "tmin": 4.4,
          "precip": 47.0
        },
        {
          "month": "Feb",
          "tmax": 11.5,
          "tmin": 4.9,
          "precip": 55.0
        },
        {
          "month": "Mar",
          "tmax": 15.0,
          "tmin": 7.6,
          "precip": 59.0
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 10.6,
          "precip": 54.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 15.0,
          "precip": 56.0
        },
        {
          "month": "Giu",
          "tmax": 27.3,
          "tmin": 19.0,
          "precip": 52.0
        },
        {
          "month": "Lug",
          "tmax": 29.6,
          "tmin": 21.5,
          "precip": 35.0
        },
        {
          "month": "Ago",
          "tmax": 29.6,
          "tmin": 21.8,
          "precip": 39.0
        },
        {
          "month": "Set",
          "tmax": 25.4,
          "tmin": 17.7,
          "precip": 86.0
        },
        {
          "month": "Ott",
          "tmax": 20.7,
          "tmin": 14.0,
          "precip": 69.0
        },
        {
          "month": "Nov",
          "tmax": 15.5,
          "tmin": 9.7,
          "precip": 87.0
        },
        {
          "month": "Dic",
          "tmax": 11.2,
          "tmin": 5.5,
          "precip": 71.0
        }
      ]
    },
    {
      "name": "Ascoli Piceno",
      "lat": 42.85,
      "lon": 13.57,
      "elevation": 154.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 10.5,
          "tmin": 1.8,
          "precip": 68.0
        },
        {
          "month": "Feb",
          "tmax": 11.5,
          "tmin": 2.0,
          "precip": 62.0
        },
        {
          "month": "Mar",
          "tmax": 14.8,
          "tmin": 4.2,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 18.2,
          "tmin": 7.5,
          "precip": 75.0
        },
        {
          "month": "Mag",
          "tmax": 23.2,
          "tmin": 11.8,
          "precip": 60.0
        },
        {
          "month": "Giu",
          "tmax": 28.2,
          "tmin": 15.8,
          "precip": 48.0
        },
        {
          "month": "Lug",
          "tmax": 31.2,
          "tmin": 18.5,
          "precip": 35.0
        },
        {
          "month": "Ago",
          "tmax": 31.5,
          "tmin": 18.8,
          "precip": 45.0
        },
        {
          "month": "Set",
          "tmax": 27.2,
          "tmin": 15.2,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 21.2,
          "tmin": 11.5,
          "precip": 95.0
        },
        {
          "month": "Nov",
          "tmax": 15.2,
          "tmin": 6.8,
          "precip": 105.0
        },
        {
          "month": "Dic",
          "tmax": 11.2,
          "tmin": 3.2,
          "precip": 85.0
        }
      ]
    },
    {
      "name": "Fermo",
      "lat": 43.16,
      "lon": 13.71,
      "elevation": 319.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.5,
          "tmin": 3.5,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 10.2,
          "tmin": 3.5,
          "precip": 60.0
        },
        {
          "month": "Mar",
          "tmax": 13.5,
          "tmin": 5.8,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 16.8,
          "tmin": 8.8,
          "precip": 62.0
        },
        {
          "month": "Mag",
          "tmax": 21.5,
          "tmin": 13.2,
          "precip": 55.0
        },
        {
          "month": "Giu",
          "tmax": 26.2,
          "tmin": 17.2,
          "precip": 45.0
        },
        {
          "month": "Lug",
          "tmax": 29.2,
          "tmin": 19.8,
          "precip": 32.0
        },
        {
          "month": "Ago",
          "tmax": 29.5,
          "tmin": 20.2,
          "precip": 42.0
        },
        {
          "month": "Set",
          "tmax": 25.2,
          "tmin": 16.8,
          "precip": 72.0
        },
        {
          "month": "Ott",
          "tmax": 20.2,
          "tmin": 13.2,
          "precip": 85.0
        },
        {
          "month": "Nov",
          "tmax": 14.8,
          "tmin": 8.8,
          "precip": 95.0
        },
        {
          "month": "Dic",
          "tmax": 10.8,
          "tmin": 5.2,
          "precip": 82.0
        }
      ]
    },
    {
      "name": "Macerata",
      "lat": 43.3,
      "lon": 13.45,
      "elevation": 315.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.2,
          "tmin": 2.8,
          "precip": 72.0
        },
        {
          "month": "Feb",
          "tmax": 10.2,
          "tmin": 2.8,
          "precip": 65.0
        },
        {
          "month": "Mar",
          "tmax": 13.5,
          "tmin": 5.2,
          "precip": 70.0
        },
        {
          "month": "Apr",
          "tmax": 16.8,
          "tmin": 8.2,
          "precip": 75.0
        },
        {
          "month": "Mag",
          "tmax": 21.8,
          "tmin": 12.5,
          "precip": 62.0
        },
        {
          "month": "Giu",
          "tmax": 26.5,
          "tmin": 16.5,
          "precip": 52.0
        },
        {
          "month": "Lug",
          "tmax": 29.5,
          "tmin": 19.2,
          "precip": 38.0
        },
        {
          "month": "Ago",
          "tmax": 29.8,
          "tmin": 19.5,
          "precip": 48.0
        },
        {
          "month": "Set",
          "tmax": 25.2,
          "tmin": 16.2,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 20.2,
          "tmin": 12.2,
          "precip": 88.0
        },
        {
          "month": "Nov",
          "tmax": 14.5,
          "tmin": 7.8,
          "precip": 105.0
        },
        {
          "month": "Dic",
          "tmax": 10.2,
          "tmin": 4.2,
          "precip": 85.0
        }
      ]
    },
    {
      "name": "Pesaro",
      "lat": 43.91,
      "lon": 12.91,
      "elevation": 11.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.2,
          "tmin": 2.5,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 10.5,
          "tmin": 2.8,
          "precip": 60.0
        },
        {
          "month": "Mar",
          "tmax": 13.8,
          "tmin": 5.2,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 17.2,
          "tmin": 8.5,
          "precip": 62.0
        },
        {
          "month": "Mag",
          "tmax": 22.0,
          "tmin": 12.8,
          "precip": 60.0
        },
        {
          "month": "Giu",
          "tmax": 26.5,
          "tmin": 16.8,
          "precip": 52.0
        },
        {
          "month": "Lug",
          "tmax": 29.5,
          "tmin": 19.5,
          "precip": 38.0
        },
        {
          "month": "Ago",
          "tmax": 29.5,
          "tmin": 19.8,
          "precip": 48.0
        },
        {
          "month": "Set",
          "tmax": 25.5,
          "tmin": 16.5,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 20.2,
          "tmin": 12.2,
          "precip": 85.0
        },
        {
          "month": "Nov",
          "tmax": 14.5,
          "tmin": 8.0,
          "precip": 95.0
        },
        {
          "month": "Dic",
          "tmax": 10.5,
          "tmin": 4.2,
          "precip": 82.0
        }
      ]
    },
    {
      "name": "Urbino",
      "lat": 43.72,
      "lon": 12.63,
      "elevation": 485.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.2,
          "tmin": 1.5,
          "precip": 85.0
        },
        {
          "month": "Feb",
          "tmax": 8.2,
          "tmin": 1.8,
          "precip": 75.0
        },
        {
          "month": "Mar",
          "tmax": 11.5,
          "tmin": 3.8,
          "precip": 80.0
        },
        {
          "month": "Apr",
          "tmax": 14.8,
          "tmin": 6.5,
          "precip": 85.0
        },
        {
          "month": "Mag",
          "tmax": 19.8,
          "tmin": 10.8,
          "precip": 75.0
        },
        {
          "month": "Giu",
          "tmax": 24.5,
          "tmin": 14.8,
          "precip": 62.0
        },
        {
          "month": "Lug",
          "tmax": 27.8,
          "tmin": 17.5,
          "precip": 45.0
        },
        {
          "month": "Ago",
          "tmax": 28.0,
          "tmin": 17.8,
          "precip": 55.0
        },
        {
          "month": "Set",
          "tmax": 23.5,
          "tmin": 14.5,
          "precip": 85.0
        },
        {
          "month": "Ott",
          "tmax": 18.2,
          "tmin": 10.5,
          "precip": 105.0
        },
        {
          "month": "Nov",
          "tmax": 12.5,
          "tmin": 6.2,
          "precip": 125.0
        },
        {
          "month": "Dic",
          "tmax": 8.5,
          "tmin": 2.8,
          "precip": 105.0
        }
      ]
    }
  ],
  "molise": [
    {
      "name": "Campobasso",
      "lat": 41.56,
      "lon": 14.65,
      "elevation": 701.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.5,
          "tmin": 0.4,
          "precip": 73.0
        },
        {
          "month": "Feb",
          "tmax": 8.4,
          "tmin": 0.5,
          "precip": 66.0
        },
        {
          "month": "Mar",
          "tmax": 11.6,
          "tmin": 2.9,
          "precip": 80.0
        },
        {
          "month": "Apr",
          "tmax": 15.1,
          "tmin": 5.8,
          "precip": 80.0
        },
        {
          "month": "Mag",
          "tmax": 19.6,
          "tmin": 10.0,
          "precip": 70.0
        },
        {
          "month": "Giu",
          "tmax": 24.5,
          "tmin": 14.3,
          "precip": 51.0
        },
        {
          "month": "Lug",
          "tmax": 27.5,
          "tmin": 16.8,
          "precip": 38.0
        },
        {
          "month": "Ago",
          "tmax": 28.0,
          "tmin": 17.5,
          "precip": 35.0
        },
        {
          "month": "Set",
          "tmax": 22.6,
          "tmin": 13.5,
          "precip": 56.0
        },
        {
          "month": "Ott",
          "tmax": 18.0,
          "tmin": 9.8,
          "precip": 69.0
        },
        {
          "month": "Nov",
          "tmax": 12.8,
          "tmin": 5.6,
          "precip": 87.0
        },
        {
          "month": "Dic",
          "tmax": 8.5,
          "tmin": 1.7,
          "precip": 83.0
        }
      ]
    },
    {
      "name": "Isernia",
      "lat": 41.59,
      "lon": 14.23,
      "elevation": 423.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 8.8,
          "tmin": 1.5,
          "precip": 105.0
        },
        {
          "month": "Feb",
          "tmax": 9.8,
          "tmin": 1.5,
          "precip": 95.0
        },
        {
          "month": "Mar",
          "tmax": 13.2,
          "tmin": 3.8,
          "precip": 85.0
        },
        {
          "month": "Apr",
          "tmax": 16.5,
          "tmin": 6.5,
          "precip": 80.0
        },
        {
          "month": "Mag",
          "tmax": 21.2,
          "tmin": 10.5,
          "precip": 62.0
        },
        {
          "month": "Giu",
          "tmax": 26.2,
          "tmin": 14.5,
          "precip": 42.0
        },
        {
          "month": "Lug",
          "tmax": 29.5,
          "tmin": 17.2,
          "precip": 25.0
        },
        {
          "month": "Ago",
          "tmax": 29.8,
          "tmin": 17.5,
          "precip": 35.0
        },
        {
          "month": "Set",
          "tmax": 25.5,
          "tmin": 14.2,
          "precip": 72.0
        },
        {
          "month": "Ott",
          "tmax": 20.2,
          "tmin": 10.8,
          "precip": 105.0
        },
        {
          "month": "Nov",
          "tmax": 14.5,
          "tmin": 6.5,
          "precip": 135.0
        },
        {
          "month": "Dic",
          "tmax": 9.8,
          "tmin": 3.2,
          "precip": 125.0
        }
      ]
    }
  ],
  "piemonte": [
    {
      "name": "Torino",
      "lat": 45.19,
      "lon": 7.65,
      "elevation": 287.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.2,
          "tmin": -2.2,
          "precip": 59.0
        },
        {
          "month": "Feb",
          "tmax": 7.7,
          "tmin": -1.6,
          "precip": 65.0
        },
        {
          "month": "Mar",
          "tmax": 12.2,
          "tmin": 1.8,
          "precip": 81.0
        },
        {
          "month": "Apr",
          "tmax": 15.6,
          "tmin": 5.7,
          "precip": 119.0
        },
        {
          "month": "Mag",
          "tmax": 19.7,
          "tmin": 10.2,
          "precip": 139.0
        },
        {
          "month": "Giu",
          "tmax": 23.7,
          "tmin": 14.2,
          "precip": 104.0
        },
        {
          "month": "Lug",
          "tmax": 26.3,
          "tmin": 16.5,
          "precip": 63.0
        },
        {
          "month": "Ago",
          "tmax": 25.9,
          "tmin": 16.6,
          "precip": 74.0
        },
        {
          "month": "Set",
          "tmax": 21.2,
          "tmin": 12.9,
          "precip": 116.0
        },
        {
          "month": "Ott",
          "tmax": 15.8,
          "tmin": 8.7,
          "precip": 120.0
        },
        {
          "month": "Nov",
          "tmax": 10.4,
          "tmin": 3.2,
          "precip": 150.0
        },
        {
          "month": "Dic",
          "tmax": 6.6,
          "tmin": -1.3,
          "precip": 67.0
        }
      ]
    },
    {
      "name": "Cuneo",
      "lat": 44.39,
      "lon": 7.54,
      "elevation": 534.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.0,
          "tmin": -2.5,
          "precip": 55.0
        },
        {
          "month": "Feb",
          "tmax": 8.0,
          "tmin": -1.5,
          "precip": 50.0
        },
        {
          "month": "Mar",
          "tmax": 12.5,
          "tmin": 2.0,
          "precip": 70.0
        },
        {
          "month": "Apr",
          "tmax": 16.0,
          "tmin": 5.5,
          "precip": 100.0
        },
        {
          "month": "Mag",
          "tmax": 20.5,
          "tmin": 9.5,
          "precip": 110.0
        },
        {
          "month": "Giu",
          "tmax": 24.5,
          "tmin": 13.5,
          "precip": 90.0
        },
        {
          "month": "Lug",
          "tmax": 27.5,
          "tmin": 16.0,
          "precip": 60.0
        },
        {
          "month": "Ago",
          "tmax": 27.0,
          "tmin": 16.0,
          "precip": 70.0
        },
        {
          "month": "Set",
          "tmax": 22.5,
          "tmin": 12.5,
          "precip": 85.0
        },
        {
          "month": "Ott",
          "tmax": 16.5,
          "tmin": 8.0,
          "precip": 110.0
        },
        {
          "month": "Nov",
          "tmax": 10.5,
          "tmin": 3.0,
          "precip": 120.0
        },
        {
          "month": "Dic",
          "tmax": 6.5,
          "tmin": -1.5,
          "precip": 70.0
        }
      ]
    },
    {
      "name": "Novara",
      "lat": 45.45,
      "lon": 8.62,
      "elevation": 160.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.5,
          "tmin": -1.5,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 9.0,
          "tmin": 0.0,
          "precip": 60.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 3.5,
          "precip": 75.0
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 7.5,
          "precip": 95.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 12.0,
          "precip": 105.0
        },
        {
          "month": "Giu",
          "tmax": 27.0,
          "tmin": 16.0,
          "precip": 95.0
        },
        {
          "month": "Lug",
          "tmax": 30.0,
          "tmin": 18.5,
          "precip": 70.0
        },
        {
          "month": "Ago",
          "tmax": 29.0,
          "tmin": 18.0,
          "precip": 85.0
        },
        {
          "month": "Set",
          "tmax": 24.5,
          "tmin": 14.0,
          "precip": 90.0
        },
        {
          "month": "Ott",
          "tmax": 18.5,
          "tmin": 9.0,
          "precip": 115.0
        },
        {
          "month": "Nov",
          "tmax": 11.5,
          "tmin": 4.0,
          "precip": 120.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": -0.5,
          "precip": 75.0
        }
      ]
    },
    {
      "name": "Alessandria",
      "lat": 44.91,
      "lon": 8.61,
      "elevation": 95.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 5.5,
          "tmin": -2.5,
          "precip": 55.0
        },
        {
          "month": "Feb",
          "tmax": 8.5,
          "tmin": -1.5,
          "precip": 50.0
        },
        {
          "month": "Mar",
          "tmax": 13.8,
          "tmin": 2.5,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 6.8,
          "precip": 85.0
        },
        {
          "month": "Mag",
          "tmax": 23.5,
          "tmin": 11.5,
          "precip": 95.0
        },
        {
          "month": "Giu",
          "tmax": 27.8,
          "tmin": 15.5,
          "precip": 85.0
        },
        {
          "month": "Lug",
          "tmax": 30.5,
          "tmin": 18.2,
          "precip": 62.0
        },
        {
          "month": "Ago",
          "tmax": 29.8,
          "tmin": 17.8,
          "precip": 72.0
        },
        {
          "month": "Set",
          "tmax": 25.2,
          "tmin": 14.2,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 18.8,
          "tmin": 9.2,
          "precip": 105.0
        },
        {
          "month": "Nov",
          "tmax": 11.5,
          "tmin": 3.8,
          "precip": 115.0
        },
        {
          "month": "Dic",
          "tmax": 6.5,
          "tmin": -1.0,
          "precip": 75.0
        }
      ]
    },
    {
      "name": "Asti",
      "lat": 44.9,
      "lon": 8.2,
      "elevation": 123.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 5.8,
          "tmin": -3.2,
          "precip": 52.0
        },
        {
          "month": "Feb",
          "tmax": 8.8,
          "tmin": -2.2,
          "precip": 48.0
        },
        {
          "month": "Mar",
          "tmax": 14.2,
          "tmin": 1.8,
          "precip": 62.0
        },
        {
          "month": "Apr",
          "tmax": 18.8,
          "tmin": 6.2,
          "precip": 82.0
        },
        {
          "month": "Mag",
          "tmax": 23.8,
          "tmin": 10.8,
          "precip": 92.0
        },
        {
          "month": "Giu",
          "tmax": 28.2,
          "tmin": 14.8,
          "precip": 82.0
        },
        {
          "month": "Lug",
          "tmax": 31.0,
          "tmin": 17.5,
          "precip": 58.0
        },
        {
          "month": "Ago",
          "tmax": 30.2,
          "tmin": 17.2,
          "precip": 68.0
        },
        {
          "month": "Set",
          "tmax": 25.8,
          "tmin": 13.5,
          "precip": 72.0
        },
        {
          "month": "Ott",
          "tmax": 19.2,
          "tmin": 8.5,
          "precip": 100.0
        },
        {
          "month": "Nov",
          "tmax": 11.8,
          "tmin": 3.2,
          "precip": 110.0
        },
        {
          "month": "Dic",
          "tmax": 6.8,
          "tmin": -1.8,
          "precip": 70.0
        }
      ]
    },
    {
      "name": "Biella",
      "lat": 45.56,
      "lon": 8.05,
      "elevation": 420.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.5,
          "tmin": -1.2,
          "precip": 75.0
        },
        {
          "month": "Feb",
          "tmax": 8.5,
          "tmin": -0.5,
          "precip": 70.0
        },
        {
          "month": "Mar",
          "tmax": 13.2,
          "tmin": 3.2,
          "precip": 95.0
        },
        {
          "month": "Apr",
          "tmax": 17.2,
          "tmin": 7.2,
          "precip": 135.0
        },
        {
          "month": "Mag",
          "tmax": 21.2,
          "tmin": 11.5,
          "precip": 155.0
        },
        {
          "month": "Giu",
          "tmax": 25.5,
          "tmin": 15.5,
          "precip": 145.0
        },
        {
          "month": "Lug",
          "tmax": 28.5,
          "tmin": 18.2,
          "precip": 115.0
        },
        {
          "month": "Ago",
          "tmax": 27.8,
          "tmin": 18.0,
          "precip": 125.0
        },
        {
          "month": "Set",
          "tmax": 23.8,
          "tmin": 14.5,
          "precip": 135.0
        },
        {
          "month": "Ott",
          "tmax": 17.8,
          "tmin": 9.8,
          "precip": 155.0
        },
        {
          "month": "Nov",
          "tmax": 11.5,
          "tmin": 4.5,
          "precip": 165.0
        },
        {
          "month": "Dic",
          "tmax": 7.5,
          "tmin": 0.2,
          "precip": 95.0
        }
      ]
    },
    {
      "name": "Verbania",
      "lat": 45.92,
      "lon": 8.55,
      "elevation": 197.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.5,
          "tmin": 0.5,
          "precip": 85.0
        },
        {
          "month": "Feb",
          "tmax": 9.5,
          "tmin": 1.5,
          "precip": 80.0
        },
        {
          "month": "Mar",
          "tmax": 14.2,
          "tmin": 4.8,
          "precip": 115.0
        },
        {
          "month": "Apr",
          "tmax": 18.2,
          "tmin": 8.8,
          "precip": 165.0
        },
        {
          "month": "Mag",
          "tmax": 22.2,
          "tmin": 13.2,
          "precip": 195.0
        },
        {
          "month": "Giu",
          "tmax": 26.5,
          "tmin": 17.2,
          "precip": 175.0
        },
        {
          "month": "Lug",
          "tmax": 29.5,
          "tmin": 19.5,
          "precip": 145.0
        },
        {
          "month": "Ago",
          "tmax": 28.8,
          "tmin": 19.2,
          "precip": 165.0
        },
        {
          "month": "Set",
          "tmax": 24.5,
          "tmin": 15.5,
          "precip": 175.0
        },
        {
          "month": "Ott",
          "tmax": 18.5,
          "tmin": 10.5,
          "precip": 195.0
        },
        {
          "month": "Nov",
          "tmax": 12.5,
          "tmin": 5.5,
          "precip": 205.0
        },
        {
          "month": "Dic",
          "tmax": 8.5,
          "tmin": 1.5,
          "precip": 115.0
        }
      ]
    },
    {
      "name": "Vercelli",
      "lat": 45.32,
      "lon": 8.42,
      "elevation": 130.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.2,
          "tmin": -2.2,
          "precip": 60.0
        },
        {
          "month": "Feb",
          "tmax": 9.2,
          "tmin": -1.2,
          "precip": 55.0
        },
        {
          "month": "Mar",
          "tmax": 14.5,
          "tmin": 2.8,
          "precip": 70.0
        },
        {
          "month": "Apr",
          "tmax": 19.2,
          "tmin": 7.2,
          "precip": 90.0
        },
        {
          "month": "Mag",
          "tmax": 24.2,
          "tmin": 11.8,
          "precip": 100.0
        },
        {
          "month": "Giu",
          "tmax": 28.5,
          "tmin": 15.8,
          "precip": 90.0
        },
        {
          "month": "Lug",
          "tmax": 31.2,
          "tmin": 18.5,
          "precip": 65.0
        },
        {
          "month": "Ago",
          "tmax": 30.5,
          "tmin": 18.2,
          "precip": 80.0
        },
        {
          "month": "Set",
          "tmax": 25.8,
          "tmin": 14.5,
          "precip": 85.0
        },
        {
          "month": "Ott",
          "tmax": 19.5,
          "tmin": 9.5,
          "precip": 110.0
        },
        {
          "month": "Nov",
          "tmax": 12.2,
          "tmin": 4.2,
          "precip": 120.0
        },
        {
          "month": "Dic",
          "tmax": 7.2,
          "tmin": -0.8,
          "precip": 75.0
        }
      ]
    }
  ],
  "puglia": [
    {
      "name": "Bari",
      "lat": 41.13,
      "lon": 16.75,
      "elevation": 44.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.9,
          "tmin": 6.8,
          "precip": 60.0
        },
        {
          "month": "Feb",
          "tmax": 12.3,
          "tmin": 6.7,
          "precip": 56.0
        },
        {
          "month": "Mar",
          "tmax": 14.6,
          "tmin": 8.4,
          "precip": 59.0
        },
        {
          "month": "Apr",
          "tmax": 17.5,
          "tmin": 10.9,
          "precip": 57.0
        },
        {
          "month": "Mag",
          "tmax": 21.7,
          "tmin": 15.0,
          "precip": 39.0
        },
        {
          "month": "Giu",
          "tmax": 26.0,
          "tmin": 19.2,
          "precip": 33.0
        },
        {
          "month": "Lug",
          "tmax": 28.7,
          "tmin": 21.8,
          "precip": 25.0
        },
        {
          "month": "Ago",
          "tmax": 29.2,
          "tmin": 22.2,
          "precip": 24.0
        },
        {
          "month": "Set",
          "tmax": 25.1,
          "tmin": 18.8,
          "precip": 57.0
        },
        {
          "month": "Ott",
          "tmax": 21.0,
          "tmin": 15.2,
          "precip": 65.0
        },
        {
          "month": "Nov",
          "tmax": 16.7,
          "tmin": 11.6,
          "precip": 70.0
        },
        {
          "month": "Dic",
          "tmax": 12.9,
          "tmin": 8.2,
          "precip": 61.0
        }
      ]
    },
    {
      "name": "Lecce",
      "lat": 40.35,
      "lon": 18.17,
      "elevation": 49.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.5,
          "tmin": 5.8,
          "precip": 58.0
        },
        {
          "month": "Feb",
          "tmax": 13.0,
          "tmin": 5.5,
          "precip": 55.0
        },
        {
          "month": "Mar",
          "tmax": 15.2,
          "tmin": 7.5,
          "precip": 58.0
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 10.2,
          "precip": 48.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 14.5,
          "precip": 35.0
        },
        {
          "month": "Giu",
          "tmax": 27.5,
          "tmin": 18.8,
          "precip": 28.0
        },
        {
          "month": "Lug",
          "tmax": 30.2,
          "tmin": 21.5,
          "precip": 20.0
        },
        {
          "month": "Ago",
          "tmax": 30.5,
          "tmin": 21.8,
          "precip": 22.0
        },
        {
          "month": "Set",
          "tmax": 26.5,
          "tmin": 18.5,
          "precip": 52.0
        },
        {
          "month": "Ott",
          "tmax": 22.0,
          "tmin": 14.8,
          "precip": 68.0
        },
        {
          "month": "Nov",
          "tmax": 17.2,
          "tmin": 10.5,
          "precip": 75.0
        },
        {
          "month": "Dic",
          "tmax": 13.5,
          "tmin": 7.2,
          "precip": 62.0
        }
      ]
    },
    {
      "name": "Foggia",
      "lat": 41.54,
      "lon": 15.72,
      "elevation": 60.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.9,
          "tmin": 3.1,
          "precip": 35.5
        },
        {
          "month": "Feb",
          "tmax": 12.7,
          "tmin": 3.0,
          "precip": 41.3
        },
        {
          "month": "Mar",
          "tmax": 15.3,
          "tmin": 4.5,
          "precip": 39.8
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 6.9,
          "precip": 37.7
        },
        {
          "month": "Mag",
          "tmax": 24.2,
          "tmin": 11.3,
          "precip": 36.1
        },
        {
          "month": "Giu",
          "tmax": 28.8,
          "tmin": 15.3,
          "precip": 33.5
        },
        {
          "month": "Lug",
          "tmax": 31.8,
          "tmin": 18.1,
          "precip": 26.0
        },
        {
          "month": "Ago",
          "tmax": 31.8,
          "tmin": 18.4,
          "precip": 28.6
        },
        {
          "month": "Set",
          "tmax": 27.5,
          "tmin": 15.3,
          "precip": 42.3
        },
        {
          "month": "Ott",
          "tmax": 22.2,
          "tmin": 11.5,
          "precip": 45.6
        },
        {
          "month": "Nov",
          "tmax": 16.3,
          "tmin": 6.9,
          "precip": 58.3
        },
        {
          "month": "Dic",
          "tmax": 12.9,
          "tmin": 4.3,
          "precip": 44.5
        }
      ]
    },
    {
      "name": "Taranto",
      "lat": 40.45,
      "lon": 17.3,
      "elevation": 3.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.2,
          "tmin": 6.0,
          "precip": 43.0
        },
        {
          "month": "Feb",
          "tmax": 12.9,
          "tmin": 6.1,
          "precip": 43.0
        },
        {
          "month": "Mar",
          "tmax": 15.0,
          "tmin": 7.4,
          "precip": 42.0
        },
        {
          "month": "Apr",
          "tmax": 17.9,
          "tmin": 10.1,
          "precip": 27.5
        },
        {
          "month": "Mag",
          "tmax": 22.2,
          "tmin": 14.0,
          "precip": 22.0
        },
        {
          "month": "Giu",
          "tmax": 26.9,
          "tmin": 18.0,
          "precip": 13.5
        },
        {
          "month": "Lug",
          "tmax": 29.9,
          "tmin": 20.8,
          "precip": 11.0
        },
        {
          "month": "Ago",
          "tmax": 29.8,
          "tmin": 20.9,
          "precip": 17.0
        },
        {
          "month": "Set",
          "tmax": 26.8,
          "tmin": 18.0,
          "precip": 24.5
        },
        {
          "month": "Ott",
          "tmax": 21.9,
          "tmin": 14.2,
          "precip": 61.0
        },
        {
          "month": "Nov",
          "tmax": 17.2,
          "tmin": 10.2,
          "precip": 52.5
        },
        {
          "month": "Dic",
          "tmax": 13.8,
          "tmin": 7.1,
          "precip": 59.5
        }
      ]
    },
    {
      "name": "Brindisi",
      "lat": 40.63,
      "lon": 17.94,
      "elevation": 15.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.8,
          "tmin": 6.5,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 13.2,
          "tmin": 6.5,
          "precip": 60.0
        },
        {
          "month": "Mar",
          "tmax": 15.5,
          "tmin": 8.0,
          "precip": 60.0
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 10.5,
          "precip": 50.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 14.5,
          "precip": 35.0
        },
        {
          "month": "Giu",
          "tmax": 27.5,
          "tmin": 18.5,
          "precip": 25.0
        },
        {
          "month": "Lug",
          "tmax": 30.2,
          "tmin": 21.5,
          "precip": 15.0
        },
        {
          "month": "Ago",
          "tmax": 30.5,
          "tmin": 21.8,
          "precip": 25.0
        },
        {
          "month": "Set",
          "tmax": 26.8,
          "tmin": 19.0,
          "precip": 55.0
        },
        {
          "month": "Ott",
          "tmax": 22.2,
          "tmin": 15.5,
          "precip": 75.0
        },
        {
          "month": "Nov",
          "tmax": 17.8,
          "tmin": 11.5,
          "precip": 85.0
        },
        {
          "month": "Dic",
          "tmax": 14.2,
          "tmin": 8.0,
          "precip": 75.0
        }
      ]
    },
    {
      "name": "Andria",
      "lat": 41.23,
      "lon": 16.3,
      "elevation": 151.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.5,
          "tmin": 4.5,
          "precip": 58.0
        },
        {
          "month": "Feb",
          "tmax": 12.2,
          "tmin": 4.2,
          "precip": 52.0
        },
        {
          "month": "Mar",
          "tmax": 14.8,
          "tmin": 6.2,
          "precip": 55.0
        },
        {
          "month": "Apr",
          "tmax": 18.2,
          "tmin": 8.8,
          "precip": 50.0
        },
        {
          "month": "Mag",
          "tmax": 23.2,
          "tmin": 13.2,
          "precip": 38.0
        },
        {
          "month": "Giu",
          "tmax": 28.2,
          "tmin": 17.5,
          "precip": 25.0
        },
        {
          "month": "Lug",
          "tmax": 31.5,
          "tmin": 20.5,
          "precip": 15.0
        },
        {
          "month": "Ago",
          "tmax": 31.8,
          "tmin": 20.8,
          "precip": 22.0
        },
        {
          "month": "Set",
          "tmax": 27.5,
          "tmin": 17.5,
          "precip": 52.0
        },
        {
          "month": "Ott",
          "tmax": 21.8,
          "tmin": 13.8,
          "precip": 65.0
        },
        {
          "month": "Nov",
          "tmax": 16.8,
          "tmin": 9.5,
          "precip": 75.0
        },
        {
          "month": "Dic",
          "tmax": 12.5,
          "tmin": 6.2,
          "precip": 68.0
        }
      ]
    },
    {
      "name": "Barletta",
      "lat": 41.32,
      "lon": 16.28,
      "elevation": 15.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.2,
          "tmin": 5.8,
          "precip": 52.0
        },
        {
          "month": "Feb",
          "tmax": 12.8,
          "tmin": 5.5,
          "precip": 48.0
        },
        {
          "month": "Mar",
          "tmax": 15.2,
          "tmin": 7.5,
          "precip": 50.0
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 10.2,
          "precip": 45.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 14.5,
          "precip": 32.0
        },
        {
          "month": "Giu",
          "tmax": 27.5,
          "tmin": 18.8,
          "precip": 20.0
        },
        {
          "month": "Lug",
          "tmax": 30.2,
          "tmin": 21.5,
          "precip": 10.0
        },
        {
          "month": "Ago",
          "tmax": 30.5,
          "tmin": 21.8,
          "precip": 18.0
        },
        {
          "month": "Set",
          "tmax": 26.8,
          "tmin": 18.5,
          "precip": 48.0
        },
        {
          "month": "Ott",
          "tmax": 22.0,
          "tmin": 14.8,
          "precip": 62.0
        },
        {
          "month": "Nov",
          "tmax": 17.2,
          "tmin": 10.5,
          "precip": 72.0
        },
        {
          "month": "Dic",
          "tmax": 13.2,
          "tmin": 7.2,
          "precip": 62.0
        }
      ]
    },
    {
      "name": "Trani",
      "lat": 41.27,
      "lon": 16.42,
      "elevation": 7.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.2,
          "tmin": 6.2,
          "precip": 55.0
        },
        {
          "month": "Feb",
          "tmax": 12.8,
          "tmin": 6.0,
          "precip": 50.0
        },
        {
          "month": "Mar",
          "tmax": 15.2,
          "tmin": 7.8,
          "precip": 52.0
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 10.5,
          "precip": 48.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 14.8,
          "precip": 35.0
        },
        {
          "month": "Giu",
          "tmax": 27.5,
          "tmin": 19.2,
          "precip": 22.0
        },
        {
          "month": "Lug",
          "tmax": 30.2,
          "tmin": 21.8,
          "precip": 12.0
        },
        {
          "month": "Ago",
          "tmax": 30.5,
          "tmin": 22.2,
          "precip": 20.0
        },
        {
          "month": "Set",
          "tmax": 26.8,
          "tmin": 18.8,
          "precip": 50.0
        },
        {
          "month": "Ott",
          "tmax": 22.0,
          "tmin": 15.2,
          "precip": 65.0
        },
        {
          "month": "Nov",
          "tmax": 17.2,
          "tmin": 10.8,
          "precip": 75.0
        },
        {
          "month": "Dic",
          "tmax": 13.2,
          "tmin": 7.5,
          "precip": 65.0
        }
      ]
    }
  ],
  "sardegna": [
    {
      "name": "Cagliari",
      "lat": 39.24,
      "lon": 9.06,
      "elevation": 1.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 13.6,
          "tmin": 7.3,
          "precip": 37.0
        },
        {
          "month": "Feb",
          "tmax": 14.1,
          "tmin": 7.0,
          "precip": 39.0
        },
        {
          "month": "Mar",
          "tmax": 16.5,
          "tmin": 8.6,
          "precip": 45.0
        },
        {
          "month": "Apr",
          "tmax": 19.0,
          "tmin": 10.7,
          "precip": 48.0
        },
        {
          "month": "Mag",
          "tmax": 23.2,
          "tmin": 13.9,
          "precip": 34.0
        },
        {
          "month": "Giu",
          "tmax": 28.1,
          "tmin": 17.9,
          "precip": 10.0
        },
        {
          "month": "Lug",
          "tmax": 31.3,
          "tmin": 20.6,
          "precip": 2.0
        },
        {
          "month": "Ago",
          "tmax": 31.7,
          "tmin": 21.3,
          "precip": 7.0
        },
        {
          "month": "Set",
          "tmax": 27.2,
          "tmin": 18.7,
          "precip": 32.0
        },
        {
          "month": "Ott",
          "tmax": 23.1,
          "tmin": 15.8,
          "precip": 43.0
        },
        {
          "month": "Nov",
          "tmax": 18.0,
          "tmin": 11.9,
          "precip": 62.0
        },
        {
          "month": "Dic",
          "tmax": 14.7,
          "tmin": 8.8,
          "precip": 53.0
        }
      ]
    },
    {
      "name": "Sassari",
      "lat": 40.73,
      "lon": 8.56,
      "elevation": 225.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.5,
          "tmin": 4.8,
          "precip": 62.0
        },
        {
          "month": "Feb",
          "tmax": 12.2,
          "tmin": 4.5,
          "precip": 58.0
        },
        {
          "month": "Mar",
          "tmax": 14.5,
          "tmin": 6.2,
          "precip": 55.0
        },
        {
          "month": "Apr",
          "tmax": 17.0,
          "tmin": 8.5,
          "precip": 52.0
        },
        {
          "month": "Mag",
          "tmax": 21.5,
          "tmin": 12.0,
          "precip": 38.0
        },
        {
          "month": "Giu",
          "tmax": 26.2,
          "tmin": 15.8,
          "precip": 18.0
        },
        {
          "month": "Lug",
          "tmax": 29.5,
          "tmin": 18.5,
          "precip": 6.0
        },
        {
          "month": "Ago",
          "tmax": 30.0,
          "tmin": 19.2,
          "precip": 10.0
        },
        {
          "month": "Set",
          "tmax": 25.5,
          "tmin": 16.5,
          "precip": 32.0
        },
        {
          "month": "Ott",
          "tmax": 21.2,
          "tmin": 13.5,
          "precip": 55.0
        },
        {
          "month": "Nov",
          "tmax": 16.2,
          "tmin": 9.5,
          "precip": 72.0
        },
        {
          "month": "Dic",
          "tmax": 12.5,
          "tmin": 6.2,
          "precip": 68.0
        }
      ]
    },
    {
      "name": "Nuoro",
      "lat": 40.32,
      "lon": 9.33,
      "elevation": 549.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.8,
          "tmin": 4.2,
          "precip": 72.0
        },
        {
          "month": "Feb",
          "tmax": 10.5,
          "tmin": 4.0,
          "precip": 68.0
        },
        {
          "month": "Mar",
          "tmax": 13.2,
          "tmin": 5.8,
          "precip": 62.0
        },
        {
          "month": "Apr",
          "tmax": 16.2,
          "tmin": 8.2,
          "precip": 58.0
        },
        {
          "month": "Mag",
          "tmax": 20.8,
          "tmin": 12.2,
          "precip": 42.0
        },
        {
          "month": "Giu",
          "tmax": 25.8,
          "tmin": 16.5,
          "precip": 22.0
        },
        {
          "month": "Lug",
          "tmax": 29.2,
          "tmin": 19.5,
          "precip": 8.0
        },
        {
          "month": "Ago",
          "tmax": 29.5,
          "tmin": 19.8,
          "precip": 15.0
        },
        {
          "month": "Set",
          "tmax": 25.2,
          "tmin": 17.2,
          "precip": 38.0
        },
        {
          "month": "Ott",
          "tmax": 20.2,
          "tmin": 13.5,
          "precip": 65.0
        },
        {
          "month": "Nov",
          "tmax": 14.8,
          "tmin": 8.8,
          "precip": 85.0
        },
        {
          "month": "Dic",
          "tmax": 10.8,
          "tmin": 5.8,
          "precip": 80.0
        }
      ]
    },
    {
      "name": "Oristano",
      "lat": 39.9,
      "lon": 8.59,
      "elevation": 9.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 14.2,
          "tmin": 6.8,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 14.8,
          "tmin": 6.5,
          "precip": 58.0
        },
        {
          "month": "Mar",
          "tmax": 17.2,
          "tmin": 8.2,
          "precip": 52.0
        },
        {
          "month": "Apr",
          "tmax": 19.8,
          "tmin": 10.5,
          "precip": 48.0
        },
        {
          "month": "Mag",
          "tmax": 23.8,
          "tmin": 13.8,
          "precip": 32.0
        },
        {
          "month": "Giu",
          "tmax": 28.2,
          "tmin": 17.8,
          "precip": 12.0
        },
        {
          "month": "Lug",
          "tmax": 31.2,
          "tmin": 20.8,
          "precip": 2.0
        },
        {
          "month": "Ago",
          "tmax": 31.5,
          "tmin": 21.2,
          "precip": 8.0
        },
        {
          "month": "Set",
          "tmax": 27.8,
          "tmin": 18.5,
          "precip": 35.0
        },
        {
          "month": "Ott",
          "tmax": 23.2,
          "tmin": 15.2,
          "precip": 62.0
        },
        {
          "month": "Nov",
          "tmax": 18.5,
          "tmin": 11.2,
          "precip": 85.0
        },
        {
          "month": "Dic",
          "tmax": 15.2,
          "tmin": 8.5,
          "precip": 75.0
        }
      ]
    }
  ],
  "sicilia": [
    {
      "name": "Palermo",
      "lat": 38.12,
      "lon": 13.36,
      "elevation": 14.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 15.2,
          "tmin": 8.5,
          "precip": 68.0
        },
        {
          "month": "Feb",
          "tmax": 15.8,
          "tmin": 8.8,
          "precip": 58.0
        },
        {
          "month": "Mar",
          "tmax": 18.2,
          "tmin": 10.5,
          "precip": 45.0
        },
        {
          "month": "Apr",
          "tmax": 21.5,
          "tmin": 13.2,
          "precip": 28.0
        },
        {
          "month": "Mag",
          "tmax": 25.8,
          "tmin": 17.2,
          "precip": 18.0
        },
        {
          "month": "Giu",
          "tmax": 30.1,
          "tmin": 21.5,
          "precip": 8.0
        },
        {
          "month": "Lug",
          "tmax": 33.5,
          "tmin": 24.2,
          "precip": 2.0
        },
        {
          "month": "Ago",
          "tmax": 33.8,
          "tmin": 24.5,
          "precip": 8.0
        },
        {
          "month": "Set",
          "tmax": 29.5,
          "tmin": 21.2,
          "precip": 28.0
        },
        {
          "month": "Ott",
          "tmax": 24.5,
          "tmin": 17.2,
          "precip": 65.0
        },
        {
          "month": "Nov",
          "tmax": 19.8,
          "tmin": 12.8,
          "precip": 85.0
        },
        {
          "month": "Dic",
          "tmax": 16.2,
          "tmin": 9.8,
          "precip": 78.0
        }
      ]
    },
    {
      "name": "Catania",
      "lat": 37.49,
      "lon": 15.07,
      "elevation": 7.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 14.2,
          "tmin": 7.5,
          "precip": 75.0
        },
        {
          "month": "Feb",
          "tmax": 14.7,
          "tmin": 7.4,
          "precip": 60.0
        },
        {
          "month": "Mar",
          "tmax": 16.8,
          "tmin": 9.0,
          "precip": 58.0
        },
        {
          "month": "Apr",
          "tmax": 19.3,
          "tmin": 11.4,
          "precip": 45.0
        },
        {
          "month": "Mag",
          "tmax": 23.8,
          "tmin": 15.3,
          "precip": 28.0
        },
        {
          "month": "Giu",
          "tmax": 28.6,
          "tmin": 19.6,
          "precip": 19.0
        },
        {
          "month": "Lug",
          "tmax": 31.7,
          "tmin": 22.4,
          "precip": 8.0
        },
        {
          "month": "Ago",
          "tmax": 32.0,
          "tmin": 23.2,
          "precip": 14.0
        },
        {
          "month": "Set",
          "tmax": 27.6,
          "tmin": 20.0,
          "precip": 52.0
        },
        {
          "month": "Ott",
          "tmax": 23.4,
          "tmin": 16.7,
          "precip": 71.0
        },
        {
          "month": "Nov",
          "tmax": 19.0,
          "tmin": 12.7,
          "precip": 68.0
        },
        {
          "month": "Dic",
          "tmax": 15.4,
          "tmin": 9.2,
          "precip": 66.0
        }
      ]
    },
    {
      "name": "Messina",
      "lat": 38.19,
      "lon": 15.55,
      "elevation": 3.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 14.5,
          "tmin": 8.2,
          "precip": 95.0
        },
        {
          "month": "Feb",
          "tmax": 14.8,
          "tmin": 7.8,
          "precip": 85.0
        },
        {
          "month": "Mar",
          "tmax": 16.5,
          "tmin": 9.2,
          "precip": 78.0
        },
        {
          "month": "Apr",
          "tmax": 19.2,
          "tmin": 11.5,
          "precip": 62.0
        },
        {
          "month": "Mag",
          "tmax": 23.5,
          "tmin": 15.2,
          "precip": 38.0
        },
        {
          "month": "Giu",
          "tmax": 28.0,
          "tmin": 19.5,
          "precip": 18.0
        },
        {
          "month": "Lug",
          "tmax": 31.2,
          "tmin": 22.5,
          "precip": 12.0
        },
        {
          "month": "Ago",
          "tmax": 31.5,
          "tmin": 23.0,
          "precip": 22.0
        },
        {
          "month": "Set",
          "tmax": 27.5,
          "tmin": 20.0,
          "precip": 58.0
        },
        {
          "month": "Ott",
          "tmax": 23.5,
          "tmin": 16.5,
          "precip": 95.0
        },
        {
          "month": "Nov",
          "tmax": 19.0,
          "tmin": 12.5,
          "precip": 105.0
        },
        {
          "month": "Dic",
          "tmax": 15.5,
          "tmin": 9.5,
          "precip": 102.0
        }
      ]
    },
    {
      "name": "Siracusa",
      "lat": 37.08,
      "lon": 15.27,
      "elevation": 5.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 15.5,
          "tmin": 7.5,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 16.0,
          "tmin": 7.5,
          "precip": 55.0
        },
        {
          "month": "Mar",
          "tmax": 18.0,
          "tmin": 9.0,
          "precip": 45.0
        },
        {
          "month": "Apr",
          "tmax": 20.5,
          "tmin": 11.5,
          "precip": 35.0
        },
        {
          "month": "Mag",
          "tmax": 24.5,
          "tmin": 15.0,
          "precip": 20.0
        },
        {
          "month": "Giu",
          "tmax": 29.0,
          "tmin": 19.0,
          "precip": 10.0
        },
        {
          "month": "Lug",
          "tmax": 32.5,
          "tmin": 22.0,
          "precip": 5.0
        },
        {
          "month": "Ago",
          "tmax": 32.5,
          "tmin": 22.5,
          "precip": 15.0
        },
        {
          "month": "Set",
          "tmax": 29.0,
          "tmin": 20.0,
          "precip": 45.0
        },
        {
          "month": "Ott",
          "tmax": 24.5,
          "tmin": 16.5,
          "precip": 85.0
        },
        {
          "month": "Nov",
          "tmax": 20.5,
          "tmin": 12.5,
          "precip": 75.0
        },
        {
          "month": "Dic",
          "tmax": 16.8,
          "tmin": 9.2,
          "precip": 75.0
        }
      ]
    },
    {
      "name": "Agrigento",
      "lat": 37.31,
      "lon": 13.58,
      "elevation": 230.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 14.5,
          "tmin": 7.5,
          "precip": 62.0
        },
        {
          "month": "Feb",
          "tmax": 15.0,
          "tmin": 7.5,
          "precip": 52.0
        },
        {
          "month": "Mar",
          "tmax": 17.2,
          "tmin": 9.0,
          "precip": 42.0
        },
        {
          "month": "Apr",
          "tmax": 20.2,
          "tmin": 11.5,
          "precip": 35.0
        },
        {
          "month": "Mag",
          "tmax": 24.5,
          "tmin": 15.2,
          "precip": 18.0
        },
        {
          "month": "Giu",
          "tmax": 29.2,
          "tmin": 19.5,
          "precip": 8.0
        },
        {
          "month": "Lug",
          "tmax": 32.5,
          "tmin": 22.5,
          "precip": 2.0
        },
        {
          "month": "Ago",
          "tmax": 32.8,
          "tmin": 23.0,
          "precip": 10.0
        },
        {
          "month": "Set",
          "tmax": 28.5,
          "tmin": 20.2,
          "precip": 40.0
        },
        {
          "month": "Ott",
          "tmax": 24.0,
          "tmin": 16.8,
          "precip": 65.0
        },
        {
          "month": "Nov",
          "tmax": 19.5,
          "tmin": 12.5,
          "precip": 75.0
        },
        {
          "month": "Dic",
          "tmax": 15.8,
          "tmin": 9.2,
          "precip": 72.0
        }
      ]
    },
    {
      "name": "Caltanissetta",
      "lat": 37.49,
      "lon": 14.06,
      "elevation": 568.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.2,
          "tmin": 4.8,
          "precip": 68.0
        },
        {
          "month": "Feb",
          "tmax": 11.8,
          "tmin": 4.5,
          "precip": 58.0
        },
        {
          "month": "Mar",
          "tmax": 14.2,
          "tmin": 6.2,
          "precip": 48.0
        },
        {
          "month": "Apr",
          "tmax": 17.5,
          "tmin": 8.8,
          "precip": 42.0
        },
        {
          "month": "Mag",
          "tmax": 22.5,
          "tmin": 12.8,
          "precip": 22.0
        },
        {
          "month": "Giu",
          "tmax": 27.8,
          "tmin": 17.5,
          "precip": 12.0
        },
        {
          "month": "Lug",
          "tmax": 31.2,
          "tmin": 20.5,
          "precip": 5.0
        },
        {
          "month": "Ago",
          "tmax": 31.5,
          "tmin": 21.0,
          "precip": 15.0
        },
        {
          "month": "Set",
          "tmax": 26.8,
          "tmin": 17.8,
          "precip": 45.0
        },
        {
          "month": "Ott",
          "tmax": 21.5,
          "tmin": 13.8,
          "precip": 72.0
        },
        {
          "month": "Nov",
          "tmax": 16.5,
          "tmin": 9.8,
          "precip": 82.0
        },
        {
          "month": "Dic",
          "tmax": 12.5,
          "tmin": 6.5,
          "precip": 78.0
        }
      ]
    },
    {
      "name": "Enna",
      "lat": 37.56,
      "lon": 14.27,
      "elevation": 931.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.5,
          "tmin": 2.5,
          "precip": 85.0
        },
        {
          "month": "Feb",
          "tmax": 8.0,
          "tmin": 2.2,
          "precip": 75.0
        },
        {
          "month": "Mar",
          "tmax": 10.5,
          "tmin": 3.8,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 13.8,
          "tmin": 6.2,
          "precip": 55.0
        },
        {
          "month": "Mag",
          "tmax": 19.2,
          "tmin": 10.5,
          "precip": 35.0
        },
        {
          "month": "Giu",
          "tmax": 24.5,
          "tmin": 15.2,
          "precip": 20.0
        },
        {
          "month": "Lug",
          "tmax": 28.5,
          "tmin": 18.5,
          "precip": 8.0
        },
        {
          "month": "Ago",
          "tmax": 28.5,
          "tmin": 18.8,
          "precip": 18.0
        },
        {
          "month": "Set",
          "tmax": 23.5,
          "tmin": 15.5,
          "precip": 55.0
        },
        {
          "month": "Ott",
          "tmax": 18.2,
          "tmin": 11.8,
          "precip": 85.0
        },
        {
          "month": "Nov",
          "tmax": 13.2,
          "tmin": 7.5,
          "precip": 95.0
        },
        {
          "month": "Dic",
          "tmax": 9.0,
          "tmin": 4.2,
          "precip": 90.0
        }
      ]
    },
    {
      "name": "Ragusa",
      "lat": 36.92,
      "lon": 14.73,
      "elevation": 502.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.5,
          "tmin": 4.2,
          "precip": 80.0
        },
        {
          "month": "Feb",
          "tmax": 12.0,
          "tmin": 4.0,
          "precip": 70.0
        },
        {
          "month": "Mar",
          "tmax": 14.5,
          "tmin": 5.5,
          "precip": 60.0
        },
        {
          "month": "Apr",
          "tmax": 17.8,
          "tmin": 7.8,
          "precip": 52.0
        },
        {
          "month": "Mag",
          "tmax": 22.5,
          "tmin": 11.8,
          "precip": 28.0
        },
        {
          "month": "Giu",
          "tmax": 27.5,
          "tmin": 16.2,
          "precip": 15.0
        },
        {
          "month": "Lug",
          "tmax": 30.8,
          "tmin": 19.2,
          "precip": 5.0
        },
        {
          "month": "Ago",
          "tmax": 31.0,
          "tmin": 19.5,
          "precip": 18.0
        },
        {
          "month": "Set",
          "tmax": 26.5,
          "tmin": 16.8,
          "precip": 55.0
        },
        {
          "month": "Ott",
          "tmax": 21.5,
          "tmin": 12.8,
          "precip": 85.0
        },
        {
          "month": "Nov",
          "tmax": 16.5,
          "tmin": 8.8,
          "precip": 92.0
        },
        {
          "month": "Dic",
          "tmax": 12.8,
          "tmin": 5.8,
          "precip": 88.0
        }
      ]
    },
    {
      "name": "Trapani",
      "lat": 38.01,
      "lon": 12.53,
      "elevation": 3.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 14.8,
          "tmin": 8.5,
          "precip": 75.0
        },
        {
          "month": "Feb",
          "tmax": 15.2,
          "tmin": 8.2,
          "precip": 65.0
        },
        {
          "month": "Mar",
          "tmax": 17.0,
          "tmin": 9.5,
          "precip": 50.0
        },
        {
          "month": "Apr",
          "tmax": 19.8,
          "tmin": 11.8,
          "precip": 38.0
        },
        {
          "month": "Mag",
          "tmax": 23.8,
          "tmin": 15.2,
          "precip": 20.0
        },
        {
          "month": "Giu",
          "tmax": 28.2,
          "tmin": 19.2,
          "precip": 10.0
        },
        {
          "month": "Lug",
          "tmax": 31.2,
          "tmin": 22.2,
          "precip": 2.0
        },
        {
          "month": "Ago",
          "tmax": 31.5,
          "tmin": 22.8,
          "precip": 12.0
        },
        {
          "month": "Set",
          "tmax": 28.2,
          "tmin": 20.0,
          "precip": 45.0
        },
        {
          "month": "Ott",
          "tmax": 23.8,
          "tmin": 16.5,
          "precip": 82.0
        },
        {
          "month": "Nov",
          "tmax": 19.5,
          "tmin": 12.8,
          "precip": 95.0
        },
        {
          "month": "Dic",
          "tmax": 16.2,
          "tmin": 10.0,
          "precip": 88.0
        }
      ]
    }
  ],
  "toscana": [
    {
      "name": "Firenze",
      "lat": 43.8,
      "lon": 11.2,
      "elevation": 40.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.2,
          "tmin": 2.1,
          "precip": 64.0
        },
        {
          "month": "Feb",
          "tmax": 12.7,
          "tmin": 2.5,
          "precip": 64.0
        },
        {
          "month": "Mar",
          "tmax": 16.3,
          "tmin": 5.3,
          "precip": 62.0
        },
        {
          "month": "Apr",
          "tmax": 19.9,
          "tmin": 8.0,
          "precip": 67.0
        },
        {
          "month": "Mag",
          "tmax": 24.5,
          "tmin": 12.1,
          "precip": 66.0
        },
        {
          "month": "Giu",
          "tmax": 29.1,
          "tmin": 16.0,
          "precip": 48.0
        },
        {
          "month": "Lug",
          "tmax": 32.2,
          "tmin": 18.3,
          "precip": 26.0
        },
        {
          "month": "Ago",
          "tmax": 32.5,
          "tmin": 18.5,
          "precip": 40.0
        },
        {
          "month": "Set",
          "tmax": 27.1,
          "tmin": 14.7,
          "precip": 74.0
        },
        {
          "month": "Ott",
          "tmax": 21.6,
          "tmin": 11.0,
          "precip": 104.0
        },
        {
          "month": "Nov",
          "tmax": 15.7,
          "tmin": 6.7,
          "precip": 118.0
        },
        {
          "month": "Dic",
          "tmax": 11.4,
          "tmin": 2.8,
          "precip": 88.0
        }
      ]
    },
    {
      "name": "Livorno",
      "lat": 43.55,
      "lon": 10.31,
      "elevation": 3.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.5,
          "tmin": 5.5,
          "precip": 72.0
        },
        {
          "month": "Feb",
          "tmax": 13.2,
          "tmin": 5.5,
          "precip": 68.0
        },
        {
          "month": "Mar",
          "tmax": 16.0,
          "tmin": 7.8,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 18.8,
          "tmin": 10.2,
          "precip": 72.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 13.8,
          "precip": 55.0
        },
        {
          "month": "Giu",
          "tmax": 27.2,
          "tmin": 17.5,
          "precip": 35.0
        },
        {
          "month": "Lug",
          "tmax": 30.5,
          "tmin": 20.2,
          "precip": 18.0
        },
        {
          "month": "Ago",
          "tmax": 30.8,
          "tmin": 20.5,
          "precip": 28.0
        },
        {
          "month": "Set",
          "tmax": 26.2,
          "tmin": 17.0,
          "precip": 72.0
        },
        {
          "month": "Ott",
          "tmax": 21.5,
          "tmin": 13.8,
          "precip": 105.0
        },
        {
          "month": "Nov",
          "tmax": 16.5,
          "tmin": 9.5,
          "precip": 115.0
        },
        {
          "month": "Dic",
          "tmax": 13.0,
          "tmin": 6.2,
          "precip": 88.0
        }
      ]
    },
    {
      "name": "Pisa",
      "lat": 43.72,
      "lon": 10.4,
      "elevation": 4.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.5,
          "tmin": 2.5,
          "precip": 75.0
        },
        {
          "month": "Feb",
          "tmax": 12.5,
          "tmin": 3.0,
          "precip": 70.0
        },
        {
          "month": "Mar",
          "tmax": 15.5,
          "tmin": 5.5,
          "precip": 70.0
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 8.5,
          "precip": 80.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 12.5,
          "precip": 60.0
        },
        {
          "month": "Giu",
          "tmax": 27.5,
          "tmin": 16.5,
          "precip": 45.0
        },
        {
          "month": "Lug",
          "tmax": 30.5,
          "tmin": 19.0,
          "precip": 25.0
        },
        {
          "month": "Ago",
          "tmax": 30.5,
          "tmin": 19.0,
          "precip": 50.0
        },
        {
          "month": "Set",
          "tmax": 26.5,
          "tmin": 15.5,
          "precip": 90.0
        },
        {
          "month": "Ott",
          "tmax": 21.0,
          "tmin": 11.5,
          "precip": 120.0
        },
        {
          "month": "Nov",
          "tmax": 16.0,
          "tmin": 7.5,
          "precip": 130.0
        },
        {
          "month": "Dic",
          "tmax": 12.0,
          "tmin": 3.5,
          "precip": 90.0
        }
      ]
    },
    {
      "name": "Siena",
      "lat": 43.32,
      "lon": 11.33,
      "elevation": 322.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.0,
          "tmin": 2.0,
          "precip": 60.0
        },
        {
          "month": "Feb",
          "tmax": 10.5,
          "tmin": 2.5,
          "precip": 60.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 5.0,
          "precip": 65.0
        },
        {
          "month": "Apr",
          "tmax": 17.5,
          "tmin": 7.5,
          "precip": 75.0
        },
        {
          "month": "Mag",
          "tmax": 22.0,
          "tmin": 11.5,
          "precip": 65.0
        },
        {
          "month": "Giu",
          "tmax": 26.5,
          "tmin": 15.0,
          "precip": 50.0
        },
        {
          "month": "Lug",
          "tmax": 30.0,
          "tmin": 17.5,
          "precip": 30.0
        },
        {
          "month": "Ago",
          "tmax": 30.0,
          "tmin": 17.5,
          "precip": 45.0
        },
        {
          "month": "Set",
          "tmax": 25.5,
          "tmin": 14.0,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 19.5,
          "tmin": 10.5,
          "precip": 95.0
        },
        {
          "month": "Nov",
          "tmax": 14.0,
          "tmin": 6.5,
          "precip": 105.0
        },
        {
          "month": "Dic",
          "tmax": 10.0,
          "tmin": 3.0,
          "precip": 80.0
        }
      ]
    },
    {
      "name": "Arezzo",
      "lat": 43.46,
      "lon": 11.88,
      "elevation": 296.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 9.5,
          "tmin": 0.5,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 11.0,
          "tmin": 1.0,
          "precip": 62.0
        },
        {
          "month": "Mar",
          "tmax": 14.8,
          "tmin": 3.5,
          "precip": 60.0
        },
        {
          "month": "Apr",
          "tmax": 18.2,
          "tmin": 6.5,
          "precip": 75.0
        },
        {
          "month": "Mag",
          "tmax": 23.2,
          "tmin": 10.5,
          "precip": 68.0
        },
        {
          "month": "Giu",
          "tmax": 27.8,
          "tmin": 14.5,
          "precip": 52.0
        },
        {
          "month": "Lug",
          "tmax": 31.2,
          "tmin": 17.0,
          "precip": 32.0
        },
        {
          "month": "Ago",
          "tmax": 31.5,
          "tmin": 17.2,
          "precip": 42.0
        },
        {
          "month": "Set",
          "tmax": 26.5,
          "tmin": 13.5,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 20.2,
          "tmin": 9.8,
          "precip": 95.0
        },
        {
          "month": "Nov",
          "tmax": 14.2,
          "tmin": 5.5,
          "precip": 105.0
        },
        {
          "month": "Dic",
          "tmax": 10.2,
          "tmin": 1.5,
          "precip": 85.0
        }
      ]
    },
    {
      "name": "Grosseto",
      "lat": 42.76,
      "lon": 11.11,
      "elevation": 10.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 12.5,
          "tmin": 3.5,
          "precip": 62.0
        },
        {
          "month": "Feb",
          "tmax": 13.5,
          "tmin": 3.8,
          "precip": 58.0
        },
        {
          "month": "Mar",
          "tmax": 16.2,
          "tmin": 5.8,
          "precip": 55.0
        },
        {
          "month": "Apr",
          "tmax": 19.2,
          "tmin": 8.5,
          "precip": 52.0
        },
        {
          "month": "Mag",
          "tmax": 23.8,
          "tmin": 12.5,
          "precip": 42.0
        },
        {
          "month": "Giu",
          "tmax": 28.2,
          "tmin": 16.5,
          "precip": 25.0
        },
        {
          "month": "Lug",
          "tmax": 31.5,
          "tmin": 19.2,
          "precip": 12.0
        },
        {
          "month": "Ago",
          "tmax": 31.8,
          "tmin": 19.5,
          "precip": 25.0
        },
        {
          "month": "Set",
          "tmax": 27.8,
          "tmin": 16.2,
          "precip": 65.0
        },
        {
          "month": "Ott",
          "tmax": 22.5,
          "tmin": 12.5,
          "precip": 85.0
        },
        {
          "month": "Nov",
          "tmax": 17.2,
          "tmin": 8.2,
          "precip": 95.0
        },
        {
          "month": "Dic",
          "tmax": 13.5,
          "tmin": 4.5,
          "precip": 82.0
        }
      ]
    },
    {
      "name": "Lucca",
      "lat": 43.84,
      "lon": 10.5,
      "elevation": 19.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.2,
          "tmin": 2.5,
          "precip": 115.0
        },
        {
          "month": "Feb",
          "tmax": 12.5,
          "tmin": 2.8,
          "precip": 105.0
        },
        {
          "month": "Mar",
          "tmax": 15.5,
          "tmin": 4.8,
          "precip": 100.0
        },
        {
          "month": "Apr",
          "tmax": 18.8,
          "tmin": 7.8,
          "precip": 110.0
        },
        {
          "month": "Mag",
          "tmax": 23.2,
          "tmin": 12.2,
          "precip": 85.0
        },
        {
          "month": "Giu",
          "tmax": 27.5,
          "tmin": 16.2,
          "precip": 55.0
        },
        {
          "month": "Lug",
          "tmax": 30.5,
          "tmin": 18.8,
          "precip": 32.0
        },
        {
          "month": "Ago",
          "tmax": 30.8,
          "tmin": 19.0,
          "precip": 45.0
        },
        {
          "month": "Set",
          "tmax": 27.2,
          "tmin": 15.5,
          "precip": 95.0
        },
        {
          "month": "Ott",
          "tmax": 21.8,
          "tmin": 11.5,
          "precip": 145.0
        },
        {
          "month": "Nov",
          "tmax": 16.2,
          "tmin": 7.2,
          "precip": 165.0
        },
        {
          "month": "Dic",
          "tmax": 11.8,
          "tmin": 3.5,
          "precip": 135.0
        }
      ]
    },
    {
      "name": "Massa",
      "lat": 44.03,
      "lon": 10.14,
      "elevation": 65.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 11.5,
          "tmin": 4.8,
          "precip": 125.0
        },
        {
          "month": "Feb",
          "tmax": 12.5,
          "tmin": 5.2,
          "precip": 115.0
        },
        {
          "month": "Mar",
          "tmax": 15.2,
          "tmin": 7.5,
          "precip": 110.0
        },
        {
          "month": "Apr",
          "tmax": 18.2,
          "tmin": 10.2,
          "precip": 120.0
        },
        {
          "month": "Mag",
          "tmax": 22.5,
          "tmin": 14.2,
          "precip": 85.0
        },
        {
          "month": "Giu",
          "tmax": 26.5,
          "tmin": 18.0,
          "precip": 52.0
        },
        {
          "month": "Lug",
          "tmax": 29.5,
          "tmin": 20.8,
          "precip": 28.0
        },
        {
          "month": "Ago",
          "tmax": 29.8,
          "tmin": 21.0,
          "precip": 42.0
        },
        {
          "month": "Set",
          "tmax": 26.5,
          "tmin": 17.5,
          "precip": 115.0
        },
        {
          "month": "Ott",
          "tmax": 21.5,
          "tmin": 14.0,
          "precip": 175.0
        },
        {
          "month": "Nov",
          "tmax": 16.2,
          "tmin": 9.8,
          "precip": 205.0
        },
        {
          "month": "Dic",
          "tmax": 12.2,
          "tmin": 6.0,
          "precip": 165.0
        }
      ]
    },
    {
      "name": "Pistoia",
      "lat": 43.93,
      "lon": 10.91,
      "elevation": 67.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 10.5,
          "tmin": 1.8,
          "precip": 95.0
        },
        {
          "month": "Feb",
          "tmax": 12.0,
          "tmin": 2.2,
          "precip": 85.0
        },
        {
          "month": "Mar",
          "tmax": 15.5,
          "tmin": 4.5,
          "precip": 80.0
        },
        {
          "month": "Apr",
          "tmax": 18.8,
          "tmin": 7.5,
          "precip": 90.0
        },
        {
          "month": "Mag",
          "tmax": 23.5,
          "tmin": 11.8,
          "precip": 75.0
        },
        {
          "month": "Giu",
          "tmax": 28.2,
          "tmin": 15.8,
          "precip": 48.0
        },
        {
          "month": "Lug",
          "tmax": 31.5,
          "tmin": 18.2,
          "precip": 32.0
        },
        {
          "month": "Ago",
          "tmax": 31.8,
          "tmin": 18.5,
          "precip": 42.0
        },
        {
          "month": "Set",
          "tmax": 27.2,
          "tmin": 14.8,
          "precip": 85.0
        },
        {
          "month": "Ott",
          "tmax": 21.2,
          "tmin": 11.0,
          "precip": 115.0
        },
        {
          "month": "Nov",
          "tmax": 15.5,
          "tmin": 6.8,
          "precip": 135.0
        },
        {
          "month": "Dic",
          "tmax": 11.2,
          "tmin": 3.2,
          "precip": 115.0
        }
      ]
    },
    {
      "name": "Prato",
      "lat": 43.88,
      "lon": 11.1,
      "elevation": 61.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 10.8,
          "tmin": 2.0,
          "precip": 85.0
        },
        {
          "month": "Feb",
          "tmax": 12.2,
          "tmin": 2.5,
          "precip": 75.0
        },
        {
          "month": "Mar",
          "tmax": 15.8,
          "tmin": 5.0,
          "precip": 75.0
        },
        {
          "month": "Apr",
          "tmax": 19.2,
          "tmin": 8.0,
          "precip": 85.0
        },
        {
          "month": "Mag",
          "tmax": 23.8,
          "tmin": 12.2,
          "precip": 72.0
        },
        {
          "month": "Giu",
          "tmax": 28.5,
          "tmin": 16.2,
          "precip": 45.0
        },
        {
          "month": "Lug",
          "tmax": 31.8,
          "tmin": 18.5,
          "precip": 28.0
        },
        {
          "month": "Ago",
          "tmax": 32.1,
          "tmin": 18.8,
          "precip": 40.0
        },
        {
          "month": "Set",
          "tmax": 27.5,
          "tmin": 15.2,
          "precip": 82.0
        },
        {
          "month": "Ott",
          "tmax": 21.5,
          "tmin": 11.2,
          "precip": 105.0
        },
        {
          "month": "Nov",
          "tmax": 15.8,
          "tmin": 7.0,
          "precip": 125.0
        },
        {
          "month": "Dic",
          "tmax": 11.5,
          "tmin": 3.5,
          "precip": 105.0
        }
      ]
    }
  ],
  "trentino_alto_adige": [
    {
      "name": "Bolzano",
      "lat": 46.5,
      "lon": 11.35,
      "elevation": 262.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.7,
          "tmin": -2.6,
          "precip": 50.0
        },
        {
          "month": "Feb",
          "tmax": 8.6,
          "tmin": -0.7,
          "precip": 51.0
        },
        {
          "month": "Mar",
          "tmax": 12.8,
          "tmin": 3.6,
          "precip": 72.0
        },
        {
          "month": "Apr",
          "tmax": 16.6,
          "tmin": 6.9,
          "precip": 96.0
        },
        {
          "month": "Mag",
          "tmax": 21.1,
          "tmin": 11.4,
          "precip": 107.0
        },
        {
          "month": "Giu",
          "tmax": 24.9,
          "tmin": 15.0,
          "precip": 94.0
        },
        {
          "month": "Lug",
          "tmax": 27.0,
          "tmin": 16.8,
          "precip": 88.0
        },
        {
          "month": "Ago",
          "tmax": 26.7,
          "tmin": 16.8,
          "precip": 93.0
        },
        {
          "month": "Set",
          "tmax": 22.3,
          "tmin": 13.2,
          "precip": 95.0
        },
        {
          "month": "Ott",
          "tmax": 17.5,
          "tmin": 9.2,
          "precip": 126.0
        },
        {
          "month": "Nov",
          "tmax": 11.5,
          "tmin": 4.3,
          "precip": 126.0
        },
        {
          "month": "Dic",
          "tmax": 7.3,
          "tmin": -1.0,
          "precip": 68.0
        }
      ]
    },
    {
      "name": "Trento",
      "lat": 46.06,
      "lon": 11.12,
      "elevation": 194.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.8,
          "tmin": -1.3,
          "precip": 53.0
        },
        {
          "month": "Feb",
          "tmax": 8.6,
          "tmin": 0.4,
          "precip": 58.0
        },
        {
          "month": "Mar",
          "tmax": 12.6,
          "tmin": 4.2,
          "precip": 76.0
        },
        {
          "month": "Apr",
          "tmax": 16.3,
          "tmin": 7.9,
          "precip": 111.0
        },
        {
          "month": "Mag",
          "tmax": 20.8,
          "tmin": 12.6,
          "precip": 129.0
        },
        {
          "month": "Giu",
          "tmax": 24.5,
          "tmin": 16.2,
          "precip": 123.0
        },
        {
          "month": "Lug",
          "tmax": 26.6,
          "tmin": 18.1,
          "precip": 119.0
        },
        {
          "month": "Ago",
          "tmax": 26.6,
          "tmin": 18.3,
          "precip": 117.0
        },
        {
          "month": "Set",
          "tmax": 22.3,
          "tmin": 14.6,
          "precip": 118.0
        },
        {
          "month": "Ott",
          "tmax": 17.8,
          "tmin": 10.4,
          "precip": 138.0
        },
        {
          "month": "Nov",
          "tmax": 12.0,
          "tmin": 5.5,
          "precip": 144.0
        },
        {
          "month": "Dic",
          "tmax": 7.7,
          "tmin": 0.8,
          "precip": 76.0
        }
      ]
    }
  ],
  "umbria": [
    {
      "name": "Perugia",
      "lat": 43.11,
      "lon": 12.39,
      "elevation": 493.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.3,
          "tmin": -0.2,
          "precip": 56.0
        },
        {
          "month": "Feb",
          "tmax": 8.5,
          "tmin": -0.2,
          "precip": 67.0
        },
        {
          "month": "Mar",
          "tmax": 12.1,
          "tmin": 2.3,
          "precip": 74.0
        },
        {
          "month": "Apr",
          "tmax": 15.6,
          "tmin": 5.2,
          "precip": 80.0
        },
        {
          "month": "Mag",
          "tmax": 20.1,
          "tmin": 9.3,
          "precip": 70.0
        },
        {
          "month": "Giu",
          "tmax": 25.0,
          "tmin": 13.6,
          "precip": 50.0
        },
        {
          "month": "Lug",
          "tmax": 28.3,
          "tmin": 16.3,
          "precip": 33.0
        },
        {
          "month": "Ago",
          "tmax": 28.5,
          "tmin": 16.6,
          "precip": 36.0
        },
        {
          "month": "Set",
          "tmax": 22.7,
          "tmin": 12.6,
          "precip": 78.0
        },
        {
          "month": "Ott",
          "tmax": 17.6,
          "tmin": 9.0,
          "precip": 91.0
        },
        {
          "month": "Nov",
          "tmax": 12.1,
          "tmin": 4.8,
          "precip": 105.0
        },
        {
          "month": "Dic",
          "tmax": 8.0,
          "tmin": 0.9,
          "precip": 83.0
        }
      ]
    },
    {
      "name": "Terni",
      "lat": 42.56,
      "lon": 12.64,
      "elevation": 130.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 10.2,
          "tmin": 2.1,
          "precip": 72.0
        },
        {
          "month": "Feb",
          "tmax": 12.1,
          "tmin": 2.5,
          "precip": 65.0
        },
        {
          "month": "Mar",
          "tmax": 16.0,
          "tmin": 4.8,
          "precip": 60.0
        },
        {
          "month": "Apr",
          "tmax": 19.5,
          "tmin": 7.8,
          "precip": 75.0
        },
        {
          "month": "Mag",
          "tmax": 24.2,
          "tmin": 11.8,
          "precip": 65.0
        },
        {
          "month": "Giu",
          "tmax": 29.1,
          "tmin": 15.8,
          "precip": 48.0
        },
        {
          "month": "Lug",
          "tmax": 32.5,
          "tmin": 18.5,
          "precip": 32.0
        },
        {
          "month": "Ago",
          "tmax": 32.5,
          "tmin": 18.8,
          "precip": 42.0
        },
        {
          "month": "Set",
          "tmax": 27.2,
          "tmin": 15.2,
          "precip": 75.0
        },
        {
          "month": "Ott",
          "tmax": 21.2,
          "tmin": 11.5,
          "precip": 95.0
        },
        {
          "month": "Nov",
          "tmax": 15.1,
          "tmin": 6.8,
          "precip": 115.0
        },
        {
          "month": "Dic",
          "tmax": 10.5,
          "tmin": 3.2,
          "precip": 88.0
        }
      ]
    }
  ],
  "valle_aosta": [
    {
      "name": "Aosta",
      "lat": 45.73,
      "lon": 7.31,
      "elevation": 583.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 4.8,
          "tmin": -1.9,
          "precip": 40.0
        },
        {
          "month": "Feb",
          "tmax": 6.3,
          "tmin": -1.5,
          "precip": 45.0
        },
        {
          "month": "Mar",
          "tmax": 9.5,
          "tmin": 1.8,
          "precip": 50.0
        },
        {
          "month": "Apr",
          "tmax": 12.5,
          "tmin": 5.5,
          "precip": 55.0
        },
        {
          "month": "Mag",
          "tmax": 17.2,
          "tmin": 9.5,
          "precip": 60.0
        },
        {
          "month": "Giu",
          "tmax": 23.1,
          "tmin": 14.2,
          "precip": 65.0
        },
        {
          "month": "Lug",
          "tmax": 26.0,
          "tmin": 16.8,
          "precip": 55.0
        },
        {
          "month": "Ago",
          "tmax": 26.0,
          "tmin": 16.9,
          "precip": 55.0
        },
        {
          "month": "Set",
          "tmax": 21.6,
          "tmin": 12.9,
          "precip": 55.0
        },
        {
          "month": "Ott",
          "tmax": 16.5,
          "tmin": 8.5,
          "precip": 65.0
        },
        {
          "month": "Nov",
          "tmax": 9.5,
          "tmin": 2.6,
          "precip": 70.0
        },
        {
          "month": "Dic",
          "tmax": 5.3,
          "tmin": -1.2,
          "precip": 50.0
        }
      ]
    }
  ],
  "veneto": [
    {
      "name": "Venezia",
      "lat": 45.44,
      "lon": 12.33,
      "elevation": 2.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.8,
          "tmin": 1.2,
          "precip": 45.0
        },
        {
          "month": "Feb",
          "tmax": 8.6,
          "tmin": 1.5,
          "precip": 42.0
        },
        {
          "month": "Mar",
          "tmax": 12.5,
          "tmin": 4.8,
          "precip": 54.0
        },
        {
          "month": "Apr",
          "tmax": 16.3,
          "tmin": 8.2,
          "precip": 68.0
        },
        {
          "month": "Mag",
          "tmax": 21.2,
          "tmin": 12.8,
          "precip": 68.0
        },
        {
          "month": "Giu",
          "tmax": 25.1,
          "tmin": 16.7,
          "precip": 72.0
        },
        {
          "month": "Lug",
          "tmax": 28.2,
          "tmin": 19.1,
          "precip": 62.0
        },
        {
          "month": "Ago",
          "tmax": 28.0,
          "tmin": 18.9,
          "precip": 65.0
        },
        {
          "month": "Set",
          "tmax": 23.9,
          "tmin": 15.2,
          "precip": 70.0
        },
        {
          "month": "Ott",
          "tmax": 18.2,
          "tmin": 10.5,
          "precip": 75.0
        },
        {
          "month": "Nov",
          "tmax": 12.2,
          "tmin": 5.6,
          "precip": 82.0
        },
        {
          "month": "Dic",
          "tmax": 7.8,
          "tmin": 1.9,
          "precip": 58.0
        }
      ]
    },
    {
      "name": "Rovigo",
      "lat": 45.07,
      "lon": 11.79,
      "elevation": 5.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.2,
          "tmin": -0.5,
          "precip": 42.0
        },
        {
          "month": "Feb",
          "tmax": 9.1,
          "tmin": 0.8,
          "precip": 40.0
        },
        {
          "month": "Mar",
          "tmax": 14.2,
          "tmin": 4.2,
          "precip": 58.0
        },
        {
          "month": "Apr",
          "tmax": 18.8,
          "tmin": 8.5,
          "precip": 72.0
        },
        {
          "month": "Mag",
          "tmax": 23.5,
          "tmin": 12.8,
          "precip": 78.0
        },
        {
          "month": "Giu",
          "tmax": 27.8,
          "tmin": 16.2,
          "precip": 68.0
        },
        {
          "month": "Lug",
          "tmax": 30.5,
          "tmin": 18.5,
          "precip": 52.0
        },
        {
          "month": "Ago",
          "tmax": 29.8,
          "tmin": 18.3,
          "precip": 65.0
        },
        {
          "month": "Set",
          "tmax": 25.1,
          "tmin": 14.2,
          "precip": 62.0
        },
        {
          "month": "Ott",
          "tmax": 18.5,
          "tmin": 9.8,
          "precip": 78.0
        },
        {
          "month": "Nov",
          "tmax": 11.2,
          "tmin": 4.2,
          "precip": 75.0
        },
        {
          "month": "Dic",
          "tmax": 6.8,
          "tmin": 0.1,
          "precip": 50.0
        }
      ]
    },
    {
      "name": "Verona",
      "lat": 45.44,
      "lon": 10.99,
      "elevation": 59.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.2,
          "tmin": -0.8,
          "precip": 42.0
        },
        {
          "month": "Feb",
          "tmax": 9.1,
          "tmin": 0.5,
          "precip": 38.0
        },
        {
          "month": "Mar",
          "tmax": 14.2,
          "tmin": 4.0,
          "precip": 52.0
        },
        {
          "month": "Apr",
          "tmax": 18.8,
          "tmin": 8.2,
          "precip": 68.0
        },
        {
          "month": "Mag",
          "tmax": 23.5,
          "tmin": 12.5,
          "precip": 82.0
        },
        {
          "month": "Giu",
          "tmax": 27.8,
          "tmin": 16.0,
          "precip": 72.0
        },
        {
          "month": "Lug",
          "tmax": 30.5,
          "tmin": 18.3,
          "precip": 55.0
        },
        {
          "month": "Ago",
          "tmax": 29.8,
          "tmin": 18.0,
          "precip": 68.0
        },
        {
          "month": "Set",
          "tmax": 25.1,
          "tmin": 14.0,
          "precip": 72.0
        },
        {
          "month": "Ott",
          "tmax": 18.5,
          "tmin": 9.5,
          "precip": 88.0
        },
        {
          "month": "Nov",
          "tmax": 11.2,
          "tmin": 3.8,
          "precip": 78.0
        },
        {
          "month": "Dic",
          "tmax": 6.8,
          "tmin": -0.2,
          "precip": 48.0
        }
      ]
    },
    {
      "name": "Padova",
      "lat": 45.41,
      "lon": 11.88,
      "elevation": 12.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 6.5,
          "tmin": -0.2,
          "precip": 45.0
        },
        {
          "month": "Feb",
          "tmax": 9.2,
          "tmin": 1.0,
          "precip": 42.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 4.5,
          "precip": 58.0
        },
        {
          "month": "Apr",
          "tmax": 18.5,
          "tmin": 8.5,
          "precip": 72.0
        },
        {
          "month": "Mag",
          "tmax": 23.2,
          "tmin": 12.8,
          "precip": 85.0
        },
        {
          "month": "Giu",
          "tmax": 27.5,
          "tmin": 16.5,
          "precip": 75.0
        },
        {
          "month": "Lug",
          "tmax": 30.2,
          "tmin": 18.8,
          "precip": 58.0
        },
        {
          "month": "Ago",
          "tmax": 29.5,
          "tmin": 18.5,
          "precip": 70.0
        },
        {
          "month": "Set",
          "tmax": 24.8,
          "tmin": 14.5,
          "precip": 78.0
        },
        {
          "month": "Ott",
          "tmax": 18.2,
          "tmin": 9.8,
          "precip": 85.0
        },
        {
          "month": "Nov",
          "tmax": 11.5,
          "tmin": 4.2,
          "precip": 75.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": 0.5,
          "precip": 50.0
        }
      ]
    },
    {
      "name": "Belluno",
      "lat": 46.14,
      "lon": 12.22,
      "elevation": 390.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 4.0,
          "tmin": -4.0,
          "precip": 50.0
        },
        {
          "month": "Feb",
          "tmax": 7.0,
          "tmin": -3.0,
          "precip": 55.0
        },
        {
          "month": "Mar",
          "tmax": 12.0,
          "tmin": 1.0,
          "precip": 75.0
        },
        {
          "month": "Apr",
          "tmax": 16.0,
          "tmin": 5.0,
          "precip": 110.0
        },
        {
          "month": "Mag",
          "tmax": 21.0,
          "tmin": 10.0,
          "precip": 135.0
        },
        {
          "month": "Giu",
          "tmax": 25.0,
          "tmin": 14.0,
          "precip": 130.0
        },
        {
          "month": "Lug",
          "tmax": 27.0,
          "tmin": 16.0,
          "precip": 110.0
        },
        {
          "month": "Ago",
          "tmax": 27.0,
          "tmin": 16.0,
          "precip": 115.0
        },
        {
          "month": "Set",
          "tmax": 22.0,
          "tmin": 12.0,
          "precip": 110.0
        },
        {
          "month": "Ott",
          "tmax": 16.0,
          "tmin": 7.0,
          "precip": 130.0
        },
        {
          "month": "Nov",
          "tmax": 9.0,
          "tmin": 1.0,
          "precip": 150.0
        },
        {
          "month": "Dic",
          "tmax": 4.0,
          "tmin": -3.0,
          "precip": 75.0
        }
      ]
    },
    {
      "name": "Treviso",
      "lat": 45.66,
      "lon": 12.24,
      "elevation": 15.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.0,
          "tmin": -1.0,
          "precip": 65.0
        },
        {
          "month": "Feb",
          "tmax": 9.0,
          "tmin": 0.0,
          "precip": 60.0
        },
        {
          "month": "Mar",
          "tmax": 14.0,
          "tmin": 4.0,
          "precip": 75.0
        },
        {
          "month": "Apr",
          "tmax": 18.0,
          "tmin": 8.0,
          "precip": 90.0
        },
        {
          "month": "Mag",
          "tmax": 23.0,
          "tmin": 13.0,
          "precip": 100.0
        },
        {
          "month": "Giu",
          "tmax": 27.0,
          "tmin": 17.0,
          "precip": 95.0
        },
        {
          "month": "Lug",
          "tmax": 30.0,
          "tmin": 19.0,
          "precip": 75.0
        },
        {
          "month": "Ago",
          "tmax": 30.0,
          "tmin": 19.0,
          "precip": 85.0
        },
        {
          "month": "Set",
          "tmax": 25.0,
          "tmin": 15.0,
          "precip": 85.0
        },
        {
          "month": "Ott",
          "tmax": 19.0,
          "tmin": 10.0,
          "precip": 105.0
        },
        {
          "month": "Nov",
          "tmax": 12.0,
          "tmin": 5.0,
          "precip": 120.0
        },
        {
          "month": "Dic",
          "tmax": 8.0,
          "tmin": 0.0,
          "precip": 75.0
        }
      ]
    },
    {
      "name": "Vicenza",
      "lat": 45.55,
      "lon": 11.55,
      "elevation": 39.0,
      "months": [
        {
          "month": "Gen",
          "tmax": 7.0,
          "tmin": -1.0,
          "precip": 60.0
        },
        {
          "month": "Feb",
          "tmax": 10.0,
          "tmin": 0.0,
          "precip": 55.0
        },
        {
          "month": "Mar",
          "tmax": 15.0,
          "tmin": 4.0,
          "precip": 70.0
        },
        {
          "month": "Apr",
          "tmax": 19.0,
          "tmin": 8.0,
          "precip": 90.0
        },
        {
          "month": "Mag",
          "tmax": 24.0,
          "tmin": 13.0,
          "precip": 100.0
        },
        {
          "month": "Giu",
          "tmax": 28.0,
          "tmin": 17.0,
          "precip": 90.0
        },
        {
          "month": "Lug",
          "tmax": 31.0,
          "tmin": 19.0,
          "precip": 70.0
        },
        {
          "month": "Ago",
          "tmax": 30.0,
          "tmin": 19.0,
          "precip": 80.0
        },
        {
          "month": "Set",
          "tmax": 25.0,
          "tmin": 15.0,
          "precip": 80.0
        },
        {
          "month": "Ott",
          "tmax": 19.0,
          "tmin": 10.0,
          "precip": 100.0
        },
        {
          "month": "Nov",
          "tmax": 12.0,
          "tmin": 4.0,
          "precip": 115.0
        },
        {
          "month": "Dic",
          "tmax": 7.0,
          "tmin": 0.0,
          "precip": 70.0
        }
      ]
    }
  ]
};
