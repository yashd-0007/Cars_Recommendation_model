import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { carApi, DisplayCar } from "@/services/carApi";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star, User, Calendar, ShieldCheck, Quote, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ExpertReview() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<DisplayCar | null>(null);
  const [review, setReview] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(parseInt(id, 10));
    }
  }, [id]);

  const fetchData = async (carId: number) => {
    setIsLoading(true);
    try {
      const [carData, reviewData] = await Promise.all([
        carApi.getCarById(carId),
        carApi.getExpertReview(carId)
      ]);
      setCar(carData);
      setReview(reviewData);
    } catch (error) {
      console.error("Failed to fetch expert review", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 pt-32 pb-20 px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <ShieldCheck className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Car Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the vehicle you're looking for.</p>
          <Button asChild><Link to="/">Return Home</Link></Button>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-800 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Expert Review Yet</h2>
          <p className="text-muted-foreground mb-6">Expert review is not available for the {car.brand} {car.model} at this time.</p>
          <Button asChild variant="outline"><Link to={`/car-details/${car.displayId}`}>Back to Car Details</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Breadcrumb & Navigation */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
            <Link to={`/car-details/${car.displayId}`} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to {car.brand} {car.model}
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
              Expert Review
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              {car.brand} {car.model}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {review.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border/50 py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium text-foreground">{review.expertName}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Source: {review.source}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500 font-medium">
              <Star className="w-4 h-4 fill-current" />
              <span>{review.rating} / 5 Rating</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden mb-12 shadow-xl border border-border/50 bg-white">
          <img 
            src={car.imageUrl || `https://placehold.co/1200x600/2D3748/FFFFFF?text=${encodeURIComponent(car.brand + ' ' + car.model)}`} 
            alt={`${car.brand} ${car.model}`}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-slate dark:prose-invert prose-lg max-w-none">
          {/* Summary */}
          <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl mb-10">
            <Quote className="w-8 h-8 text-primary/40 mb-2" />
            <p className="text-xl font-medium text-foreground leading-relaxed m-0">
              {review.summary}
            </p>
          </div>

          {/* Sections */}
          {review.sections && Object.entries(review.sections).map(([key, content], idx) => {
            if (!content) return null;
            const title = key.charAt(0).toUpperCase() + key.slice(1);
            return (
              <div key={key} className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-muted-foreground">
                    {idx + 1}
                  </span>
                  {title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {content as string}
                </p>
              </div>
            );
          })}

          {/* Verdict Box */}
          {review.sections?.verdict && (
            <Card className="mt-12 bg-slate-900 text-slate-50 border-none overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
              <CardContent className="p-8 md:p-10">
                <h3 className="text-2xl font-bold mb-4 text-white">The Verdict</h3>
                <p className="text-slate-300 text-lg leading-relaxed m-0">
                  {review.sections.verdict}
                </p>
              </CardContent>
            </Card>
          )}
        </article>
      </div>
    </div>
  );
}
