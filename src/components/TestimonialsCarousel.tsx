import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import TestimonialCard, { TestimonialType } from "./TestimonialCard";
import { reviewApi, Review } from "@/services/reviewApi";
import { useAuth } from "@/context/AuthContext";
import ReviewModal from "./ReviewModal";
import { toast } from "sonner";

const staticTestimonials: TestimonialType[] = [
  {
    id: "s1",
    name: "Rahul Sharma",
    city: "Mumbai",
    rating: 5,
    text: "DreamDrive helped me find the perfect SUV within my budget in just minutes. The AI suggestions were surprisingly accurate.",
  },
  {
    id: "s2",
    name: "Priya Verma",
    city: "Pune",
    rating: 5,
    text: "I was overwhelmed by all the options out there, but the recommendation engine narrowed it down perfectly to what I actually needed.",
  },
  {
    id: "s3",
    name: "Amit Patel",
    city: "Ahmedabad",
    rating: 5,
    text: "The premium feel of this platform matched the luxury car I was looking for. Highly recommend to any serious car buyer.",
  },
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [displayReviews, setDisplayReviews] = useState<TestimonialType[]>(staticTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to write a review.");
      navigate("/login", { state: { from: location } });
      return;
    }
    setIsModalOpen(true);
  };

  const fetchReviews = async () => {
    try {
      const realReviews = await reviewApi.getApprovedReviews();
      if (realReviews && realReviews.length > 0) {
        const mapped = realReviews.map((r: Review) => ({
          id: r.id,
          name: r.displayName || r.user?.name || "Verified User",
          city: r.user?.city || "India",
          text: r.comment,
          rating: r.rating
        }));
        // Merge real reviews with a few static ones for variety if real count is low
        setDisplayReviews(mapped.length < 3 ? [...mapped, ...staticTestimonials.slice(0, 3 - mapped.length)] : mapped);
      }
    } catch (err) {
      console.error("Failed to fetch real reviews, using static data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    if (displayReviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % displayReviews.length);
  }, [displayReviews.length]);

  const prevSlide = useCallback(() => {
    if (displayReviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + displayReviews.length) % displayReviews.length);
  }, [displayReviews.length]);

  // Auto-scroll every 6 seconds unless hovered
  useEffect(() => {
    if (isHovered || displayReviews.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide, displayReviews.length]);

  if (isLoading && displayReviews === staticTestimonials) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

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
            className="text-lg text-muted-foreground mt-4 mb-8"
          >
            Discover how DreamDrive helped people find their perfect car.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={handleWriteReviewClick}
              size="lg"
              className="rounded-full shadow-md hover:shadow-lg transition-all text-md font-semibold px-8"
            >
              Write a Review
            </Button>
          </motion.div>
        </div>

        <ReviewModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onReviewSubmitted={fetchReviews}
        />

        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Carousel Track */}
          <div className="relative h-[420px] md:h-[350px] w-full flex justify-center items-center">
            {displayReviews.map((testimonial, i) => {
              // Calculate relative position based on absolute array length loop
              let diff = i - currentIndex;
              
              const half = Math.floor(displayReviews.length / 2);
              if (diff > half) diff -= displayReviews.length;
              if (diff < -half) diff += displayReviews.length;
              
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
          {displayReviews.length > 1 && (
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
                {displayReviews.map((_, idx) => (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
