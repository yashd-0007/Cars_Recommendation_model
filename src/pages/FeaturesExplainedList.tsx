import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { carApi, DisplayCar } from "@/services/carApi";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Youtube, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeaturesExplainedList() {
  const [cars, setCars] = useState<DisplayCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const indices = await carApi.getContentIndices();
      const allCars = await carApi.getAllCars();
      
      const availableCars = allCars.filter(car => indices.features.includes(car.displayId));
      setCars(availableCars);
    } catch (error) {
      console.error("Failed to fetch features list", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <Youtube className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Features Explained</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Video walkthroughs, hidden features, and detailed capability demonstrations.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">No feature videos are currently available.</p>
            <Button asChild><Link to="/">Browse All Cars</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map(car => (
              <Card key={car.displayId} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50 rounded-2xl flex flex-col">
                <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img 
                    src={car.imageUrl || `https://placehold.co/600x400/2D3748/FFFFFF?text=${encodeURIComponent(car.brand + ' ' + car.model)}`} 
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-white/90 text-red-600 hover:bg-white border-none shadow-md">
                      <Youtube className="w-3 h-3 mr-1 inline-block" /> Video Guide
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="text-sm font-medium text-muted-foreground mb-1">{car.brand}</div>
                  <h3 className="text-xl font-bold mb-4 line-clamp-1">{car.model}</h3>
                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-sm font-medium text-red-600">Watch Features</span>
                    <Button size="icon" variant="ghost" asChild className="rounded-full w-8 h-8 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                      <Link to={`/features-explained/${car.displayId}`}>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
