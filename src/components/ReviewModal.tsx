import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, MessageSquare, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { reviewApi } from "@/services/reviewApi";
import { useAuth } from "@/context/AuthContext";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

const ReviewModal = ({ isOpen, onClose }: ReviewModalProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Please share a bit more about your experience (min 10 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewApi.submitReview({
        userId: user.id,
        rating,
        comment,
        displayName,
      });
      toast.success("Thank you for your feedback! It's awaiting moderation.");
      
      // Mark as reviewed in localStorage to avoid showing popup again
      localStorage.setItem(`reviewed_${user.id}`, "true");
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      onClose();
    } catch (error: any) {
      console.error("Submit Review Error:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-card text-card-foreground border border-border rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-8 border-b border-border/50 relative bg-muted/30">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase">Share Your <span className="text-primary">Experience</span></h2>
            </div>
            <p className="text-sm text-muted-foreground font-medium">How was your journey with DreamDrive?</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Rating */}
            <div className="space-y-4 text-center py-6 bg-muted/30 rounded-3xl border border-border/50">
              <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Rating</Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 transition-all ${
                        star <= (hoveredRating || rating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                {rating === 5 ? "Exceptional" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
              </p>
            </div>

            {/* Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest ml-1 text-foreground">Display Name</Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className="rounded-2xl h-12 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest ml-1 text-foreground">Your Feedback</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the accuracy, speed, and overall feel of your car discovery journey..."
                  className="rounded-3xl min-h-[120px] bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none p-4"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-2xl h-14 font-bold uppercase tracking-widest text-xs"
              >
                Maybe Later
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-2xl h-14 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" /> Submit Review
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;
