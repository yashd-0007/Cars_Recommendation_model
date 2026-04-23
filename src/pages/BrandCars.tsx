import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, loadCarData } from "@/lib/carData";
import CarCard from "@/components/CarCard";
import Navbar from "@/components/Navbar";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BrandCars = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      const allCars = await loadCarData();
      const filtered = allCars.filter(
        (c) => c.brand.toLowerCase() === brandName?.toLowerCase()
      );
      setCars(filtered);
      setLoading(false);
    };

    fetchCars();
    window.scrollTo(0, 0);
  }, [brandName]);

  // Capitalize brand name for display
  const displayBrandName = brandName 
    ? brandName.charAt(0).toUpperCase() + brandName.slice(1).replace(/-/g, ' ') 
    : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-2 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {loading ? (
              <div className="h-8 w-32 bg-muted animate-pulse mx-auto rounded-full mb-4"></div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm mb-4 shadow-sm border border-border">
                <Sparkles className="w-4 h-4 text-primary" />
                {cars.length} Models available
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tight mb-4">
              {displayBrandName} <span className="text-gradient-golden">Collection</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore all {displayBrandName} models and variants curated for your lifestyle.
            </p>
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
              <p className="text-xl text-muted-foreground mb-2">No cars found for {displayBrandName}.</p>
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

export default BrandCars;
