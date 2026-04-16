import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Car, loadCarData } from "@/lib/carData";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import CarDetailHero from "@/components/CarDetailHero";
import CarSpecsGrid from "@/components/CarSpecsGrid";
import CarHighlights from "@/components/CarHighlights";
import PriceCard from "@/components/PriceCard";
import SimilarCars from "@/components/SimilarCars";

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [car, setCar] = useState<Car | null>(null);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Scroll to top automatically when navigating to detail pages
    window.scrollTo(0, 0);
    
    const fetchCarAndData = async () => {
      setIsLoading(true);
      try {
        const data = await loadCarData();
        setAllCars(data);
        
        if (id) {
          const selectedCar = data.find((c) => c.index === parseInt(id));
          setCar(selectedCar || null);
        }
      } catch (error) {
        console.error("Failed to load car details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarAndData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-3xl font-bold mb-4">Car Not Found</h2>
          <p className="text-muted-foreground mb-8">The vehicle you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Results
        </button>

        {/* Dynamic Multi-Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Left Column (Hero, Highlights, Specs) */}
          <div className="lg:col-span-8">
            <CarDetailHero car={car} />
            <CarHighlights car={car} />
            <CarSpecsGrid car={car} />
          </div>

          {/* Sticky Right Column (Pricing and Conversion Actions) */}
          <div className="lg:col-span-4 rounded-xl">
            <PriceCard car={car} />
          </div>

        </div>

        {/* Bottom Similar Cars recommendations */}
        <SimilarCars currentCar={car} allCars={allCars} />
        
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>© 2026 DreamDrive · Premium Automotive Index</p>
      </footer>
    </div>
  );
};

export default CarDetails;
