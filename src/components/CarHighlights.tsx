import { Car } from "@/lib/carData";
import { formatEngineCC } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star } from "lucide-react";

interface CarHighlightsProps {
  car: Car;
}

const CarHighlights = ({ car }: CarHighlightsProps) => {
  // Algorithmic Tag Generation based on car params natively
  const generateHighlights = () => {
    const highlights = [];
    
    // Mileage bounds scaled around normalized boundaries
    if (car.mileage >= 0.7) highlights.push("Highly Fuel Efficient");
    else if (car.mileage >= 0.4) highlights.push("Good Daily Commuter");
    
    // Transmission
    if (car.transmission === "Automatic") highlights.push("Easy City Driving");
    if (car.transmission === "Manual") highlights.push("Engaging Driving Experience");
    
    // Seating & Body
    if (car.seating >= 6 || car.body_type === "SUV" || car.body_type === "MUV") highlights.push("Family Friendly");
    if (car.body_type === "Hatchback") highlights.push("Easy to Park & Maneuver");
    
    // Power & Price Segments
    if (car.engine_cc >= 0.5) highlights.push("High Performance Engine");
    if (car.price_max_inr >= 3000000) highlights.push("Premium Luxury Interiors");
    
    // Safety Net
    if (highlights.length < 3) highlights.push("Excellent Resale Value");
    if (highlights.length < 3) highlights.push("Low Maintenance Costs");

    return highlights.slice(0, 5); // Return top 5 dynamically
  };

  const dynamicHighlights = generateHighlights();

  return (
    <div className="bg-card border border-border p-6 rounded-2xl mb-8" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-primary fill-primary/20" />
        <h3 className="text-xl font-bold font-sans">Why buy this car?</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {dynamicHighlights.map((highlight, index) => (
          <Badge key={index} variant="secondary" className="px-4 py-2 text-sm bg-accent/60 hover:bg-accent cursor-default border border-border/50">
            <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
            {highlight}
          </Badge>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
         <h4 className="font-semibold mb-2">Overview</h4>
         <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
           The {car.brand} {car.model} is a versatile {car.body_type.toLowerCase()} engineered to deliver a balanced mix of performance and comfort. Featuring a {formatEngineCC(car.engine_cc, car.fuel_type)} engine paired with a sharp {car.transmission} transmission, it is optimally suited for both urban commutes and long highway drives.
         </p>
      </div>
    </div>
  );
};

export default CarHighlights;
