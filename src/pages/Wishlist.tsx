import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { wishlistApi } from "@/services/wishlistApi";
import { loadCarData, Car } from "@/lib/carData";
import CarCard from "@/components/CarCard";
import Navbar from "@/components/Navbar";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
  const { user } = useAuth();
  const [savedCars, setSavedCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchWishlistData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        // Step 1: Fetch precise saved indices from backend datastore
        const savedIndices = await wishlistApi.getWishlist(user.id);
        
        // Step 2: Extract real car data intersecting safely over local datasets
        const allCars = await loadCarData();
        const mappedCars = allCars.filter((car) => savedIndices.includes(car.index));
        
        setSavedCars(mappedCars);
      } catch (err: any) {
        setError(err.message || "Failed to load wishlist safely.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistData();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-background pt-24">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-sans">
            My <span className="text-gradient-golden">Wishlist</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage specific cars tightly bound to your personal DreamDrive profile.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Syncing saved cars from backend...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-xl text-center shadow-sm">
            <p className="mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : savedCars.length === 0 ? (
          <div className="bg-card border border-border shadow-sm rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-primary opacity-60" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No cars saved yet</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Discover and compare cars matching your lifestyle, and tap the heart icon to save them securely here.
            </p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 shadow-md hover:shadow-lg transition-all">
              <Link to="/#search-section">Explore Cars</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCars.map((car, index) => (
              <CarCard key={car.index} car={car} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
