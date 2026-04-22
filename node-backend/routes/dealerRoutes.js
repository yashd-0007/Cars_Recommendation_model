const express = require("express");
const router = express.Router();
const { getDealers, getDealerById } = require("../controllers/dealerController");

router.get("/", getDealers);
router.get("/:id", getDealerById);

module.exports = router;
