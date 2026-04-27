import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, loadCarData } from "@/lib/carData";
import { normalize } from "@/lib/searchUtils";
import CarCard from "@/components/CarCard";
import Navbar from "@/components/Navbar";
import { Search, ArrowLeft, Frown } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const allCars = await loadCarData();
      const normalizedQuery = normalize(query);

      if (!normalizedQuery) {
        setResults([]);
        setLoading(false);
        return;
      }

      const filtered = allCars.filter((c) => {
        const combined = normalize(`${c.brand} ${c.model} ${c.variant}`);
        return combined.includes(normalizedQuery);
      });

      // Group by model to avoid showing 20 variants of the same car if it's a broad search
      // Actually, standard search usually shows everything, but let's see.
      // The user wants "proper search results page".
      setResults(filtered);
      setLoading(false);
    };

    fetchResults();
    window.scrollTo(0, 0);
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-16 px-4">
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
            className="mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-bold font-sans tracking-tight mb-2">
              Search Results for <span className="text-gradient-golden">"{query}"</span>
            </h1>
            {!loading && (
              <p className="text-muted-foreground">
                Found {results.length} matching cars and variants
              </p>
            )}
          </motion.div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground animate-pulse">Searching the dataset...</p>
            </div>
          ) : results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-card/50 border border-dashed border-border rounded-3xl"
            >
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Frown className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No matching brand or car found</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                We couldn't find any brand or car matching "{query}". Try checking for typos or using broader terms.
              </p>
              <Link 
                to="/#search-section" 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
              >
                Try AI Recommendation
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((car, i) => (
                <CarCard key={`${car.brand}-${car.model}-${car.variant}-${i}`} car={car} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
