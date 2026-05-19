## 2025-05-15 — [Structural] Restored Missing Reference Infrastructure

**Learning:** Discovered that several core reference files (`nowcasting_radar.md`, `uv_marine_recent.md`) cited in `SKILL.md` were missing from the repository, and one (`event_reliability.md`) had a critical typo in its filename. This broke the "progressive disclosure" pattern where `SKILL.md` remains lean and relies on `references/` for depth.

**Action:** Always perform a "Broken Link Audit" during the initial AUDIT phase by grepping `SKILL.md` for all `references/*.md` calls and verifying their existence/correct naming. Fix typos and restore missing boilerplate immediately to ensure the agent has the necessary thresholds for interpretation.

## 2025-05-16 — [Accuracy] Aligned Data Fetch with Interpretation Logic
Learning: Adding interpretation logic for complex phenomena (e.g., Cuscino Freddo, Gelicidio) is only effective if the data acquisition layer (SKILL.md) is updated to fetch all required variables (pressure_msl, wind_direction_850hPa). Logic without data is non-functional.
Action: Perform a "Data Coverage Audit" when adding new phenomena: cross-check every threshold/signal in the reference file against the API parameter list in SKILL.md.

## 2025-05-17 — [Accuracy] Parameter Naming and Data Alignment
Learning: Open-Meteo API is strict with parameter names (e.g., 'dewpoint_2m' vs 'dew_point_2m'). Additionally, complex Italian phenomena detection (V-Shaped storms, Foehn, Gelicidio) requires specific upper-air data (500hPa, 850hPa geopotential) and surface moisture/snow variables that were missing in the primary fetch workflow.
Action: Always verify the exact parameter names in the Open-Meteo documentation before implementation. Ensure that the Step 3 fetch list in SKILL.md provides all variables required by the detection logic in references/ (Data Coverage Audit).

## 2025-05-18 — [Accuracy] Detection of Maritime Advection Fog (Caligo/Lupa)
Learning: Discovered that "Nebbia Marittima" (advection fog) is a critical spring phenomenon in Italy (Liguria, Strait of Messina) that was missing from the skill. Its detection requires specific sea-surface temperature (SST) comparison against T2m, which is available in the Marine API fetch.
Action: Include SST in maritime/coastal analysis and apply the T(2m) > SST + 2°C threshold during March–May to identify Caligo and Lupa di mare events.

## 2025-05-19 — [Operational] DPC Radar API and ASE Phenomenon
Learning: Confirmed that the DPC Radar API endpoint 'type=SITES' is invalid (returns 404), while 'type=VMI' is the correct functional endpoint for checking the latest product availability. Also, identified the Adriatic Sea Effect (ASE) as a missing key phenomenon for the East Coast, requiring 850hPa humidity data for accurate detection.
Action: Updated SKILL.md to remove the failing 'type=SITES' call and added 850hPa/500hPa humidity to the primary fetch to support ASE and convective analysis.

## 2025-05-20 — [Accuracy] Agrometeorology and High-Res Global Models
Learning: Discovered that Open-Meteo provides 'ecmwf_ifs' as the primary 9km HRES global model (free), which is superior to the 25km 'ecmwf_ifs025' for Italy's complex terrain. Also identified 'Maccaja' and 'Burian' as critical missing patterns and integrated 'et0_fao_evapotranspiration' for agriculture.
Action: Promoted 'ecmwf_ifs' to primary global reference in weights and fetch logic. Added agrometeorological variables and detection logic for Ligurian maritime clouds (Maccaja) and Siberian cold (Burian).

## 2025-05-21 — [Accuracy] Standards for Sea State and Health
**Learning:** Found that generic Beaufort Scale usage often conflates wind force with wave height. In Italy, the Douglas Scale is the standard for sea state (wave height) vs wind force. Also confirmed 'Notti Tropicali' (Tmin > 20°C) as a key health indicator in Italian climate reports.
**Action:** Use Douglas Scale for `wave_height` interpretation and include Tropical Night flags when Tmin > 20°C to improve the operational utility of Marine and Health use cases.

## 2025-05-22 — [Accuracy] Soil Temperature and Climatology Data Limits
**Learning:** High-accuracy detection of winter ground-level phenomena (Gelicidio, Galaverna, Brina) requires 'soil_temperature_0cm' and 'soil_temperature_6cm' to distinguish surface freezing from air temperature. Additionally, the Open-Meteo Archive API has a 10,000-line limit per request; fetching 30 years of daily data (~10,950 lines) requires splitting the request into chunks.
**Action:** Add soil temperature variables to primary fetches. When fetching multi-decade daily climatology, split requests into 15-year chunks to avoid '400 Bad Request' and implement exponential backoff for '429 Too Many Requests'.
