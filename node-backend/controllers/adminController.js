const prisma = require("../prismaClient");

// @desc    Admin dashboard summary
// @route   GET /api/admin/summary
// @access  Private/Admin
const getSummary = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBookings,
      totalWishlist,
      totalCompare,
      totalActivity,
      totalReviews,
      bookingStatusCounts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.testDriveBooking.count(),
      prisma.wishlistItem.count(),
      prisma.compareItem.count(),
      prisma.activityLog.count(),
      prisma.review.count(),
      prisma.testDriveBooking.groupBy({
        by: ['status'],
        _count: true
      })
    ]);

    const stats = {
      totalUsers,
      totalBookings,
      totalWishlist,
      totalCompare,
      totalActivity,
      totalReviews,
      statusBreakdown: bookingStatusCounts.reduce((acc, curr) => {
        acc[curr.status.toLowerCase()] = curr._count;
        return acc;
      }, { pending: 0, confirmed: 0, cancelled: 0, completed: 0 })
    };

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Admin Summary Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error fetching summary." });
  }
};

// @desc    Get detailed bookings report
// @route   GET /api/admin/bookings-report
// @access  Private/Admin
const getBookingsReport = async (req, res) => {
  try {
    const bookings = await prisma.testDriveBooking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        dealer: { select: { name: true, city: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    // Simple aggregation for brand popularity (from carId - we don't have Car model in Prisma yet, 
    // but we can try to resolve it from carId if it's numeric/stored properly)
    // For now, return raw bookings
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Bookings Report Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error fetching bookings report." });
  }
};

// @desc    Get recent activities
// @route   GET /api/admin/activity-report
// @access  Private/Admin
const getActivityReport = async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("Activity Report Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error fetching activity report." });
  }
};

// @desc    Get users list
// @route   GET /api/admin/users-report
// @access  Private/Admin
const getUsersReport = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
            wishlists: true,
            compares: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Users Report Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error fetching users report." });
  }
};

module.exports = { 
  getSummary, 
  getBookingsReport, 
  getActivityReport, 
  getUsersReport 
};
