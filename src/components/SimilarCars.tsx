import { Car } from "@/lib/carData";
import CarCard from "@/components/CarCard";

interface SimilarCarsProps {
  currentCar: Car;
  allCars: Car[];
}

const SimilarCars = ({ currentCar, allCars }: SimilarCarsProps) => {
  // Logic to find similar cars: Same Brand or Same Segment, excluding the current car
  const similarCars = allCars
    .filter((c) => c.index !== currentCar.index && (c.segment === currentCar.segment || c.brand === currentCar.brand))
    .sort((a, b) => b.score - a.score) // Show highest scored similar cars first
    .slice(0, 4);

  if (similarCars.length === 0) return null;

  return (
    <section className="mt-16 pt-16 border-t border-border">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-sans">
          Similar <span className="text-gradient-golden">Cars</span>
        </h2>
        <p className="text-muted-foreground mt-2">
          Explore other highly-rated vehicles in the {currentCar.segment} segment or from {currentCar.brand}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarCars.map((car, index) => (
          <CarCard key={car.index} car={car} index={index} />
        ))}
      </div>
    </section>
  );
};

export default SimilarCars;
