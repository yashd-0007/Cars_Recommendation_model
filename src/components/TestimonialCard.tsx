import { Star, Quote } from "lucide-react";

export interface TestimonialType {
  id: string | number;
  name: string;
  city: string;
  text: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: TestimonialType;
  isActive: boolean;
}

const TestimonialCard = ({ testimonial, isActive }: TestimonialCardProps) => {
  return (
    <div
      className={`relative w-full p-6 md:p-8 rounded-[2rem] border bg-card/95 backdrop-blur-xl transition-all duration-500 overflow-hidden ${
        isActive ? "border-primary/30 shadow-elevated" : "border-border/50 shadow-sm"
      }`}
    >
      {/* Decorative gradient blob */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 ${isActive ? "bg-primary/20 opacity-100" : "opacity-0"}`} />

      <Quote className={`absolute top-6 right-6 w-10 h-10 transition-colors duration-500 rotate-180 z-0 ${isActive ? "text-primary/15" : "text-muted-foreground/10"}`} />
      
      <div className="flex gap-1 mb-6 relative z-10">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 md:w-5 md:h-5 ${
              i < testimonial.rating
                ? "fill-primary text-primary"
                : "text-muted-foreground/20"
            }`}
          />
        ))}
      </div>

      <p className="text-foreground/90 text-[15px] md:text-base leading-relaxed mb-8 relative z-10 min-h-[90px] md:min-h-[110px] font-medium">
        "{testimonial.text}"
      </p>

      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border transition-colors duration-500 ${
            isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"
        }`}>
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-base tracking-tight">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground font-medium">{testimonial.city}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
