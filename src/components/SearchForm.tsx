import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, loadCarData, getUniqueFuelTypes, getUniqueBodyTypes, getUniqueTransmissions, UserPreferences } from "@/lib/carData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/carData";
import { Search, Fuel, Car as CarIcon, IndianRupee, Wallet } from "lucide-react";

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

  useEffect(() => {
    loadCarData().then(setCars);
  }, []);

  const fuelTypes = ["Any", ...getUniqueFuelTypes(cars)];
  const bodyTypes = ["Any", ...getUniqueBodyTypes(cars)];
  const transmissions = ["Any", ...getUniqueTransmissions(cars)];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      monthlySalary,
      budget,
      fuelType,
      bodyType,
      transmission,
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
      <div className="max-w-3xl mx-auto">
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
          className="bg-card border border-border rounded-2xl p-6 md:p-10 space-y-8"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Monthly Salary */}
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
                max={1000000}
                step={5000}
                className="flex-1"
              />
              <span className="text-sm font-medium text-primary min-w-[100px] text-right">
                {formatPrice(monthlySalary)}
              </span>
            </div>
          </div>

          {/* Budget */}
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
                max={15000000}
                step={100000}
                className="flex-1"
              />
              <span className="text-sm font-medium text-primary min-w-[100px] text-right">
                {formatPrice(budget)}
              </span>
            </div>
          </div>

          {/* Fuel, Body, Transmission */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-primary" />
                Fuel Type
              </Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((ft) => (
                    <SelectItem key={ft} value={ft}>
                      {ft}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CarIcon className="w-4 h-4 text-primary" />
                Body Type
              </Label>
              <Select value={bodyType} onValueChange={setBodyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypes.map((bt) => (
                    <SelectItem key={bt} value={bt}>
                      {bt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                Transmission
              </Label>
              <Select value={transmission} onValueChange={setTransmission}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {transmissions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-golden text-primary-foreground py-4 rounded-xl text-lg font-medium shadow-md hover:shadow-lg transition-shadow disabled:opacity-60"
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
