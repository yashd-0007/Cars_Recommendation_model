import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import logo from "@/assets/dreamdrive-logo.png";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const carouselItems = [
  {
    id: 1,
    brand: "BMW",
    model: "7 Series",
    subtitle: "The Pinnacle of Luxury",
    image: `${import.meta.env.BASE_URL}images/cars/bmw_7_series.png`,
  },
  {
    id: 2,
    brand: "BMW",
    model: "5 Series",
    subtitle: "Dynamic Elegance",
    image: `${import.meta.env.BASE_URL}images/cars/bmw_5_series.png`,
  },
  {
    id: 3,
    brand: "BMW",
    model: "3 Series",
    subtitle: "Unleash the Drive",
    image: `${import.meta.env.BASE_URL}images/cars/bmw_3_series.png`,
  },
  {
    id: 4,
    brand: "Tata",
    model: "Nexon",
    subtitle: "Bold & Confident",
    image: `${import.meta.env.BASE_URL}images/cars/tata_nexon.png`,
  },
];

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 8000); // Slower for readability
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background pt-24 pb-12">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-muted/10 z-0" />
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl pointer-events-none" />

      {/* Main Hero Composition */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12 flex-grow">
        
        {/* Left Side: Branding & Car Info */}
        <div className="flex-1 w-full text-center md:text-left z-20">
          
          {/* Static Branding Intro */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <img
                src={logo}
                alt="DreamDrive Logo"
                className="w-10 h-10"
              />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Dream<span className="text-gradient-golden">Drive</span>
              </h2>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-xl mx-auto md:mx-0 mb-4">
              Discover your perfect car, tailored to your lifestyle and budget.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">
              <span>AI Powered</span>
              <span className="w-1 h-1 bg-primary/30 rounded-full" />
              <span>900+ Variants</span>
              <span className="w-1 h-1 bg-primary/30 rounded-full" />
              <span>Smart Tech</span>
            </div>
          </motion.div>

          {/* Animated Carousel Car Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-primary font-black tracking-[0.4em] uppercase text-[10px] mb-2 opacity-80">
                    Featured Masterpiece
                  </p>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                    {carouselItems[currentIndex].brand} <span className="text-muted-foreground/20 block md:inline">{carouselItems[currentIndex].model}</span>
                  </h1>
                </div>
                
                <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-lg mx-auto md:mx-0">
                  {carouselItems[currentIndex].subtitle}
                </p>

                <div className="pt-6 flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                  <Button
                    onClick={onGetStarted}
                    size="lg"
                    className="group rounded-full h-14 px-10 text-base font-bold shadow-xl hover:shadow-2xl transition-all bg-gradient-golden text-white border-none scale-105 hover:scale-110 active:scale-95"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Find Your Dream Car
                  </Button>
                  
                  <div className="hidden lg:block h-10 w-px bg-border/50" />
                  
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-center md:text-left leading-relaxed opacity-60">
                    Scroll down to explore <br/> our full collections
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Car Image Showcase */}
        <div className="flex-[1.2] w-full flex justify-center md:justify-end z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.85, x: 50, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, x: -50, filter: "blur(10px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[800px] aspect-[16/10] flex items-center justify-center"
            >
              <img 
                src={carouselItems[currentIndex].image} 
                alt={`${carouselItems[currentIndex].brand} ${carouselItems[currentIndex].model}`}
                className="w-full h-auto object-contain drop-shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
                style={{ WebkitUserDrag: 'none' } as any}
              />
              
              {/* Subtle accent blur behind car */}
              <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full -z-10 opacity-30" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Indicators & Bottom Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-4">
        <div className="flex gap-2.5">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-700 ${
                idx === currentIndex ? "w-10 bg-primary" : "w-4 bg-primary/10 hover:bg-primary/30"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="cursor-pointer"
          onClick={onGetStarted}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground/30" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
