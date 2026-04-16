import { motion } from "framer-motion";
import { Car as CarIcon, Fuel, IndianRupee, Brain } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered",
    description: "Our model analyzes 900+ car variants to find your perfect match",
  },
  {
    icon: IndianRupee,
    title: "Budget Smart",
    description: "Recommendations tailored to your salary and spending capacity",
  },
  {
    icon: Fuel,
    title: "Fuel Flexible",
    description: "Electric, Petrol, Diesel, CNG, and Hybrid options available",
  },
  {
    icon: CarIcon,
    title: "All Segments",
    description: "From mid-range to luxury — SUVs, sedans, coupes and more",
  },
];

const FeaturesSection = () => {
  return (
    <section id="about" className="py-16 px-4 bg-card/50">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent flex items-center justify-center">
                <feat.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 font-sans">{feat.title}</h3>
              <p className="text-sm text-muted-foreground">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
