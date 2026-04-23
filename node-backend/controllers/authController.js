const prisma = require("../prismaClient");

// @desc    Authenticate user & get user payload
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Boundary check for missing fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both an email address and a password.",
      });
    }

    // Try to locate the user in database
    const user = await prisma.user.findUnique({ where: { email } });

    // Validate if user exists and password strictly matches
    if (user && user.password === password) {
      // Exclude password from the sanitized response payload
      const { password: _, ...sanitizedUser } = user;
      
      return res.status(200).json({
        success: true,
        message: "Login successful. Welcome back!",
        user: sanitizedUser,
      });
    } else {
      // Return 401 Unauthorized securely without specifying which part failed
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please verify your credentials.",
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

// @desc    Register a generic new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    // Validate boundaries conservatively
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please submit name, email, and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Check pre-existing users natively
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already tightly bound to an account. Please sign in.",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: "USER",
        city: city || null
      }
    });

    // Return sanitized payload successfully bridging automatic login integration
    const { password: _, ...sanitizedUser } = newUser;

    return res.status(201).json({
      success: true,
      message: "Registration successful. Welcome to DreamDrive!",
      user: sanitizedUser,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while signing up.",
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
