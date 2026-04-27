import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, formatPrice, loadCarData } from "@/lib/carData";
import CarCard from "./CarCard";
import { Loader2 } from "lucide-react";

// Fallback high-end cars using local images to ensure the UI is NEVER empty
const INITIAL_FEATURED_CARS: Car[] = [
  {
    index: 101, // Temporary index
    brand: "BMW",
    model: "7 Series",
    variant: "740i M Sport",
    body_type: "Sedan",
    fuel_type: "Petrol",
    engine_cc: 2998,
    transmission: "Automatic",
    mileage: 12.6,
    price_min_inr: 17000000,
    price_max_inr: 17500000,
    segment: "Luxury",
    seating: 5,
    launch_year: 2023,
    country: "Germany",
    price_normalized: 17000000,
    score: 9.5,
    imageUrl: "/images/cars/bmw_7_series.png",
  },
  {
    index: 102,
    brand: "BMW",
    model: "5 Series",
    variant: "530Li M Sport",
    body_type: "Sedan",
    fuel_type: "Petrol",
    engine_cc: 1998,
    transmission: "Automatic",
    mileage: 14.8,
    price_min_inr: 7200000,
    price_max_inr: 7500000,
    segment: "Luxury",
    seating: 5,
    launch_year: 2024,
    country: "Germany",
    price_normalized: 7200000,
    score: 9.0,
    imageUrl: "/images/cars/bmw_5_series.png",
  },
  {
    index: 103,
    brand: "BMW",
    model: "3 Series",
    variant: "330Li M Sport",
    body_type: "Sedan",
    fuel_type: "Petrol",
    engine_cc: 1998,
    transmission: "Automatic",
    mileage: 15.3,
    price_min_inr: 6000000,
    price_max_inr: 6200000,
    segment: "Luxury",
    seating: 5,
    launch_year: 2023,
    country: "Germany",
    price_normalized: 6000000,
    score: 8.8,
    imageUrl: "/images/cars/bmw_3_series.png",
  },
  {
    index: 104,
    brand: "Tata",
    model: "Nexon",
    variant: "Fearless Plus S",
    body_type: "SUV",
    fuel_type: "Petrol",
    engine_cc: 1199,
    transmission: "Automatic",
    mileage: 17.0,
    price_min_inr: 1400000,
    price_max_inr: 1500000,
    segment: "Compact SUV",
    seating: 5,
    launch_year: 2023,
    country: "India",
    price_normalized: 1400000,
    score: 8.5,
    imageUrl: "/images/cars/tata_nexon.png",
  },
];

const FeaturedCars = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>(INITIAL_FEATURED_CARS);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const resolveRealIndices = async () => {
      try {
        const allCars = await loadCarData();
        
        // Match our hardcoded "placeholders" with real data from the dataset
        const updatedCars = INITIAL_FEATURED_CARS.map(initialCar => {
          const realMatch = allCars.find(c => 
            c.brand.toLowerCase().trim() === initialCar.brand.toLowerCase().trim() && 
            c.model.toLowerCase().trim() === initialCar.model.toLowerCase().trim()
          );
          
          if (realMatch) {
            // Keep the premium hardcoded images but use the correct dataset index and specs
            return {
              ...initialCar,
              ...realMatch,
              // Prioritize our hardcoded premium images if available
              imageUrl: initialCar.imageUrl || realMatch.imageUrl,
            };
          }
          return initialCar;
        });

        setFeaturedCars(updatedCars);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Failed to resolve featured car indices:", error);
      }
    };

    resolveRealIndices();
  }, []);

  return (
    <section className="py-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-serif mb-4 tracking-tight"
          >
            Featured Masterpieces
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A curated selection of our most popular and luxurious models available right now.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCars.map((car, idx) => (
            <motion.div
              key={`${car.brand}-${car.model}-${car.index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <CarCard car={car} index={idx} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
