/**
 * DreamDrive Image Resolver Service
 * Resolves car brand+model to the best available image URL.
 * 
 * Resolution order:
 * 1. Exact model image (from public/images/cars/)
 * 2. null (let frontend handle brand-level fallback)
 * 
 * Architecture: The backend resolves the imageUrl and includes it in the
 * display car object. The frontend's carImages.ts then uses it if present,
 * or falls back to its existing brand-level image map.
 */

const fs = require("fs");
const path = require("path");
const { normalizeBrand, normalizeModel, buildModelKey } = require("./normalizer");

// ─── In-Memory Cache ────────────────────────────────────────────────────────────
let imageIndex = {};   // normalized "brand_model" → image path
let initialized = false;

// ─── Image Directory ────────────────────────────────────────────────────────────
const IMAGE_DIR = path.join(__dirname, "..", "..", "public", "images", "cars");
const IMAGE_BASE_URL = "/images/cars"; // URL path served by Vite/static server

/**
 * Scan the image directory and build the lookup index.
 * Maps filenames like "tata_nexon.svg" → { key: "tata_nexon", url: "/images/cars/tata_nexon.svg" }
 */
function initialize() {
  imageIndex = {};

  if (!fs.existsSync(IMAGE_DIR)) {
    console.warn("⚠️  Image directory not found:", IMAGE_DIR);
    initialized = true;
    return;
  }

  const files = fs.readdirSync(IMAGE_DIR);
  for (const file of files) {
    // Only index REAL photo files — not generated SVG placeholders.
    // SVG silhouettes are lower quality than existing brand photos.
    // When real model photos (.jpg/.webp/.png) are added, they'll be picked up automatically.
    const ext = path.extname(file).toLowerCase();
    if (![".webp", ".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const baseName = path.basename(file, ext); // e.g. "tata_nexon"
    // Normalize the filename for matching
    const normKey = baseName.toLowerCase().replace(/[^a-z0-9_]/g, "");
    imageIndex[normKey] = `${IMAGE_BASE_URL}/${file}`;
  }

  initialized = true;
  console.log(`✅ Image resolver indexed: ${Object.keys(imageIndex).length} model images.`);
}

/**
 * Resolve the best image URL for a given brand + model.
 * 
 * @param {string} brand - e.g. "Tata"
 * @param {string} model - e.g. "Nexon"
 * @returns {string|null} Image URL or null if no model-level image found
 */
function resolveImage(brand, model) {
  if (!initialized) initialize();

  const normBrand = normalizeBrand(brand);
  const normModel = normalizeModel(model);

  // Strategy 1: Try exact file key match (e.g. "tata_nexon")
  const exactKey = `${normBrand}_${normModel}`;
  if (imageIndex[exactKey]) {
    return imageIndex[exactKey];
  }

  // Strategy 2: Try with underscores replaced differently
  // Handles cases like "maruti_suzuki_grand_vitara" vs "marutisuzuki_grandvitara"
  for (const [key, url] of Object.entries(imageIndex)) {
    const keyNorm = key.replace(/_/g, "");
    const searchNorm = `${normBrand}${normModel}`;
    if (keyNorm === searchNorm) {
      return url;
    }
  }

  // Strategy 3: Try partial match for brand (fallback brand-level image)
  for (const [key, url] of Object.entries(imageIndex)) {
    if (key.startsWith(normBrand + "_") || key === normBrand) {
      // Don't return this as it would be a wrong model's image
      // Only return if it's specifically a brand-generic image
      continue;
    }
  }

  // No model-level image found — return null so frontend uses its own fallback
  return null;
}

/**
 * Get the full image index (for debugging/admin)
 */
function getImageIndex() {
  if (!initialized) initialize();
  return { ...imageIndex };
}

module.exports = {
  initialize,
  resolveImage,
  getImageIndex,
};
