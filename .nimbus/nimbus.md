## 2025-05-15 — [Structural] Restored Missing Reference Infrastructure

**Learning:** Discovered that several core reference files (`nowcasting_radar.md`, `uv_marine_recent.md`) cited in `SKILL.md` were missing from the repository, and one (`event_reliability.md`) had a critical typo in its filename. This broke the "progressive disclosure" pattern where `SKILL.md` remains lean and relies on `references/` for depth.

**Action:** Always perform a "Broken Link Audit" during the initial AUDIT phase by grepping `SKILL.md` for all `references/*.md` calls and verifying their existence/correct naming. Fix typos and restore missing boilerplate immediately to ensure the agent has the necessary thresholds for interpretation.

## 2025-05-16 — [Accuracy] Aligned Data Fetch with Interpretation Logic
Learning: Adding interpretation logic for complex phenomena (e.g., Cuscino Freddo, Gelicidio) is only effective if the data acquisition layer (SKILL.md) is updated to fetch all required variables (pressure_msl, wind_direction_850hPa). Logic without data is non-functional.
Action: Perform a "Data Coverage Audit" when adding new phenomena: cross-check every threshold/signal in the reference file against the API parameter list in SKILL.md.
