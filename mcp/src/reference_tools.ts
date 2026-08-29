/**
 * Barrel di compatibilità: i tool di riferimento ora vivono in moduli
 * dedicati (climatology.ts, bioclimatic_indices.ts, reference_guidelines.ts,
 * pollen.ts, local_phenomena.ts, model_tuning.ts, event_reliability.ts,
 * verification.ts, year_compare.ts) con gli helper condivisi in models.ts.
 * Questo file mantiene funzionanti gli import esistenti (index.ts).
 */
export { normalizeModelId, round1 } from "./models.js";
export { registerClimatology } from "./climatology.js";
export { registerBioclimaticIndices } from "./bioclimatic_indices.js";
export { registerReferenceGuidelines } from "./reference_guidelines.js";
export { registerPollen } from "./pollen.js";
export { registerLocalPhenomena } from "./local_phenomena.js";
export { registerModelTuning } from "./model_tuning.js";
export { registerEventReliability } from "./event_reliability.js";
export { registerVerification } from "./verification.js";
export { registerYearCompare } from "./year_compare.js";
