const express = require("express");
const router = express.Router();
const { 
  getSummary, 
  getBookingsReport, 
  getActivityReport, 
  getUsersReport,
  getAnalyticsReport
} = require("../controllers/adminController");
const { adminOnly } = require("../middleware/authMiddleware");

// All admin routes are protected
router.use(adminOnly);

router.get("/summary", getSummary);
router.get("/bookings-report", getBookingsReport);
router.get("/activity-report", getActivityReport);
router.get("/users-report", getUsersReport);
router.get("/analytics-report", getAnalyticsReport);

module.exports = router;
