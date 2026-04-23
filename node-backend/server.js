require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const compareRoutes = require("./routes/compareRoutes");
const carRoutes = require("./routes/carRoutes");

// New Architecture Route Boundaries
const dealerRoutes = require("./routes/dealerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const financeRoutes = require("./routes/financeRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const displayDataService = require("./services/displayDataService");

const app = express();

// Middleware
// Allow requests from the local Vite development server (port 8080 or port 5173) and any future deployment UI
app.use(cors({ origin: "*" })); 

// Support JSON payload parsing automatically
app.use(express.json());

// Initialize the Display-Data Service (loads registry + CSV, builds index)
displayDataService.initialize();

// Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/compare", compareRoutes);
app.use("/api/cars", carRoutes);

// New Feature Routes
app.use("/api/dealers", dealerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);

// Application Status Endpoint
app.get("/", (req, res) => {
  res.send("Node.js DreamDrive API is running — Display-Data Service active.");
});

// Configure Port 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`🚀 DreamDrive API Server Started`);
  console.log(`📊 Display-Data Service: Initialized`);
  console.log(`🌐 Listening on http://localhost:${PORT}`);
  console.log(`===========================================\n`);
});
