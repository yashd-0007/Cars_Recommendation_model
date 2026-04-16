import Papa from "papaparse";

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
}

export interface UserPreferences {
  monthlySalary: number;
  budget: number;
  fuelType: string;
  bodyType?: string;
  transmission?: string;
  seating?: number;
}

let cachedCars: Car[] | null = null;

export async function loadCarData(): Promise<Car[]> {
  if (cachedCars) return cachedCars;

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

  return cachedCars;
}

// Global toggle for API integration vs local simulated math
const USE_PYTHON_AI_BACKEND = true;
const PYTHON_API_URL = "http://localhost:8000/predict";

export async function recommendCars(cars: Car[], prefs: UserPreferences): Promise<Car[]> {
  // Option 1: Try hitting the real Python FastAPI Backend
  if (USE_PYTHON_AI_BACKEND) {
    try {
      const response = await fetch(PYTHON_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prefs),
      });

      if (response.ok) {
        const aiRecommendations: Car[] = await response.json();
        if (aiRecommendations && aiRecommendations.length > 0) {
          console.log("Successfully fetched recommendations from Python AI Model!");
          return aiRecommendations;
        }
      } else {
        console.warn(`Python API returned ${response.status}. Falling back to local simulation.`);
      }
    } catch (error) {
      console.warn("Python AI Server is strongly offline or not reachable. Falling back to local simulation logic.");
    }
  }

  // Option 2: Fallback to simulated logic if API fails or is disabled (to prevent UI crashes)
  console.log("Using Local Simulated Recommendation Engine");
  // Filter by fuel type
  let filtered = cars;
  if (prefs.fuelType && prefs.fuelType !== "Any") {
    filtered = filtered.filter((c) => c.fuel_type === prefs.fuelType);
  }

  // Filter by budget (use price_max_inr)
  filtered = filtered.filter((c) => c.price_max_inr <= prefs.budget);

  // Optional filters
  if (prefs.bodyType && prefs.bodyType !== "Any") {
    filtered = filtered.filter((c) => c.body_type === prefs.bodyType);
  }
  if (prefs.transmission && prefs.transmission !== "Any") {
    filtered = filtered.filter((c) => c.transmission === prefs.transmission);
  }
  if (prefs.seating) {
    filtered = filtered.filter((c) => c.seating >= prefs.seating);
  }

  // Sort by score (higher = better recommendation)
  filtered.sort((a, b) => b.score - a.score);

  return Promise.resolve(filtered.slice(0, 12));
}

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
