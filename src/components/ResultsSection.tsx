import { motion } from "framer-motion";
import { Car } from "@/lib/carData";
import CarCard from "./CarCard";
import { Sparkles } from "lucide-react";

interface ResultsSectionProps {
  results: Car[];
  hasSearched: boolean;
}

const ResultsSection = ({ results, hasSearched }: ResultsSectionProps) => {
  if (!hasSearched) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            {results.length} cars found for you
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Your <span className="text-gradient-golden">Recommendations</span>
          </h2>
        </motion.div>

        {results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-muted-foreground mb-2">No cars match your criteria</p>
            <p className="text-muted-foreground/70">Try adjusting your budget or preferences</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((car, i) => (
              <CarCard key={`${car.brand}-${car.model}-${car.variant}-${i}`} car={car} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultsSection;
