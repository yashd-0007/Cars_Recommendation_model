import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, loadCarData } from "@/lib/carData";
import CarCard from "@/components/CarCard";
import Navbar from "@/components/Navbar";
import { Sparkles } from "lucide-react";

const BrowseCars = () => {
  const { category } = useParams<{ category: string }>();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      const allCars = await loadCarData();
      let filtered = [...allCars];

      switch (category?.toLowerCase()) {
        case "electric":
          filtered = filtered.filter((c) => c.fuel_type.toLowerCase() === "electric");
          break;
        case "upcoming":
          // Assuming launch_year >= 2025 is upcoming based on typical car datasets in 2024 boundary
          filtered = filtered.filter((c) => c.launch_year >= 2025);
          break;
        case "latest":
          filtered = filtered.filter((c) => c.launch_year === 2024 || c.launch_year === 2023);
          break;
        case "popular":
          // Highest scores
          filtered.sort((a, b) => b.score - a.score);
          filtered = filtered.slice(0, 50);
          break;
        case "all":
        case "variant-explained":
          // All variants
          break;
        default:
          break;
      }

      setCars(filtered);
      setLoading(false);
    };

    fetchCars();
    window.scrollTo(0, 0);
  }, [category]);

  const categoryTitles: Record<string, { title: string; highlight: string }> = {
    electric: { title: "Electric", highlight: "Vehicles" },
    upcoming: { title: "Upcoming", highlight: "Models" },
    latest: { title: "Latest", highlight: "Arrivals" },
    popular: { title: "Popular", highlight: "Choices" },
    all: { title: "All", highlight: "Variants Explained" },
    "variant-explained": { title: "All", highlight: "Variants Explained" },
  };

  const currentTitle = category ? categoryTitles[category.toLowerCase()] || { title: "Browse", highlight: "Cars" } : { title: "Browse", highlight: "Cars" };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 mb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            {loading ? (
              <div className="h-8 w-32 bg-muted animate-pulse mx-auto rounded-full mb-4"></div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm mb-4 shadow-sm border border-border">
                <Sparkles className="w-4 h-4 text-primary" />
                {cars.length} cars available
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight">
              {currentTitle.title} <span className="text-gradient-golden">{currentTitle.highlight}</span>
            </h1>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : cars.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-xl text-muted-foreground mb-2">No cars found in this category.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car, i) => (
                <CarCard key={`${car.brand}-${car.model}-${car.variant}-${i}`} car={car} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BrowseCars;
