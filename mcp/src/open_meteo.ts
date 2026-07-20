import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiGet, toToolResult, openMeteoCommon, latLon } from "./http.js";

const csv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export function registerOpenMeteo(server: McpServer) {
  // --- Geocoding ---------------------------------------------------------
  server.registerTool(
    "open_meteo_geocode",
    {
      title: "Open-Meteo Geocoding",
      description:
        "Resolve a place name to coordinates. Returns results filtered to Italy when possible, with lat/lon, elevation and admin region. Use this before any forecast call.",
      inputSchema: {
        name: z.string().describe("City or place name to search"),
        count: z.coerce.number().int().min(1).max(50).default(10).describe("Max results"),
        language: z.string().default("it").describe("Response language"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ name, count, language }) => {
      const r = await apiGet("https://geocoding-api.open-meteo.com/v1/search", {
        name,
        count,
        language,
        format: "json",
      });
      return toToolResult(r);
    }
  );

  // --- Forecast (TIER 1, LIVELLI 1-3) -----------------------------------
  server.registerTool(
    "open_meteo_forecast",
    {
      title: "Open-Meteo Forecast",
      description:
        "Multi-model numerical forecast. Pass models (comma list), hourly variables, daily variables. Supports past_days and forecast_days. Core call for the skill's Step A.",
      inputSchema: {
        ...latLon,
        ...openMeteoCommon,
        models: z.string().optional().describe("Comma-separated model list, e.g. ecmwf,icon_seamless,gfs025"),
        hourly: z.string().optional().describe("Comma-separated hourly variables"),
        daily: z.string().optional().describe("Comma-separated daily variables"),
        current: z.string().optional().describe("Comma-separated current variables"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ latitude, longitude, models, hourly, daily, current, timezone, past_days, forecast_days }) => {
      const r = await apiGet("https://api.open-meteo.com/v1/forecast", {
        latitude,
        longitude,
        models: models ? csv(models) : undefined,
        hourly: hourly ? csv(hourly) : undefined,
        daily: daily ? csv(daily) : undefined,
        current: current ? csv(current) : undefined,
        timezone,
        past_days,
        forecast_days,
      });
      return toToolResult(r);
    }
  );

  // --- Archive / ERA5 climatology (Step B) ------------------------------
  server.registerTool(
    "open_meteo_archive",
    {
      title: "Open-Meteo Archive (ERA5)",
      description:
        "Historical reanalysis (ERA5) for climatology baselines. Provide start_date and end_date (YYYY-MM-DD). Used by skill Step B.",
      inputSchema: {
        ...latLon,
        start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Start date YYYY-MM-DD"),
        end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("End date YYYY-MM-DD"),
        daily: z.string().optional().describe("Comma-separated daily variables"),
        hourly: z.string().optional().describe("Comma-separated hourly variables"),
        timezone: z.string().default("Europe/Rome"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ latitude, longitude, start_date, end_date, daily, hourly, timezone }) => {
      const r = await apiGet("https://archive-api.open-meteo.com/v1/archive", {
        latitude,
        longitude,
        start_date,
        end_date,
        daily: daily ? csv(daily) : undefined,
        hourly: hourly ? csv(hourly) : undefined,
        timezone,
      });
      return toToolResult(r);
    }
  );

  // --- Marine (Step F) --------------------------------------------------
  server.registerTool(
    "open_meteo_marine",
    {
      title: "Open-Meteo Marine",
      description:
        "Marine weather: wave height/direction/period, SST. Activate for coastal/nautical use cases (skill Step F).",
      inputSchema: {
        ...latLon,
        ...openMeteoCommon,
        hourly: z.string().optional().describe("Comma-separated hourly marine variables"),
        daily: z.string().optional().describe("Comma-separated daily marine variables"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ latitude, longitude, hourly, daily, timezone, past_days, forecast_days }) => {
      const r = await apiGet("https://marine-api.open-meteo.com/v1/marine", {
        latitude,
        longitude,
        hourly: hourly ? csv(hourly) : undefined,
        daily: daily ? csv(daily) : undefined,
        timezone,
        past_days,
        forecast_days,
      });
      return toToolResult(r);
    }
  );

  // --- Air Quality / CAMS (Step H) --------------------------------------
  server.registerTool(
    "open_meteo_air_quality",
    {
      title: "Open-Meteo Air Quality (CAMS)",
      description:
        "European air quality (CAMS): PM10/PM2.5, NO2, O3, SO2, CO, dust, European AQI, pollen. Used by skill Step H.",
      inputSchema: {
        ...latLon,
        ...openMeteoCommon,
        hourly: z.string().optional().describe("Comma-separated hourly AQ variables"),
        current: z.string().optional().describe("Comma-separated current AQ variables"),
        domains: z.string().default("cams_europe").describe("Model domain, default cams_europe"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ latitude, longitude, hourly, current, domains, timezone, past_days, forecast_days }) => {
      const r = await apiGet("https://air-quality-api.open-meteo.com/v1/air-quality", {
        latitude,
        longitude,
        hourly: hourly ? csv(hourly) : undefined,
        current: current ? csv(current) : undefined,
        domains,
        timezone,
        past_days,
        forecast_days,
      });
      return toToolResult(r);
    }
  );

  // --- Ensemble (Step J) ------------------------------------------------
  server.registerTool(
    "open_meteo_ensemble",
    {
      title: "Open-Meteo Ensemble",
      description:
        "Ensemble probabilistic forecasts with spread (sigma between members). Used by skill Step J for uncertainty.",
      inputSchema: {
        ...latLon,
        ...openMeteoCommon,
        models: z.string().optional().describe("Comma-separated ensemble models"),
        hourly: z.string().optional().describe("Comma-separated hourly variables (include _spread vars)"),
        daily: z.string().optional().describe("Comma-separated daily variables"),
      },
      outputSchema: { ok: z.boolean(), url: z.string(), status: z.number(), data: z.unknown(), elapsedMs: z.number() },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ latitude, longitude, models, hourly, daily, timezone, past_days, forecast_days }) => {
      const r = await apiGet("https://ensemble-api.open-meteo.com/v1/ensemble", {
        latitude,
        longitude,
        models: models ? csv(models) : undefined,
        hourly: hourly ? csv(hourly) : undefined,
        daily: daily ? csv(daily) : undefined,
        timezone,
        past_days,
        forecast_days,
      });
      return toToolResult(r);
    }
  );
}
