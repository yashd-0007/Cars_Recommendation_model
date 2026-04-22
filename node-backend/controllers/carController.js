/**
 * DreamDrive Car Display Controller
 * Handles all car display-data API endpoints.
 */

const displayDataService = require("../services/displayDataService");
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
          action: "RECOMMENDATION_RESOLVE",
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

module.exports = { getAllCars, getCarById, resolveCars, browseCars };
