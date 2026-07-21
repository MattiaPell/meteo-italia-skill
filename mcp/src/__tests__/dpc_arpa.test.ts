import { describe, it, expect } from "vitest";
import { alertLevelFromText, extractZoneRegionMap } from "../dpc.js";
import { parseArpavIdroXml } from "../regioni/arpav.js";
import { parseMeteoTrentinoStations, parseMeteoTrentinoObs } from "../regioni/meteotrentino.js";
import { parseMetarStation } from "../italian_sources.js";

describe("alertLevelFromText", () => {
  it("maps official bulletin texts to 0-3", () => {
    expect(alertLevelFromText("Assenza di fenomeni significativi prevedibili / NESSUNA ALLERTA")).toBe(0);
    expect(alertLevelFromText("Ordinaria criticità per rischio temporali / Allerta gialla")).toBe(1);
    expect(alertLevelFromText("Moderata criticità per rischio idrogeologico / Allerta arancione")).toBe(2);
    expect(alertLevelFromText("Elevata criticità per rischio idraulico / Allerta rossa")).toBe(3);
  });
});

describe("extractZoneRegionMap", () => {
  it("builds zona → regione from the bulletin HTML", () => {
    const html =
      "<p>Per la giornata di oggi:<br/><b>ORDINARIA CRITICITA' PER RISCHIO TEMPORALI / ALLERTA GIALLA:</b><br /><b>Emilia Romagna</b>: Costa romagnola, Pianura bolognese<br /><b>Lombardia</b>: Orobie bergamasche<br /></p>";
    const map = extractZoneRegionMap(html);
    expect(map.get("costa romagnola")).toBe("Emilia Romagna");
    expect(map.get("orobie bergamasche")).toBe("Lombardia");
    expect(map.has("ordinaria criticita' per rischio temporali / allerta gialla:")).toBe(false);
  });
});

describe("parseArpavIdroXml", () => {
  it("parses station blocks with last value and 6h trend", () => {
    const mk = (h: string, v: string) => `<DATI ISTANTE="${h}"><VM>${v}</VM></DATI>`;
    const dati = Array.from({ length: 40 }, (_, i) => mk(`2026072100${String(i).padStart(2, "0")}`, i < 37 ? "0.50" : "0.80")).join("");
    const xml = `<CONTENITORE><STAZIONE><IDSTAZ>6</IDSTAZ><NOME><![CDATA[Adige a Verona]]></NOME><X>10.99</X><Y>45.44</Y><QUOTA>60</QUOTA><TIPOSTAZ>IDRO</TIPOSTAZ><PROVINCIA>VR</PROVINCIA><COMUNE><![CDATA[VERONA]]></COMUNE>${dati}</STAZIONE></CONTENITORE>`;
    const s = parseArpavIdroXml(xml);
    expect(s).toHaveLength(1);
    expect(s[0].nome).toBe("Adige a Verona");
    expect(s[0].provincia).toBe("VR");
    expect(s[0].livelloM).toBe(0.8);
    expect(s[0].livello6hFaM).toBe(0.5);
    expect(s[0].trend).toBe("salita");
  });

  it("marks trend as stabile when delta < 0.01", () => {
    const mk = (h: string, v: string) => `<DATI ISTANTE="${h}"><VM>${v}</VM></DATI>`;
    const dati = Array.from({ length: 40 }, (_, i) => mk(`2026072100${String(i).padStart(2, "0")}`, "1.00")).join("");
    const xml = `<CONTENITORE><STAZIONE><IDSTAZ>1</IDSTAZ><NOME>Staz Stabile</NOME><X>11.0</X><Y>45.0</Y><QUOTA>50</QUOTA><PROVINCIA>VI</PROVINCIA><COMUNE>Comune</COMUNE>${dati}</STAZIONE></CONTENITORE>`;
    const s = parseArpavIdroXml(xml);
    expect(s[0].trend).toBe("stabile");
  });

  it("handles CDATA in nome and comune", () => {
    const xml = `<CONTENITORE><STAZIONE><IDSTAZ>12</IDSTAZ><NOME><![CDATA[Adige a Boara Pisani]]></NOME><X>11.8</X><Y>45.1</Y><PROVINCIA>PD</PROVINCIA><COMUNE><![CDATA[BOARA PISANI]]></COMUNE><DATI ISTANTE="202607211200"><VM>1.23</VM></DATI></STAZIONE></CONTENITORE>`;
    const s = parseArpavIdroXml(xml);
    expect(s[0].nome).toBe("Adige a Boara Pisani");
    expect(s[0].comune).toBe("BOARA PISANI");
  });

  it("skips stations with no DATI blocks", () => {
    const xml = `<CONTENITORE><STAZIONE><IDSTAZ>99</IDSTAZ><NOME>Empty</NOME><X>11.0</X><Y>45.0</Y><PROVINCIA>VR</PROVINCIA><COMUNE>VERONA</COMUNE></STAZIONE></CONTENITORE>`;
    expect(parseArpavIdroXml(xml)).toHaveLength(0);
  });
});

describe("parseMeteoTrentinoStations", () => {
  it("keeps only active stations (no <fine>)", () => {
    const xml = `<ArrayOfAnagrafica>
      <anagrafica><codice>T0154</codice><nome>Ala (Convento)</nome><nomebreve>Ala</nomebreve><quota>165</quota><latitudine>45.75</latitudine><longitudine>10.99</longitudine><fine>22/06/2005</fine></anagrafica>
      <anagrafica><codice>T0383</codice><nome>Trento</nome><nomebreve>Trento</nomebreve><quota>200</quota><latitudine>46.06</latitudine><longitudine>11.12</longitudine><fine></fine></anagrafica>
    </ArrayOfAnagrafica>`;
    const s = parseMeteoTrentinoStations(xml);
    expect(s).toHaveLength(1);
    expect(s[0].codice).toBe("T0383");
  });

  it("skips stations with missing lat/lon", () => {
    const xml = `<ArrayOfAnagrafica>
      <anagrafica><codice>T001</codice><nome>No Coord</nome><latitudine></latitudine><longitudine></longitudine></anagrafica>
      <anagrafica><codice>T002</codice><nome>Ok</nome><latitudine>46.0</latitudine><longitudine>11.0</longitudine></anagrafica>
    </ArrayOfAnagrafica>`;
    const s = parseMeteoTrentinoStations(xml);
    expect(s).toHaveLength(1);
    expect(s[0].codice).toBe("T002");
  });

  it("uses nomebreve when available, falls back to nome", () => {
    const xml = `<ArrayOfAnagrafica>
      <anagrafica><codice>T001</codice><nome>Ala (Convento) lungo</nome><nomebreve>Ala</nomebreve><latitudine>45.75</latitudine><longitudine>10.99</longitudine></anagrafica>
      <anagrafica><codice>T002</codice><nome>NomeSolo</nome><latitudine>46.0</latitudine><longitudine>11.0</longitudine></anagrafica>
    </ArrayOfAnagrafica>`;
    const s = parseMeteoTrentinoStations(xml);
    expect(s[0].nome).toBe("Ala");
    expect(s[1].nome).toBe("NomeSolo");
  });

  it("returns empty array when no active stations", () => {
    const xml = `<ArrayOfAnagrafica>
      <anagrafica><codice>T001</codice><nome>Closed</nome><latitudine>46.0</latitudine><longitudine>11.0</longitudine><fine>22/06/2005</fine></anagrafica>
    </ArrayOfAnagrafica>`;
    expect(parseMeteoTrentinoStations(xml)).toHaveLength(0);
  });
});

describe("parseMeteoTrentinoObs", () => {
  it("extracts tmin/tmax/rain, last temperature and precip sum", () => {
    const xml = `<datiOggi><data>2026/07/21</data><tmin>14</tmin><tmax>24</tmax><rain>0.8</rain>
      <temperature>
        <temperatura_aria UM="°C"><data>2026-07-20T00:00:00</data><temperatura>15.6</temperatura></temperatura_aria>
        <temperatura_aria UM="°C"><data>2026-07-20T00:15:00</data><temperatura>16.1</temperatura></temperatura_aria>
      </temperature>
      <precipitazioni>
        <precipitazione UM="mm"><data>2026-07-20T00:00:00</data><pioggia>0.2</pioggia></precipitazione>
        <precipitazione UM="mm"><data>2026-07-20T00:15:00</data><pioggia>0.6</pioggia></precipitazione>
      </precipitazioni>
    </datiOggi>`;
    const o = parseMeteoTrentinoObs(xml);
    expect(o.tmin).toBe(14);
    expect(o.tmax).toBe(24);
    expect(o.lastTempC).toBe(16.1);
    expect(o.precipSumMm).toBeCloseTo(0.8, 5);
  });

  it("returns nulls when XML is empty", () => {
    const o = parseMeteoTrentinoObs("<datiOggi></datiOggi>");
    expect(o.tmin).toBeNull();
    expect(o.tmax).toBeNull();
    expect(o.rainMm).toBeNull();
    expect(o.lastTempC).toBeNull();
    expect(o.precipSumMm).toBeNull();
  });

  it("handles missing temperature blocks", () => {
    const xml = `<datiOggi><tmin>10</tmin><tmax>20</tmax><rain>0</rain></datiOggi>`;
    const o = parseMeteoTrentinoObs(xml);
    expect(o.tmin).toBe(10);
    expect(o.lastTempC).toBeNull();
    expect(o.precipSumMm).toBeNull();
  });
});

describe("parseMetarStation (aviationweather JSON)", () => {
  it("parses the real aviationweather.gov shape", () => {
    const raw = {
      icaoId: "LIPZ", temp: 29, dewp: 16, wdir: 130, wspd: 4,
      visib: "6+", altim: 1014, cover: "CAVOK", fltCat: "VFR",
      rawOb: "METAR LIPZ 211250Z 13004KT CAVOK 29/16 Q1014 NOSIG",
    };
    const s = parseMetarStation(raw, 30);
    expect(s.icao).toBe("LIPZ");
    expect(s.tempC).toBe(29);
    expect(s.windKt).toBe(4);
    expect(s.windDir).toBe(130);
    expect(s.visibilityM).toBe(Math.round(6 * 1609.34));
    expect(s.qnhHpa).toBe(1014);
    expect(s.skyCover).toBe("CAVOK");
    expect(s.decodedVsNwp.tempScarto).toBe(1);
  });
});
