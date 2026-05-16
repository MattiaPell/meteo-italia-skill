## 2025-05-15 — [Structural] Restored Missing Reference Infrastructure

**Learning:** Discovered that several core reference files (`nowcasting_radar.md`, `uv_marine_recent.md`) cited in `SKILL.md` were missing from the repository, and one (`event_reliability.md`) had a critical typo in its filename. This broke the "progressive disclosure" pattern where `SKILL.md` remains lean and relies on `references/` for depth.

**Action:** Always perform a "Broken Link Audit" during the initial AUDIT phase by grepping `SKILL.md` for all `references/*.md` calls and verifying their existence/correct naming. Fix typos and restore missing boilerplate immediately to ensure the agent has the necessary thresholds for interpretation.
