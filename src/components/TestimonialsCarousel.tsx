import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import TestimonialCard, { TestimonialType } from "./TestimonialCard";

const testimonials: TestimonialType[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    city: "Mumbai",
    rating: 5,
    text: "DreamDrive helped me find the perfect SUV within my budget in just minutes. The AI suggestions were surprisingly accurate.",
  },
  {
    id: 2,
    name: "Priya Verma",
    city: "Pune",
    rating: 5,
    text: "I was overwhelmed by all the options out there, but the recommendation engine narrowed it down perfectly to what I actually needed.",
  },
  {
    id: 3,
    name: "Amit Patel",
    city: "Ahmedabad",
    rating: 5,
    text: "The premium feel of this platform matched the luxury car I was looking for. Highly recommend to any serious car buyer.",
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    city: "Bangalore",
    rating: 4,
    text: "Very smooth and intuitive process. I loved the EMI calculator and how easily I could compare different variants.",
  },
  {
    id: 5,
    name: "Rohit Mehta",
    city: "Delhi",
    rating: 5,
    text: "Absolutely brilliant! Found my dream sedan without any of the usual dealership hassle. The AI knows cars better than most salesmen.",
  },
  {
    id: 6,
    name: "Ankit Singh",
    city: "Hyderabad",
    rating: 5,
    text: "From start to finish, the experience was flawless. The clean design and accurate matching algorithm saved me weeks of research.",
  },
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-scroll every 5 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-serif mb-4 tracking-tight"
          >
            Trusted by Thousands of Car Buyers
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mt-4"
          >
            Discover how DreamDrive helped people find their perfect car.
          </motion.p>
        </div>

        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Carousel Track */}
          <div className="relative h-[420px] md:h-[350px] w-full flex justify-center items-center">
            {testimonials.map((testimonial, i) => {
              // Calculate relative position based on absolute array length loop
              let diff = i - currentIndex;
              
              const half = Math.floor(testimonials.length / 2);
              if (diff > half) diff -= testimonials.length;
              if (diff < -half) diff += testimonials.length;
              
              const isMobile = windowWidth < 768;
              
              // Mobile screens offset more to hide completely, Desktop shows tight hints
              let xOffset = diff * 105;
              if (isMobile) {
                 xOffset = diff * 115;
              }

              return (
                <motion.div
                  key={testimonial.id}
                  initial={false}
                  animate={{
                    x: `${xOffset}%`,
                    scale: diff === 0 ? 1 : 0.85,
                    opacity: diff === 0 ? 1 : Math.abs(diff) === 1 && !isMobile ? 0.35 : 0,
                    zIndex: diff === 0 ? 20 : 10 - Math.abs(diff),
                    filter: diff === 0 ? "blur(0px)" : "blur(3px)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                  }}
                  style={{ pointerEvents: diff === 0 ? "auto" : "none" }}
                  className="absolute w-full max-w-[340px] sm:max-w-sm md:max-w-lg"
                >
                  <TestimonialCard testimonial={testimonial} isActive={diff === 0} />
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center mt-12 gap-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? "bg-primary w-8" 
                      : "bg-primary/20 hover:bg-primary/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={nextSlide}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
