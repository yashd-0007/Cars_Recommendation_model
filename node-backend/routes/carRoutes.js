const express = require("express");
const router = express.Router();
const { getAllCars, getCarById, resolveCars, browseCars } = require("../controllers/carController");

// IMPORTANT: Place specific routes before parameterized routes to avoid conflicts

// POST /api/cars/resolve — Resolve ML output into display-safe cars
router.post("/resolve", resolveCars);

// GET /api/cars/browse/:category — Category-filtered cars
router.get("/browse/:category", browseCars);

// GET /api/cars — All display-safe cars
router.get("/", getAllCars);

// GET /api/cars/content/indices
router.get("/content/indices", require("../controllers/carController").getContentIndices);

// GET /api/cars/:id/expert-review
router.get("/:id/expert-review", require("../controllers/carController").getExpertReview);

// GET /api/cars/:id/features-explained
router.get("/:id/features-explained", require("../controllers/carController").getFeaturesExplained);

// GET /api/cars/:id — Single car by displayId
router.get("/:id", getCarById);

module.exports = router;
