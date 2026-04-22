const express = require("express");
const router = express.Router();
const { addCar, removeCar, getWishlist, checkSaved } = require("../controllers/wishlistController");

// Mounts onto generic /api/wishlist prefix defined in server.js
router.post("/add", addCar);
router.post("/remove", removeCar);
router.get("/:userId", getWishlist);
router.get("/check/:userId/:carId", checkSaved);

module.exports = router;
