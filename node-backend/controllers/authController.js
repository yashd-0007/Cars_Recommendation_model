const users = require("../data/users");

// @desc    Authenticate user & get user payload
// @route   POST /api/auth/login
// @access  Public
const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    // Boundary check for missing fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both an email address and a password.",
      });
    }

    // Try to locate the user natively in the array
    const user = users.find((u) => u.email === email);

    // Validate if user exists and password strictly matches
    // (Reminder: Always use bcrypt.compare in production!)
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

module.exports = {
  loginUser,
};
