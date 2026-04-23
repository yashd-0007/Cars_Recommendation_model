import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ReviewModal from "./ReviewModal";
import { useLocation } from "react-router-dom";
import { reviewApi } from "@/services/reviewApi";

const ReviewTrigger = () => {
  const { user, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // 1. Session check: If they dismissed it in this session, don't show again
    const sessionDismissed = sessionStorage.getItem(`review_dismissed_${user.id}`);
    if (sessionDismissed) return;

    const checkEligibilityAndSchedule = async () => {
      try {
        // 2. Backend check: The source of truth
        const { hasReviewed } = await reviewApi.checkUserReview(user.id);
        
        if (hasReviewed) {
          // If they've already reviewed, we can even cache this in localStorage to save API calls
          localStorage.setItem(`reviewed_${user.id}`, "true");
          return;
        }

        // 3. Scheduling logic (e.g. after 45s on homepage)
        const isHomePage = location.pathname === "/";
        if (isHomePage) {
          const timer = setTimeout(() => {
            setIsModalOpen(true);
          }, 45000); // 45 seconds of engagement
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error checking review eligibility:", error);
      }
    };

    const cleanup = checkEligibilityAndSchedule();
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [isAuthenticated, user, location.pathname]);

  const handleClose = () => {
    setIsModalOpen(false);
    // Mark as dismissed for this session so we don't nag them immediately again
    if (user) {
      sessionStorage.setItem(`review_dismissed_${user.id}`, "true");
    }
  };

  return (
    <ReviewModal
      isOpen={isModalOpen}
      onClose={handleClose}
    />
  );
};

export default ReviewTrigger;
