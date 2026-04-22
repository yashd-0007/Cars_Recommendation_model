const express = require("express");
const router = express.Router();
const { logActivity } = require("../controllers/analyticsController");

router.post("/log", logActivity);

module.exports = router;
