import { z } from "zod";

export const DEBUG_PORT = Number(process.env.METEO_MCP_DEBUG_PORT ?? 3000);
export const CHECKWX_API_KEY = process.env.CHECKWX_API_KEY ?? "";

export interface ApiResult {
  [key: string]: unknown;
  ok: boolean;
  url: string;
  status: number;
  /** Parsed JSON when available, otherwise raw text. */
  data: unknown;
  error?: string;
  /** Timing in ms, useful for the debug page. */
  elapsedMs: number;
}

/**
 * Perform a GET request and normalize the result so every tool returns a
 * consistent shape the MCP client and the debug web page can both consume.
 */
export async function apiGet(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined | string[]>,
  opts: { headers?: Record<string, string>; acceptText?: boolean } = {}
): Promise<ApiResult> {
  const url = buildUrl(baseUrl, params);
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "meteo-italia-mcp/1.0",
        Accept: opts.acceptText ? "text/plain, */*" : "application/json, */*",
        ...(opts.headers ?? {}),
      },
    });
    const elapsedMs = Date.now() - start;
    const text = await res.text();
    if (!res.ok) {
      return {
        ok: false,
        url,
        status: res.status,
        data: text.slice(0, 2000),
        error: `HTTP ${res.status}: ${text.slice(0, 300)}`,
        elapsedMs,
      };
    }
    let data: unknown = text;
    if (!opts.acceptText) {
      try {
        data = text.length ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
    }
    return { ok: true, url, status: res.status, data, elapsedMs };
  } catch (err) {
    return {
      ok: false,
      url,
      status: 0,
      data: null,
      error: err instanceof Error ? err.message : String(err),
      elapsedMs: Date.now() - start,
    };
  }
}

/** POST with a JSON body (used by DPC radar downloadProduct). */
export async function apiPostJson(
  url: string,
  body: unknown,
  opts: { headers?: Record<string, string> } = {}
): Promise<ApiResult> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "User-Agent": "meteo-italia-mcp/1.0",
        "Content-Type": "application/json",
        Accept: "application/json, */*",
        ...(opts.headers ?? {}),
      },
      body: JSON.stringify(body),
    });
    const elapsedMs = Date.now() - start;
    const text = await res.text();
    if (!res.ok) {
      return {
        ok: false,
        url,
        status: res.status,
        data: text.slice(0, 2000),
        error: `HTTP ${res.status}: ${text.slice(0, 300)}`,
        elapsedMs,
      };
    }
    let data: unknown = text;
    try {
      data = text.length ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return { ok: true, url, status: res.status, data, elapsedMs };
  } catch (err) {
    return {
      ok: false,
      url,
      status: 0,
      data: null,
      error: err instanceof Error ? err.message : String(err),
      elapsedMs: Date.now() - start,
    };
  }
}

export function buildUrl(
  base: string,
  params: Record<string, string | number | boolean | undefined | string[]>
): string {
  const u = new URL(base);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "") continue;
    if (Array.isArray(v)) {
      // Repeated params (e.g. models=ecmwf&models=icon_seamless) — accepted
      // by every Open-Meteo endpoint, unlike comma-joined model lists.
      for (const item of v) {
        if (item !== undefined && item !== "") u.searchParams.append(k, String(item));
      }
    } else {
      u.searchParams.set(k, String(v));
    }
  }
  return u.toString();
}

/** Format an ApiResult as MCP tool content (text + structured). */
export function toToolResult(result: ApiResult) {
  const text = JSON.stringify(result, null, 2);
  return {
    content: [{ type: "text" as const, text }],
    structuredContent: result,
    isError: !result.ok,
  };
}

/** Common query-string params shared by every Open-Meteo endpoint. */
export const openMeteoCommon = {
  timezone: z.string().default("Europe/Rome").describe("IANA timezone, default Europe/Rome"),
  past_days: z.coerce.number().int().min(0).max(92).optional().describe("Days of past data to include"),
  forecast_days: z.coerce.number().int().min(1).max(16).optional().describe("Days of forecast (1-16)"),
};

export const latLon = {
  latitude: z.coerce.number().min(-90).max(90).describe("Latitude in decimal degrees"),
  longitude: z.coerce.number().min(-180).max(180).describe("Longitude in decimal degrees"),
};
