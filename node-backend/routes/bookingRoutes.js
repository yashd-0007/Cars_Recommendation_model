const express = require("express");
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking } = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/my/:userId", getMyBookings);
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
