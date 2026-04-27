/**
 * DreamDrive Display-Data Service
 * Core orchestrator: loads the curated registry, normalizes incoming car references,
 * matches them against verified specs, and returns UI-safe display objects.
 *
 * Architecture: registry.json → normalizer → matcher → formatter → sanitizer → DisplayCar
 */

const fs = require("fs");
const path = require("path");
const { normalizeBrand, normalizeModel, normalizeVariant, buildModelKey, similarityScore } = require("./normalizer");
const { formatPrice, formatMileage, formatEngine, sanitizeCarObject } = require("./displayFormatter");
const imageResolver = require("./imageResolver");

// ─── In-Memory State ───────────────────────────────────────────────────────────
let registry = null;         // Raw registry JSON
let modelIndex = {};         // Normalized key → registry car object
let brandIndex = {};         // Normalized brand → first registry car (fallback)
let allDisplayCars = [];     // Complete flat list of resolved display cars
let csvData = [];            // Parsed CSV rows for reference

// ─── Initialization ────────────────────────────────────────────────────────────

/**
 * Load and index the curated display registry
 */
function loadRegistry() {
  const registryPath = path.join(__dirname, "..", "data", "displayCarRegistry.json");
  if (!fs.existsSync(registryPath)) {
    console.error("❌ Display registry not found at:", registryPath);
    return false;
  }

  registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
  modelIndex = {};
  brandIndex = {};

  for (const car of registry.cars) {
    // Model-level index: "bmw_7series" → car
    const mKey = buildModelKey(car.brand, car.model);
    modelIndex[mKey] = car;

    // Brand-level index: "bmw" → first car found (image fallback)
    const bKey = normalizeBrand(car.brand);
    if (!brandIndex[bKey]) {
      brandIndex[bKey] = car;
    }
  }

  console.log(`✅ Display registry loaded: ${registry.cars.length} models indexed.`);
  return true;
}

/**
 * Load and parse the CSV dataset for identity mapping
 */
function loadCSVData() {
  const csvPath = path.join(__dirname, "..", "..", "public", "data", "cleaned_car_dataset.csv");
  if (!fs.existsSync(csvPath)) {
    console.warn("⚠️  CSV dataset not found at:", csvPath);
    return;
  }

  const raw = fs.readFileSync(csvPath, "utf-8");
  const lines = raw.split("\n").filter(l => l.trim());
  const headers = lines[0].split(",").map(h => h.trim().replace(/\r/g, ""));

  csvData = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim().replace(/\r/g, ""));
    const row = {};
    headers.forEach((h, idx) => { row[h] = cols[idx] || ""; });
    row._csvIndex = i - 1;
    csvData.push(row);
  }

  console.log(`✅ CSV dataset loaded: ${csvData.length} rows.`);
}

// ─── Matching Engine ────────────────────────────────────────────────────────────

/**
 * Match a car (by brand/model/variant) against the curated registry.
 * Fallback order: exact model → brand fallback → complete fallback
 *
 * @param {string} brand
 * @param {string} model
 * @param {string} variant
 * @returns {{ match: Object|null, matchType: string }}
 */
function matchCar(brand, model, variant) {
  const mKey = buildModelKey(brand, model);

  // Priority 1: Exact model match
  if (modelIndex[mKey]) {
    return { match: modelIndex[mKey], matchType: "model" };
  }

  // Priority 2: Fuzzy model match — find closest model key
  const normModel = normalizeModel(model);
  let bestMatch = null;
  let bestScore = 0;
  for (const [key, car] of Object.entries(modelIndex)) {
    const keyModel = key.split("_").slice(1).join("_");
    const score = similarityScore(normModel, keyModel);
    if (score > bestScore && score >= 0.6) {
      bestScore = score;
      bestMatch = car;
    }
  }
  if (bestMatch) {
    return { match: bestMatch, matchType: "fuzzy" };
  }

  // Priority 3: Brand-level fallback (image only)
  const bKey = normalizeBrand(brand);
  if (brandIndex[bKey]) {
    return { match: brandIndex[bKey], matchType: "brand" };
  }

  // Priority 4: Complete fallback
  return { match: null, matchType: "fallback" };
}

// ─── Display Object Builder ─────────────────────────────────────────────────────

/**
 * Build a clean, UI-safe display object from a CSV row + registry match
 *
 * @param {Object} csvRow - Raw CSV row data
 * @param {number} index - Display ID (CSV row index)
 * @returns {Object} Clean display car object
 */
function buildDisplayCar(csvRow, index) {
  const { match, matchType } = matchCar(
    csvRow.brand || "",
    csvRow.model || "",
    csvRow.variant || ""
  );

  // Use curated specs when available, fall back to CSV identity fields
  const isReliable = match && (matchType === "model" || matchType === "fuzzy");

  const car = {
    // Identity (always from CSV to maintain mapping)
    displayId: index,
    id: isReliable ? match.id : null,
    brand: csvRow.brand || "Unknown",
    model: csvRow.model || "Unknown",
    variant: csvRow.variant || "Standard",

    // Specs: prefer curated registry over CSV
    fuelType:     isReliable ? match.defaultFuelType    : (csvRow.fuel_type || "N/A"),
    transmission: isReliable ? match.defaultTransmission : (csvRow.transmission || "N/A"),
    bodyType:     isReliable ? match.defaultBodyType    : (csvRow.body_type || "N/A"),
    seating:      isReliable ? match.seating            : safeInt(csvRow.seating, null),
    engineCc:     isReliable ? match.engineCc           : null,
    mileageKmpl:  isReliable ? match.mileageKmpl        : null,
    evRangeKm:    isReliable ? match.evRangeKm          : null,
    launchYear:   isReliable ? match.launchYear         : safeInt(csvRow.launch_year, null),
    priceMinInr:  isReliable ? match.priceMinInr        : safeInt(csvRow.price_min_inr, null),
    priceMaxInr:  isReliable ? match.priceMaxInr        : safeInt(csvRow.price_max_inr, null),
    segment:      isReliable ? match.segment            : (csvRow.segment || ""),
    country:      isReliable ? match.country            : (csvRow.country || ""),
    imageUrl:     imageResolver.resolveImage(csvRow.brand || "", csvRow.model || "") || (match ? match.imageUrl : null),

    // ML-derived (preserve for ranking — not display specs)
    score: safeFloat(csvRow.score, 0),

    // Metadata
    matchType: matchType,
    sourceQuality: isReliable ? "curated" : (matchType === "brand" ? "estimated" : "unavailable"),
  };

  // Apply formatting and sanitization
  return sanitizeCarObject(car);
}

// ─── Build All Display Cars ──────────────────────────────────────────────────────

/**
 * Process all CSV rows into display-safe car objects
 * Called once at startup after loading registry and CSV
 */
function buildAllDisplayCars() {
  allDisplayCars = csvData.map((row, idx) => {
    const csvIndex = parseInt(row[""] || row._csvIndex || idx, 10);
    return buildDisplayCar(row, csvIndex);
  });

  console.log(`✅ Built ${allDisplayCars.length} display-safe car objects.`);
  return allDisplayCars;
}

// ─── Public API ──────────────────────────────────────────────────────────────────

/**
 * Initialize the service — call once on server startup
 */
function initialize() {
  loadRegistry();
  imageResolver.initialize();
  loadCSVData();
  buildAllDisplayCars();
}

/**
 * Get all display-safe cars
 */
function getAllCars() {
  return allDisplayCars;
}

/**
 * Get a single car by displayId
 * @param {number} id
 */
function getCarById(id) {
  return allDisplayCars.find(c => c.displayId === id) || null;
}

/**
 * Resolve a list of ML-recommended cars into display-safe objects
 * Accepts an array of { brand, model, variant?, index? } and returns matched display cars
 *
 * @param {Array} mlCars - Array of raw ML car recommendations
 * @returns {Array} Resolved display car objects
 */
function resolveCars(mlCars) {
  if (!Array.isArray(mlCars)) return [];

  return mlCars.map(ml => {
    // If we have an index, try direct lookup first
    if (typeof ml.index !== "undefined") {
      const byId = getCarById(ml.index);
      if (byId) return byId;
    }

    // Otherwise, try matching by brand/model
    const found = allDisplayCars.find(c =>
      normalizeBrand(c.brand) === normalizeBrand(ml.brand || "") &&
      normalizeModel(c.model) === normalizeModel(ml.model || "")
    );

    if (found) return found;

    // Last resort: build from ML data directly
    return buildDisplayCar({
      brand: ml.brand || "Unknown",
      model: ml.model || "Unknown",
      variant: ml.variant || "",
      fuel_type: ml.fuel_type || "",
      transmission: ml.transmission || "",
      body_type: ml.body_type || "",
      seating: ml.seating,
      engine_cc: ml.engine_cc,
      launch_year: ml.launch_year,
      price_min_inr: ml.price_min_inr,
      price_max_inr: ml.price_max_inr,
      segment: ml.segment || "",
      country: ml.country || "",
      score: ml.score || 0,
    }, ml.index || -1);
  });
}

/**
 * Get cars filtered by category
 * @param {string} category - "electric", "upcoming", "latest", "popular", "all"
 */
function getCarsByCategory(category) {
  const cat = (category || "").toLowerCase();

  switch (cat) {
    case "electric":
      return allDisplayCars.filter(c =>
        c.fuelType && c.fuelType.toLowerCase() === "electric"
      );

    case "upcoming":
      return allDisplayCars.filter(c => c.launchYear && c.launchYear >= 2025);

    case "latest":
      return allDisplayCars.filter(c =>
        c.launchYear && (c.launchYear === 2024 || c.launchYear === 2023)
      );

    case "popular":
      return [...allDisplayCars]
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 50);

    case "all":
    case "variant-explained":
    default:
      return allDisplayCars;
  }
}

// ─── Utilities ──────────────────────────────────────────────────────────────────

function safeInt(val, fallback) {
  const n = parseInt(val, 10);
  return isNaN(n) ? fallback : n;
}

function safeFloat(val, fallback) {
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
}

module.exports = {
  initialize,
  getAllCars,
  getCarById,
  resolveCars,
  getCarsByCategory,
  matchCar,
  buildDisplayCar,
};
