require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
// Allow requests from the local Vite development server (port 8080 or port 5173) and any future deployment UI
app.use(cors({ origin: "*" })); 

// Support JSON payload parsing automatically
app.use(express.json());

// Main Routes
app.use("/api/auth", authRoutes);

// Application Status Endpoint
app.get("/", (req, res) => {
  res.send("Node.js DreamDrive Authentication API is running securely.");
});

// Configure Port 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`🚀 DreamDrive Auth API Server Started`);
  console.log(`🌐 Listening securely on port http://localhost:${PORT}`);
  console.log(`===========================================\n`);
});
