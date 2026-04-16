import bmwImg from "@/assets/cars/bmw.jpg";
import mahindraImg from "@/assets/cars/mahindra.jpg";
import ferrariImg from "@/assets/cars/ferrari.jpg";
import hyundaiImg from "@/assets/cars/hyundai.jpg";
import hondaImg from "@/assets/cars/honda.jpg";
import rollsRoyceImg from "@/assets/cars/rolls-royce.jpg";
import porscheImg from "@/assets/cars/porsche.jpg";
import toyotaImg from "@/assets/cars/toyota.jpg";
import teslaImg from "@/assets/cars/tesla.jpg";
import bentleyImg from "@/assets/cars/bentley.jpg";
import kiaImg from "@/assets/cars/kia.jpg";
import audiImg from "@/assets/cars/audi.jpg";
import marutiSuzukiImg from "@/assets/cars/maruti-suzuki.jpg";
import tataImg from "@/assets/cars/tata.jpg";
import mercedesBenzImg from "@/assets/cars/mercedes-benz.jpg";
import lamborghiniImg from "@/assets/cars/lamborghini.jpg";
import skodaImg from "@/assets/cars/skoda.jpg";
import volkswagenImg from "@/assets/cars/volkswagen.jpg";

const brandImages: Record<string, string> = {
  BMW: bmwImg,
  Mahindra: mahindraImg,
  Ferrari: ferrariImg,
  Hyundai: hyundaiImg,
  Honda: hondaImg,
  "Rolls-Royce": rollsRoyceImg,
  Porsche: porscheImg,
  Toyota: toyotaImg,
  Tesla: teslaImg,
  Bentley: bentleyImg,
  Kia: kiaImg,
  Audi: audiImg,
  "Maruti Suzuki": marutiSuzukiImg,
  Tata: tataImg,
  "Mercedes-Benz": mercedesBenzImg,
  Lamborghini: lamborghiniImg,
  Skoda: skodaImg,
  Volkswagen: volkswagenImg,
};

// 1. Exact matches for specific models (Scalable for 1500+ variants since variants of same model share the key)
const modelImages: Record<string, string> = {
  // Add exact matches here, e.g. "toyota_camry": camryImg
};

// 2. Normalize dictionaries for deterministic robust lookup (Handles casing, spaces, hyphens)
const normalizedBrandImages = Object.entries(brandImages).reduce((acc, [key, value]) => {
  acc[key.toLowerCase().replace(/[^a-z0-9]/g, "")] = value;
  return acc;
}, {} as Record<string, string>);

const normalizedModelImages = Object.entries(modelImages).reduce((acc, [key, value]) => {
  acc[key.toLowerCase().replace(/[^a-z0-9]/g, "")] = value;
  return acc;
}, {} as Record<string, string>);

// 3. Fallback placeholder (Generic No-Image SVG)
const DEFAULT_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="100%25" height="100%25" fill="%23f3f4f6"/><text x="50%25" y="50%25" font-family="sans-serif" font-size="24" fill="%239ca3af" dominant-baseline="middle" text-anchor="middle">No Car Image</text></svg>`;

export function getCarImage(car: { brand: string; model?: string } | string): string {
  let brand = "";
  let model = "";

  if (typeof car === "string") {
    brand = car;
  } else if (car) {
    brand = car.brand || "";
    model = car.model || "";
  }

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  const normBrand = normalize(brand);
  const normModel = normalize(model);
  const exactKey = `${normBrand}_${normModel}`;

  // Deterministic Matching Strategy:
  
  // A: Exact Model Match First
  if (normBrand && normModel && exactKey in normalizedModelImages) {
    return normalizedModelImages[exactKey];
  }

  // B: Brand Level Match Fallback
  if (normBrand && normBrand in normalizedBrandImages) {
    return normalizedBrandImages[normBrand];
  }

  // C: Safe Default Placeholder (Never show a wrong unrelated car)
  return DEFAULT_PLACEHOLDER;
}
