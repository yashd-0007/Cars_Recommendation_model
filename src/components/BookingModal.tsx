import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Calendar, Clock, CheckCircle, Car } from "lucide-react";
import CONFIG from "@/config";

interface Dealer {
  id: string | number;
  placeId?: string;
  name: string;
  city: string;
  address: string;
  phone?: string;
  workingHours?: string;
  supportedBrands?: string;
  rating?: number;
  lat?: number;
  lon?: number;
}

interface CarData {
  displayId: number;
  brand: string;
  model: string;
  variant: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId?: string;
  initialDealer?: Dealer;
}

export function BookingModal({ isOpen, onClose, carId: initialCarId, initialDealer }: BookingModalProps) {
  const { user } = useAuth();
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [cars, setCars] = useState<CarData[]>([]);
  const [selectedDealerId, setSelectedDealerId] = useState<string>(initialDealer ? initialDealer.id.toString() : "");
  const [selectedCar, setSelectedCar] = useState<string>(initialCarId || "");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (!initialDealer) {
        fetchDealers();
      } else {
        // If initialDealer is passed, we can just use it as our list to select from to avoid refetching
        setDealers([initialDealer]);
        setSelectedDealerId(initialDealer.id.toString());
      }
      if (!initialCarId) fetchCars();
      setSuccess(false);
      setDate("");
      setTimeSlot("");
      if (initialCarId) setSelectedCar(initialCarId);
    }
  }, [isOpen, initialDealer, initialCarId]);

  const currentDealer = dealers.find(d => d.id.toString() === selectedDealerId);

  const filteredCars = useMemo(() => {
    if (!currentDealer || !currentDealer.supportedBrands) return cars;
    try {
      const supportedBrands: string[] = JSON.parse(currentDealer.supportedBrands);
      if (supportedBrands.includes("Multi-Brand") || supportedBrands.length === 0) {
        return cars;
      }
      return cars.filter(car => 
        supportedBrands.some(b => car.brand.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(car.brand.toLowerCase()))
      );
    } catch (e) {
      return cars;
    }
  }, [cars, currentDealer]);

  const fetchDealers = async () => {
    try {
      // Default to Pune if fetching for general booking without context
      const res = await fetch(`${CONFIG.NODE_API_URL}/dealers?city=Pune`);
      const data = await res.json();
      if (data.success) setDealers(data.data);
    } catch (error) {
      console.error("Failed to fetch dealers", error);
    }
  };

  const fetchCars = async () => {
    try {
      const res = await fetch(`${CONFIG.NODE_API_URL}/cars`);
      const data = await res.json();
      if (data.success) setCars(data.data);
    } catch (error) {
      console.error("Failed to fetch cars", error);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to book a test drive.");
      return;
    }
    if (!selectedDealerId || !selectedCar || !date || !timeSlot) {
      toast.error("Please fill in all fields.");
      return;
    }

    const fullDealerData = dealers.find(d => d.id.toString() === selectedDealerId);

    setIsLoading(true);
    try {
      const res = await fetch(`${CONFIG.NODE_API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          dealer: fullDealerData,
          carId: selectedCar,
          date,
          timeSlot,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        toast.success("Test drive booked successfully!");
        setTimeout(() => onClose(), 2000);
      } else {
        toast.error(data.message || "Failed to book test drive");
      }
    } catch (error) {
      toast.error("An error occurred while booking.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border shadow-elevated">
        {success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-foreground">Booking Confirmed</h2>
            <p className="text-muted-foreground text-center">Your test drive has been scheduled. The dealer will contact you shortly.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Book a Test Drive</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Schedule an exclusive test drive at your preferred dealership.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              {!initialCarId && (
                <div className="space-y-2">
                  <Label htmlFor="car" className="flex items-center gap-2 text-muted-foreground">
                    <Car className="w-4 h-4 text-primary" /> Select Car
                  </Label>
                  <Select value={selectedCar} onValueChange={setSelectedCar}>
                    <SelectTrigger className="w-full bg-background border-border text-foreground">
                      <SelectValue placeholder="Choose a car model" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground max-h-[200px]">
                      {filteredCars.length > 0 ? (
                        filteredCars.map((car) => (
                          <SelectItem key={car.displayId} value={car.displayId.toString()}>
                            {car.brand} {car.model} ({car.variant})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          {currentDealer ? `No ${JSON.parse(currentDealer.supportedBrands || "[]").join(", ")} cars available` : "Loading cars..."}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="dealer" className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" /> Select Dealership
                </Label>
                <Select value={selectedDealerId} onValueChange={setSelectedDealerId}>
                  <SelectTrigger className="w-full bg-background border-border text-foreground">
                    <SelectValue placeholder="Choose a dealer nearby" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground max-h-[200px]">
                    {dealers.length > 0 ? (
                      dealers.map((dealer) => (
                        <SelectItem key={dealer.id} value={dealer.id.toString()}>
                          {dealer.name} ({dealer.city})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>Loading dealers...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" /> Preferred Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" /> Time Slot
                </Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger className="w-full bg-background border-border text-foreground">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    <SelectItem value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</SelectItem>
                    <SelectItem value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</SelectItem>
                    <SelectItem value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="bg-transparent border-border text-foreground hover:bg-muted">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? "Booking..." : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
