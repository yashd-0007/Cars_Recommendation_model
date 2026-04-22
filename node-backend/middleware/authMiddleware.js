const prisma = require("../prismaClient");

const adminOnly = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"]; // In a real app, this would come from a verified JWT
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) }
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Access denied. Admin role required." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    res.status(500).json({ success: false, message: "Internal server error in auth middleware." });
  }
};

module.exports = { adminOnly };
