import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Clock, Car } from "lucide-react";
import { BookingModal } from "@/components/BookingModal";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import CONFIG from "@/config";

interface Dealer {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  workingHours: string;
  supportedBrands: string;
  rating: number;
  googleMapsUrl: string;
}

const COMMON_CITIES = [
  { label: "Pune", value: "pune" },
  { label: "Mumbai", value: "mumbai" },
  { label: "Delhi", value: "delhi" },
  { label: "Bengaluru", value: "bengaluru" },
  { label: "Hyderabad", value: "hyderabad" },
  { label: "Chennai", value: "chennai" },
  { label: "Ahmedabad", value: "ahmedabad" },
  { label: "Kolkata", value: "kolkata" },
];

export default function Dealers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [cityFilter, setCityFilter] = useState("Pune");
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | undefined>();

  useEffect(() => {
    fetchDealers();
  }, [cityFilter]);

  const fetchDealers = async () => {
    try {
      const url = cityFilter
        ? `${CONFIG.NODE_API_URL}/dealers?city=${encodeURIComponent(cityFilter)}`
        : `${CONFIG.NODE_API_URL}/dealers`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setDealers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dealers", error);
    }
  };

  const handleBookTestDrive = (dealer: Dealer) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedDealer(dealer);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight">
            Premium Dealerships
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Find certified DreamDrive partners near you to experience luxury firsthand.
          </p>
        </div>

        <div className="max-w-md mx-auto relative group">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-card border-border text-foreground h-14 text-base rounded-2xl focus-visible:ring-primary shadow-sm px-4"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <span className={cityFilter ? "text-foreground" : "text-muted-foreground"}>
                    {cityFilter || "Select or type a city..."}
                  </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-border shadow-xl overflow-hidden" align="start">
              <Command className="bg-card">
                <CommandInput 
                  placeholder="Search city..." 
                  className="h-12 border-none focus:ring-0" 
                  value={inputValue}
                  onValueChange={setInputValue}
                />
                <CommandList className="max-h-[300px]">
                  <CommandEmpty className="py-6 px-4 text-sm text-center">
                    <p className="text-muted-foreground">No city found.</p>
                    <Button 
                      variant="link" 
                      className="mt-2 text-primary p-0 h-auto font-semibold"
                      onClick={() => {
                        setCityFilter(inputValue);
                        setOpen(false);
                      }}
                    >
                      Use "{inputValue}" as location
                    </Button>
                  </CommandEmpty>
                  <CommandGroup heading="Common Cities" className="px-2">
                    {COMMON_CITIES.map((city) => (
                      <CommandItem
                        key={city.value}
                        value={city.label}
                        onSelect={(currentValue) => {
                          setCityFilter(currentValue === cityFilter ? "" : city.label);
                          setOpen(false);
                        }}
                        className="rounded-xl my-1 px-4 py-3 cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                      >
                        <Check
                          className={cn(
                            "mr-3 h-4 w-4 text-primary",
                            cityFilter === city.label ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {city.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {dealers.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground bg-card border border-border rounded-3xl shadow-sm">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium">No dealers found in this location.</p>
            <p className="mt-2 text-sm">Try searching for a different city or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {dealers.map((dealer) => (
              <div
                key={dealer.id}
                className="bg-card border border-border rounded-3xl p-8 hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex-1 space-y-5">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {dealer.name}
                    </h3>
                    <div className="flex items-center space-x-1 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 px-2.5 py-1 rounded-md text-sm font-semibold shrink-0">
                      <span>★</span>
                      <span>{dealer.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 text-muted-foreground text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{dealer.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary shrink-0" />
                      <p>{dealer.workingHours}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary shrink-0" />
                      <p>{dealer.phone}</p>
                    </div>
                    <div className="flex items-start gap-3 pt-2">
                      <Car className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(dealer.supportedBrands).map((brand: string, idx: number) => (
                          <span key={idx} className="bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full font-medium">
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.open(dealer.googleMapsUrl, "_blank")}
                    className="w-full h-12 font-semibold"
                  >
                    Open in Maps
                  </Button>
                  <Button
                    onClick={() => handleBookTestDrive(dealer)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold shadow-md"
                  >
                    Book Test Drive
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialDealer={selectedDealer}
      />
    </div>
  );
}
