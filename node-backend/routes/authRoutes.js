const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/authController");

// Mounts onto generic /api/auth prefix defined in server.js
router.post("/login", loginUser);
router.post("/signup", registerUser);

module.exports = router;
