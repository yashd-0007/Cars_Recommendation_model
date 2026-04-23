import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, loadCarData, getUniqueFuelTypes, getUniqueBodyTypes, getUniqueTransmissions, getUniqueBrands, UserPreferences, formatPrice } from "@/lib/carData";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Fuel, Car as CarIcon, IndianRupee, Wallet, Users, Zap, MapPin, Briefcase, Award, Cog } from "lucide-react";

interface SearchFormProps {
  onSearch: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [monthlySalary, setMonthlySalary] = useState<number>(50000);
  const [budget, setBudget] = useState<number>(5000000);
  const [fuelType, setFuelType] = useState<string>("Any");
  const [bodyType, setBodyType] = useState<string>("Any");
  const [transmission, setTransmission] = useState<string>("Any");
  
  const [preferredBrand, setPreferredBrand] = useState<string>("Any");
  const [seating, setSeating] = useState<string>("Any");
  const [evHybridPreference, setEvHybridPreference] = useState<string>("Any");
  const [city, setCity] = useState<string>("Any");
  const [lifestyle, setLifestyle] = useState<string>("Any");

  // Derive dynamic budget ceiling from data
  const maxCarPrice = cars.length > 0 
    ? cars.reduce((max, car) => Math.max(max, car.price_max_inr), 0)
    : 15000000;
    
  const sliderMax = Math.max(15000000, Math.ceil(maxCarPrice / 1000000) * 1000000);

  useEffect(() => {
    loadCarData().then(setCars);
  }, []);

  // Update budget if it exceeds the new max (though unlikely as max only grows)
  useEffect(() => {
    if (budget > sliderMax) {
      setBudget(sliderMax);
    }
  }, [sliderMax]);

  const fuelTypes = ["Any", ...getUniqueFuelTypes(cars)];
  const bodyTypes = ["Any", ...getUniqueBodyTypes(cars)];
  const transmissions = ["Any", ...getUniqueTransmissions(cars)];
  const brands = ["Any", ...getUniqueBrands(cars)];
  const seatings = ["Any", "2", "4", "5", "6", "7", "8+"];
  const evHybrids = ["Any", "Electric", "Hybrid", "Conventional"];
  const cities = ["Any", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Other"];
  const lifestyles = ["Any", "Family", "City Commute", "Highway Cruising", "Luxury & Status", "First Car"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      monthlySalary,
      budget,
      fuelType,
      bodyType,
      transmission,
      preferredBrand,
      seating,
      evHybridPreference,
      city,
      lifestyle
    });
  };

  return (
    <motion.section
      id="search-section"
      className="py-20 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Tell Us About <span className="text-gradient-golden">You</span>
          </h2>
          <p className="text-muted-foreground">
            Share your preferences and let our AI find the perfect match
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 md:p-10 space-y-12"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Section 1: Financials */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2 text-primary">
              <Wallet className="w-5 h-5" /> Financials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base font-medium">
                  <Wallet className="w-4 h-4 text-primary" />
                  Monthly Salary
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[monthlySalary]}
                    onValueChange={([v]) => setMonthlySalary(v)}
                    min={10000}
                    max={2000000}
                    step={10000}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-primary min-w-[100px] text-right">
                    {formatPrice(monthlySalary)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base font-medium">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  Maximum Budget
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[budget]}
                    onValueChange={([v]) => setBudget(v)}
                    min={500000}
                    max={sliderMax}
                    step={500000}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-primary min-w-[100px] text-right">
                    {formatPrice(budget)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Core Specifications */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2 text-primary">
              <CarIcon className="w-5 h-5" /> Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Preferred Brand
                </Label>
                <Select value={preferredBrand} onValueChange={setPreferredBrand}>
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CarIcon className="w-4 h-4 text-primary" />
                  Body Type
                </Label>
                <Select value={bodyType} onValueChange={setBodyType}>
                  <SelectTrigger><SelectValue placeholder="Select body type" /></SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map((bt) => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-primary" />
                  Fuel Type
                </Label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger><SelectValue placeholder="Select fuel type" /></SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((ft) => <SelectItem key={ft} value={ft}>{ft}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Cog className="w-4 h-4 text-primary" />
                  Transmission
                </Label>
                <Select value={transmission} onValueChange={setTransmission}>
                  <SelectTrigger><SelectValue placeholder="Select transmission" /></SelectTrigger>
                  <SelectContent>
                    {transmissions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Seating Capacity
                </Label>
                <Select value={seating} onValueChange={setSeating}>
                  <SelectTrigger><SelectValue placeholder="Select seating" /></SelectTrigger>
                  <SelectContent>
                    {seatings.map((s) => <SelectItem key={s} value={s}>{s !== "Any" ? `${s} Seats` : s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  EV / Hybrid
                </Label>
                <Select value={evHybridPreference} onValueChange={setEvHybridPreference}>
                  <SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger>
                  <SelectContent>
                    {evHybrids.map((ev) => <SelectItem key={ev} value={ev}>{ev}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 3: Lifestyle & Environment */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2 text-primary">
              <Briefcase className="w-5 h-5" /> Lifestyle & Environment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  City / Location
                </Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Primary Use / Lifestyle
                </Label>
                <Select value={lifestyle} onValueChange={setLifestyle}>
                  <SelectTrigger><SelectValue placeholder="Select use-case" /></SelectTrigger>
                  <SelectContent>
                    {lifestyles.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-golden text-primary-foreground py-4 rounded-xl text-lg font-medium shadow-md hover:shadow-lg transition-shadow disabled:opacity-60 mt-8"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isLoading ? "Finding your dream car..." : "🚗 Get Recommendations"}
          </motion.button>
        </form>
      </div>
    </motion.section>
  );
};

export default SearchForm;
