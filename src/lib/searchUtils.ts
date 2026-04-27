import { Car } from "./carData";

export type MatchResult = 
  | { type: "brand"; brand: string }
  | { type: "car"; id: number }
  | { type: "multiple"; query: string }
  | { type: "none"; query: string };

/**
 * Normalizes a string for comparison
 */
export const normalize = (str: string) => str.toLowerCase().trim().replace(/\s+/g, " ");

/**
 * Finds the best match for a search query against the car dataset
 */
export const findBestMatch = (query: string, cars: Car[]): MatchResult => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return { type: "none", query: "" };

  const brands = [...new Set(cars.map((c) => c.brand))];
  
  // 1. Check for exact brand match
  const exactBrand = brands.find((b) => normalize(b) === normalizedQuery);
  if (exactBrand) {
    return { type: "brand", brand: exactBrand };
  }

  // 2. Check for exact model match (or brand + model match)
  // We prioritize matches where the full string matches "Brand Model" or just "Model"
  const exactCarMatch = cars.find((c) => {
    const fullMatch = normalize(`${c.brand} ${c.model}`) === normalizedQuery;
    const modelMatch = normalize(c.model) === normalizedQuery;
    return fullMatch || modelMatch;
  });
  
  if (exactCarMatch) {
    return { type: "car", id: exactCarMatch.index };
  }

  // 3. Partial matches
  // If query is a substring of a brand
  const partialBrands = brands.filter((b) => normalize(b).includes(normalizedQuery));
  
  // If query is a substring of a model or brand+model
  const partialCars = cars.filter((c) => {
    const combined = normalize(`${c.brand} ${c.model}`);
    return combined.includes(normalizedQuery);
  });

  // If we have exactly one partial brand and no specific car matches better
  if (partialBrands.length === 1 && partialCars.every(c => c.brand === partialBrands[0])) {
    return { type: "brand", brand: partialBrands[0] };
  }

  // If we have exactly one partial car match
  // We need to be careful: "Tata" matches many cars. 
  // If the query is "Nexon" and only "Tata Nexon" matches, then it's a car match.
  // But if the query is "Tata", it matches many cars, so it should be a brand match or multiple.
  
  // Filter partial cars to unique models to avoid variants bloating the results
  const uniqueModels = Array.from(new Set(partialCars.map(c => `${c.brand} ${c.model}`)));
  
  if (uniqueModels.length === 1) {
    // Find the first car matching this unique model
    const matchedCar = partialCars.find(c => `${c.brand} ${c.model}` === uniqueModels[0]);
    if (matchedCar) {
      return { type: "car", id: matchedCar.index };
    }
  }

  // 4. Multiple or None
  if (partialBrands.length > 0 || partialCars.length > 0) {
    return { type: "multiple", query };
  }

  return { type: "none", query };
};
