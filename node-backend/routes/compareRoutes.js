const express = require("express");
const router = express.Router();
const { addCompare, removeCompare, clearCompare, getCompare, checkCompare } = require("../controllers/compareController");

// Mounts onto generic /api/compare prefix mapping natively defined in server.js
router.post("/add", addCompare);
router.post("/remove", removeCompare);
router.post("/clear", clearCompare);
router.get("/:userId", getCompare);
router.get("/check/:userId/:carId", checkCompare);

module.exports = router;
