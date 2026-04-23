import Papa from "papaparse";
import { carApi, DisplayCar } from "@/services/carApi";
import CONFIG from "@/config";

// ─── Car Interface (Backwards Compatible) ──────────────────────────────────────
// The existing UI components use this shape. We map DisplayCar → Car seamlessly.

export interface Car {
  index: number;
  brand: string;
  model: string;
  variant: string;
  body_type: string;
  fuel_type: string;
  engine_cc: number;
  transmission: string;
  mileage: number;
  price_min_inr: number;
  price_max_inr: number;
  segment: string;
  seating: number;
  launch_year: number;
  country: string;
  price_normalized: number;
  score: number;
  // New fields from display-data service (optional for backwards compat)
  imageUrl?: string | null;
  matchType?: string;
  sourceQuality?: string;
  priceFormatted?: { min: string; max: string };
  mileageFormatted?: string;
  engineFormatted?: string;
  seatingFormatted?: string;
}

export interface UserPreferences {
  monthlySalary: number;
  budget: number;
  fuelType: string;
  bodyType?: string;
  transmission?: string;
  seating?: string;
  preferredBrand?: string;
  evHybridPreference?: string;
  city?: string;
  lifestyle?: string;
}

// ─── DisplayCar → Car Mapper ────────────────────────────────────────────────────
// Maps the new backend DisplayCar shape into the existing Car interface
// so all existing components (CarCard, Compare, etc.) work without changes.

function displayCarToLegacy(dc: DisplayCar): Car {
  return {
    index: dc.displayId,
    brand: dc.brand,
    model: dc.model,
    variant: dc.variant,
    body_type: dc.bodyType || "N/A",
    fuel_type: dc.fuelType || "N/A",
    engine_cc: dc.engineCc || 0,
    transmission: dc.transmission || "N/A",
    mileage: dc.mileageKmpl || dc.evRangeKm || 0,
    price_min_inr: dc.priceMinInr || 0,
    price_max_inr: dc.priceMaxInr || 0,
    segment: dc.segment || "",
    seating: dc.seating || 5,
    launch_year: dc.launchYear || 2023,
    country: dc.country || "",
    price_normalized: 0, // Not used for display anymore
    score: dc.score || 0,
    // Pass through new metadata
    imageUrl: dc.imageUrl || null,
    matchType: dc.matchType,
    sourceQuality: dc.sourceQuality,
    priceFormatted: dc.priceFormatted,
    mileageFormatted: dc.mileageFormatted,
    engineFormatted: dc.engineFormatted,
    seatingFormatted: dc.seatingFormatted,
  };
}

// ─── Caching ────────────────────────────────────────────────────────────────────

let cachedCars: Car[] | null = null;

// ─── Data Loading (Backend-First, CSV Fallback) ─────────────────────────────────

/**
 * Load car data from the Node.js display-data backend.
 * Falls back to CSV parsing if the backend is unavailable.
 */
export async function loadCarData(): Promise<Car[]> {
  if (cachedCars) return cachedCars;

  // Strategy 1: Try the display-data backend (curated, reliable specs)
  try {
    const displayCars = await carApi.getAllCars();
    if (displayCars && displayCars.length > 0) {
      cachedCars = displayCars.map(displayCarToLegacy);
      console.log(`✅ Loaded ${cachedCars.length} cars from Display-Data Backend (curated specs)`);
      return cachedCars;
    }
  } catch (err) {
    console.warn("⚠️  Display-Data Backend unavailable. Falling back to local CSV.");
  }

  // Strategy 2: Fallback to CSV (old behavior — normalized/unreliable values)
  const response = await fetch(`${import.meta.env.BASE_URL}data/cleaned_car_dataset.csv`);
  const csvText = await response.text();
  const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });

  cachedCars = result.data.map((row: Record<string, string>) => ({
    index: parseInt(row[""] || "0"),
    brand: row.brand || "Unknown",
    model: row.model || "Unknown",
    variant: row.variant || "Unknown",
    body_type: row.body_type || "Unknown",
    fuel_type: row.fuel_type || "Unknown",
    engine_cc: parseFloat(row.engine_cc || "0"),
    transmission: row.transmission || "Unknown",
    mileage: parseFloat(row.mileage_kmpl_or_range || "0"),
    price_min_inr: parseInt(row.price_min_inr || "0"),
    price_max_inr: parseInt(row.price_max_inr || "0"),
    segment: row.segment || "",
    seating: parseInt(row.seating || "4"),
    launch_year: parseInt(row.launch_year || "2020"),
    country: row.country || "",
    price_normalized: parseFloat(row.price || "0"),
    score: parseFloat(row.score || "0"),
  }));

  console.warn("⚠️  Using CSV fallback — specifications may be unreliable.");
  return cachedCars;
}

// ─── Recommendation Engine ──────────────────────────────────────────────────────

// Global toggle for Python AI backend
const USE_PYTHON_AI_BACKEND = true;
const PYTHON_API_URL = CONFIG.PYTHON_API_URL;

export async function recommendCars(cars: Car[], prefs: UserPreferences): Promise<Car[]> {
  // Option 1: Try the real Python FastAPI Backend for ML recommendations
  if (USE_PYTHON_AI_BACKEND) {
    try {
      const response = await fetch(PYTHON_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      if (response.ok) {
        const aiRecommendations = await response.json();
        if (aiRecommendations && aiRecommendations.length > 0) {
          console.log("✅ Got ML recommendations. Resolving through Display-Data Service...");

          // Resolve ML output through the display-data backend for clean specs
          try {
            const resolved = await carApi.resolveCars(aiRecommendations);
            if (resolved && resolved.length > 0) {
              console.log("✅ Display-safe recommendations ready.");
              return resolved.map(displayCarToLegacy);
            }
          } catch {
            console.warn("⚠️  Display resolve failed. Using ML data as-is.");
          }

          // If resolve fails, map ML data directly (less reliable)
          return aiRecommendations.map((rec: any, i: number) => ({
            index: rec.index ?? i,
            brand: rec.brand || "Unknown",
            model: rec.model || "Unknown",
            variant: rec.variant || "",
            body_type: rec.body_type || "Unknown",
            fuel_type: rec.fuel_type || "Unknown",
            engine_cc: rec.engine_cc || 0,
            transmission: rec.transmission || "Unknown",
            mileage: rec.mileage || 0,
            price_min_inr: rec.price_min_inr || 0,
            price_max_inr: rec.price_max_inr || 0,
            segment: rec.segment || "",
            seating: rec.seating || 5,
            launch_year: rec.launch_year || 2023,
            country: rec.country || "",
            price_normalized: rec.price_normalized || 0,
            score: rec.score || 0,
          }));
        }
      } else {
        console.warn(`Python API returned ${response.status}. Falling back to local simulation.`);
      }
    } catch (error) {
      console.warn("Python AI Server offline. Falling back to local simulation.");
    }
  }

  // Option 2: Fallback to simulated logic (prevents UI crashes)
  console.log("Using Local Simulated Recommendation Engine");
  let filtered = cars;
  if (prefs.fuelType && prefs.fuelType !== "Any") {
    filtered = filtered.filter((c) => c.fuel_type === prefs.fuelType);
  }
  if (prefs.preferredBrand && prefs.preferredBrand !== "Any") {
    filtered = filtered.filter((c) => c.brand === prefs.preferredBrand);
  }
  filtered = filtered.filter((c) => c.price_max_inr <= prefs.budget);
  if (prefs.bodyType && prefs.bodyType !== "Any") {
    filtered = filtered.filter((c) => c.body_type === prefs.bodyType);
  }
  if (prefs.transmission && prefs.transmission !== "Any") {
    filtered = filtered.filter((c) => c.transmission === prefs.transmission);
  }
  if (prefs.seating && prefs.seating !== "Any") {
    const seats = parseInt(prefs.seating.replace("+", ""), 10);
    if (!isNaN(seats)) {
      filtered = filtered.filter((c) => c.seating >= seats);
    }
  }
  if (prefs.evHybridPreference && prefs.evHybridPreference !== "Any") {
    const pref = prefs.evHybridPreference.toLowerCase();
    if (pref === "electric") {
      filtered = filtered.filter((c) => c.fuel_type.toLowerCase().includes("electric") || c.fuel_type.toLowerCase().includes("ev"));
    } else if (pref === "hybrid") {
      filtered = filtered.filter((c) => c.fuel_type.toLowerCase().includes("hybrid"));
    } else if (pref === "conventional") {
      filtered = filtered.filter((c) => !c.fuel_type.toLowerCase().includes("electric") && !c.fuel_type.toLowerCase().includes("ev") && !c.fuel_type.toLowerCase().includes("hybrid"));
    }
  }
  filtered.sort((a, b) => b.score - a.score);
  return Promise.resolve(filtered.slice(0, 12));
}

// ─── Utility Functions (Unchanged) ──────────────────────────────────────────────

export function getUniqueFuelTypes(cars: Car[]): string[] {
  return [...new Set(cars.map((c) => c.fuel_type))].sort();
}

export function getUniqueBodyTypes(cars: Car[]): string[] {
  return [...new Set(cars.map((c) => c.body_type))].sort();
}

export function getUniqueTransmissions(cars: Car[]): string[] {
  return [...new Set(cars.map((c) => c.transmission))].sort();
}

export function getUniqueBrands(cars: Car[]): string[] {
  return [...new Set(cars.map((c) => c.brand))].sort();
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

// Generate a car image URL using brand + model for a stock-like image
export function getCarImageUrl(brand: string, model: string): string {
  const query = encodeURIComponent(`${brand} ${model} car`);
  // Use a deterministic placeholder based on brand+model
  const hash = (brand + model).split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const colors = ["E8B44A", "2D3748", "4A5568", "C4953A", "1A202C"];
  const color = colors[hash % colors.length];
  return `https://placehold.co/600x400/${color}/FFFFFF?text=${query}`;
}
