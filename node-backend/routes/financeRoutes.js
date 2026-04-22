const express = require("express");
const router = express.Router();
const { getQuote } = require("../controllers/financeController");

router.post("/quote", getQuote);

module.exports = router;
