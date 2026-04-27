import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { carApi, DisplayCar } from "@/services/carApi";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PlaySquare, ShieldCheck, Youtube } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Settings, Info } from "lucide-react";

export default function FeaturesExplained() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<DisplayCar | null>(null);
  const [featuresData, setFeaturesData] = useState<{ type: "videos" | "generated", content: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(parseInt(id, 10));
    }
  }, [id]);

  const fetchData = async (carId: number) => {
    setIsLoading(true);
    try {
      const [carData, data] = await Promise.all([
        carApi.getCarById(carId),
        carApi.getFeaturesExplained(carId)
      ]);
      setCar(carData);
      setFeaturesData(data);
    } catch (error) {
      console.error("Failed to fetch features explained", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 pt-32 pb-20 px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <ShieldCheck className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Car Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the vehicle you're looking for.</p>
          <Button asChild><Link to="/">Return Home</Link></Button>
        </div>
      </div>
    );
  }

  if (!featuresData || !featuresData.content || featuresData.content.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <PlaySquare className="w-16 h-16 text-slate-300 dark:text-slate-800 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Content Available</h2>
          <p className="text-muted-foreground mb-6">Feature explanation content is not available for the {car.brand} {car.model} yet.</p>
          <Button asChild variant="outline"><Link to={`/car-details/${car.displayId}`}>Back to Car Details</Link></Button>
        </div>
      </div>
    );
  }

  const isGenerated = featuresData.type === "generated";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb & Navigation */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
            <Link to={`/car-details/${car.displayId}`} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to {car.brand} {car.model}
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-wrap items-center gap-3">
            {isGenerated ? (
              <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
                <Settings className="w-3 h-3 mr-1 inline-block" /> Feature Highlights
              </Badge>
            ) : (
              <Badge variant="secondary" className="px-3 py-1 bg-red-500/10 text-red-600 border-red-500/20">
                <Youtube className="w-3 h-3 mr-1 inline-block" /> Video Features
              </Badge>
            )}
            <Badge variant="outline" className="px-3 py-1">
              {car.brand} {car.model}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Features Explained
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {isGenerated 
              ? `Discover the key features, powertrain details, and practicality aspects that define the ${car.brand} ${car.model}.`
              : `Watch detailed walkthroughs, hidden feature explanations, and comprehensive reviews to know everything about the ${car.brand} ${car.model}.`
            }
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuresData.content.map((item, idx) => (
            <Card key={idx} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-border/50 rounded-2xl flex flex-col">
              {isGenerated ? (
                <CardContent className="p-8 flex-grow flex flex-col">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold leading-tight mb-4 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              ) : (
                <>
                  <div className="relative pt-[56.25%] bg-slate-900 w-full flex-shrink-0">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${item.videoId}?rel=0`}
                      title={item.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col justify-between bg-card">
                    <div>
                      <h3 className="text-xl font-bold leading-tight mb-2 text-foreground line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Youtube className="w-4 h-4 text-red-500" />
                        <span className="font-medium">{item.channel}</span>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
