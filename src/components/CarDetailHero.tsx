import { Car } from "@/lib/carData";
import { getCarImage } from "@/lib/carImages";
import { Badge } from "@/components/ui/badge";

interface CarDetailHeroProps {
  car: Car;
}

const CarDetailHero = ({ car }: CarDetailHeroProps) => {
  const matchPercent = Math.round(car.score * 100);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-xl" style={{ boxShadow: "var(--shadow-card)" }}>
      <img
        src={getCarImage(car)}
        alt={`${car.brand} ${car.model}`}
        className="w-full h-full object-cover"
      />
      
      {/* Soft Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>

      <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex gap-2 mb-3">
             <Badge
                className={`text-sm font-semibold px-3 py-1 ${
                  matchPercent >= 30
                    ? "bg-green-500/90 hover:bg-green-500/100 text-white"
                    : matchPercent >= 15
                    ? "bg-primary/90 text-primary-foreground"
                    : "bg-muted-foreground/80 text-white"
                }`}
              >
                {matchPercent}% Match
              </Badge>
              <Badge variant="secondary" className="text-sm backdrop-blur-md bg-secondary/80">
                {car.segment} Segment
              </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-sans text-foreground mb-2 drop-shadow-sm">
            {car.brand} <span className="text-gradient-golden">{car.model}</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium drop-shadow-sm">
            {car.variant}
          </p>
          
          <p className="mt-4 text-muted-foreground/90 max-w-lg hidden md:block">
            Experience premium engineering and advanced performance with the latest {car.model}. The perfect `{car.body_type}` for your lifestyle.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarDetailHero;
