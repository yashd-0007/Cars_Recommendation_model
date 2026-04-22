const prisma = require("../prismaClient");

// @desc    Log a user activity
// @route   POST /api/analytics/log
// @access  Public/Private
const logActivity = async (req, res) => {
  try {
    const { userId, action, details } = req.body;

    if (!action) {
      return res.status(400).json({ success: false, message: "Action is required for logging." });
    }

    const log = await prisma.activityLog.create({
      data: {
        userId: userId ? parseInt(userId, 10) : null,
        action,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
      }
    });

    return res.status(201).json({ success: true, data: log });
  } catch (error) {
    console.error("Log Activity Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error logging activity." });
  }
};

module.exports = { logActivity };
