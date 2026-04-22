/**
 * DreamDrive Data Presentation Formatters
 * 
 * Updated for Phase 1: When data comes from the Display-Data Backend,
 * values arrive pre-formatted and sanitized. These formatters now serve
 * as a thin safety net for edge cases and CSV-fallback mode.
 */

/**
 * Format Engine CC for display
 * - If data comes from backend: engineCc is a real value (e.g. 2998)
 * - If data comes from CSV fallback: engineCc is normalized (0-1)
 */
export const formatEngineCC = (value: number, fuelType: string): string => {
  if (!value && value !== 0) return "N/A";
  
  const isElectric = fuelType?.toLowerCase().includes("electric") || fuelType === "EV";
  if (isElectric || value <= 0) return "Electric Motor";

  // If it's a real CC value (> 100), format directly
  if (value > 100) {
    return `${Math.round(value).toLocaleString("en-IN")} cc`;
  }

  // Legacy CSV fallback: value is 0-1 normalized — show N/A instead of guessing
  return "N/A";
};


/**
 * Format Mileage for display
 * - If data comes from backend: mileage is a real value (e.g. 17.8 kmpl or 530 km range)
 * - If data comes from CSV fallback: mileage is normalized (0-1)
 */
export const formatMileage = (value: number, fuelType: string): string => {
  if (!value && value !== 0) return "N/A";

  const isElectric = fuelType?.toLowerCase().includes("electric") || fuelType === "EV";
  
  if (isElectric) {
    // EV range: real values are 100-900 km
    if (value >= 50) {
      return `${Math.round(value)} km range`;
    }
    return "N/A";
  }

  // ICE mileage: real values are 5-50 kmpl
  if (value >= 3 && value <= 60) {
    return `${value.toFixed(1)} kmpl`;
  }

  // Legacy CSV fallback: value is 0-1 normalized — show N/A instead of guessing
  return "N/A";
};
