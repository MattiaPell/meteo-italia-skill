# Changelog

All notable changes to the meteo-italia-skill project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Tromba Marina (waterspout) detection: tornadica vs fair-weather types, Adriatic/Tyrrhenian hotspots, CAPE/SST/shear thresholds, intensity scale
- Tromba d'Aria (tornado) detection: EF0-EF5 scale, CAPE>1500/LI<-8/shear thresholds, Italian probability estimates
- Lightning integration for tornado precursors (cloud-to-ground activity 10-30 min before touchdown)
- Satellite pattern recognition for tornado precursors (overshooting top, cold-U, enhanced-V)
- GitHub Action: Broken Link Audit — verifies all `references/*.md` cited in SKILL.md exist on push/PR/weekly

## [1.3.0] - 2025-05-18

### Added
- **METAR/TAF aviation weather** (Step K): CheckWX API, 34 Italian ICAO codes, decoded JSON, flight category (VFR/MVFR/IFR/LIFR), ceiling/visibility/RVR thresholds
- **Lightning detection** (Step L): DMI Open Data API, 4 Italian bounding boxes, nowcasting thresholds (10/15min, 30/30min), storm cell tracking
- **Hydrological data** (Step M): floods.it (Trentino real-time API), ISPRA (national floods), EFAS (European flood awareness), river levels, alert states
- **Satellite imagery** (Step N): EUMETSAT, EUMETView static images (IR10.8, HRV, Airmass, Dust), NASA GIBS (MODIS, VIIRS), cloud analysis, fire detection
- **Climatology expansion**: 8 new cities (Verona, Padova, Brescia, Ferrara, Livorno, Lecce, Messina, Sassari) → 32 total, regional index
- **Energy use case**: eolico (wind power forecast) + solare (solar power forecast) with GFS irradiance, cloud cover, wind at turbine height
- **Tourism use case**: Beach Index (mare sicuro) + Ski Index (neve + vento impianti)

### Changed
- Report template expanded with conditional sections K (METAR), L (Lightning), M (Hydro), N (Satellite)
- Use cases increased from 6 to 10

## [1.2.0] - 2025-05-10

### Added
- **Mountain intelligence**: improved altitude accuracy (DEM-based), thermal gradient (0.65°C/100m), wind exposure, snow depth
- **Regional climatology**: 24 cities with ERA5 1991-2020 normals, regional index for quick comparison
- **Atmospheric stability**: CAPE, CIN, lifted index, total totals index, K-index, convective potential
- **Cloud analysis**: cloud cover by altitude (low/mid/high), cloud base/ceiling, cloud type inference
- **Beekeeping use case**: flight conditions, nectar flow, swarm risk
- **Levante, Ostro, Ponente winds**: documented and integrated into local phenomena

### Changed
- Climatology from 16 to 24 cities
- Report template with mountain-specific sections

## [1.1.0] - 2025-05-05

### Added
- **Acqua Alta detection** (Venice): tide levels, wind setup, atmospheric pressure, SLOSH model
- **Winter phenomena expansion**: galicidio (freezing rain), brina (hoar frost), galaverna (hard rime), nebbia gelata
- **Cuscino freddo** (cold air pool): inversion detection, temperature differential, persistence
- **Marine and health analysis**: Douglas sea scale, Italian heat thresholds, biometeorology
- **Agrometeorology**: evapotranspiration, soil moisture, growing degree days, frost risk
- **Adriatic Sea Effect** (Bora-induced convergence): documented phenomenon with detection logic
- **Maritime fog detection**: advection vs radiation fog, SST-air temperature delta
- **Upper-air variables**: wind speed/direction at 850/700/500hPa, temperature profiles, geopotential height
- **Snow variables**: snowfall, snow depth, snowmelt
- **Environmental variables**: soil temperature, evapotranspiration, direct/diffuse radiation

### Changed
- Vertical resolution expanded from surface-only to multi-level (surface + 850/700/500hPa)
- Climatology added for Ancona and Perugia (ARPA reference stations)

## [1.0.0] - 2025-04-28

### Added
- **Initial skill**: meteo-italia — analisi comparativa delle previsioni meteo multi-modello specializzata per l'Italia
- **Multi-model comparison**: ECMWF, GFS, ICON, GEM, ARPAE COSMO, ARPIE MOLOCH, ARPALUM CAMS
- **Regional analysis**: 16 cities with climatology, local phenomena detection (27 phenomena)
- **Fetch workflow**: Steps A-I covering surface, hourly, daily, air quality, marine, geocoding, models, radar, satellite
- **Use cases**: Daily Report, Agriculture, Marine, Health, Events, Alerts
- **Report template**: structured Italian weather report with regional breakdown
- **Local phenomena**: Maestrale, Garbino, Ponentino, Bora, Scirocco, Tramontana, Libeccio, Grecale, Foehn, Vento di Favonio, Brezza di mare/terra, Muggine, Scirocco caldissimo, Roll cloud, Arcus cloud, Cuscino freddo, Gelicidio, Acqua alta, Nebbia da irraggiamento/avvezione, Isola di calore, Ghiaccio su strade, Caldo anomalo invernale, Neve al suolo persistente, Grandine, Nubi lenticolari, Onde orografiche, Fata Morgana, Fata Morgana superiore

### Reference Files
- `references/models.md`: Weather model comparison, accuracy, biases
- `references/api_endpoints.md`: Open-Meteo API documentation
- `references/local_phenomena.md`: Italian weather phenomena detection logic
- `references/climatology.md`: ERA5 1991-2020 normals for Italian cities
- `references/use_cases.md`: Use case definitions and report templates

---

## Versioning Strategy

This project uses **Semantic Versioning** (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes to skill interface (trigger words, report format, API dependencies)
- **MINOR**: New data sources, phenomena, use cases, reference files (backward compatible)
- **PATCH**: Bug fixes, accuracy improvements, documentation corrections

### Release Process

1. Update `CHANGELOG.md` — move `[Unreleased]` entries to new version with today's date
2. Tag release: `git tag -a v1.4.0 -m "v1.4.0"`
3. Push: `git push origin main --tags`

### Git Conventions

- **Conventional Commits**: `type(scope): description`
  - `feat`: new feature, data source, phenomenon, use case
  - `fix`: bug fix, accuracy correction
  - `docs`: documentation only
  - `refactor`: code restructuring without behavior change
  - `ci`: CI/CD changes
  - `test`: test additions or modifications
- **Branch per feature**: `feature/<name>`, `fix/<name>`
- **Atomic commits**: one logical change per commit
- **PR per branch**: each feature branch gets its own pull request
