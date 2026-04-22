/**
 * DreamDrive Display-Data Normalizer
 * Robust string normalization for matching ML-recommended cars to curated display records.
 */

// Known variant suffixes to strip during fuzzy matching
const VARIANT_SUFFIXES = [
  "edition", "pro", "sport", "plus", "turbo", "ev", "hybrid",
  "mt", "at", "amt", "cvt", "dct", "luxury", "premium",
  "base", "top", "mid", "lx", "zx", "vx", "sx", "gx",
  "signature", "max", "ultimate", "limited"
];

/**
 * Core normalize: lowercase, strip all non-alphanumeric
 */
function normalize(str) {
  if (!str || typeof str !== "string") return "";
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Normalize brand name
 * "Maruti Suzuki" → "marutisuzuki", "Rolls-Royce" → "rollsroyce"
 */
function normalizeBrand(brand) {
  return normalize(brand);
}

/**
 * Normalize model name
 * "7 Series" → "7series", "CR-V" → "crv", "Innova Hycross" → "innovahycross"
 */
function normalizeModel(model) {
  return normalize(model);
}

/**
 * Normalize variant name — strips known suffixes for fuzzy matching
 * "Premium Plus Edition EV" → "premiumplus"
 * "Signature AT" → "signature" (AT is a suffix)
 */
function normalizeVariant(variant) {
  if (!variant || typeof variant !== "string") return "";

  let normalized = variant.toLowerCase().trim();

  // Remove known suffixes from the end, iteratively
  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of VARIANT_SUFFIXES) {
      const pattern = new RegExp(`\\b${suffix}\\b`, "g");
      const before = normalized;
      normalized = normalized.replace(pattern, "").trim();
      if (normalized !== before) changed = true;
    }
  }

  return normalized.replace(/[^a-z0-9]/g, "");
}

/**
 * Build a lookup key from brand + model
 * ("BMW", "7 Series") → "bmw_7series"
 */
function buildModelKey(brand, model) {
  return `${normalizeBrand(brand)}_${normalizeModel(model)}`;
}

/**
 * Build a full lookup key from brand + model + variant
 * ("BMW", "7 Series", "740i M Sport") → "bmw_7series_740imsport"
 */
function buildVariantKey(brand, model, variant) {
  return `${buildModelKey(brand, model)}_${normalizeVariant(variant)}`;
}

/**
 * Calculate similarity score between two normalized strings (0-1)
 * Used for fuzzy variant matching when exact match fails
 */
function similarityScore(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;

  // Check if one contains the other
  if (a.includes(b) || b.includes(a)) {
    return 0.8;
  }

  // Simple character overlap ratio
  const setA = new Set(a.split(""));
  const setB = new Set(b.split(""));
  let overlap = 0;
  for (const ch of setA) {
    if (setB.has(ch)) overlap++;
  }
  return overlap / Math.max(setA.size, setB.size);
}

module.exports = {
  normalize,
  normalizeBrand,
  normalizeModel,
  normalizeVariant,
  buildModelKey,
  buildVariantKey,
  similarityScore,
  VARIANT_SUFFIXES,
};
