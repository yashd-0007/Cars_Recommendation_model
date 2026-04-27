/**
 * 360° Car View Asset Mapping
 * 
 * Maps car model IDs (from displayCarRegistry) to their 360° image sequences.
 * Each car can have an array of image URLs representing a full rotation.
 */

// Import Nexon 360 frames
import nexon0 from "@/assets/cars/360/nexon/0.png";
import nexon1 from "@/assets/cars/360/nexon/1.png";
import nexon2 from "@/assets/cars/360/nexon/2.png";
import nexon3 from "@/assets/cars/360/nexon/3.png";
import nexon4 from "@/assets/cars/360/nexon/4.png";
import nexon5 from "@/assets/cars/360/nexon/5.png";
import nexon6 from "@/assets/cars/360/nexon/6.png";
import nexon7 from "@/assets/cars/360/nexon/7.png";
import nexon8 from "@/assets/cars/360/nexon/8.png";
import nexon9 from "@/assets/cars/360/nexon/9.png";
import nexon10 from "@/assets/cars/360/nexon/10.png";
import nexon11 from "@/assets/cars/360/nexon/11.png";

// Import BMW 3 Series frames
import bmw3_0 from "@/assets/cars/360/bmw_3_series/0.png";
import bmw3_1 from "@/assets/cars/360/bmw_3_series/1.png";
import bmw3_2 from "@/assets/cars/360/bmw_3_series/2.png";
import bmw3_3 from "@/assets/cars/360/bmw_3_series/3.png";
import bmw3_4 from "@/assets/cars/360/bmw_3_series/4.png";
import bmw3_5 from "@/assets/cars/360/bmw_3_series/5.png";

// Fallback images for other BMWs (using main images for now due to quota)
const bmw5_fallback = "/images/cars/bmw_5_series.png";
const bmw7_fallback = "/images/cars/bmw_7_series.png";

export interface Car360Asset {
  id: string; // Should match displayCarRegistry ID
  frames: string[];
}

const car360Assets: Record<string, Car360Asset> = {
  "tata_nexon": {
    id: "tata_nexon",
    frames: [
      nexon0, nexon1, nexon2, nexon3, nexon4, nexon5, 
      nexon6, nexon7, nexon8, nexon9, nexon10, nexon11
    ]
  },
  "bmw_3_series": {
    id: "bmw_3_series",
    frames: [
      bmw3_0, bmw3_1, bmw3_2, bmw3_3, bmw3_4, bmw3_5
    ]
  },
  "bmw_5_series": {
    id: "bmw_5_series",
    frames: [bmw5_fallback] // Single frame fallback
  },
  "bmw_7_series": {
    id: "bmw_7_series",
    frames: [bmw7_fallback] // Single frame fallback
  }
};

/**
 * Returns the 360° asset for a given car ID if available.
 */
export function getCar360Asset(carId: string): Car360Asset | null {
  // Normalize ID (case-insensitive and remove spaces/underscores for robustness)
  const normalizedId = carId.toLowerCase().replace(/[\s-]/g, "_");
  return car360Assets[normalizedId] || null;
}

export default car360Assets;
