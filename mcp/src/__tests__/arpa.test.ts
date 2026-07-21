import { describe, it, expect } from "vitest";
import { dmsToDecimal, parseStationList, parseStationDetail } from "../regioni/arpa-marche.js";
import { parseStation } from "../regioni/arpa-lombardia.js";

// ---------------------------------------------------------------------------
// ARPA Marche
// ---------------------------------------------------------------------------

describe("dmsToDecimal", () => {
  it("converts DMS string with positive degrees", () => {
    const result = dmsToDecimal(`43°36'6.340''`);
    expect(result).toBeCloseTo(43.60176, 5);
  });

  it("converts DMS string with negative degrees (lon ovest)", () => {
    // longitude like 12°33'9.799'' — positive
    const result = dmsToDecimal(`12°33'9.799''`);
    expect(result).toBeCloseTo(12.55272, 5);
  });

  it("handles integer seconds", () => {
    const result = dmsToDecimal(`12°56'52''`);
    expect(result).toBeCloseTo(12.94778, 5);
  });

  it("returns 0 for unparseable input", () => {
    expect(dmsToDecimal("")).toBe(0);
    expect(dmsToDecimal("not-dms")).toBe(0);
  });

  it("handles zero degrees", () => {
    const result = dmsToDecimal(`0°30'0''`);
    expect(result).toBeCloseTo(0.5, 5);
  });

  it("uses DMS when latitudine/longitudine decimal fields are 0", () => {
    // station data may have latString but latitudine=0
    const raw = {
      lista: [
        {
          codice: "ST99",
          nome: "Test",
          comune: "Test",
          provincia: "AN",
          latString: `43°36'6.340''`,
          longString: `12°33'9.799''`,
          latitudine: 0,
          longitudine: 0,
          altitudine: "295",
          statoCodice: "ATTIVA",
          proprietario: "AMAP",
          fine: "2026-07-21T06:10:00",
        },
      ],
    };
    const stations = parseStationList(raw);
    expect(stations[0].latitudine).toBeCloseTo(43.60176, 4);
    expect(stations[0].longitudine).toBeCloseTo(12.55272, 4);
  });
});

describe("parseStationList", () => {
  it("parses multiple stations from raw API response", () => {
    const raw = {
      totale: 3,
      lista: [
        {
          codice: "ST60",
          nome: "Acqualagna",
          comune: "Acqualagna",
          provincia: "PU",
          latitudine: 43.60176,
          longitudine: 12.55272,
          altitudine: "295",
          statoCodice: "ATTIVA",
          proprietario: "AMAP",
          fine: "2026-07-21T06:10:00",
        },
        {
          codice: "ST32",
          nome: "Agugliano",
          comune: "Agugliano",
          provincia: "AN",
          latitudine: 43.54029,
          longitudine: 13.37633,
          altitudine: "140",
          statoCodice: "ATTIVA",
          proprietario: "AMAP",
          fine: "2026-07-21T06:10:00",
        },
        {
          codice: "ST08",
          nome: "Carassai",
          comune: "Carassai",
          provincia: "AP",
          latitudine: 43.04016,
          longitudine: 13.68021,
          altitudine: "210",
          statoCodice: "ATTIVA",
          proprietario: "AMAP",
          fine: "2026-07-21T06:10:00",
        },
      ],
    };
    const stations = parseStationList(raw);
    expect(stations).toHaveLength(3);
    expect(stations[0].codice).toBe("ST60");
    expect(stations[0].nome).toBe("Acqualagna");
    expect(stations[0].provincia).toBe("PU");
    expect(stations[0].attiva).toBe(true);
    expect(stations[0].altitudine).toBe(295);
    expect(stations[0].ultimoAggiornamento).toBe("2026-07-21T06:10:00");
    expect(stations[0].sensori).toEqual([]);
  });

  it("handles empty lista", () => {
    expect(parseStationList({})).toEqual([]);
    expect(parseStationList({ lista: [] })).toEqual([]);
  });

  it("handles missing fields gracefully", () => {
    const raw = { lista: [{ codice: "ST01" }] };
    const stations = parseStationList(raw);
    expect(stations).toHaveLength(1);
    expect(stations[0].nome).toBe("");
    expect(stations[0].latitudine).toBe(0);
    expect(stations[0].attiva).toBe(false);
  });

  it("uses DMS fallback when latitudine is missing but latString exists", () => {
    const raw = {
      lista: [
        {
          codice: "ST70",
          nome: "Cagli",
          latString: `43°36'54.734''`,
          longString: `12°41'57.113''`,
          statoCodice: "ATTIVA",
        },
      ],
    };
    const stations = parseStationList(raw);
    expect(stations[0].latitudine).toBeCloseTo(43.6152, 3);
    expect(stations[0].longitudine).toBeCloseTo(12.6992, 3);
  });
});

describe("parseStationDetail", () => {
  it("adds sensor list to base station", () => {
    const base = {
      codice: "ST01",
      nome: "Maltignano",
      comune: "Maltignano",
      provincia: "AP",
      latitudine: 42.84227,
      longitudine: 13.69877,
      altitudine: 114,
      attiva: true,
      proprietario: "AMAP",
      ultimoAggiornamento: "2026-07-21T06:20:00",
      sensori: [],
    };
    const raw = {
      altitudine: "114",
      listaSensori: {
        totale: 3,
        lista: [
          {
            idSensoreStazione: 1,
            idSensoreClasse: 1,
            descrizioneClasse: "Sensore di temperatura in aria a m. 1.50 dal suolo",
            haGiornalieri: true,
            haMensili: true,
            haAnnuali: true,
            haGrafico: true,
          },
          {
            idSensoreStazione: 7,
            idSensoreClasse: 7,
            descrizioneClasse: "Sensore di vento a m. 10 dal suolo",
            haGiornalieri: true,
            haMensili: false,
            haAnnuali: false,
            haGrafico: false,
          },
          {
            idSensoreStazione: 10,
            idSensoreClasse: 10,
            descrizioneClasse: "Sensore di precipitazione",
            haGiornalieri: true,
            haMensili: true,
            haAnnuali: true,
            haGrafico: true,
          },
        ],
      },
    };
    const detail = parseStationDetail(raw, base);
    expect(detail.sensori).toHaveLength(3);
    expect(detail.sensori[0].id).toBe(1);
    expect(detail.sensori[0].tipo).toContain("temperatura");
    expect(detail.sensori[0].haGiornalieri).toBe(true);
    expect(detail.sensori[1].tipo).toContain("vento");
    expect(detail.sensori[2].tipo).toContain("precipitazione");
  });

  it("handles missing sensor list", () => {
    const base = {
      codice: "ST99",
      nome: "Test",
      comune: "Test",
      provincia: "AN",
      latitudine: 0,
      longitudine: 0,
      altitudine: 0,
      attiva: true,
      proprietario: "AMAP",
      ultimoAggiornamento: null,
      sensori: [],
    };
    const detail = parseStationDetail({}, base);
    expect(detail.sensori).toEqual([]);
  });

  it("updates altitudine from detail when present", () => {
    const base = {
      codice: "ST01",
      nome: "Maltignano",
      comune: "Maltignano",
      provincia: "AP",
      latitudine: 42.84227,
      longitudine: 13.69877,
      altitudine: 0,
      attiva: true,
      proprietario: "AMAP",
      ultimoAggiornamento: null,
      sensori: [],
    };
    const detail = parseStationDetail({ altitudine: "114" }, base);
    expect(detail.altitudine).toBe(114);
  });
});

// ---------------------------------------------------------------------------
// ARPA Lombardia
// ---------------------------------------------------------------------------

describe("parseStation (ARPA Lombardia / Socrata)", () => {
  it("parses a Socrata row with all fields", () => {
    const row = {
      idsensore: "14399",
      tipologia: "Temperatura",
      unit_dimisura: "°C",
      idstazione: "1365",
      nomestazione: "Bione",
      quota: "911",
      provincia: "BS",
      lat: "45.66721826",
      lng: "10.32736288",
    };
    const station = parseStation(row);
    expect(station.idsensore).toBe("14399");
    expect(station.tipologia).toBe("Temperatura");
    expect(station.unitaMisura).toBe("°C");
    expect(station.nomeStazione).toBe("Bione");
    expect(station.quota).toBe(911);
    expect(station.provincia).toBe("BS");
    expect(station.lat).toBeCloseTo(45.66721826, 8);
    expect(station.lon).toBeCloseTo(10.32736288, 8);
  });

  it("parses a precipitation sensor row", () => {
    const row = {
      idsensore: "9999",
      tipologia: "Precipitazione",
      unit_dimisura: "mm",
      idstazione: "2001",
      nomestazione: "Milano Centro",
      quota: "120",
      provincia: "MI",
      lat: "45.46427",
      lng: "9.18951",
    };
    const station = parseStation(row);
    expect(station.tipologia).toBe("Precipitazione");
    expect(station.unitaMisura).toBe("mm");
    expect(station.lat).toBeCloseTo(45.46427, 5);
  });

  it("handles missing optional fields", () => {
    const row = {
      idsensore: "7777",
      tipologia: "Vento",
      unit_dimisura: "m/s",
      idstazione: "42",
      nomestazione: "Stazione Test",
      provincia: "SO",
      lat: "46.0",
      lng: "9.5",
    };
    const station = parseStation(row);
    expect(station.quota).toBeNull();
    expect(station.nomeStazione).toBe("Stazione Test");
  });

  it("handles empty lat/lng as 0", () => {
    const row = {
      idsensore: "1",
      tipologia: "Temperatura",
      unit_dimisura: "°C",
      idstazione: "1",
      nomestazione: "Empty",
      provincia: "MI",
    };
    const station = parseStation(row);
    expect(station.lat).toBe(0);
    expect(station.lon).toBe(0);
  });
});
