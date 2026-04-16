import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Car, loadCarData } from "@/lib/carData";
import CarCard from "./CarCard";
import { Star } from "lucide-react";

const RecommendedCars = () => {
  const [topCars, setTopCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopCars = async () => {
      try {
        const cars = await loadCarData();
        // Sort by the AI 'score' to get the most universally recommended cars
        // Then take the top 6
        const sorted = [...cars].sort((a, b) => b.score - a.score).slice(0, 6);
        setTopCars(sorted);
      } catch (error) {
        console.error("Failed to load recommended cars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopCars();
  }, []);

  if (isLoading || topCars.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-muted/50 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm mb-4">
            <Star className="w-4 h-4 fill-primary text-primary" />
            Top Rated
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-sans mb-4">
            Highly <span className="text-gradient-golden">Recommended Cars</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI's top picks globally based on absolute value for money, reliable mileage, matching features, and market popularity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topCars.map((car, i) => (
            <CarCard key={`rec-${car.brand}-${car.model}-${i}`} car={car} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedCars;
