import { Car } from "@/lib/carData";
import { getCarImage } from "@/lib/carImages";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Rotate3d, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCar360Asset } from "@/lib/car360Data";
import Car360Viewer from "./Car360Viewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CarDetailHeroProps {
  car: Car;
}

const CarDetailHero = ({ car }: CarDetailHeroProps) => {
  const [show360, setShow360] = useState(false);
  const matchPercent = Math.round(car.score * 100);
  const asset360 = car.id ? getCar360Asset(car.id) : null;

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

        <div className="flex flex-col gap-3 items-end">
          {asset360 ? (
            <Dialog open={show360} onOpenChange={setShow360}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-primary/20 backdrop-blur-xl border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground px-6 py-6 rounded-2xl flex items-center gap-3 transition-all duration-300 group shadow-lg"
                >
                  <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-white/20 transition-colors">
                    <Rotate3d className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Interactive</p>
                    <p className="text-sm font-bold">360° Experience</p>
                  </div>
                  <Sparkles className="w-4 h-4 ml-1 text-amber-500 animate-bounce" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 overflow-hidden border-none bg-transparent shadow-none">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl rounded-3xl overflow-hidden border border-border/50">
                  <div className="absolute top-6 left-8 z-50">
                    <h2 className="text-2xl font-bold font-sans">
                      {car.brand} <span className="text-gradient-golden">{car.model}</span> 360°
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Full Interactive Rotation</p>
                  </div>
                  <Car360Viewer frames={asset360.frames} isModal onClose={() => setShow360(false)} />
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button 
              disabled
              className="bg-muted/50 backdrop-blur-md border border-border/50 text-muted-foreground px-6 py-6 rounded-2xl flex items-center gap-3 opacity-60 cursor-not-allowed"
            >
              <Rotate3d className="w-5 h-5" />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Coming Soon</p>
                <p className="text-sm font-bold">360° View</p>
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailHero;
