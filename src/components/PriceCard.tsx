import { Car, formatPrice } from "@/lib/carData";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, ArrowLeftRight, CarFront } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { wishlistApi } from "@/services/wishlistApi";
import { compareApi } from "@/services/compareApi";
import { BookingModal } from "@/components/BookingModal";

interface PriceCardProps {
  car: Car;
}

const PriceCard = ({ car }: PriceCardProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompareLoading, setIsCompareLoading] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Check saved status on component mount gracefully
  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const status = await wishlistApi.checkSaved(user.id, car.index);
          const compareStatus = await compareApi.checkSaved(user.id, car.index);
          setIsSaved(status);
          setIsCompared(compareStatus);
        } catch (error) {
          console.error("Failed to check backend statuses", error);
        }
      }
    };
    checkStatus();
  }, [isAuthenticated, user, car.index]);

  const handleToggleSave = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in carefully to save cars to your wishlist.");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await wishlistApi.removeCar(user.id, car.index);
        setIsSaved(false);
        toast.success(`${car.model} safely removed from wishlist.`);
      } else {
        await wishlistApi.addCar(user.id, car.index);
        setIsSaved(true);
        toast.success(`${car.model} successfully added to wishlist!`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update wishlist natively.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCompare = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in actively to compare vehicles.");
      navigate("/login");
      return;
    }

    setIsCompareLoading(true);
    try {
      if (isCompared) {
        await compareApi.removeCar(user.id, car.index);
        setIsCompared(false);
        toast.success(`${car.model} safely removed from comparison set.`);
      } else {
        await compareApi.addCar(user.id, car.index);
        setIsCompared(true);
        toast.success(`${car.model} effectively added to comparison set!`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed generic compare hook constraints.");
    } finally {
      setIsCompareLoading(false);
    }
  };

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
        <Button 
          onClick={() => setIsBookingOpen(true)}
          className="w-full text-base py-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
        >
          <CarFront className="mr-2 h-5 w-5" />
          Book Test Drive
        </Button>
        <div className="grid grid-cols-2 gap-3">
           <Button 
            variant="outline" 
            className={`w-full transition-colors ${isSaved ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" : ""}`}
            onClick={handleToggleSave}
            disabled={isLoading}
          >
            <Heart className={`mr-2 h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button 
            variant="outline" 
            className={`w-full transition-colors ${isCompared ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" : ""}`}
            onClick={handleToggleCompare}
            disabled={isCompareLoading}
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            {isCompared ? "Compared" : "Compare"}
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="text-sm text-muted-foreground text-center">
        Pricing varies by city, dealership, and selected variants. Taxes and RTO fees apply.
      </div>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        carId={car.index.toString()} 
      />
    </div>
  );
};

export default PriceCard;
