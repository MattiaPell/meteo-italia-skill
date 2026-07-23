import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { toToolResult, latLon, ApiResult, apiGet } from "./http.js";
import { getDistance } from "./geo.js";
import { climatologyData } from "./climatology_data.js";

/** Unify dash/underscore model ids so `icon-eu` and `icon_eu` match. */
export function normalizeModelId(id: string): string {
  return id.trim().toLowerCase().replace(/-/g, "_");
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
        latitude: z.coerce.number().min(-90).max(90).optional().describe("Latitude of the target location"),
        longitude: z.coerce.number().min(-180).max(180).optional().describe("Longitude of the target location"),
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
        "Calculate various indices (Heat Index, Wind Chill, Growing Degree Days GDD, Bilancio Idrico Nimbus) and verify agrometeorological or use case thresholds (Vite, Olivo, Api, Eolico, Solare, Beach/Ski indexes, Snow-Line Quota Neve, and Nimbus Fire Risk).",
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
        useCase: z.enum(["agricoltura", "apicoltura", "vite", "olivo", "solare", "eolico", "montagna_sci", "spiaggia_mare", "energia_fv", "energia_eolico"]).optional().describe("Target use case for threshold checks"),
        seaSurfaceTempC: z.coerce.number().optional().describe("Sea Surface Temperature in °C (for beach/marine)"),
        uvIndex: z.coerce.number().min(0).optional().describe("UV Index max value"),
        snowfallSumCm: z.coerce.number().min(0).optional().describe("Fresh snowfall sum in cm (for ski)"),
        snowDepthCm: z.coerce.number().min(0).optional().describe("Snow depth in cm (for ski)"),
        freezingLevelHeightM: z.coerce.number().optional().describe("Freezing level (Zero Termico) height in meters"),
        precipIntensityMmH: z.coerce.number().optional().describe("Precipitation intensity in mm/h or cm/h"),
        isNarrowValley: z.boolean().optional().describe("Whether the location is in a narrow alpine/apennine valley"),
        cloudCover: z.coerce.number().min(0).max(100).optional().describe("Cloud cover in % (for energy use cases)"),
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
      freezingLevelHeightM,
      precipIntensityMmH,
      isNarrowValley,
      cloudCover,
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

      if (useCase === "energia_fv") {
        let fvScore = 100;
        const debugFlags: string[] = [];
        if (cloudCover !== undefined) {
          if (cloudCover > 80) { fvScore -= 60; debugFlags.push("cielo_coperto"); }
          else if (cloudCover > 50) { fvScore -= 30; debugFlags.push("parzialmente_nuvoloso"); }
          else if (cloudCover > 20) { fvScore -= 10; debugFlags.push("poche_nuvole"); }
        }
        if (uvIndex !== undefined) {
          if (uvIndex < 2) { fvScore -= 20; debugFlags.push("uv_basso"); }
          else if (uvIndex > 8) { fvScore += 5; }
        }
        if (tempC > 35) { fvScore -= 10; debugFlags.push("caldo_estremo_efficienza_ridotta"); }
        indices.energiaFv = {
          score: Math.max(0, Math.min(100, fvScore)),
          stima: fvScore >= 70 ? "Produzione eccellente" : fvScore >= 40 ? "Produzione moderata" : "Produzione ridotta",
          flags: debugFlags,
          nota: "Stima qualitativa basata su copertura e UV. Per stima kWh/kWp servono dati GHI/DNI orari.",
        };
      }

      if (useCase === "energia_eolico") {
        if (windSpeedKmH !== undefined) {
          const vMs = windSpeedKmH / 3.6;
          const cutIn = 3, rated = 12, cutOut = 25;
          let powerPct = 0;
          let stato = "Nessuna produzione";
          if (vMs >= cutOut) {
            powerPct = 0;
            stato = "CUT-OUT (vento troppo forte, turbina frenata)";
          } else if (vMs >= rated) {
            powerPct = 100;
            stato = "Produzione massima (rated power)";
          } else if (vMs >= cutIn) {
            powerPct = Math.round(Math.pow((vMs - cutIn) / (rated - cutIn), 3) * 100);
            stato = `Produzione ${powerPct}% (curva cubica)`;
          } else {
            stato = "Sotto cut-in (nessuna produzione)";
          }
          indices.energiaEolico = {
            windSpeedMs: Math.round(vMs * 10) / 10,
            powerPercent: powerPct,
            stato,
            cutInMs: cutIn,
            ratedMs: rated,
            cutOutMs: cutOut,
            nota: "Curva di potenza semplificata (cubica tra cut-in e rated). Per calcolo preciso serve curva specifica turbina.",
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

      // 6. Saturated Vapor Pressure & VPD & Fire Risk (Nimbus Fire Intelligence)
      if (tempC !== undefined && relativeHumidity !== undefined) {
        const es = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3)); // kPa
        const ea = es * (relativeHumidity / 100); // kPa
        const vpd = Math.max(0, es - ea); // kPa

        indices.vaporPressureDeficit = {
          saturatedVaporPressureKpa: Math.round(es * 100) / 100,
          actualVaporPressureKpa: Math.round(ea * 100) / 100,
          vpdKpa: Math.round(vpd * 100) / 100
        };

        const ws = windSpeedKmH ?? 0;
        const sm = soilMoisture0to1cm ?? 0.25;

        let fireRisk = "BASSO";
        let fireFlag = "Rischio trascurabile";

        if (vpd > 2.0 && ws > 35 && sm < 0.15) {
          fireRisk = "ESTREMO";
          fireFlag = "⚠️ Pericolo Incendi Estremo (Red Flag) — propagazione incontrollabile!";
        } else if (vpd > 1.5 && ws > 20) {
          fireRisk = "ALTO";
          fireFlag = "⚠️ Rischio Incendio Elevato — vegetazione altamente infiammabile.";
        } else if (vpd > 1.0 || sm < 0.20) {
          fireRisk = "MEDIO";
          fireFlag = "Attenzione: vegetazione secca, favorevole a inneschi locali.";
        }

        indices.nimbusFireIntelligence = {
          riskLevel: fireRisk,
          flag: fireFlag,
          vpdKpa: Math.round(vpd * 100) / 100,
          soilMoisture: sm,
          windSpeedKmH: ws
        };
      }

      // 7. Snow-Line / Quota Neve (Nimbus Formula)
      if (freezingLevelHeightM !== undefined) {
        let baseOffset = 300;
        let intensityAdj = 0;
        let valleyAdj = 0;
        let humidityAdj = 0;

        if (precipIntensityMmH !== undefined) {
          if (precipIntensityMmH < 2) {
            intensityAdj = -100; // Total offset is 200m
          } else if (precipIntensityMmH >= 2 && precipIntensityMmH <= 5) {
            intensityAdj = 100; // Total offset is 400m
          } else if (precipIntensityMmH > 5 && precipIntensityMmH <= 10) {
            intensityAdj = 300; // Total offset is 600m
          } else if (precipIntensityMmH > 10) {
            intensityAdj = 500; // Total offset is 800m (omotermia grave)
          }
        }

        if (isNarrowValley === true) {
          valleyAdj = 150; // extra descent in narrow valleys
        }

        if (relativeHumidity !== undefined) {
          if (relativeHumidity < 70) {
            humidityAdj = 100; // dry air, snow falls lower relative to ZT
          } else if (relativeHumidity > 90) {
            humidityAdj = -100; // humid air, snow melts faster
          }
        }

        const totalOffset = baseOffset + intensityAdj + valleyAdj + humidityAdj;
        const snowLine = Math.max(0, freezingLevelHeightM - totalOffset);

        indices.snowLineNimbus = {
          calculatedSnowLineM: Math.round(snowLine),
          freezingLevelHeightM,
          totalOffsetM: totalOffset,
          breakdown: {
            baseOffsetM: baseOffset,
            intensityAdjustmentM: intensityAdj,
            valleyAdjustmentM: valleyAdj,
            humidityAdjustmentM: humidityAdj
          },
          formulaUsed: "Quota Neve = Zero_Termico - (300m + Correttivo_Intensità + Correttivo_Valle + Correttivo_Umidità)"
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

// --- 6. REFERENCE GUIDELINES TOOL -------------------------------------------
export function registerReferenceGuidelines(server: McpServer) {
  server.registerTool(
    "meteo_reference_guidelines",
    {
      title: "Linee Guida e Scale Meteorologiche di Riferimento",
      description:
        "Access static weather reference scales, indexes, guidelines, and tables (such as Beaufort, Douglas, CAMS Air Quality limits, AINEVA avalanche scale, airport ICAO directories, EUMETSAT channels, radar reflectivity tables, river thresholds, and portals fallbacks).",
      inputSchema: {
        category: z.enum([
          "models",
          "marine",
          "air_quality",
          "mountain",
          "hydro",
          "nowcasting",
          "satellite",
          "lightning",
          "aviation",
          "portals"
        ]).describe("The reference category to retrieve guidelines/scales/data for")
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ category }) => {
      const start = Date.now();
      let data: any = {};

      if (category === "models") {
        data = {
          coreModels: [
            { id: "ecmwf_ifs", name: "ECMWF IFS HRES 9km", resolution: "9 km", coverage: "Globale", update: "6h", forecastDays: 10, weight: 1.4 },
            { id: "ecmwf_ifs025", name: "ECMWF IFS 0.25°", resolution: "25 km", coverage: "Globale", update: "6h", forecastDays: 10, weight: 1.2 },
            { id: "icon_seamless", name: "DWD ICON Seamless", resolution: "2–13 km", coverage: "Globale+EU", update: "1-3h", forecastDays: "7–16", weight: 1.0 },
            { id: "icon_global", name: "DWD ICON Global", resolution: "13 km", coverage: "Globale", update: "6h", forecastDays: 16, weight: 1.0 },
            { id: "icon_eu", name: "DWD ICON EU", resolution: "7 km", coverage: "Europa", update: "3h", forecastDays: 5, weight: 1.0 },
            { id: "icon_d2", name: "DWD ICON D2", resolution: "2 km", coverage: "Europa Centrale", update: "1h", forecastDays: 2, weight: 1.3 },
            { id: "italia_meteo_arpae_icon_2i", name: "ItaliaMeteo ARPAE ICON 2I", resolution: "2.2 km", coverage: "Italia", update: "1h", forecastDays: 5, weight: 1.5 },
            { id: "meteofrance_seamless", name: "Météo-France Seamless", resolution: "1.3–40 km", coverage: "Globale+EU", update: "1-6h", forecastDays: "4–15", weight: 0.9 },
            { id: "arpege_europe", name: "Météo-France ARPEGE Europe", resolution: "11 km", coverage: "Europa", update: "3h", forecastDays: 4, weight: 0.9 },
            { id: "arome_france", name: "Météo-France AROME France", resolution: "2.5 km", coverage: "Francia+vicini", update: "1h", forecastDays: 2, weight: 0.8 },
            { id: "meteoswiss_icon_seamless", name: "MeteoSwiss ICON Seamless", resolution: "1–11 km", coverage: "Svizzera+Alpi", update: "1-3h", forecastDays: 5, weight: 1.2 },
            { id: "geosphere_seamless", name: "GeoSphere Austria Seamless", resolution: "1–25 km", coverage: "Alpi Centrale+EU", update: "1-6h", forecastDays: 5, weight: 1.0 },
            { id: "knmi_seamless", name: "KNMI Harmonie/Seamless", resolution: "1–11 km", coverage: "Olanda+Mar del Nord", update: "1-3h", forecastDays: 2, weight: 0.9 }
          ],
          globalModels: [
            { id: "gfs_seamless", name: "NCEP GFS Seamless", resolution: "11–22 km", coverage: "Globale", update: "1h", forecastDays: 16, weight: 0.8 },
            { id: "gfs025", name: "NCEP GFS 0.25°", resolution: "25 km", coverage: "Globale", update: "6h", forecastDays: 16, weight: 0.6 },
            { id: "ecmwf_aifs025", name: "ECMWF AIFS (AI model)", resolution: "25 km", coverage: "Globale", update: "6h", forecastDays: 10, weight: 0.7 },
            { id: "gfs_graphcast025", name: "NCEP GFS GraphCast", resolution: "25 km", coverage: "Globale", update: "6h", forecastDays: 10, weight: 0.7 },
            { id: "gem_seamless", name: "GEM Canada Seamless", resolution: "2.5–15 km", coverage: "Globale", update: "3-6h", forecastDays: 16, weight: 0.6 },
            { id: "jma_seamless", name: "JMA Seamless", resolution: "5–55 km", coverage: "Globale", update: "3-6h", forecastDays: 11, weight: 0.6 }
          ],
          selectionByMacroarea: {
            nord_ovest: { core: "italia_meteo_arpae_icon_2i, icon_d2, icon_seamless, ecmwf_ifs, arome_france, gfs_seamless, meteoswiss_icon_seamless", note: "Usa arome_france per la fascia costiera, meteoswiss_icon_seamless per Alpi" },
            nord_est: { core: "italia_meteo_arpae_icon_2i, icon_d2, icon_seamless, ecmwf_ifs, gfs_seamless, meteoswiss_icon_seamless, geosphere_seamless", note: "Priorità ad ARPAE ICON 2I e ICON D2 per Bora e convezione" },
            centro_nord: { core: "italia_meteo_arpae_icon_2i, icon_seamless, icon_eu, ecmwf_ifs, meteofrance_seamless, gfs_seamless", note: "Consensus bilanciato con ARPAE ICON 2I" },
            centro: { core: "ecmwf_ifs, icon_seamless, meteofrance_seamless, arpege_europe, gfs_seamless, icon_eu", note: "ECMWF IFS ha peso elevato" },
            sud: { core: "ecmwf_ifs, ecmwf_aifs025, arpege_europe, icon_seamless, gfs_seamless, meteofrance_seamless", note: "Usa GFS e ARPEGE per Scirocco e vento sinottico" },
            sicilia: { core: "ecmwf_ifs, ecmwf_aifs025, arpege_europe, gfs_seamless, meteofrance_seamless", note: "ARPAE ICON 2I ha copertura ridotta, usa ECMWF come backbone" },
            sardegna: { core: "ecmwf_ifs, ecmwf_aifs025, meteofrance_seamless, arpege_europe, gfs_seamless", note: "Maestrale dominato da ECMWF e AROME/ARPEGE" }
          }
        };
      } else if (category === "marine") {
        data = {
          douglasScaleWindSea: [
            { degree: 0, description: "Calmo (specchio)", heightM: "0", action: "Navigazione sicura" },
            { degree: 1, description: "Quasi calmo", heightM: "0 – 0.10", action: "Navigazione sicura" },
            { degree: 2, description: "Poco mosso", heightM: "0.10 – 0.50", action: "Navigazione sicura" },
            { degree: 3, description: "Mosso", heightM: "0.50 – 1.25", action: "Cautela piccola nautica" },
            { degree: 4, description: "Molto mosso", heightM: "1.25 – 2.50", action: "Sconsigliato piccola nautica" },
            { degree: 5, description: "Agitato", heightM: "2.50 – 4.00", action: "Pericolo per balneazione e nautica" },
            { degree: 6, description: "Molto agitato", heightM: "4.00 – 6.00", action: "Navigazione difficile" },
            { degree: 7, description: "Grosso", heightM: "6.00 – 9.00", action: "Solo grandi navi" },
            { degree: 8, description: "Molto grosso", heightM: "9.00 – 14.00", action: "Emergenza" },
            { degree: 9, description: "Tempestoso", heightM: "> 14.00", action: "Condizioni eccezionali" }
          ],
          douglasScaleSwell: [
            { range: "0 – 2 m", class: "Bassa", description: "Onde lunghe e basse" },
            { range: "2 – 4 m", class: "Media", description: "Onde lunghe e moderate" },
            { range: "> 4 m", class: "Alta", description: "Onde lunghe e alte" }
          ],
          swellPeriod: [
            { periodS: "< 6s", class: "Corta", description: "Onde frequenti (Wind Sea)" },
            { periodS: "6 – 10s", class: "Media", description: "Onde regolari" },
            { periodS: "> 10s", class: "Lunga", description: "Onde distanziate (Swell / post-burrasca)" }
          ],
          beaufortScale: [
            { degree: 0, speedKmH: "<1", description: "Calma", effect: "Fumo sale verticale" },
            { degree: 1, speedKmH: "1–5", description: "Bava di vento", effect: "Fumo inclinato" },
            { degree: 2, speedKmH: "6–11", description: "Brezza leggera", effect: "Foglie muovono" },
            { degree: 3, speedKmH: "12–19", description: "Brezza tesa", effect: "Bandiere spiegate" },
            { degree: 4, speedKmH: "20–28", description: "Vento moderato", effect: "Solleva polvere" },
            { degree: 5, speedKmH: "29–38", description: "Vento teso", effect: "Piccoli alberi oscillano" },
            { degree: 6, speedKmH: "39–49", description: "Vento fresco", effect: "Grandi rami muovono" },
            { degree: 7, speedKmH: "50–61", description: "Vento forte", effect: "Difficoltà con ombrelli" },
            { degree: 8, speedKmH: "62–74", description: "Burrasca", effect: "Ramoscelli si spezzano" },
            { degree: 9, speedKmH: "75–88", description: "Burrasca forte", effect: "Danni alle strutture" }
          ],
          sstComfort: [
            { range: "<18°C", comfort: "Molto fredda", note: "Necessaria muta per permanenza prolungata" },
            { range: "18–21°C", comfort: "Fredda", note: "Rinfrescante, richiede adattamento" },
            { range: "22–24°C", comfort: "Ideale", note: "Perfetta per la maggior parte dei bagnanti" },
            { range: "25–27°C", comfort: "Calda", note: "Tipica del pieno agosto nel Med" },
            { range: ">28°C", comfort: "Molto calda", note: "Possibile stress ecosistema / mucillagine" }
          ],
          coastalTraversiaRiskMatrix: [
            { area: "Liguria Centrale/Levante", cities: "Genova, Chiavari, Spezia", traversia: "200° – 240°", windCrit: "Libeccio", waveThresholdM: 3.0 },
            { area: "Liguria Ponente", cities: "Savona, Imperia, Sanremo", traversia: "150° – 200°", windCrit: "Scirocco / Mezzogiorno", waveThresholdM: 2.5 },
            { area: "Toscana Nord / Versilia", cities: "Viareggio, Massa, Livorno", traversia: "220° – 260°", windCrit: "Libeccio", waveThresholdM: 3.0 },
            { area: "Toscana Sud / Lazio", cities: "Grosseto, Civitavecchia, Ostia", traversia: "230° – 270°", windCrit: "Libeccio / Ponente", waveThresholdM: 2.5 },
            { area: "Campania / Calabria Tirr.", cities: "Napoli, Salerno, Paola", traversia: "240° – 280°", windCrit: "Ponente / Libeccio", waveThresholdM: 3.0 },
            { area: "Sardegna Ovest", cities: "Alghero, Oristano, Bosa", traversia: "270° – 320°", windCrit: "Maestrale", waveThresholdM: 4.0 },
            { area: "Sardegna Est", cities: "Olbia, Nuoro, Costa Rei", traversia: "90° – 140°", windCrit: "Levante / Scirocco", waveThresholdM: 2.5 },
            { area: "Sicilia Nord", cities: "Palermo, Cefalù, Messina", traversia: "310° – 350°", windCrit: "Tramontana / Maestrale", waveThresholdM: 3.0 },
            { area: "Sicilia Sud", cities: "Agrigento, Gela, Pozzallo", traversia: "180° – 230°", windCrit: "Libeccio / Scirocco", waveThresholdM: 2.5 },
            { area: "Sicilia Est / Calabria Jon.", cities: "Catania, Siracusa, Crotone", traversia: "90° – 130°", windCrit: "Levante / Scirocco", waveThresholdM: 3.0 },
            { area: "Puglia Adriatica / Gargano", cities: "Vieste, Bari, Brindisi", traversia: "30° – 70°", windCrit: "Bora / Grecale", waveThresholdM: 2.5 },
            { area: "Puglia Salento (Jonico)", cities: "Gallipoli, Porto Cesareo", traversia: "180° – 220°", windCrit: "Scirocco / Libeccio", waveThresholdM: 2.0 },
            { area: "Marche / Abruzzo / Molise", cities: "Ancona, Pescara, Termoli", traversia: "30° – 60°", windCrit: "Bora / Grecale", waveThresholdM: 3.0 },
            { area: "Alto Adriatico / Romagna", cities: "Rimini, Ravenna, Chioggia", traversia: "60° – 120°", windCrit: "Bora / Levante", waveThresholdM: 2.0 },
            { area: "Laguna di Venezia", cities: "Venezia, Lido", traversia: "120° – 160°", windCrit: "Scirocco", waveThresholdM: 1.5 }
          ]
        };
      } else if (category === "air_quality") {
        data = {
          aqiEuropeanScale: [
            { aqiRange: "0–20", level: "Buono", color: "🟢", pm25: "0–10", pm10: "0–20", no2: "0–40", o3: "0–50" },
            { aqiRange: "20–40", level: "Discreto", color: "🟡", pm25: "10–20", pm10: "20–40", no2: "40–90", o3: "50–100" },
            { aqiRange: "40–60", level: "Moderato", color: "🟠", pm25: "20–25", pm10: "40–50", no2: "90–120", o3: "100–130" },
            { aqiRange: "60–80", level: "Scarso", color: "🔴", pm25: "25–50", pm10: "50–100", no2: "120–230", o3: "130–240" },
            { aqiRange: "80–100", level: "Molto scarso", color: "🟣", pm25: "50–75", pm10: "100–150", no2: "230–340", o3: "240–380" },
            { aqiRange: ">100", level: "Pessimo", color: "⚫", pm25: ">75", pm10: ">150", no2: ">340", o3: ">380" }
          ],
          pollenThresholdsAia: [
            { type: "Graminacee (grass)", low: "0.6 – 9.9", medium: "10 – 29.9", high: "> 30" },
            { type: "Betulle/Ontano (birch/alder)", low: "0.6 – 15.9", medium: "16 – 49.9", high: "> 50" },
            { type: "Olivo (olive)", low: "0.6 – 4.9", medium: "5 – 24.9", high: "> 25" },
            { type: "Ambrosia/Artemisia (ragweed/mugwort)", low: "0.1 – 4.9", medium: "5 – 24.9", high: "> 25" },
            { type: "Parietaria (Urticaceae)", low: "2.0 – 19.9", medium: "20 – 69.9", high: "> 70" },
            { type: "Cipresso (Cupressaceae)", low: "4.0 – 29.9", medium: "30 – 89.9", high: "> 90" }
          ],
          pollenCalendarItaly: {
            ontano: { nord: "gen–mar", centro_sud: "dic–feb" },
            betulla: { nord: "mar–apr", centro_sud: "feb–mar" },
            graminacee: { nord: "apr–giu", centro_sud: "mar–mag" },
            olivo: { nord: "mag–giu", centro_sud: "apr–mag" },
            artemisia: { nord: "lug–set", centro_sud: "lug–ago" },
            ambrosia: { nord: "ago–set", centro_sud: "ago–set" }
          },
          boundaryLayerMixingHeight: [
            { range: "< 300 m", risk: "Estremo", scenario: "Inquinanti intrappolati vicino al suolo (inversione notturna)" },
            { range: "300 – 500 m", risk: "Alto", scenario: "Ventilazione scarsa, ristagno PM10/NO2" },
            { range: "500 – 1000 m", risk: "Moderato", scenario: "Condizioni di dispersione medie" },
            { range: "> 1000 m", risk: "Basso", scenario: "Ottima dispersione verticale (aria pulita)" }
          ],
          protocolloAriaPadana: {
            verde: { range: "< 50 µg/m³", level: "Livello 0", action: "Nessuna restrizione" },
            arancio: { range: "> 50 µg/m³ per 2gg cons.", level: "Livello 1", action: "Blocco Euro 4/5 diesel, riscaldamento a legna" },
            rosso: { range: "> 75 µg/m³ per 2gg cons.", level: "Livello 2", action: "Restrizioni commerciali estese" }
          }
        };
      } else if (category === "mountain") {
        data = {
          avalancheDangerScaleAineva: [
            { grade: 1, level: "Debole", color: "🟢", stability: "Ben consolidato e stabile", triggers: "Solo con forte sovraccarico su pendii ripidi" },
            { grade: 2, level: "Moderato", color: "🟡", stability: "Moderatamente stabile", triggers: "Possibili con forte sovraccarico su pendii ripidi" },
            { grade: 3, level: "Marcato", color: "🟠", stability: "Da moderata a debole", triggers: "Possibili anche con debole sovraccarico" },
            { grade: 4, level: "Forte", color: "🔴", stability: "Debolmente consolidato", triggers: "Molte valanghe spontanee anche di grandi dimensioni" },
            { grade: 5, level: "Molto Forte", color: "⚫", stability: "Instabile", triggers: "Valanghe catastrofiche molto grandi spontanee" }
          ],
          windChillDanger: [
            { range: "0 a -10°C", class: "Fastidio", risk: "Lievi disagi per esposizione prolungata" },
            { range: "-10 a -25°C", class: "Freddo Intenso", risk: "Rischio moderato di congelamento" },
            { range: "-25 a -45°C", class: "Freddo Estremo", risk: "Pericolo grave, congelamento in pochi minuti" },
            { range: "< -45°C", class: "Emergenza", risk: "Pericolo imminente" }
          ],
          snowQualityMatrix: [
            { quality: "Farinosa", conditions: "snowfall > 0, T < -3°C, Vento < 15 km/h, UR < 70%", note: "Ideale per sci fuori pista" },
            { quality: "Crostosa", conditions: "snowfall = 0, Ciclo +/- 0°C, Vento > 25 km/h", note: "Presenza di crosta da vento" },
            { quality: "Pesante", conditions: "snowfall > 0, T -1 a +1°C, UR > 85%", note: "Neve bagnata, faticosa, rischio valanghe" },
            { quality: "Marcia", conditions: "T > 5°C per 3+ ore", note: "Neve primaverile bagnatissima" },
            { quality: "Ghiacciata", conditions: "T < -5°C", note: "Fondo duro" }
          ]
        };
      } else if (category === "hydro") {
        data = {
          poRiverThresholdsAipo: [
            { station: "Piacenza", prov: "PC", zeroM: 42.41, yellowS1: 5.0, orangeS2: 6.0, redS3: 7.0 },
            { station: "Cremona", prov: "CR", zeroM: 34.40, yellowS1: 2.2, orangeS2: 3.2, redS3: 4.2 },
            { station: "Casalmaggiore", prov: "CR", zeroM: 24.31, yellowS1: 3.8, orangeS2: 5.0, redS3: 6.2 },
            { station: "Boretto", prov: "RE", zeroM: 21.64, yellowS1: 4.5, orangeS2: 5.5, redS3: 6.5 },
            { station: "Borgoforte", prov: "MN", zeroM: 14.15, yellowS1: 5.0, orangeS2: 6.0, redS3: 7.0 },
            { station: "Pontelagoscuro", prov: "FE", zeroM: 8.38, yellowS1: 0.5, orangeS2: 1.3, redS3: 2.5 }
          ],
          arnoRiverThresholdsCfr: [
            { station: "Nave di Rovezzano", location: "Firenze Est", yellowS1: 3.0, redS3: 4.5 },
            { station: "Firenze Uffizi", location: "Centro Storico", yellowS1: 3.0, redS3: 5.5 },
            { station: "Ponte a Signa", location: "Firenze Ovest", yellowS1: 5.5, redS3: 8.5 },
            { station: "S. Giovanni alla Vena", location: "Pisa", yellowS1: 4.5, redS3: 7.1 }
          ],
          tevereRiverThresholdsLazio: [
            { station: "Roma Ripetta", location: "Centro Storico", yellowS1: 7.0, orangeS2: 10.0, redS3: 12.5 },
            { station: "Isola Tiberina", location: "Centro Storico", yellowS1: 6.5, orangeS2: 9.0, redS3: 11.0 }
          ],
          renoRiverThresholdsArpae: [
            { station: "Casalecchio Chiusa", location: "Bologna", yellowS1: 0.8, orangeS2: 1.6, redS3: 2.2 }
          ],
          volturnoCapuaInfo: "Nessuna soglia fissa in tabella. Piena storica 2023 ~8.20m. Fare riferimento al Bollettino Multirischi Campania.",
          floodsItStationsTrentino: [
            { id: "ADIGE_TRENTO", river: "Adige", location: "Trento", yellow: 3.0, red: 4.0 },
            { id: "ADIGE_ROVERETO", river: "Adige", location: "Rovereto", yellow: 2.8, red: 3.8 },
            { id: "BRENTA_BASSANO", river: "Brenta", location: "Bassano del Grappa", yellow: 3.5, red: 4.5 },
            { id: "SARCA_ARCO", river: "Sarca", location: "Arco", yellow: 2.0, red: 3.0 }
          ],
          arpavStationsVeneto: [
            { id: 124, river: "Adige", location: "Verona (Pte Nuovo)", s1: 1.0, s2: 1.5, s3: 2.0 },
            { id: 142, river: "Adige", location: "Boara Pisani", s1: 2.5, s2: 3.5, s3: 4.5 },
            { id: 105, river: "Brenta", location: "Bassano (Barzizza)", s1: 1.5, s2: 2.5, s3: 3.5 },
            { id: 108, river: "Bacchiglione", location: "Vicenza (Pte degli Angeli)", s1: 4.5, s2: 5.5, s3: 6.0 },
            { id: 132, river: "Po", location: "Ariano (Delta)", s1: 2.5, s2: 3.5, s3: 4.5 }
          ],
          corrivazioneHours: {
            po_piacenza_to_pontelagoscuro: "48-72 ore",
            adige_trento_to_verona: "6-10 ore",
            arno_firenze_to_pisa: "8-12 ore"
          }
        };
      } else if (category === "nowcasting") {
        data = {
          vmiReflectivityTableDpc: [
            { dbz: "15–20", intensity: "Molto debole", description: "Pioviggine o nubi dense" },
            { dbz: "20–35", intensity: "Debole/Moderata", description: "Pioggia ordinaria" },
            { dbz: "35–45", intensity: "Forte", description: "Rovesci intensi (temporale)" },
            { dbz: "45–55", intensity: "Molto forte", description: "Temporale severo, possibile grandine piccola" },
            { dbz: ">55", intensity: "Estrema", description: "Temporale violento, grandine grossa altamente probabile" }
          ],
          blendingRadarNwpMatrix: [
            { horizonMin: "0–15", radarWeight: 1.0, nwpWeight: 0.0, strategy: "Radar Dominante" },
            { horizonMin: "15–45", radarWeight: 0.8, nwpWeight: 0.2, strategy: "Validazione NWP" },
            { horizonMin: "45–90", radarWeight: 0.4, nwpWeight: 0.6, strategy: "Correzione Temporale (traslazione ritardo/anticipo)" },
            { horizonMin: ">90", radarWeight: 0.0, nwpWeight: 1.0, strategy: "NWP Dominante (ICON-D2 / ECMWF)" }
          ]
        };
      } else if (category === "satellite") {
        data = {
          eumetviewChannels: [
            { channel: "IR10.8", name: "Infrarosso termico", use: "Copertura nuvolosa, temperatura top nubi, celle convettive notturne/diurne" },
            { channel: "VIS0.6", name: "Visibile", use: "Estensione nebbie, nubi basse, polvere sahariana in ore diurne" },
            { channel: "WV0.62", name: "Water Vapor", use: "Umidità media troposfera, correnti a getto, vorticità" }
          ],
          satelliteInterpretationRules: {
            fronts: "Bande nuvolose continue IR10.8 indicano fronti atlantici. Confrontare posizione reale vs modelli NWP.",
            cells: "Tops nuvolosi molto freddi (IR10.8 < -60°C) indicano temporali intensi. Presenza di overshooting top = supercella.",
            fog: "Strato uniforme in VIS0.6 non visibile in IR10.8 notturno indica nebbia da irraggiamento.",
            dust: "Area diffusa in canale IR8.7 / RGB Dust conferma trasporto polvere sahariana."
          }
        };
      } else if (category === "lightning") {
        data = {
          densityThresholds: [
            { count15MinPer50Km2: ">0", severity: "Attività elettrica", risk: "Fulmini isolati in zona" },
            { count15MinPer50Km2: ">10", severity: "Temporale attivo", risk: "Fulminazione frequente, temporale organizzato" },
            { count15MinPer50Km2: ">20", severity: "Temporale severo", risk: "Rischio grandine elevato, downburst, temporale molto forte" }
          ],
          distanceHazard: [
            { nearestKm: "<5", hazard: "Pericolo immediato", action: "Evacuare creste, spiaggia, ripararsi in struttura chiusa" },
            { nearestKm: "5-15", hazard: "In zona", action: "Trovare riparo a breve" },
            { nearestKm: ">15", hazard: "Nelle vicinanze", action: "Monitorare evoluzione radar/fulmini" }
          ],
          dryLightningRisk: "Fulmini con precipitazione al suolo <1mm indica rischio elevato incendi (vegetazione secca). Comunissimo con Scirocco/Garbino."
        };
      } else if (category === "aviation") {
        data = {
          icaoAirportsItaly: {
            nord_ovest: [
              { icao: "LIMC", name: "Milano Malpensa", elevationM: 234, note: "Hub internazionale" },
              { icao: "LIML", name: "Milano Linate", elevationM: 107, note: "Urbano, nebbia padana" },
              { icao: "LIME", name: "Bergamo Orio al Serio", elevationM: 237, note: "Low-cost" },
              { icao: "LIMF", name: "Torino Caselle", elevationM: 301, note: "Frequente Foehn" },
              { icao: "LIMJ", name: "Genova Sestri", elevationM: 4, note: "Costiero, Maccaja/Caligo" }
            ],
            nord_est: [
              { icao: "LIPZ", name: "Venezia Tessera", elevationM: 2, note: "Lagunare, nebbia/acqua alta" },
              { icao: "LIPX", name: "Verona Villafranca", elevationM: 68, note: "Pianura" },
              { icao: "LIPE", name: "Bologna Borgo Panigale", elevationM: 37, note: "Pianura Padana" },
              { icao: "LIPB", name: "Bolzano", elevationM: 241, note: "Valle alpina, Foehn" }
            ],
            centro: [
              { icao: "LIRF", name: "Roma Fiumicino", elevationM: 5, note: "Hub internazionale costiero" },
              { icao: "LIRA", name: "Roma Ciampino", elevationM: 130, note: "Urbano" },
              { icao: "LIRP", name: "Pisa San Giusto", elevationM: 2, note: "Costiero tirrenico" },
              { icao: "LIRZ", name: "Perugia Sant'Egidio", elevationM: 205, note: "Collinare" }
            ],
            sud_isole: [
              { icao: "LIRN", name: "Napoli Capodichino", elevationM: 90, note: "Urbano" },
              { icao: "LIBD", name: "Bari Palese", elevationM: 54, note: "Costiero" },
              { icao: "LICC", name: "Catania Fontanarossa", elevationM: 12, note: "Etna, venti forti" },
              { icao: "LICJ", name: "Palermo Falcone Borsellino", elevationM: 19, note: "Costiero tirrenico, scirocco" },
              { icao: "LIEE", name: "Cagliari Elmas", elevationM: 4, note: "Costiero tirrenico" }
            ]
          },
          validationRules: {
            temperature: "Scarto >2°C indica bias del modello, scarto >4°C indica modello inaffidabile per il punto.",
            wind: "Scarto velocità >10kt indica sottostima vento, raffiche >20kt non previste sono critiche.",
            visibility: "Visibilità <2000m ma NWP sereno indica nebbia non risolta dal modello (critico viabilità).",
            ceiling: "Base nubi (ceiling) <1000ft indica regole di volo IFR."
          }
        };
      } else if (category === "portals") {
        data = {
          italianPortalsFallbacks: [
            { name: "3bMeteo", coverage: "Nazionale", url: "https://www.3bmeteo.com" },
            { name: "iLMeteo", coverage: "Nazionale", url: "https://www.ilmeteo.it" },
            { name: "Meteo.it", coverage: "Nazionale", url: "https://www.meteo.it" },
            { name: "LAMMA Toscana", coverage: "Regionale (Toscana/Centro)", url: "https://www.lamma.toscana.it" },
            { name: "MeteoAM", coverage: "Nazionale (Aeronautica)", url: "https://www.meteoam.it" }
          ],
          consensusRules: "Confrontare almeno 3 portali indipendenti. Se divergono, dichiarare esplicitamente l'incertezza e mostrare gli scenari alternativi."
        };
      } else if (category === "pollen") {
        data = {
          pollenCalendarItaly: {
            ontano: { nord: "gen–mar", centro_sud: "dic–feb", peak: "feb" },
            betulla: { nord: "mar–apr", centro_sud: "feb–mar", peak: "mar" },
            cipresso: { nord: "feb–apr", centro_sud: "gen–mar", peak: "mar" },
            graminacee: { nord: "apr–giu", centro_sud: "mar–mag", peak: "mag" },
            olivo: { nord: "mag–giu", centro_sud: "apr–mag", peak: "mag" },
            parietaria: { nord: "mar–ott", centro_sud: "feb–nov", peak: "apr" },
            artemisia: { nord: "lug–set", centro_sud: "lug–ago", peak: "ago" },
            ambrosia: { nord: "ago–set", centro_sud: "ago–set", peak: "set" }
          },
          thresholdsAia: [
            { type: "Graminacee", low: "0.6–9.9", medium: "10–29.9", high: "≥30", unit: "grani/m³" },
            { type: "Olivo", low: "0.6–4.9", medium: "5–24.9", high: "≥25", unit: "grani/m³" },
            { type: "Betulle/Ontano", low: "0.6–15.9", medium: "16–49.9", high: "≥50", unit: "grani/m³" },
            { type: "Parietaria", low: "2.0–19.9", medium: "20–69.9", high: "≥70", unit: "grani/m³" },
            { type: "Ambrosia", low: "0.1–4.9", medium: "5–24.9", high: "≥25", unit: "grani/m³" },
            { type: "Cipresso", low: "4.0–29.9", medium: "30–89.9", high: "≥90", unit: "grani/m³" }
          ],
          weatherFactors: "Pioggia abbassa polline (lavaggio aria). Vento >15 km/h aumenta dispersione. T >15°C e secco favorisce rilascio. Nebbia intrappola polline vicino al suolo."
        };
      } else if (category === "uv") {
        data = {
          uvScale: [
            { range: "0–2", level: "Basso", color: "🟢", protection: "Nessuna necessaria", burnTimeFitzpatrick2: "60+ min" },
            { range: "3–5", level: "Moderato", color: "🟡", protection: "Occhiali, crema SPF 30", burnTimeFitzpatrick2: "30–45 min" },
            { range: "6–7", level: "Alto", color: "🟠", protection: "SPF 50, cappello, ombra 11–16", burnTimeFitzpatrick2: "15–25 min" },
            { range: "8–10", level: "Molto alto", color: "🔴", protection: "SPF 50+, evitare esposizione 10–16", burnTimeFitzpatrick2: "10–15 min" },
            { range: "11+", level: "Estremo", color: "🟣", protection: "Evitare uscita, SPF 50+, abiti coprenti", burnTimeFitzpatrick2: "<10 min" }
          ],
          fitzpatrickTypes: [
            { type: 1, description: "Pelle molto chiara, capelli rossi, lentiggini", burnMultiplier: 0.5 },
            { type: 2, description: "Pelle chiara, capelli biondi/rossi", burnMultiplier: 1.0 },
            { type: 3, description: "Pelle media, capelli castani", burnMultiplier: 1.5 },
            { type: 4, description: "Pelle olivastra, capelli scuri", burnMultiplier: 2.5 },
            { type: 5, description: "Pelle scura", burnMultiplier: 4.0 },
            { type: 6, description: "Pelle molto scura", burnMultiplier: 8.0 }
          ],
          altitudeNote: "UV aumenta ~10% ogni 1000m di quota. Riflessione neve: +80%. Riflessione acqua: +25%. Riflessione sabbia: +15%.",
          vitaminD: "15–20 min di esposizione braccia/viso senza protezione sufficiente per sintesi vitamina D (UV 3+)."
        };
      } else if (category === "construction") {
        data = {
          windLimits: [
            { activity: "Grù a torre", limitKmH: 50, note: "Fermo operazioni, braccio in bandiera" },
            { activity: "Ponteggi", limitKmH: 60, note: "Verifica ancoraggi, no salita" },
            { activity: "Lavori in quota", limitKmH: 40, note: "Imbracatura obbligatoria, no bordi" },
            { activity: "Getto calcestruzzo", limitKmH: 30, note: "Rischio rapida essicazione" },
            { activity: "Verniciatura", limitKmH: 20, note: "Spray disperdo, adesione ridotta" }
          ],
          concreteRules: {
            minTempC: 5,
            maxTempC: 35,
            rainRisk: "Coprire getto se pioggia prevista entro 4h",
            frostRisk: "No getto se T<0°C prevista nelle 24h successive",
            curingNote: "T 20°C: maturazione 28gg. T 10°C: 42gg. T 5°C: 56gg."
          },
          soilConditions: {
            saturatedRisk: "soil_moisture > 0.35 → scavi instabili, rischio cedimento",
            frozenRisk: "T suolo < 0°C → lavorazione impossibile, attesa disgelo"
          }
        };
      } else if (category === "tourism") {
        data = {
          bestPeriods: {
            mare: { best: "giu–set", peak: "lug–ago", note: "SST > 22°C, UV alto" },
            montagna: { best: "giu–set", peak: "lug–ago", note: "Quota 1500–2500m ideale" },
            citta_arte: { best: "mar–mag, set–ott", peak: "apr, ott", note: "T miti, meno folla" },
            sci: { best: "dic–mar", peak: "gen–feb", note: "Migliore neve, freddo" },
            termale: { best: "ott–apr", peak: "nov–mar", note: "Ideale con T fredde" }
          },
          comfortIndex: {
            formula: "Basato su T percepita, UR, vento, UV",
            scale: [
              { range: "0–20", label: "Molto scomodo", action: "Evitare attività outdoor" },
              { range: "21–40", label: "Scomodo", action: "Limitare esposizione" },
              { range: "41–60", label: "Accettabile", action: "Attività outdoor con cautela" },
              { range: "61–80", label: "Confortevole", action: "Ideale per escursioni" },
              { range: "81–100", label: "Perfetto", action: "Condizioni ottimali" }
            ]
          }
        };
      }

      const res: ApiResult = {
        ok: true,
        url: `mcp://reference_guidelines/${category}`,
        status: 200,
        data,
        elapsedMs: Date.now() - start
      };
      return toToolResult(res);
    }
  );
}

// --- POLLEN FORECAST TOOL ---------------------------------------------------
export function registerPollen(server: McpServer) {
  server.registerTool(
    "meteo_pollen",
    {
      title: "Pollen Forecast Italy",
      description:
        "Estimate pollen levels for Italian allergenic plants based on season, weather conditions (T, humidity, wind, rain), and AIA thresholds. Returns active allergens, risk level, and recommendations.",
      inputSchema: {
        latitude: z.coerce.number().min(-90).max(90).describe("Latitude"),
        longitude: z.coerce.number().min(-180).max(180).describe("Longitude"),
        tempC: z.coerce.number().describe("Current temperature in °C"),
        relativeHumidity: z.coerce.number().min(0).max(100).describe("Relative humidity in %"),
        windSpeedKmH: z.coerce.number().min(0).describe("Wind speed in km/h"),
        precipMm: z.coerce.number().min(0).default(0).describe("Precipitation in last 24h in mm"),
        cloudCover: z.coerce.number().min(0).max(100).optional().describe("Cloud cover in %"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ latitude, longitude, tempC, relativeHumidity, windSpeedKmH, precipMm, cloudCover }) => {
      const start = Date.now();
      const month = new Date().getMonth() + 1;
      const isNord = latitude > 44.0;

      const pollenCalendar: Record<string, { nord: number[]; centro_sud: number[] }> = {
        ontano: { nord: [1, 2, 3], centro_sud: [12, 1, 2] },
        betulla: { nord: [3, 4], centro_sud: [2, 3] },
        cipresso: { nord: [2, 3, 4], centro_sud: [1, 2, 3] },
        graminacee: { nord: [4, 5, 6], centro_sud: [3, 4, 5] },
        olivo: { nord: [5, 6], centro_sud: [4, 5] },
        parietaria: { nord: [3, 4, 5, 6, 7, 8, 9, 10], centro_sud: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
        artemisia: { nord: [7, 8, 9], centro_sud: [7, 8] },
        ambrosia: { nord: [8, 9], centro_sud: [8, 9] }
      };

      const thresholds: Record<string, { low: number; medium: number; high: number }> = {
        graminacee: { low: 10, medium: 30, high: 50 },
        olivo: { low: 5, medium: 25, high: 50 },
        betulla: { low: 16, medium: 50, high: 80 },
        parietaria: { low: 20, medium: 70, high: 100 },
        ambrosia: { low: 5, medium: 25, high: 50 },
        cipresso: { low: 30, medium: 90, high: 150 },
      };

      const activeAllergens: any[] = [];
      for (const [pollen, seasons] of Object.entries(pollenCalendar)) {
        const activeMonths = isNord ? seasons.nord : seasons.centro_sud;
        if (!activeMonths.includes(month)) continue;

        let baseLevel = 50;
        if (tempC < 5) baseLevel *= 0.2;
        else if (tempC < 10) baseLevel *= 0.5;
        else if (tempC > 30) baseLevel *= 0.7;

        if (precipMm > 5) baseLevel *= 0.2;
        else if (precipMm > 1) baseLevel *= 0.5;

        if (windSpeedKmH > 25) baseLevel *= 1.5;
        else if (windSpeedKmH > 15) baseLevel *= 1.2;
        else if (windSpeedKmH < 3) baseLevel *= 0.6;

        if (relativeHumidity > 85) baseLevel *= 0.4;
        else if (relativeHumidity > 70) baseLevel *= 0.7;

        if (cloudCover !== undefined && cloudCover > 80) baseLevel *= 0.6;

        const estimatedLevel = Math.round(Math.max(0, Math.min(150, baseLevel)));
        const th = thresholds[pollen] ?? { low: 10, medium: 30, high: 50 };
        let risk = "Basso";
        if (estimatedLevel >= th.high) risk = "Alto";
        else if (estimatedLevel >= th.medium) risk = "Medio";

        activeAllergens.push({
          pollen,
          estimatedLevel,
          risk,
          isPeak: activeMonths.length <= 2,
        });
      }

      activeAllergens.sort((a, b) => b.estimatedLevel - a.estimatedLevel);
      const maxRisk = activeAllergens.some((a) => a.risk === "Alto") ? "Alto" : activeAllergens.some((a) => a.risk === "Medio") ? "Medio" : "Basso";

      return toToolResult({
        ok: true,
        url: "mcp://pollen",
        status: 200,
        data: {
          location: { latitude, longitude, zona: isNord ? "Nord Italia" : "Centro-Sud Italia" },
          mese: month,
          condizioniMeteo: { tempC, relativeHumidity, windSpeedKmH, precipMm },
          overallRisk: maxRisk,
          allergeniAttivi: activeAllergens,
          raccomandazioni: maxRisk === "Alto"
            ? "Evitare attività outdoor nelle ore calde (10-16). Antistaminici profilattici. Chiudere finestre, lavarsi dopo essere stati fuori."
            : maxRisk === "Medio"
            ? "Limitare tempo all'aperto se sensibili. Doccia e cambio vestiti al rientro."
            : "Condizioni favorevoli per chi soffre di allergie.",
        },
        elapsedMs: Date.now() - start,
      });
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
        latitude: z.coerce.number().min(-90).max(90).describe("Latitude of target"),
        longitude: z.coerce.number().min(-180).max(180).describe("Longitude of target"),
        temp2m: z.coerce.number().min(-90).max(60).describe("Temperature at 2m (°C)"),
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

      // 15. LIBECCIO
      const isLibeccio = windSpeed10m > 25 && (windDir10m >= 210 && windDir10m <= 250);
      const isTirreno = longitude >= 9.0 && longitude <= 16.0 && latitude >= 37.0 && latitude <= 44.0;
      if (isLibeccio && isTirreno) {
        flags.push("LIBECCIO");
        descriptions.LIBECCIO = `Libeccio forte sul Tirreno (vento da ${windDir10m}° a ${windSpeed10m} km/h). Mare molto agitato su coste occidentali, onde fino a ${windSpeed10m > 40 ? "4-6m" : "2-3m"}.`;
      }

      // 16. GELO DA IRRAGGIAMENTO
      const isGeloIrraggiamento = temp2m < 0 && cloudCover !== undefined && cloudCover < 15 && windSpeed10m < 5 && relHum2m > 60;
      const isValle = precip7dMm !== undefined && precip7dMm < 2;
      if (isGeloIrraggiamento && isValle) {
        flags.push("GELO_IRRAGGIAMENTO");
        descriptions.GELO_IRRAGGIAMENTO = `Gelo da irraggiamento notturno in vallata. T ${temp2m}°C, cielo sereno (${cloudCover}%), vento quasi assente. Possibili ${temp2m < -5 ? "formazioni di ghiaccio nero" : "brinate diffuse"}.`;
      }

      // 17. NEBBIA DA AVVEZIONE
      const isNebbiaAvvezione = relHum2m >= 95 && windSpeed10m >= 5 && windSpeed10m <= 15 && cloudCoverLow !== undefined && cloudCoverLow > 90;
      const isCosta = seaSurfaceTemp !== undefined && (temp2m - seaSurfaceTemp) > 3;
      if (isNebbiaAvvezione && isCosta) {
        flags.push("NEBBIA_AVVEZIONE");
        descriptions.NEBBIA_AVVEZIONE = `Nebbia da avvezione costiera. Aria calda e umida (${temp2m}°C, UR ${relHum2m}%) su mare più freddo (${seaSurfaceTemp}°C). Visibilità < 500m, critica per navigazione e viabilità costiera.`;
      }

      // 18. BREVA / TIVANO (Lago di Como)
      const isLagoDiComo = latitude >= 45.8 && latitude <= 46.2 && longitude >= 9.0 && longitude <= 9.5;
      if (isLagoDiComo && windSpeed10m > 8) {
        const hour = new Date().getHours();
        if (hour >= 10 && hour <= 18 && windDir10m >= 170 && windDir10m <= 210) {
          flags.push("BREVA");
          descriptions.BREVA = `Breva attiva sul Lago di Como: brezza diurna da Sud (ore ${hour}). Vento regolare ${windSpeed10m} km/h, ideale per vela.`;
        } else if ((hour >= 20 || hour <= 8) && windDir10m >= 340 || windDir10m <= 20) {
          flags.push("TIVANO");
          descriptions.TIVANO = `Tivano attivo sul Lago di Como: brezza notturna da Nord (ore ${hour}). Vento fresco ${windSpeed10m} km/h.`;
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
        modelId: z.string().optional().describe("Filter biases for a specific model (e.g. ecmwf_ifs, icon_d2, italia_meteo_arpae_icon_2i, gfs_seamless)"),
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

      const rawWeights = weights[macroarea] ?? {};
      const matchedWeights: Record<string, number> = {};
      for (const [model, w] of Object.entries(rawWeights)) {
        matchedWeights[normalizeModelId(model)] = w;
      }

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

      const normalizedModelId = modelId ? normalizeModelId(modelId) : undefined;
      const filteredBiases = normalizedModelId
        ? biases.filter((b) => normalizeModelId(b.model).includes(normalizedModelId))
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
            convective: "Se CAPE > 500 o weather_code 80-99, aumenta peso (+0.3) di icon_d2, arome_france, italia_meteo_arpae_icon_2i; riduci gfs_seamless, ecmwf_ifs.",
            frontal: "Se pioggia diffusa, aumenta peso (+0.3) di ecmwf_ifs, arpege_europe.",
            fog: "Se nebbia padana, aumenta peso (+0.4) di italia_meteo_arpae_icon_2i; riduci gfs_seamless (-0.3).",
            orographic_wind: "Se Bora/Foehn, aumenta peso (+0.3) di icon_d2, meteoswiss_icon_seamless; riduci ecmwf_ifs (-0.2).",
            snow: "Se nevicate, aumenta peso (+0.4) di icon_d2, meteoswiss_icon_seamless, geosphere_seamless; riduci gfs_seamless (-0.2).",
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

function round1(v: number | null): number | null {
  return v == null ? null : Math.round(v * 10) / 10;
}

// --- 7. HISTORICAL VERIFICATION TOOL ----------------------------------------
export function registerVerification(server: McpServer) {
  server.registerTool(
    "meteo_verification",
    {
      title: "Historical Forecast Verification",
      description:
        "Compare past NWP forecasts with ERA5 reanalysis (ground truth) to compute model accuracy metrics: MAE, bias, RMSE for temperature and precipitation. Use to evaluate local model bias over recent days.",
      inputSchema: {
        ...latLon,
        days: z.coerce.number().int().min(3).max(30).default(7).describe("Number of past days to verify (3-30)"),
        models: z.string().default("ecmwf_ifs025").describe("Comma-separated model ids to verify"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ latitude, longitude, days, models }) => {
      const start = Date.now();
      const modelList = models.split(",").map((x) => x.trim()).filter(Boolean);

      const forecastRes = await apiGet("https://api.open-meteo.com/v1/forecast", {
        latitude, longitude,
        models: modelList,
        daily: ["temperature_2m_max", "temperature_2m_min", "precipitation_sum"],
        past_days: days,
        forecast_days: 0,
        timezone: "Europe/Rome",
      });

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      const fmt = (d: Date) => d.toISOString().slice(0, 10);

      const archiveRes = await apiGet("https://archive-api.open-meteo.com/v1/archive", {
        latitude, longitude,
        daily: ["temperature_2m_max", "temperature_2m_min", "precipitation_sum"],
        start_date: fmt(startDate),
        end_date: fmt(endDate),
        timezone: "Europe/Rome",
      });

      if (!forecastRes.ok || !archiveRes.ok) {
        return toToolResult({
          ok: false, url: "mcp://verification", status: 0, data: null,
          error: `Dati non disponibili: forecast=${forecastRes.ok}, archive=${archiveRes.ok}`,
          elapsedMs: Date.now() - start,
        });
      }

      const fData = forecastRes.data as any;
      const aData = archiveRes.data as any;
      const era5Dates: string[] = aData?.daily?.time ?? [];
      const era5Tmax: number[] = aData?.daily?.temperature_2m_max ?? [];
      const era5Tmin: number[] = aData?.daily?.temperature_2m_min ?? [];
      const era5Precip: number[] = aData?.daily?.precipitation_sum ?? [];

      const verification: Record<string, any> = {};
      for (const model of modelList) {
        const fTmax: number[] = fData?.daily?.[`temperature_2m_max_${model}`] ?? fData?.daily?.temperature_2m_max ?? [];
        const fTmin: number[] = fData?.daily?.[`temperature_2m_min_${model}`] ?? fData?.daily?.temperature_2m_min ?? [];
        const fPrecip: number[] = fData?.daily?.[`precipitation_sum_${model}`] ?? fData?.daily?.precipitation_sum ?? [];
        const fDates: string[] = fData?.daily?.time ?? [];

        const errors = { tmax: [] as number[], tmin: [] as number[], precip: [] as number[] };
        const dailyComparison: any[] = [];

        for (let i = 0; i < era5Dates.length; i++) {
          const fi = fDates.indexOf(era5Dates[i]);
          if (fi < 0) continue;
          const eTmax = era5Tmax[i], eTmin = era5Tmin[i], eP = era5Precip[i];
          const fTmaxV = fTmax[fi], fTminV = fTmin[fi], fPV = fPrecip[fi];
          if (eTmax != null && fTmaxV != null) errors.tmax.push(fTmaxV - eTmax);
          if (eTmin != null && fTminV != null) errors.tmin.push(fTminV - eTmin);
          if (eP != null && fPV != null) errors.precip.push(fPV - eP);
          dailyComparison.push({
            date: era5Dates[i],
            era5: { tmax: eTmax, tmin: eTmin, precip: eP },
            forecast: { tmax: fTmaxV, tmin: fTminV, precip: fPV },
            error: { tmax: round1(fTmaxV - eTmax), tmin: round1(fTminV - eTmin), precip: round1(fPV - eP) },
          });
        }

        const calcStats = (errs: number[]) => {
          if (!errs.length) return { n: 0, mae: null, bias: null, rmse: null };
          const n = errs.length;
          const mae = round1(errs.reduce((s, e) => s + Math.abs(e), 0) / n);
          const bias = round1(errs.reduce((s, e) => s + e, 0) / n);
          const rmse = round1(Math.sqrt(errs.reduce((s, e) => s + e * e, 0) / n));
          return { n, mae, bias, rmse };
        };

        verification[model] = {
          temperature_max: calcStats(errors.tmax),
          temperature_min: calcStats(errors.tmin),
          precipitation: calcStats(errors.precip),
          daily: dailyComparison,
        };
      }

      return toToolResult({
        ok: true,
        url: "mcp://verification",
        status: 200,
        data: {
          location: { latitude, longitude },
          period: { from: era5Dates[0], to: era5Dates[era5Dates.length - 1], days: era5Dates.length },
          reference: "ERA5 Reanalysis (ECMWF)",
          verification,
          interpretation: "bias>0=model sovrastima, bias<0=model sottostima. MAE=errore medio assoluto. RMSE=punisce errori grandi.",
        },
        elapsedMs: Date.now() - start,
      });
    }
  );
}

// --- 8. YEAR COMPARISON TOOL ------------------------------------------------
export function registerYearCompare(server: McpServer) {
  server.registerTool(
    "meteo_year_compare",
    {
      title: "Year-over-Year Weather Comparison",
      description:
        "Compare current weather forecast with the same period last year (ERA5 reanalysis). Shows anomalies in temperature and precipitation to identify trends (warmer/cooler, wetter/drier).",
      inputSchema: {
        ...latLon,
        days: z.coerce.number().int().min(3).max(14).default(7).describe("Number of days to compare (3-14)"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ latitude, longitude, days }) => {
      const start = Date.now();

      const now = new Date();
      const currentStart = new Date(now);
      currentStart.setDate(now.getDate() - days);
      const lastYearStart = new Date(currentStart);
      lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
      const lastYearEnd = new Date(now);
      lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);
      const fmt = (d: Date) => d.toISOString().slice(0, 10);

      const currentRes = await apiGet("https://api.open-meteo.com/v1/forecast", {
        latitude, longitude,
        daily: ["temperature_2m_max", "temperature_2m_min", "precipitation_sum"],
        past_days: days,
        forecast_days: 0,
        timezone: "Europe/Rome",
      });

      const lastYearRes = await apiGet("https://archive-api.open-meteo.com/v1/archive", {
        latitude, longitude,
        daily: ["temperature_2m_max", "temperature_2m_min", "precipitation_sum"],
        start_date: fmt(lastYearStart),
        end_date: fmt(lastYearEnd),
        timezone: "Europe/Rome",
      });

      if (!currentRes.ok || !lastYearRes.ok) {
        return toToolResult({
          ok: false, url: "mcp://year_compare", status: 0, data: null,
          error: `Dati non disponibili: current=${currentRes.ok}, lastYear=${lastYearRes.ok}`,
          elapsedMs: Date.now() - start,
        });
      }

      const cData = currentRes.data as any;
      const lData = lastYearRes.data as any;
      const cDates: string[] = cData?.daily?.time ?? [];
      const lDates: string[] = lData?.daily?.time ?? [];
      const cTmax: number[] = cData?.daily?.temperature_2m_max ?? [];
      const cTmin: number[] = cData?.daily?.temperature_2m_min ?? [];
      const cPrecip: number[] = cData?.daily?.precipitation_sum ?? [];
      const lTmax: number[] = lData?.daily?.temperature_2m_max ?? [];
      const lTmin: number[] = lData?.daily?.temperature_2m_min ?? [];
      const lPrecip: number[] = lData?.daily?.precipitation_sum ?? [];

      const daily: any[] = [];
      const diffs = { tmax: [] as number[], tmin: [] as number[], precip: [] as number[] };

      for (let i = 0; i < Math.min(cDates.length, lDates.length); i++) {
        const cDate = cDates[i];
        const lDate = lDates[i];
        const cDay = parseInt(cDate.slice(8, 10));
        const lDay = parseInt(lDate.slice(8, 10));
        if (cDay !== lDay) continue;

        const dTmax = cTmax[i] != null && lTmax[i] != null ? round1(cTmax[i] - lTmax[i]) : null;
        const dTmin = cTmin[i] != null && lTmin[i] != null ? round1(cTmin[i] - lTmin[i]) : null;
        const dPrecip = cPrecip[i] != null && lPrecip[i] != null ? round1(cPrecip[i] - lPrecip[i]) : null;

        if (dTmax != null) diffs.tmax.push(dTmax);
        if (dTmin != null) diffs.tmin.push(dTmin);
        if (dPrecip != null) diffs.precip.push(dPrecip);

        daily.push({
          date: cDate,
          current: { tmax: cTmax[i], tmin: cTmin[i], precip: cPrecip[i] },
          lastYear: { tmax: lTmax[i], tmin: lTmin[i], precip: lPrecip[i] },
          delta: { tmax: dTmax, tmin: dTmin, precip: dPrecip },
        });
      }

      const avg = (xs: number[]) => xs.length ? round1(xs.reduce((a, b) => a + b, 0) / xs.length) : null;
      const summary = {
        avgDeltaTmax: avg(diffs.tmax),
        avgDeltaTmin: avg(diffs.tmin),
        avgDeltaPrecip: avg(diffs.precip),
        totalPrecipCurrent: round1(cPrecip.reduce((a, b) => a + (b ?? 0), 0)),
        totalPrecipLastYear: round1(lPrecip.reduce((a, b) => a + (b ?? 0), 0)),
        daysAnalyzed: daily.length,
      };

      const trend = {
        temperature: summary.avgDeltaTmax != null
          ? summary.avgDeltaTmax > 1 ? "Più caldo dell'anno scorso" : summary.avgDeltaTmax < -1 ? "Più freddo dell'anno scorso" : "Simile all'anno scorso"
          : "Dati insufficienti",
        precipitation: summary.totalPrecipCurrent != null && summary.totalPrecipLastYear != null
          ? summary.totalPrecipCurrent > summary.totalPrecipLastYear * 1.3 ? "Più piovoso dell'anno scorso" : summary.totalPrecipCurrent < summary.totalPrecipLastYear * 0.7 ? "Più secco dell'anno scorso" : "Simile all'anno scorso"
          : "Dati insufficienti",
      };

      return toToolResult({
        ok: true,
        url: "mcp://year_compare",
        status: 200,
        data: {
          location: { latitude, longitude },
          currentPeriod: { from: cDates[0], to: cDates[cDates.length - 1] },
          lastYearPeriod: { from: lDates[0], to: lDates[lDates.length - 1] },
          summary,
          trend,
          daily,
        },
        elapsedMs: Date.now() - start,
      });
    }
  );
}
