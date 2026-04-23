import CONFIG from "@/config";

const NODE_API_BASE = `${CONFIG.NODE_API_URL}/cars`;

export interface DisplayCar {
  displayId: number;
  brand: string;
  model: string;
  variant: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  seating: number | null;
  engineCc: number | null;
  mileageKmpl: number | null;
  evRangeKm: number | null;
  launchYear: number | null;
  priceMinInr: number | null;
  priceMaxInr: number | null;
  segment: string;
  country: string;
  imageUrl: string | null;
  score: number;
  matchType: "model" | "fuzzy" | "brand" | "fallback";
  sourceQuality: "curated" | "estimated" | "unavailable";
  priceFormatted: { min: string; max: string };
  mileageFormatted: string;
  engineFormatted: string;
  seatingFormatted: string;
}

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export const carApi = {
  /**
   * Fetch all display-safe cars from the backend
   */
  async getAllCars(): Promise<DisplayCar[]> {
    const result = await fetchJson<ApiResponse<DisplayCar[]>>(NODE_API_BASE);
    return result.data || [];
  },

  /**
   * Fetch a single car by its displayId
   */
  async getCarById(id: number): Promise<DisplayCar | null> {
    const result = await fetchJson<ApiResponse<DisplayCar>>(`${NODE_API_BASE}/${id}`);
    return result.data || null;
  },

  /**
   * Resolve ML-recommended raw cars into display-safe objects
   */
  async resolveCars(mlCars: any[]): Promise<DisplayCar[]> {
    const result = await fetchJson<ApiResponse<DisplayCar[]>>(`${NODE_API_BASE}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cars: mlCars }),
    });
    return result.data || [];
  },

  /**
   * Fetch cars by category (electric, upcoming, latest, popular, all)
   */
  async browseCars(category: string): Promise<DisplayCar[]> {
    const result = await fetchJson<ApiResponse<DisplayCar[]>>(
      `${NODE_API_BASE}/browse/${encodeURIComponent(category)}`
    );
    return result.data || [];
  },
};
