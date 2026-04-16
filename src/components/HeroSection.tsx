import { motion } from "framer-motion";
import logo from "@/assets/dreamdrive-logo.png";
import { Search, ChevronDown } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <motion.img
          src={logo}
          alt="DreamDrive Logo"
          className="w-24 h-24 mx-auto mb-6"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Dream<span className="text-gradient-golden">Drive</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-3 font-light">
          Discover your perfect car, tailored to your lifestyle and budget.
        </p>
        <p className="text-sm text-muted-foreground/70 mb-10">
          Powered by AI · 900+ car variants · Smart recommendations
        </p>

        <motion.button
          onClick={onGetStarted}
          className="group inline-flex items-center gap-3 bg-gradient-golden text-primary-foreground px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search className="w-5 h-5" />
          Find Your Dream Car
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute bottom-8 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground/50" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
