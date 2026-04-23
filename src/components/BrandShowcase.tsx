import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadCarData, getUniqueBrands } from "@/lib/carData";

const BrandShowcase = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      const cars = await loadCarData();
      const uniqueBrands = getUniqueBrands(cars);
      // Filter out empty or invalid brands
      setBrands(uniqueBrands.filter(b => b && b !== "Unknown"));
    };
    fetchBrands();
  }, []);

  if (brands.length === 0) return null;

  const handleBrandClick = (brand: string) => {
    navigate(`/brands/${encodeURIComponent(brand.toLowerCase())}`);
  };

  return (
    <section className="py-12 bg-background border-y border-border/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-sm font-bold tracking-[0.2em] uppercase text-muted-foreground text-center">
          Explore Top Premium Brands
        </p>
      </div>
      
      {/* Marquee Container */}
      <div className="relative flex overflow-x-hidden group">
        {/* Left Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        
        {/* Right Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-16 md:gap-24 items-center whitespace-nowrap pr-16 md:pr-24"
          animate={{ x: [0, -2000] }} // Increased range for dynamic content
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 40, // Slightly slower for more brands
          }}
          // Pause on hover
          whileHover={{ animationPlayState: "paused" }}
        >
          {/* We render the list twice to create an infinite scroll illusion */}
          {[...brands, ...brands, ...brands].map((brand, idx) => (
            <span
              key={idx}
              onClick={() => handleBrandClick(brand)}
              className="text-2xl md:text-4xl font-serif text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer duration-500 hover:scale-110 transform inline-block"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandShowcase;
