const prisma = require("../prismaClient");
const { containsInappropriateLanguage, MODERATION_ERROR_MESSAGE } = require("../services/moderationService");

// @desc    Submit a new review
// @route   POST /api/reviews
// @access  Private (Logged-in users)
const submitReview = async (req, res) => {
  try {
    const { userId, rating, comment, displayName } = req.body;

    if (!userId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId, rating, and comment.",
      });
    }

    // Backend Moderation Check (Source of Truth)
    if (containsInappropriateLanguage(comment) || containsInappropriateLanguage(displayName)) {
      return res.status(400).json({
        success: false,
        message: MODERATION_ERROR_MESSAGE,
      });
    }

    // Optional: Check if user already submitted a review
    const existingReview = await prisma.review.findFirst({
      where: { userId: parseInt(userId) },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review.",
      });
    }

    const review = await prisma.review.create({
      data: {
        userId: parseInt(userId),
        rating: parseInt(rating),
        comment,
        displayName: displayName || null,
        status: "PENDING", // Require moderation
      },
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully and is awaiting moderation.",
      review,
    });
  } catch (error) {
    console.error("Submit Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

// @desc    Get all approved reviews for public display
// @route   GET /api/reviews/approved
// @access  Public
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            city: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get Approved Reviews Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

// @desc    Get all reviews for admin moderation
// @route   GET /api/reviews/admin
// @access  Private (Admin only)
const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get Admin Reviews Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

// @desc    Update review status (Approve/Reject)
// @route   PATCH /api/reviews/:id/status
// @access  Private (Admin only)
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return res.status(200).json({
      success: true,
      message: `Review status updated to ${status}.`,
      review,
    });
  } catch (error) {
    console.error("Update Review Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin only)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.review.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

// @desc    Check if a user has already submitted a review
// @route   GET /api/reviews/check/:userId
// @access  Private (Logged-in users)
const checkUserReviewExistence = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a userId.",
      });
    }

    const existingReview = await prisma.review.findFirst({
      where: { userId: parseInt(userId) },
    });

    return res.status(200).json({
      success: true,
      hasReviewed: !!existingReview,
    });
  } catch (error) {
    console.error("Check User Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

module.exports = {
  submitReview,
  getApprovedReviews,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview,
  checkUserReviewExistence,
};
