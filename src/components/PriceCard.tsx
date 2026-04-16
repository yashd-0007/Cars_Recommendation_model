import { Car, formatPrice } from "@/lib/carData";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, ArrowLeftRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PriceCardProps {
  car: Car;
}

const PriceCard = ({ car }: PriceCardProps) => {
  // Rough estimate logic for EMI display (Assuming 10% down, 9.5% interest, 5 years)
  const principal = car.price_min_inr * 0.9;
  const r = 9.5 / 12 / 100;
  const n = 60;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const formattedEmi = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(emi);

  return (
    <div className="bg-card border border-border p-6 rounded-2xl sticky top-24" style={{ boxShadow: "var(--shadow-card)" }}>
      <h3 className="text-lg font-semibold text-muted-foreground mb-2">Ex-Showroom Price</h3>
      <div className="text-3xl lg:text-4xl font-bold text-gradient-golden mb-6">
         {formatPrice(car.price_min_inr)}
         {car.price_min_inr !== car.price_max_inr && (
           <span className="text-xl lg:text-2xl text-muted-foreground font-medium block mt-1">
             to {formatPrice(car.price_max_inr)}
           </span>
         )}
      </div>

      <div className="bg-accent/50 p-4 rounded-xl border border-border/50 mb-6">
        <p className="text-sm text-muted-foreground mb-1">Estimated EMI Starts From</p>
        <p className="text-xl font-bold font-sans">{formattedEmi} <span className="text-sm font-normal text-muted-foreground">/mo</span></p>
      </div>

      <div className="space-y-3">
        <Button className="w-full text-base py-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
          <MessageSquare className="mr-2 h-5 w-5" />
          Contact Dealer
        </Button>
        <div className="grid grid-cols-2 gap-3">
           <Button variant="outline" className="w-full">
            <Heart className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" className="w-full">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Compare
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="text-sm text-muted-foreground text-center">
        Pricing varies by city, dealership, and selected variants. Taxes and RTO fees apply.
      </div>
    </div>
  );
};

export default PriceCard;
