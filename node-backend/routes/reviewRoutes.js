const express = require("express");
const router = express.Router();
const {
  submitReview,
  getApprovedReviews,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview,
  checkUserReviewExistence,
} = require("../controllers/reviewController");

// Public routes
router.get("/approved", getApprovedReviews);

// Private routes
router.post("/", submitReview);
router.get("/check/:userId", checkUserReviewExistence);

// Admin routes (Note: In a real app, use an adminMiddleware here)
router.get("/admin", getAllReviewsAdmin);
router.patch("/:id/status", updateReviewStatus);
router.delete("/:id", deleteReview);

module.exports = router;
