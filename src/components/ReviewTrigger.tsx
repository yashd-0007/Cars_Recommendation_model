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

    let timer: NodeJS.Timeout;

    const checkEligibilityAndSchedule = async () => {
      try {
        const { hasReviewed } = await reviewApi.checkUserReview(user.id);
        
        if (hasReviewed) {
          localStorage.setItem(`reviewed_${user.id}`, "true");
          return;
        }

        const isHomePage = location.pathname === "/";
        if (isHomePage) {
          timer = setTimeout(() => {
            setIsModalOpen(true);
          }, 45000); // 45 seconds of engagement
        }
      } catch (error) {
        console.error("Error checking review eligibility:", error);
      }
    };

    checkEligibilityAndSchedule();
    
    return () => {
      if (timer) clearTimeout(timer);
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
