import { motion } from "framer-motion";
import logo from "@/assets/dreamdrive-logo.png";
import { Search } from "lucide-react";

interface WelcomeSectionProps {
  onGetStarted: () => void;
}

const WelcomeSection = ({ onGetStarted }: WelcomeSectionProps) => {
  return (
    <section className="relative py-24 flex flex-col items-center justify-center overflow-hidden px-4 bg-background border-b border-border/40">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <motion.img
          src={logo}
          alt="DreamDrive Logo"
          className="w-24 h-24 mx-auto mb-6"
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Dream<span className="text-gradient-golden">Drive</span>
        </h2>

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
    </section>
  );
};

export default WelcomeSection;
