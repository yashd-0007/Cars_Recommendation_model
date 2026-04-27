/**
 * DreamDrive Car Display Controller
 * Handles all car display-data API endpoints.
 */

const displayDataService = require("../services/displayDataService");
const contentService = require("../services/contentService");
const prisma = require("../prismaClient");

// @desc    Get all display-safe cars
// @route   GET /api/cars
const getAllCars = (req, res) => {
  try {
    const cars = displayDataService.getAllCars();
    return res.status(200).json({ success: true, count: cars.length, data: cars });
  } catch (error) {
    console.error("Car Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve car data." });
  }
};

// @desc    Get a single car by displayId
// @route   GET /api/cars/:id
const getCarById = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid car ID." });
    }

    const car = displayDataService.getCarById(id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found." });
    }

    return res.status(200).json({ success: true, data: car });
  } catch (error) {
    console.error("Car Detail Error:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve car details." });
  }
};

// @desc    Resolve ML-recommended cars into display-safe objects
// @route   POST /api/cars/resolve
const resolveCars = async (req, res) => {
  try {
    const { cars: mlCars } = req.body;
    if (!Array.isArray(mlCars)) {
      return res.status(400).json({ success: false, message: "Request body must contain a 'cars' array." });
    }

    const resolved = displayDataService.resolveCars(mlCars);

    // Log activity
    const userId = req.headers["x-user-id"];
    if (userId) {
      await prisma.activityLog.create({
        data: {
          userId: parseInt(userId, 10),
          activityType: "RECOMMENDATION_RESOLVE",
          details: JSON.stringify({ count: resolved.length })
        }
      });
    }

    return res.status(200).json({ success: true, count: resolved.length, data: resolved });
  } catch (error) {
    console.error("Car Resolve Error:", error);
    return res.status(500).json({ success: false, message: "Failed to resolve car data." });
  }
};

// @desc    Get cars filtered by category
// @route   GET /api/cars/browse/:category
const browseCars = (req, res) => {
  try {
    const category = req.params.category || "all";
    const cars = displayDataService.getCarsByCategory(category);
    return res.status(200).json({ success: true, category, count: cars.length, data: cars });
  } catch (error) {
    console.error("Car Browse Error:", error);
    return res.status(500).json({ success: false, message: "Failed to browse cars." });
  }
};

// @desc    Get expert review by car ID
// @route   GET /api/cars/:id/expert-review
const getExpertReview = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const review = contentService.getExpertReview(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Expert review not found for this car." });
    }
    return res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error("Expert Review Error:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve expert review." });
  }
};

// @desc    Get features explained videos by car ID
// @route   GET /api/cars/:id/features-explained
const getFeaturesExplained = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const videos = contentService.getFeaturesExplained(id);
    if (!videos || videos.length === 0) {
      return res.status(404).json({ success: false, message: "Features explained videos not found for this car." });
    }
    return res.status(200).json({ success: true, data: videos });
  } catch (error) {
    console.error("Features Explained Error:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve features videos." });
  }
};

// @desc    Get available content indices
// @route   GET /api/cars/content/indices
const getContentIndices = (req, res) => {
  try {
    const expertReviewIds = contentService.getAvailableExpertReviewCarIds();
    const featuresIds = contentService.getAvailableFeaturesCarIds();
    return res.status(200).json({ 
      success: true, 
      data: {
        expertReviews: expertReviewIds,
        features: featuresIds
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to retrieve content indices." });
  }
};

module.exports = { 
  getAllCars, 
  getCarById, 
  resolveCars, 
  browseCars,
  getExpertReview,
  getFeaturesExplained,
  getContentIndices
};
