import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Car, formatPrice } from "@/lib/carData";
import { getCarImage } from "@/lib/carImages";
import { formatMileage } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Fuel, Users, Calendar, Gauge, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarCardProps {
  car: Car;
  index: number;
}

const CarCard = ({ car, index }: CarCardProps) => {
  const navigate = useNavigate();
  const matchPercent = Math.round(car.score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={getCarImage(car)}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <Badge
            className={`text-xs font-semibold px-2 py-1 ${
              matchPercent >= 30
                ? "bg-green-500/90 text-white"
                : matchPercent >= 15
                ? "bg-primary/90 text-primary-foreground"
                : "bg-muted-foreground/80 text-white"
            }`}
          >
            {matchPercent}% Match
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs backdrop-blur-sm">
            {car.segment}
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="mb-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {car.brand}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-1 font-sans">
          {car.model}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{car.variant}</p>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fuel className="w-3.5 h-3.5 text-primary" />
            {car.fuel_type}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cog className="w-3.5 h-3.5 text-primary" />
            {car.transmission}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{formatMileage(car.mileage, car.fuel_type)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {car.launch_year}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">Price Range</span>
            <p className="text-base font-bold text-gradient-golden">
              {formatPrice(car.price_min_inr)} – {formatPrice(car.price_max_inr)}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {car.body_type}
          </Badge>
        </div>

        {/* View Details Button */}
        <div className="pt-4 mt-4 border-t border-border">
          <Button 
            variant="secondary" 
            className="w-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            onClick={() => navigate(`/car-details/${car.index}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
