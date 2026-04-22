import { Car } from "@/lib/carData";
import { formatEngineCC, formatMileage } from "@/lib/formatters";
import { 
  Fuel, 
  Cog, 
  Gauge, 
  Settings2, 
  Users, 
  Calendar, 
  Car as CarIcon, 
  Globe 
} from "lucide-react";

interface CarSpecsGridProps {
  car: Car;
}

const CarSpecsGrid = ({ car }: CarSpecsGridProps) => {
  const specs = [
    { icon: <Fuel className="w-5 h-5 text-primary" />, label: "Fuel Type", value: car.fuel_type },
    { icon: <Cog className="w-5 h-5 text-primary" />, label: "Transmission", value: car.transmission },
    { icon: <Gauge className="w-5 h-5 text-primary" />, label: "Mileage", value: formatMileage(car.mileage, car.fuel_type) },
    { icon: <Settings2 className="w-5 h-5 text-primary" />, label: "Engine CC", value: formatEngineCC(car.engine_cc, car.fuel_type) },
    { icon: <Users className="w-5 h-5 text-primary" />, label: "Seating", value: `${car.seating} Persons` },
    { icon: <Calendar className="w-5 h-5 text-primary" />, label: "Launch Year", value: car.launch_year },
    { icon: <CarIcon className="w-5 h-5 text-primary" />, label: "Body Type", value: car.body_type },
    { icon: <Globe className="w-5 h-5 text-primary" />, label: "Brand Origin", value: car.country || "Global" },
  ];

  return (
    <div className="bg-card border border-border p-6 rounded-2xl mb-8" style={{ boxShadow: "var(--shadow-card)" }}>
      <h3 className="text-xl font-bold font-sans mb-6">Key Specifications</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {specs.map((spec, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {spec.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 mt-0.5">{spec.label}</p>
              <p className="font-semibold text-foreground text-sm">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarSpecsGrid;
