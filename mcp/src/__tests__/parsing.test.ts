import { describe, it, expect } from "vitest";
import { parseRawMetar } from "../italian_sources.js";
import { inferModels } from "../summaries.js";
import { normalizeModelId } from "../reference_tools.js";

describe("parseRawMetar", () => {
  it("parses 4-digit visibility in meters", () => {
    const m = parseRawMetar("LIRF 201500Z 12015KT 6000 SCT020 BKN030 15/11");
    expect(m.visibility_statute_mi).toBeCloseTo(6000 / 1609.34, 2);
    expect(m.wind_speed_kt).toBe(15);
    expect(m.wind_dir_degrees).toBe(120);
  });

  it("CAVOK → unlimited visibility (null)", () => {
    const m = parseRawMetar("LIML 201500Z 24010KT CAVOK 18/12");
    expect(m.cavok).toBe(true);
    expect(m.visibility_statute_mi).toBeNull();
  });

  it("does NOT treat wind digits as visibility", () => {
    const m = parseRawMetar("LIPE 201500Z 35022KT 9999 BKN020 21/15");
    expect(m.wind_speed_kt).toBe(22);
    expect(m.visibility_statute_mi).toBeCloseTo(9999 / 1609.34, 1);
  });

  it("passes nwpTempC through so decodedVsNwp can compute the delta", () => {
    const m = parseRawMetar("LIRF 201500Z 12015KT 6000 SCT020 BKN030 15/11", 13.5);
    expect(m.temp_c).toBe(15);
  });
});

describe("inferModels", () => {
  it("handles multi-underscore ids without truncation", () => {
    const daily = { temperature_2m_max_metno_nve: [1], precipitation_sum_ukmo_seamless: [0] };
    const found = inferModels(daily, {});
    expect(found).toContain("metno_nve");
    expect(found).toContain("ukmo_seamless");
  });

  it("matches known Open-Meteo ids", () => {
    const hourly = { temperature_2m_ecmwf_ifs025: [1], wind_gusts_10m_icon_d2: [1] };
    const found = inferModels({}, hourly);
    expect(found).toEqual(expect.arrayContaining(["ecmwf_ifs025", "icon_d2"]));
  });
});

describe("normalizeModelId", () => {
  it("unifies dash and underscore", () => {
    expect(normalizeModelId("icon-EU")).toBe("icon_eu");
    expect(normalizeModelId("meteo-France-AROME")).toBe("meteo_france_arome");
  });
});
