import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { toToolResult, latLon, ApiResult } from "./http.js";
import { climatologyData } from "./climatology_data.js";

// Compute distance between two lat/lon coordinates (Haversine formula)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- 1. CLIMATOLOGY TOOL ----------------------------------------------------
export function registerClimatology(server: McpServer) {
  server.registerTool(
    "meteo_climatology",
    {
      title: "Climatologia ERA5 Italia",
      description:
        "Query climatological normals (1991-2020 ERA5) for over 100 Italian cities/stations. Matches by closest lat/lon or city name. Can return single month or full year, and estimates anomalies / sigma categorization.",
      inputSchema: {
        latitude: z.coerce.number().optional().describe("Latitude of the target location"),
        longitude: z.coerce.number().optional().describe("Longitude of the target location"),
        cityName: z.string().optional().describe("Filter by city name (e.g. 'Milano', 'Roma')"),
        region: z.string().optional().describe("Filter by region name (e.g. 'lombardia')"),
        month: z.coerce.number().int().min(1).max(12).optional().describe("Month number (1=Gen, 12=Dic)"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ latitude, longitude, cityName, region, month }) => {
      const start = Date.now();
      let matchedCity: any = null;
      let minDistance = Infinity;
      let results: any[] = [];

      const keys = Object.keys(climatologyData);
      const filteredKeys = region ? keys.filter((k) => k.toLowerCase().includes(region.toLowerCase())) : keys;

      for (const regKey of filteredKeys) {
        const cities = climatologyData[regKey] ?? [];
        for (const city of cities) {
          let matchesName = true;
          if (cityName) {
            matchesName = city.name.toLowerCase().includes(cityName.toLowerCase());
          }
          if (matchesName) {
            if (latitude !== undefined && longitude !== undefined) {
              const d = getDistance(latitude, longitude, city.lat, city.lon);
              if (d < minDistance) {
                minDistance = d;
                matchedCity = { ...city, region: regKey, distanceKm: Math.round(d * 10) / 10 };
              }
            } else {
              results.push({ ...city, region: regKey });
            }
          }
        }
      }

      if (latitude !== undefined && longitude !== undefined && matchedCity) {
        results = [matchedCity];
      }

      const formattedResults = results.map((city) => {
        let monthsFiltered = city.months;
        if (month !== undefined) {
          const monthIndex = month - 1;
          monthsFiltered = city.months[monthIndex] ? [city.months[monthIndex]] : [];
        }
        return {
          name: city.name,
          region: city.region,
          latitude: city.lat,
          longitude: city.lon,
          elevation: city.elevation,
          distanceKm: city.distanceKm ?? null,
          climatology: monthsFiltered,
        };
      });

      const res: ApiResult = {
        ok: true,
        url: "mcp://climatology",
        status: 200,
        data: {
          count: formattedResults.length,
          stations: formattedResults,
          info: "ERA5 1991-2020 Normals. Use these baselines to evaluate temperature anomalies and precipitation sums.",
        },
        elapsedMs: Date.now() - start,
      };
      return toToolResult(res);
    }
  );
}

// --- 2. BIOCLIMATIC INDICES TOOL --------------------------------------------
export function registerBioclimaticIndices(server: McpServer) {
  server.registerTool(
    "meteo_bioclimatic_indices",
    {
      title: "Indici Bioclimatici e Soglie Agricole",
      description:
        "Calculate various indices (Heat Index, Wind Chill, Growing Degree Days GDD, Bilancio Idrico Nimbus) and verify agrometeorological or use case thresholds (Vite, Olivo, Api, Eolico, Solare, Beach/Ski indexes).",
      inputSchema: {
        tempC: z.coerce.number().describe("Air temperature in °C"),
        relativeHumidity: z.coerce.number().min(0).max(100).optional().describe("Relative humidity in %"),
        windSpeedKmH: z.coerce.number().min(0).optional().describe("Wind speed in km/h"),
        tempMinC: z.coerce.number().optional().describe("Minimum air temperature in °C"),
        tempMaxC: z.coerce.number().optional().describe("Maximum air temperature in °C"),
        gddBase: z.coerce.number().default(10).describe("Base temperature for GDD calculation, default 10°C"),
        precip7dMm: z.coerce.number().min(0).optional().describe("7-day accumulated precipitation in mm"),
        et07dMm: z.coerce.number().min(0).optional().describe("7-day FAO-ET0 evapotranspiration in mm"),
        soilMoisture0to1cm: z.coerce.number().min(0).max(1).optional().describe("Soil moisture (0-1cm) in m³/m³"),
        soilTemp6cm: z.coerce.number().optional().describe("Soil temperature at 6cm depth in °C"),
        useCase: z.enum(["agricoltura", "apicoltura", "vite", "olivo", "solare", "eolico", "montagna_sci", "spiaggia_mare"]).optional().describe("Target use case for threshold checks"),
        seaSurfaceTempC: z.coerce.number().optional().describe("Sea Surface Temperature in °C (for beach/marine)"),
        uvIndex: z.coerce.number().min(0).optional().describe("UV Index max value"),
        snowfallSumCm: z.coerce.number().min(0).optional().describe("Fresh snowfall sum in cm (for ski)"),
        snowDepthCm: z.coerce.number().min(0).optional().describe("Snow depth in cm (for ski)"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({
      tempC,
      relativeHumidity,
      windSpeedKmH,
      tempMinC,
      tempMaxC,
      gddBase,
      precip7dMm,
      et07dMm,
      soilMoisture0to1cm,
      soilTemp6cm,
      useCase,
      seaSurfaceTempC,
      uvIndex,
      snowfallSumCm,
      snowDepthCm,
    }) => {
      const start = Date.now();
      const indices: Record<string, any> = {};

      // 1. Heat Index (Afa)
      if (tempC >= 27 && relativeHumidity !== undefined) {
        const t = (tempC * 1.8) + 32; // Convert to Fahrenheit
        const rh = relativeHumidity;
        // Simplified formula accurate enough for typical conditions
        let hiF = 0.5 * (t + 61.0 + ((t - 68.0) * 1.2) + (rh * 0.094));
        if (hiF >= 80) {
          hiF =
            -42.379 +
            2.04901523 * t +
            10.14333127 * rh -
            0.22475541 * t * rh -
            0.00683783 * t * t -
            0.05481717 * rh * rh +
            0.00122874 * t * t * rh +
            0.00085282 * t * rh * rh -
            0.00000199 * t * t * rh * rh;
        }
        const hiC = (hiF - 32) / 1.8;
        let category = "Normale";
        if (hiC >= 27 && hiC < 32) category = "Cautela (Affaticamento)";
        else if (hiC >= 32 && hiC < 41) category = "Estrema Cautela (Crampi/Insolazione)";
        else if (hiC >= 41 && hiC < 54) category = "Pericolo (Colpo di calore)";
        else if (hiC >= 54) category = "Estremo Pericolo (Colpo di calore imminente)";

        indices.heatIndex = {
          valueC: Math.round(hiC * 10) / 10,
          valueF: Math.round(hiF * 10) / 10,
          category,
        };
      }

      // THI (Temperature-Humidity Index for livestock/biometeorology)
      if (relativeHumidity !== undefined) {
        const thi = (1.8 * tempC + 32) - ((0.55 - 0.0055 * relativeHumidity) * (1.8 * tempC - 26));
        let thiStatus = "Nessuno stress";
        if (thi >= 68 && thi < 72) thiStatus = "Stress Lieve (inizio disagio)";
        else if (thi >= 72 && thi < 79) thiStatus = "Stress Moderato";
        else if (thi >= 79 && thi < 90) thiStatus = "Stress Grave";
        else if (thi >= 90) thiStatus = "Emergenza";
        indices.thi = { value: Math.round(thi * 10) / 10, status: thiStatus };
      }

      // 2. Wind Chill
      if (tempC <= 10 && windSpeedKmH !== undefined && windSpeedKmH > 4.8) {
        const t = tempC;
        const v = windSpeedKmH;
        const wc = 13.12 + 0.6215 * t - 11.37 * Math.pow(v, 0.16) + 0.3965 * t * Math.pow(v, 0.16);
        let wcStatus = "Freddo moderato";
        if (wc < 0 && wc >= -10) wcStatus = "Freddo intenso";
        else if (wc < -10 && wc >= -25) wcStatus = "Rischio congelamento/ipotermia graduale";
        else if (wc < -25) wcStatus = "Rischio congelamento rapido (pericolo estremo)";
        indices.windChill = {
          valueC: Math.round(wc * 10) / 10,
          status: wcStatus,
        };
      }

      // 3. Growing Degree Days (GDD)
      if (tempMinC !== undefined && tempMaxC !== undefined) {
        const avgT = (tempMinC + tempMaxC) / 2;
        const gdd = Math.max(avgT - gddBase, 0);
        indices.gdd = {
          base: gddBase,
          value: Math.round(gdd * 10) / 10,
          note: `Growing Degree Days accumulati oggi con base ${gddBase}°C`,
        };
      }

      // 4. Bilancio Idrico Nimbus
      if (precip7dMm !== undefined && et07dMm !== undefined) {
        const bilancio = precip7dMm - et07dMm;
        let status = "Equilibrio";
        let impact = "Condizioni ottimali";
        if (bilancio > 20) {
          status = "Surplus Idrico";
          impact = "Terreno saturo, rischio ristagni, stop irrigazione";
        } else if (bilancio < -10 && bilancio >= -30) {
          status = "Deficit Moderato";
          impact = "Inizio stress idrico per orticole e prati";
        } else if (bilancio < -30) {
          status = "Stress Idrico Severo";
          impact = "Irrigazione di soccorso necessaria, rapido disseccamento";
        }
        indices.waterBalance = {
          valueMm: Math.round(bilancio * 10) / 10,
          status,
          impact,
          precip7dMm,
          et07dMm,
        };
      }

      // Soil Moisture evaluation
      if (soilMoisture0to1cm !== undefined) {
        let moistureStatus = "Moderata";
        if (soilMoisture0to1cm < 0.15) moistureStatus = "Molto secco (punto di appassimento)";
        else if (soilMoisture0to1cm > 0.35) moistureStatus = "Molto umido / saturo";
        indices.soilMoisture = {
          value: soilMoisture0to1cm,
          status: moistureStatus,
        };
      }

      // 5. Use Case Threshold Evaluations
      const thresholds: Record<string, any> = {};

      if (useCase === "agricoltura") {
        if (soilTemp6cm !== undefined) {
          thresholds.germination = {
            mais: soilTemp6cm >= 10 ? (soilTemp6cm >= 12 ? "Ottimale" : "Minima (germinazione lenta)") : "Arrestata (<10°C)",
            pomodoro: soilTemp6cm >= 12 ? (soilTemp6cm >= 15 ? "Ottimale" : "Minima") : "Insufficiente (<12°C)",
            barbabietola: soilTemp6cm >= 5 ? (soilTemp6cm >= 10 ? "Ottimale" : "Minima") : "Insufficiente (<5°C)",
            girasole: soilTemp6cm >= 8 ? (soilTemp6cm >= 10 ? "Ottimale" : "Minima") : "Insufficiente (<8°C)",
            value: soilTemp6cm,
          };
        }
      }

      if (useCase === "vite") {
        // Regola dei Tre Dieci
        const hasT = tempMinC !== undefined && tempMinC > 10;
        const hasRain = precip7dMm !== undefined && precip7dMm >= 10;
        const wetnessProxy = relativeHumidity !== undefined && relativeHumidity > 90;
        thresholds.peronosporaRegolaTreDieci = {
          temperaturaSoddisfatta: hasT,
          pioggiaSoddisfatta: hasRain,
          bagnaturaFogliareProxy: wetnessProxy,
          rischioInfezionePrimaverile: hasT && hasRain ? "CRITICO (avvio infezioni primarie)" : "Basso",
          nota: "La regola richiede: T > 10°C, Tralcio > 10cm (da verificare in campo), Pioggia > 10mm in 24-48 ore.",
        };
        if (tempMinC !== undefined && tempMinC < -1) {
          thresholds.gelataTardivaVite = "PERICOLO GRAVE (T < -1°C dopo germogliamento)";
        }
      }

      if (useCase === "olivo") {
        if (tempMinC !== undefined) {
          if (tempMinC < -10) {
            thresholds.freddoOlivo = "DANNI GRAVI AL LEGNO (T < -10°C)";
          } else if (tempMinC < -5) {
            thresholds.freddoOlivo = "Danni lievi a foglie/germogli (T < -5°C)";
          } else {
            thresholds.freddoOlivo = "Nessun danno da freddo";
          }
        }
        // Mosca dell'olivo
        const isFlyOptimal = tempC >= 22 && tempC <= 25;
        const isFlyLethal = tempC > 30 && relativeHumidity !== undefined && relativeHumidity < 30;
        const isFlyArrested = tempC > 35;
        thresholds.moscaOlivo = {
          stato: isFlyOptimal ? "Sviluppo ottimale (T 22-25°C)" : (isFlyLethal ? "Alta mortalità uova/larve (T > 30°C + UR < 30%)" : (isFlyArrested ? "Attività arrestata (T > 35°C)" : "Moderata")),
        };
      }

      if (useCase === "apicoltura") {
        let volo = "Assente (api nel glomere)";
        if (tempC >= 16 && tempC <= 25 && (windSpeedKmH === undefined || windSpeedKmH < 25)) {
          volo = "Attività ottimale di bottinatura";
        } else if (tempC >= 10 && tempC < 16) {
          volo = "Attività limitata";
        } else if (tempC > 35) {
          volo = "Attività ridotta (ventilazione alveare)";
        }
        if (windSpeedKmH !== undefined && windSpeedKmH >= 25) {
          volo += " ⚠️ Limitata da forte vento (>25 km/h)";
        }
        thresholds.voloApi = { stato: volo };

        thresholds.secrezioneNettarifera = {
          acacia: tempMinC !== undefined && tempMinC > 12 && relativeHumidity !== undefined && relativeHumidity > 60 ? "Ottimale (notti miti >12°C + UR >60%)" : "Subottimale o bloccata",
          castagno: relativeHumidity !== undefined && relativeHumidity > 70 ? "Favorita da clima umido" : "Ridotta da vento o siccità",
        };
      }

      if (useCase === "solare") {
        thresholds.solareNote = "DNI > 600 W/m² = ottimale, < 200 W/m² = basso. Rapporto direct/diffuse indica efficienza.";
      }

      if (useCase === "eolico") {
        let eolicoVolo = "Fuori range operativo (nessuna produzione)";
        if (windSpeedKmH !== undefined) {
          const vMs = windSpeedKmH / 3.6;
          if (vMs >= 5 && vMs <= 25) eolicoVolo = "Operatività standard (buona produzione)";
          else if (vMs > 25) eolicoVolo = "CUT-OUT Preventivo (stop per sicurezza, vento >25 m/s / 90 km/h)";
          else if (vMs < 3) eolicoVolo = "CUT-IN Insufficiente (<3 m/s, nessuna produzione)";
          thresholds.eolicoStato = {
            windSpeedMs: Math.round(vMs * 10) / 10,
            stato: eolicoVolo,
          };
        }
      }

      if (useCase === "spiaggia_mare") {
        let beachScore = 100;
        const debugFlags: string[] = [];
        if (seaSurfaceTempC !== undefined) {
          if (seaSurfaceTempC < 18) { beachScore -= 25; debugFlags.push("mare_freddo"); }
          else if (seaSurfaceTempC >= 18 && seaSurfaceTempC < 22) beachScore -= 10;
        }
        if (uvIndex !== undefined) {
          if (uvIndex < 3) beachScore -= 15;
        }
        if (windSpeedKmH !== undefined && windSpeedKmH > 30) {
          beachScore -= 30;
          debugFlags.push("vento_sabbia");
        } else if (windSpeedKmH !== undefined && windSpeedKmH > 15) {
          beachScore -= 10;
        }

        indices.beachIndex = {
          score: Math.max(0, beachScore),
          sstComfort: seaSurfaceTempC ? (seaSurfaceTempC >= 22 ? "Confortevole" : (seaSurfaceTempC >= 18 ? "Fresco" : "Freddo")) : "N/D",
          flags: debugFlags,
        };
      }

      if (useCase === "montagna_sci") {
        let skiScore = 100;
        const debugFlags: string[] = [];
        if (snowfallSumCm !== undefined && snowfallSumCm < 5) { skiScore -= 20; debugFlags.push("scarsa_neve_fresca"); }
        if (tempC > 2) { skiScore -= 30; debugFlags.push("neve_pesante_marcia"); }
        else if (tempC < -10) { skiScore -= 10; debugFlags.push("molto_freddo"); }

        if (windSpeedKmH !== undefined && windSpeedKmH > 60) {
          skiScore -= 50;
          debugFlags.push("rischio_chiusura_impianti_vento");
        }

        indices.skiIndex = {
          score: Math.max(0, skiScore),
          quality: tempC <= 0 ? "Farinosa (ottima)" : "Pesante / Marcia",
          flags: debugFlags,
        };
      }

      const res: ApiResult = {
        ok: true,
        url: "mcp://bioclimatic_indices",
        status: 200,
        data: {
          indices,
          thresholds,
        },
        elapsedMs: Date.now() - start,
      };
      return toToolResult(res);
    }
  );
}

// --- 3. LOCAL PHENOMENA TOOL ------------------------------------------------
export function registerLocalPhenomena(server: McpServer) {
  server.registerTool(
    "meteo_local_phenomena",
    {
      title: "Riconoscimento Fenomeni Locali Italiani",
      description:
        "Run algorithmic checks on hourly weather forecast parameters to automatically identify typical Italian phenomena (Bora, Foehn, Scirocco, Nebbia Padana, Gelicidio, etc.).",
      inputSchema: {
        latitude: z.coerce.number().describe("Latitude of target"),
        longitude: z.coerce.number().describe("Longitude of target"),
        temp2m: z.coerce.number().describe("Temperature at 2m (°C)"),
        relHum2m: z.coerce.number().min(0).max(100).describe("Relative Humidity at 2m (%)"),
        windSpeed10m: z.coerce.number().min(0).describe("Wind speed at 10m (km/h)"),
        windDir10m: z.coerce.number().min(0).max(360).describe("Wind direction at 10m (degrees)"),
        windGusts10m: z.coerce.number().min(0).optional().describe("Wind gusts at 10m (km/h)"),
        pressureMsl: z.coerce.number().optional().describe("MSL Pressure (hPa)"),
        weatherCode: z.coerce.number().optional().describe("WMO weather code"),
        soilTemp0cm: z.coerce.number().optional().describe("Soil temperature at surface (°C)"),
        temp850hPa: z.coerce.number().optional().describe("Temperature at 850 hPa level (°C)"),
        temp925hPa: z.coerce.number().optional().describe("Temperature at 925 hPa level (°C)"),
        geopotential850hPa: z.coerce.number().optional().describe("Geopotential height at 850 hPa (m)"),
        seaSurfaceTemp: z.coerce.number().optional().describe("Sea Surface Temperature (°C)"),
        cloudCoverLow: z.coerce.number().min(0).max(100).optional().describe("Low cloud cover (%)"),
        cloudCover: z.coerce.number().min(0).max(100).optional().describe("Total cloud cover (%)"),
        cape: z.coerce.number().min(0).optional().describe("CAPE (J/kg)"),
        liftedIndex: z.coerce.number().optional().describe("Lifted Index"),
        windSpeed500hPa: z.coerce.number().min(0).optional().describe("Wind speed at 500 hPa (km/h)"),
        precip7dMm: z.coerce.number().min(0).optional().describe("7-day accumulated precipitation (mm)"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({
      latitude,
      longitude,
      temp2m,
      relHum2m,
      windSpeed10m,
      windDir10m,
      windGusts10m,
      pressureMsl,
      weatherCode,
      soilTemp0cm,
      temp850hPa,
      temp925hPa,
      geopotential850hPa,
      seaSurfaceTemp,
      cloudCoverLow,
      cloudCover,
      cape,
      liftedIndex,
      windSpeed500hPa,
      precip7dMm,
    }) => {
      const start = Date.now();
      const flags: string[] = [];
      const descriptions: Record<string, string> = {};

      // 1. FOEHN (Favonio)
      const isFoehnWind = windSpeed10m > 25 && (windDir10m >= 340 || windDir10m <= 45); // N/NNE
      const isFoehnHumidity = relHum2m < 30;
      const isFoehnTarget = latitude >= 44.5 && latitude <= 46.8 && longitude >= 6.5 && longitude <= 12.5; // Alpine / Padana slopes
      if (isFoehnWind && isFoehnHumidity && isFoehnTarget) {
        flags.push("FOEHN");
        descriptions.FOEHN = `Favonio attivo sulle vallate alpine e pianura nord-occidentale. T aumentata adabaticamente, UR bassissima (${relHum2m}%).`;
      }

      // 2. BORA
      const isBoraWind = windSpeed10m > 30 && (windDir10m >= 50 && windDir10m <= 85); // ENE
      const isTriesteZone = latitude >= 45.3 && latitude <= 46.0 && longitude >= 12.0 && longitude <= 14.0;
      if (isBoraWind && isTriesteZone) {
        flags.push("BORA");
        let type = "Bora Chiara (bel tempo)";
        if (weatherCode !== undefined && weatherCode >= 50) type = "Bora Scura (maltempo e precipitazioni)";
        descriptions.BORA = `Bora attiva nel golfo di Trieste e alto Adriatico. Tipologia: ${type}. Raffiche previste fino a ${windGusts10m ?? Math.round(windSpeed10m * 1.5)} km/h.`;
      }

      // 3. SCIROCCO
      const isSciroccoWind = windSpeed10m > 18 && (windDir10m >= 130 && windDir10m <= 190); // SE/S
      if (isSciroccoWind) {
        flags.push("SCIROCCO");
        const type = relHum2m < 35 ? "Scirocco Secco Estivo (elevato pericolo incendi)" : "Scirocco Umido (trasporto sabbia sahariana)";
        descriptions.SCIROCCO = `${type} attivo con vento da ${windDir10m}° a ${windSpeed10m} km/h. Tendenza a temperature superiori alla norma stagionale.`;
      }

      // 4. MAESTRALE
      const isMistralWind = windSpeed10m > 25 && (windDir10m >= 280 && windDir10m <= 330); // NW
      const isSardinia = latitude >= 38.8 && latitude <= 41.3 && longitude >= 8.0 && longitude <= 10.0;
      if (isMistralWind && isSardinia) {
        flags.push("MAESTRALE");
        descriptions.MAESTRALE = `Forte Maestrale attivo sulla Sardegna e Mar Tirreno. Onde elevate su coste occidentali.`;
      }

      // 5. NEBBIA PADANA
      const isPadana = latitude >= 44.2 && latitude <= 46.0 && longitude >= 7.0 && longitude <= 13.0; // Po Valley
      const isFogConditions = relHum2m >= 92 && windSpeed10m < 6;
      const isThermalInversion = temp925hPa !== undefined && temp2m < temp925hPa;
      if (isPadana && isFogConditions) {
        flags.push("NEBBIA_PADANA");
        let prob = "Moderata";
        if (relHum2m >= 95 && windSpeed10m < 4 && isThermalInversion) prob = "Elevata (Visibilità < 100m)";
        descriptions.NEBBIA_PADANA = `Rischio Nebbia da irraggiamento in Pianura Padana con probabilità ${prob}. Inversione termica rilevata.`;
      }

      // 6. GELICIDIO (Freezing Rain)
      const hasGelicidioCode = weatherCode === 66 || weatherCode === 67;
      const isFreezingUnder = temp2m < 0 && (soilTemp0cm !== undefined && soilTemp0cm < 0);
      const isWarmerAbove = temp850hPa !== undefined && temp850hPa > 0;
      if (hasGelicidioCode || (isFreezingUnder && isWarmerAbove)) {
        flags.push("GELICIDIO");
        descriptions.GELICIDIO = `PERICOLO GELICIDIO (Vetrone / Black Ice). Pioggia superraffreddata che gela al suolo (T suolo ${soilTemp0cm ?? temp2m}°C). Evitare spostamenti!`;
      }

      // 7. CALIGO / LUPA DI MARE
      const isCaligoSeason = seaSurfaceTemp !== undefined && seaSurfaceTemp < temp2m && relHum2m >= 90 && windSpeed10m < 12;
      if (isCaligoSeason) {
        const caligoName = latitude >= 43.5 && latitude <= 44.6 && longitude >= 7.3 && longitude <= 10.1 ? "Caligo (Liguria)" : "Lupa di Mare (Sicilia/Ionio)";
        flags.push("NEBBIA_MARITTIMA");
        descriptions.NEBBIA_MARITTIMA = `Condizioni favorevoli per ${caligoName} costiera. Aria calda su superficie marina fredda (${seaSurfaceTemp}°C).`;
      }

      // 8. TRAMONTANA
      const isTramontana = windSpeed10m > 22 && (windDir10m >= 340 || windDir10m <= 20) && relHum2m < 50;
      if (isTramontana && !flags.includes("FOEHN")) {
        flags.push("TRAMONTANA");
        descriptions.TRAMONTANA = `Tramontana fredda e secca da Nord, cielo limpido, ottima visibilità, mare agitato al largo.`;
      }

      // 9. GARBINO
      const isGarbino = windSpeed10m > 20 && (windDir10m >= 210 && windDir10m <= 250) && relHum2m < 35 && (longitude > 12.0 && latitude >= 41.5 && latitude <= 44.5); // East Coast Apennines
      if (isGarbino) {
        flags.push("GARBINO");
        descriptions.GARBINO = `Garbino attivo (Favonio Appenninico) sul versante adriatico. T in brusco aumento e UR bassissima (${relHum2m}%).`;
      }

      // 10. MACCAJA
      const isMaccaja = latitude >= 43.8 && latitude <= 44.6 && longitude >= 7.3 && longitude <= 10.1 && relHum2m > 85 && (cloudCoverLow !== undefined && cloudCoverLow > 75) && (windDir10m >= 130 && windDir10m <= 230);
      if (isMaccaja) {
        flags.push("MACCAJA");
        descriptions.MACCAJA = `Maccaja ligure attiva con nubi basse e compatte ed elevata umidità bloccata dall'Appennino.`;
      }

      // 11. ADRIATIC SEA EFFECT (ASE)
      const isAse = temp850hPa !== undefined && seaSurfaceTemp !== undefined && (seaSurfaceTemp - temp850hPa) > 13 && (windDir10m >= 30 && windDir10m <= 90) && (longitude >= 12.0 && longitude <= 18.0 && latitude >= 39.5 && latitude <= 44.0);
      if (isAse) {
        flags.push("ADRIATIC_SEA_EFFECT");
        descriptions.ADRIATIC_SEA_EFFECT = `Adriatic Sea Effect (ASE) attivo: aria gelida siberiana su mare Adriatico caldo. Rischio bande nevose intense su Marche, Abruzzo, Molise e Puglia.`;
      }

      // 12. ACQUA ALTA
      const isAcquaAltaTigger = pressureMsl !== undefined && pressureMsl < 1005 && (windDir10m >= 110 && windDir10m <= 150) && windSpeed10m > 30 && latitude >= 45.0 && latitude <= 45.8 && longitude >= 12.0 && longitude <= 13.5;
      if (isAcquaAltaTigger) {
        flags.push("ACQUA_ALTA");
        descriptions.ACQUA_ALTA = `Rischio ACQUA ALTA a Venezia. Bassa pressione (${pressureMsl} hPa) combinata con forte Scirocco persistente sull'asse adriatico.`;
      }

      // 13. MCS PADANO & TEMPORALE AUTORIGENERANTE (V-SHAPED)
      if (cape !== undefined && cape > 1000) {
        let isVShaped = false;
        if (windSpeed500hPa !== undefined && windSpeed500hPa > 70 && relHum2m > 75) {
          isVShaped = true;
          flags.push("V_SHAPED_STORM");
          descriptions.V_SHAPED_STORM = `Rischio TEMPORALE AUTORIGENERANTE (V-Shaped) stazionario e distruttivo. Elevato pericolo alluvioni lampo localizzate.`;
        }
        if (!isVShaped && isPadana) {
          flags.push("MCS_PADANO");
          descriptions.MCS_PADANO = `Rischio MCS (Mesoscale Convective System) Padano con forte instabilità (CAPE ${cape} J/kg). Possibili colpi di vento e grandine.`;
        }
      }

      // 14. GALAVERNA vs BRINA
      if (temp2m < 0 && soilTemp0cm !== undefined && soilTemp0cm < 0) {
        if (relHum2m > 95 && (weatherCode === 45 || weatherCode === 48)) {
          flags.push("GALAVERNA");
          descriptions.GALAVERNA = `Galaverna attiva: aghi di ghiaccio per nebbia sopraffusa a ${temp2m}°C.`;
        } else if (cloudCover !== undefined && cloudCover < 20 && windSpeed10m < 4) {
          flags.push("BRINA");
          descriptions.BRINA = `Brina diffusa al suolo dovuta a forte irraggiamento notturno in cielo sereno.`;
        }
      }

      const res: ApiResult = {
        ok: true,
        url: "mcp://local_phenomena",
        status: 200,
        data: {
          detectedPhenomena: flags,
          alerts: descriptions,
        },
        elapsedMs: Date.now() - start,
      };
      return toToolResult(res);
    }
  );
}

// --- 4. MODEL TUNING & BIASES TOOL ------------------------------------------
export function registerModelTuning(server: McpServer) {
  server.registerTool(
    "meteo_model_tuning",
    {
      title: "Model Biases, Weights & UHI Correction",
      description:
        "Retrieve model weights for consensus based on macroarea, fetch systematic model biases, and apply UHI (Urban Heat Island) corrections for major Italian cities.",
      inputSchema: {
        macroarea: z.enum([
          "nord_ovest",
          "nord_est",
          "centro_nord",
          "centro",
          "sud",
          "sicilia",
          "sardegna",
          "costa_adriatica",
          "alpi",
          "appennino",
        ]).describe("Italian geographical macroarea"),
        cityName: z.string().optional().describe("Filter/Apply UHI correction for a city (Milano, Roma, Torino, Napoli, Bologna, Firenze, Bari, Palermo)"),
        cloudCover: z.coerce.number().min(0).max(100).optional().describe("Cloud cover (%) to evaluate UHI conditions"),
        windSpeedKmH: z.coerce.number().min(0).optional().describe("Wind speed (km/h) to evaluate UHI conditions"),
        modelId: z.string().optional().describe("Filter biases for a specific model (e.g. ecmwf_ifs, icon_d2, arpae_icon_2i, gfs)"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ macroarea, cityName, cloudCover, windSpeedKmH, modelId }) => {
      const start = Date.now();

      // 1. Model weights per zone
      const weights: Record<string, Record<string, number>> = {
        nord_ovest: { icon_d2: 1.4, ecmwf_ifs: 1.3, meteoswiss_icon_seamless: 1.3, italia_meteo_arpae_icon_2i: 1.2, icon_seamless: 1.0, arome_france: 0.9, gfs_seamless: 0.7 },
        nord_est: { italia_meteo_arpae_icon_2i: 1.5, icon_d2: 1.4, ecmwf_ifs: 1.2, meteoswiss_icon_seamless: 1.2, geosphere_seamless: 1.1, icon_seamless: 1.0, gfs_seamless: 0.7 },
        centro_nord: { italia_meteo_arpae_icon_2i: 1.5, ecmwf_ifs: 1.3, icon_eu: 1.1, icon_seamless: 1.0, meteofrance_seamless: 0.9, gfs_seamless: 0.7 },
        centro: { ecmwf_ifs: 1.5, meteofrance_seamless: 1.2, icon_seamless: 1.1, arpege_europe: 1.0, icon_eu: 1.0, gfs_seamless: 0.8 },
        sud: { ecmwf_ifs: 1.5, ecmwf_aifs025: 1.2, arpege_europe: 1.2, gfs_seamless: 1.0, icon_seamless: 0.9, meteofrance_seamless: 0.9 },
        sicilia: { ecmwf_ifs: 1.6, ecmwf_aifs025: 1.3, arpege_europe: 1.2, gfs_seamless: 1.0, meteofrance_seamless: 0.8 },
        sardegna: { ecmwf_ifs: 1.5, ecmwf_aifs025: 1.3, meteofrance_seamless: 1.2, arpege_europe: 1.0, gfs_seamless: 0.9 },
        costa_adriatica: { italia_meteo_arpae_icon_2i: 1.4, icon_d2: 1.3, ecmwf_ifs: 1.2, knmi_seamless: 1.1, icon_seamless: 1.0, gfs_seamless: 0.8 },
        alpi: { icon_d2: 1.5, meteoswiss_icon_seamless: 1.4, ecmwf_ifs: 1.2, geosphere_seamless: 1.2, italia_meteo_arpae_icon_2i: 1.1, icon_seamless: 0.9 },
        appennino: { ecmwf_ifs: 1.4, icon_eu: 1.2, italia_meteo_arpae_icon_2i: 1.0, icon_seamless: 1.0, meteofrance_seamless: 0.9, gfs_seamless: 0.8 },
      };

      const matchedWeights = weights[macroarea] ?? {};

      // 2. Systematic model biases
      const biases: Array<{ model: string; zone: string; bias: string; entity: string; note: string }> = [
        { model: "italia_meteo_arpae_icon_2i", zone: "Versante adriatico", bias: "Anticipa precipitazioni", entity: "1-3h", note: "Inizia a piovere prima di quanto previsto" },
        { model: "italia_meteo_arpae_icon_2i", zone: "Prealpi venete, Appennino emiliano", bias: "Sovrastima pioggia orografica", entity: "+20-40%", note: "Su flussi da S/SW contro rilievi" },
        { model: "italia_meteo_arpae_icon_2i", zone: "Trieste", bias: "Sottostima Bora", entity: "-10-20 km/h raffica", note: "Tende a smorzare i picchi di raffica" },
        { model: "italia_meteo_arpae_icon_2i", zone: "Pianura Padana", bias: "Eccellente precisione nebbia padana", entity: "Migliore in assoluto", note: "Cattura perfettamente l'inversione termica" },
        { model: "ecmwf_ifs", zone: "Tutto il territorio", bias: "Tende a smussare precipitazioni intense", entity: "-10-20% sui picchi", note: "Eccelle nelle tendenze ma sottostima i picchi convettivi estremi" },
        { model: "ecmwf_ifs", zone: "Centro-Sud", bias: "Anticipa ondate di calore", entity: "12-24h", note: "Individua le ondate prima degli altri modelli" },
        { model: "icon_d2", zone: "Coste e valli alpine", bias: "Sovrastima raffiche di vento", entity: "+5-15 km/h", note: "Troppo generoso nelle raffiche in terreno complesso" },
        { model: "icon_d2", zone: "Pianura Padana, Prealpi", bias: "Eccellente temporali convettivi", entity: "Altissima precisione", note: "Migliore risoluzione per celle temporalesche" },
        { model: "gfs_seamless", zone: "Sud Italia, Sicilia", bias: "Sovrastima scirocco", entity: "+10-20 km/h", note: "Tende a esagerare l'intensità dello scirocco" },
        { model: "gfs_seamless", zone: "Liguria, Calabria tirrenica", bias: "Sottostima precipitazioni orografiche", entity: "-20-30%", note: "Risoluzione insufficiente per coste ripide" },
        { model: "gfs_seamless", zone: "Centro-Sud", bias: "Caldo eccessivo in estate", entity: "+1-2°C T max", note: "Bias caldo sistematico in estate al Sud" },
      ];

      const filteredBiases = modelId
        ? biases.filter((b) => b.model.toLowerCase().includes(modelId.toLowerCase()))
        : biases;

      // 3. UHI Correction Matrix
      const uhiMatrix: Record<string, { deltaTMax: number; deltaTMin: number; note: string }> = {
        milano: { deltaTMax: 0.5, deltaTMin: 2.5, note: "Massimo effetto in estate con calma di vento" },
        roma: { deltaTMax: 1.0, deltaTMin: 2.0, note: "Effetto mitigato dal Ponentino in periferia" },
        torino: { deltaTMax: 0.5, deltaTMin: 2.0, note: "Ristagno termico in inverno e estate" },
        napoli: { deltaTMax: 0.5, deltaTMin: 1.5, note: "Effetto mitigato dalla brezza di mare" },
        bologna: { deltaTMax: 1.0, deltaTMin: 2.0, note: "Particolarmente intenso in estate" },
        firenze: { deltaTMax: 1.0, deltaTMin: 2.5, note: "Effetto conca amplifica l'accumulo" },
        bari: { deltaTMax: 1.0, deltaTMin: 4.0, note: "UHI intensa in estate, mitigata in costa" },
        palermo: { deltaTMax: 1.0, deltaTMin: 2.5, note: "Effetto amplificato da orografia (conca)" },
      };

      let uhiApplied = null;
      if (cityName) {
        const uhiKey = cityName.toLowerCase().trim();
        const uhi = uhiMatrix[uhiKey];
        if (uhi) {
          const isUhiMax =
            (cloudCover === undefined || cloudCover < 20) &&
            (windSpeedKmH === undefined || windSpeedKmH < 5);
          uhiApplied = {
            cityName,
            deltaTMax: uhi.deltaTMax,
            deltaTMin: uhi.deltaTMin,
            conditionsMet: isUhiMax,
            appliedDeltaMin: isUhiMax ? uhi.deltaTMin : 0,
            note: uhi.note + (isUhiMax ? " (CONDIZIONI CORREZIONE UHI SODDISFATTE: cielo sereno e vento debole)" : " (Condizioni non ottimali per massimo UHI)"),
          };
        }
      }

      const res: ApiResult = {
        ok: true,
        url: "mcp://model_tuning",
        status: 200,
        data: {
          macroarea,
          weights: matchedWeights,
          biases: filteredBiases,
          uhiCorrection: uhiApplied,
          dynamicWeightingScenarios: {
            convective: "Se CAPE > 500 o weather_code 80-99, aumenta peso (+0.3) di icon_d2, arome_france, arpae_icon_2i; riduci gfs, ecmwf.",
            frontal: "Se pioggia diffusa, aumenta peso (+0.3) di ecmwf_ifs, arpege.",
            fog: "Se nebbia padana, aumenta peso (+0.4) di arpae_icon_2i; riduci gfs (-0.3).",
            orographic_wind: "Se Bora/Foehn, aumenta peso (+0.3) di icon_d2, meteoswiss; riduci ecmwf (-0.2).",
            snow: "Se nevicate, aumenta peso (+0.4) di icon_d2, meteoswiss, geosphere; riduci gfs (-0.2).",
          },
        },
        elapsedMs: Date.now() - start,
      };
      return toToolResult(res);
    }
  );
}

// --- 5. EVENT RELIABILITY TOOL ----------------------------------------------
export function registerEventReliability(server: McpServer) {
  server.registerTool(
    "meteo_event_reliability",
    {
      title: "Forecast Reliability Matrix",
      description:
        "Retrieve the forecast accuracy reliability percentages for various weather event types (convection, frontal rain, snow, fog, wind, heatwaves) across different lead times.",
      inputSchema: {},
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async () => {
      const start = Date.now();
      const matrix = {
        frontal_rain_snow: { "0-24h": "Alta (90%)", "1-3d": "Buona (80%)", "4-7d": "Media (60%)", ">7d": "Bassa (40%)" },
        convective_storms: { "0-24h": "Media (65% - nowcasting required)", "1-3d": "Bassa (40%)", "4-7d": "Molto bassa (20%)", ">7d": "Nulla (0%)" },
        heatwave_cold_spell: { "0-24h": "Alta (95%)", "1-3d": "Alta (90%)", "4-7d": "Media (70%)", ">7d": "Bassa (50%)" },
        orographic_winds: { "0-24h": "Alta (85%)", "1-3d": "Buona (75%)", "4-7d": "Media (50%)", ">7d": "Bassa (30%)" },
        fog: { "0-24h": "Media (70%)", "1-3d": "Bassa (45%)", "4-7d": "Molto bassa (25%)", ">7d": "Nulla (0%)" },
        foehn_winds: { "0-24h": "Alta (90%)", "1-3d": "Buona (80%)", "4-7d": "Bassa (40%)", ">7d": "Nulla (0%)" },
      };
      const res: ApiResult = {
        ok: true,
        url: "mcp://event_reliability",
        status: 200,
        data: {
          reliabilityMatrix: matrix,
          guideline: "Use this matrix to assign confidence levels to forecast discussions. Severe convective storms require nowcasting (Step I/L) due to low predictability beyond 24h.",
        },
        elapsedMs: Date.now() - start,
      };
      return toToolResult(res);
    }
  );
}
