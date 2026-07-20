import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet, toToolResult, openMeteoCommon, latLon, ApiResult } from "./http.js";

/**
 * Compute a compact per-model summary from a raw Open-Meteo forecast/ensemble
 * response. Open-Meteo suffixes every variable with `_<model>` when several
 * models are requested, so we detect variables by suffix, not exact name.
 *
 * The result is ~90% smaller than the raw payload and is what the skill's
 * report actually needs (daily extremes, totals, event-hour counts).
 */
export function summarizeForecast(raw: any, models?: string[]): {
  location: { latitude: number; longitude: number; elevation?: number; timezone: string };
  days: Array<{
    date: string;
    models: Record<
      string,
      {
        temp_max?: number;
        temp_min?: number;
        precip_sum?: number;
        precip_prob_max?: number;
        cape_max?: number;
        gust_max?: number;
        precip_hours: number;
        thunderstorm_hours: number;
      }
    >;
  }>;
} {
  const daily = raw?.daily;
  const hourly = raw?.hourly;
  const dates: string[] = (daily?.time as string[]) ?? [];

  // Open-Meteo appends `_<model>` to every variable when multiple models are
  // requested. Model ids contain underscores (e.g. ecmwf_ifs04), so we match
  // the known model ids against the end of each key instead of naive splitting.
  const modelList = models && models.length ? models : inferModels(daily, hourly);
  const splitKey = (key: string): { base: string; model: string } | null => {
    for (const m of modelList) {
      if (key === m) continue;
      if (key.endsWith(`_${m}`)) return { base: key.slice(0, key.length - m.length - 1), model: m };
    }
    // Single-model response: no suffix.
    return { base: key, model: modelList[0] ?? "default" };
  };

  const pickDaily = (model: string, base: string): number[] | undefined => {
    const arr =
      (daily?.[`${base}_${model}`] as number[]) ??
      (modelList.length === 1 ? (daily?.[base] as number[]) : undefined);
    return Array.isArray(arr) ? arr : undefined;
  };
  const pickHourly = (model: string, base: string): number[] | undefined => {
    const arr =
      (hourly?.[`${base}_${model}`] as number[]) ??
      (modelList.length === 1 ? (hourly?.[base] as number[]) : undefined);
    return Array.isArray(arr) ? arr : undefined;
  };

  const days = dates.map((date, i) => {
    const modelsOut: Record<string, any> = {};
    for (const s of modelList) {
      const tmax = pickDaily(s, "temperature_2m_max")?.[i];
      const tmin = pickDaily(s, "temperature_2m_min")?.[i];
      const psum = pickDaily(s, "precipitation_sum")?.[i];
      const pprob = pickDaily(s, "precipitation_probability_max")?.[i];
      const cape = pickDaily(s, "cape")?.[i] ?? pickHourly(s, "cape")?.[i];
      const gust = pickDaily(s, "wind_gusts_10m_max")?.[i] ?? pickHourly(s, "wind_gusts_10m")?.[i];
      modelsOut[s] = {
        temp_max: num(tmax),
        temp_min: num(tmin),
        precip_sum: num(psum),
        precip_prob_max: num(pprob),
        cape_max: num(cape),
        gust_max: num(gust),
        precip_hours: 0,
        thunderstorm_hours: 0,
      };
    }
    return { date, models: modelsOut };
  });

  // Hourly event counts (per model, over the whole window).
  if (hourly?.time) {
    const times = hourly.time as string[];
    const n = times.length;
    for (const s of modelList) {
      const wc = pickHourly(s, "weather_code");
      const precip = pickHourly(s, "precipitation");
      if (!wc) continue;
      for (let i = 0; i < n; i++) {
        const code = num(wc[i]);
        const p = num(precip?.[i]);
        const dayIdx = dates.findIndex((d) => times[i]?.startsWith(d));
        if (dayIdx < 0) continue;
        const m = days[dayIdx]?.models[s];
        if (!m) continue;
        if (p !== null && p !== undefined && p > 0) m.precip_hours++;
        if (code !== null && code !== undefined && code >= 80 && code <= 99) m.thunderstorm_hours++;
      }
    }
  }

  return {
    location: {
      latitude: raw?.latitude,
      longitude: raw?.longitude,
      elevation: raw?.elevation,
      timezone: raw?.timezone ?? "unknown",
    },
    days,
  };
}

/** Best-effort model discovery when the caller didn't pass the list. */
function inferModels(daily: any, hourly: any): string[] {
  const found = new Set<string>();
  const scan = (obj: any) => {
    if (!obj) return;
    for (const k of Object.keys(obj)) {
      if (k === "time") continue;
      const m = k.match(/_([a-z0-9]+_[a-z0-9]+)$/i) ?? k.match(/_([a-z0-9]+)$/i);
      if (m) found.add(m[1]);
    }
  };
  scan(daily);
  scan(hourly);
  return [...found];
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && !Number.isNaN(v) ? v : undefined;
}

export function registerSummaries(server: McpServer) {
  server.registerTool(
    "open_meteo_forecast_summary",
    {
      title: "Open-Meteo Forecast Summary (compact)",
      description:
        "Same call as open_meteo_forecast but returns a COMPACT per-model daily summary (temp max/min, precip sum, precip-prob max, CAPE max, gust max, thunderstorm/precip hour counts) instead of the full hourly grid. Use this instead of the raw forecast to save ~90% context when you only need the report-level numbers. Raw hourly stays available via open_meteo_forecast for Level 2/3 deep dives.",
      inputSchema: {
        ...latLon,
        ...openMeteoCommon,
        models: z.string().optional().describe("Comma-separated model list, e.g. ecmwf_ifs04,icon_seamless,gfs_seamless"),
        hourly: z.string().optional().describe("Comma-separated hourly variables (need weather_code + precipitation for event counts)"),
        daily: z.string().optional().describe("Comma-separated daily variables"),
        current: z.string().optional().describe("Comma-separated current variables"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ latitude, longitude, models, hourly, daily, current, timezone, past_days, forecast_days }) => {
      const raw = await apiGet("https://api.open-meteo.com/v1/forecast", {
        latitude,
        longitude,
        models: models ? models.split(",").map((x) => x.trim()).filter(Boolean) : undefined,
        hourly: hourly
          ? hourly.split(",").map((x) => x.trim()).filter(Boolean)
          : ["temperature_2m", "precipitation", "weather_code", "cape", "wind_gusts_10m"],
        daily: daily
          ? daily.split(",").map((x) => x.trim()).filter(Boolean)
          : [
              "temperature_2m_max",
              "temperature_2m_min",
              "precipitation_sum",
              "precipitation_probability_max",
            ],
        current: current ? current.split(",").map((x) => x.trim()).filter(Boolean) : undefined,
        timezone,
        past_days,
        forecast_days,
      });
      if (!raw.ok) return toToolResult(raw);
      const modelList = models ? models.split(",").map((x) => x.trim()).filter(Boolean) : undefined;
      const summary = summarizeForecast(raw.data, modelList);
      const result: ApiResult = { ...raw, data: summary };
      return toToolResult(result);
    }
  );
}
