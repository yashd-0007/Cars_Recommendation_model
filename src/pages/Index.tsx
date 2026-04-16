import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Car, loadCarData, recommendCars, UserPreferences } from "@/lib/carData";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import FeaturesSection from "@/components/FeaturesSection";
import SearchForm from "@/components/SearchForm";
import ResultsSection from "@/components/ResultsSection";
import RecommendedCars from "@/components/RecommendedCars";
import EmiCalculator from "@/components/EmiCalculator";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

const Index = () => {
  const [results, setResults] = useState<Car[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // Small delay to ensure rendering is complete
    }
  }, [location]);

  const handleGetStarted = () => {
    document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = async (prefs: UserPreferences) => {
    setIsLoading(true);
    try {
      const cars = await loadCarData();
      const recommended = await recommendCars(cars, prefs);
      setResults(recommended);
      setHasSearched(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      <div ref={resultsRef}>
        <ResultsSection results={results} hasSearched={hasSearched} />
      </div>
      <div id="top-recommended">
        <RecommendedCars />
      </div>
      <div id="emi-calculator">
        <EmiCalculator />
      </div>
      <div id="reviews">
        <TestimonialsCarousel />
      </div>
      <footer id="contact-us" className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>© 2026 DreamDrive · AI-Powered Car Recommendations</p>
        <p className="mt-2 text-xs opacity-70">Contact Us: hello@dreamdrive.test | +91 98765 43210</p>
      </footer>
    </div>
  );
};

export default Index;
