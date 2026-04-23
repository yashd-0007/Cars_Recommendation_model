import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { compareApi } from "@/services/compareApi";
import { loadCarData, Car, formatPrice } from "@/lib/carData";
import { getCarImage } from "@/lib/carImages";
import { formatEngineCC, formatMileage } from "@/lib/formatters";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeftRight, Loader2, Trash2, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Compare = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comparedCars, setComparedCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCompareData();
  }, [user]);

  const fetchCompareData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const compareIds = await compareApi.getCompareList(user.id);
      
      const allCars = await loadCarData();
      const mappedCars = allCars.filter((car) => compareIds.includes(car.index));
      
      setComparedCars(mappedCars);
    } catch (err: any) {
      setError(err.message || "Failed to load comparison data safely.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCar = async (carId: number, carModel: string) => {
    if (!user) return;
    try {
      await compareApi.removeCar(user.id, carId);
      setComparedCars(prev => prev.filter(c => c.index !== carId));
      toast.success(`${carModel} safely removed from comparison.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to detach car from list.");
    }
  };

  const handleClearCompare = async () => {
    if (!user) return;
    try {
      await compareApi.clearCompare(user.id);
      setComparedCars([]);
      toast.success("Comparison list perfectly wiped clean.");
    } catch (err: any) {
      toast.error(err.message || "Failed generic clearing logic.");
    }
  };

  const renderRow = (label: string, field: keyof Car | ((car: Car) => React.ReactNode), isHighlighted = false) => (
    <div className={`flex flex-col md:flex-row border-b border-border transition-colors hover:bg-muted/30 ${isHighlighted ? 'bg-muted/10 font-medium' : ''}`}>
      <div className="w-full md:w-48 shrink-0 p-4 font-semibold text-muted-foreground bg-accent/30 text-sm flex items-center md:border-r border-border">
        {label}
      </div>
      <div className="flex-1 flex overflow-x-auto">
        {comparedCars.map((car) => (
          <div key={car.index} className="flex-1 min-w-[280px] p-4 text-sm text-foreground text-center border-r border-border last:border-r-0 flex items-center justify-center">
            {typeof field === 'function' 
              ? field(car) 
              : (typeof car[field] === 'object' ? JSON.stringify(car[field]) : (car[field] as React.ReactNode))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background pt-24">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sans">
              Compare <span className="text-gradient-golden">Cars</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Side-by-side analysis of your top tailored choices
            </p>
          </div>
          {comparedCars.length > 0 && (
            <Button variant="destructive" onClick={handleClearCompare} className="flex items-center gap-2 shadow-sm">
              <Trash2 className="w-4 h-4" /> Clear All
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Synchronizing specifications securely...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-xl text-center shadow-sm">
            <p className="mb-4">{error}</p>
            <Button variant="outline" onClick={fetchCompareData}>Attempt Retry</Button>
          </div>
        ) : comparedCars.length === 0 ? (
          <div className="bg-card border border-border shadow-sm rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <ArrowLeftRight className="w-10 h-10 text-amber-500 opacity-80" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No cars selected for comparison</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Explore our models and click the Compare button to deeply analyze up to 3 models simultaneously.
            </p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 shadow-md hover:shadow-lg transition-all">
              <Link to="/#search-section">Discover Vehicles</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden mb-12">
            
            {/* Header Images Row */}
            <div className="flex flex-col md:flex-row border-b border-border bg-card">
              <div className="w-full md:w-48 shrink-0 p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-border bg-accent/30">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-muted-foreground to-muted-foreground/30">VS</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest mt-2">{comparedCars.length}/3 Limit</span>
              </div>
              <div className="flex-1 flex overflow-x-auto">
                {comparedCars.map((car) => (
                  <div key={car.index} className="flex-1 min-w-[280px] p-6 text-center border-r border-border last:border-r-0 relative group">
                    <div className="h-40 mb-4 rounded-xl overflow-hidden shadow-inner border border-border/50 relative bg-muted cursor-pointer group/image" onClick={() => navigate(`/car-details/${car.index}`)}>
                       <img src={getCarImage(car)} alt={car.model} className="w-full h-full object-cover group-hover/image:scale-105 transition-transform" />
                       
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleRemoveCar(car.index, car.model); }}
                         className="absolute top-2 right-2 z-10 bg-background/70 backdrop-blur-sm text-foreground/70 hover:bg-destructive hover:text-destructive-foreground transition-all rounded-full p-1.5 shadow-sm opacity-100 md:opacity-0 group-hover/image:opacity-100"
                         title="Remove from comparison"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                       <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="backdrop-blur-md bg-background/60 shadow-sm">{Math.round(car.score * 100)}% Match</Badge>
                       </div>
                    </div>
                    <Badge variant="outline" className="mb-2 bg-background">{car.brand}</Badge>
                    <h3 className="text-xl font-bold font-sans hover:text-primary cursor-pointer transition-colors" onClick={() => navigate(`/car-details/${car.index}`)}>{car.model}</h3>
                    <p className="text-sm text-muted-foreground truncate">{car.variant}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className="flex flex-col">
              {renderRow("Estimated Price", (car) => (
                <span className="text-base font-bold text-gradient-golden">
                  {formatPrice(car.price_min_inr)}
                  {car.price_min_inr !== car.price_max_inr ? ` - ${formatPrice(car.price_max_inr)}` : ""}
                </span>
              ), true)}
              {renderRow("Fuel Type", "fuel_type")}
              {renderRow("Transmission", "transmission")}
              {renderRow("Mileage", (car) => formatMileage(car.mileage, car.fuel_type), true)}
              {renderRow("Engine Capacity", (car) => formatEngineCC(car.engine_cc, car.fuel_type))}
              {renderRow("Body Type", "body_type")}
              {renderRow("Seating Capacity", (car) => `${car.seating} Seats`)}
              {renderRow("Launch Year", "launch_year")}
              {renderRow("Segment", "segment")}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Compare;
