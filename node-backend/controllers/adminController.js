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
        city: true,
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

// @desc    Get product analytics report
// @route   GET /api/admin/analytics-report
// @access  Private/Admin
const getAnalyticsReport = async (req, res) => {
  try {
    const [
      searchedBrands,
      searchedCars,
      wishlistedCars,
      comparedCars
    ] = await Promise.all([
      prisma.activityLog.groupBy({
        by: ['targetValue'],
        where: { activityType: 'SEARCH_BRAND' },
        _count: { targetValue: true },
        orderBy: { _count: { targetValue: 'desc' } },
        take: 5
      }),
      prisma.activityLog.groupBy({
        by: ['targetValue'],
        where: { activityType: 'SEARCH_CAR' },
        _count: { targetValue: true },
        orderBy: { _count: { targetValue: 'desc' } },
        take: 5
      }),
      prisma.activityLog.groupBy({
        by: ['carId'],
        where: { activityType: 'WISHLIST_ADD' },
        _count: { carId: true },
        orderBy: { _count: { carId: 'desc' } },
        take: 5
      }),
      prisma.activityLog.groupBy({
        by: ['carId'],
        where: { activityType: 'COMPARE_ADD' },
        _count: { carId: true },
        orderBy: { _count: { carId: 'desc' } },
        take: 5
      })
    ]);

    // Resolve car names for the car IDs
    const displayDataService = require("../services/displayDataService");
    
    const resolveName = (id) => {
      const car = displayDataService.getCarById(parseInt(id, 10));
      return car ? `${car.brand} ${car.model}` : `Car #${id}`;
    };

    const report = {
      topBrands: searchedBrands.map(b => ({ name: b.targetValue, count: b._count.targetValue })),
      topSearchedModels: searchedCars.map(c => ({ name: c.targetValue, count: c._count.targetValue })),
      topWishlisted: wishlistedCars.map(w => ({ name: resolveName(w.carId), count: w._count.carId })),
      topCompared: comparedCars.map(c => ({ name: resolveName(c.carId), count: c._count.carId }))
    };

    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error("Analytics Report Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error fetching analytics report." });
  }
};

module.exports = { 
  getSummary, 
  getBookingsReport, 
  getActivityReport, 
  getUsersReport,
  getAnalyticsReport
};
