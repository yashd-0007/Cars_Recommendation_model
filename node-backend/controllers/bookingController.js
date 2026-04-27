const prisma = require("../prismaClient");

// @desc    Book a test drive
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { userId, dealer, carId, date, timeSlot, isPriority } = req.body;

    if (!userId || !dealer || !carId || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: "Missing required booking fields." });
    }

    const cIdStr = carId.toString();

    // Upsert Dealer dynamically based on placeId
    let localDealer;
    if (dealer.placeId) {
      localDealer = await prisma.dealer.findUnique({
        where: { placeId: dealer.placeId }
      });
      if (!localDealer) {
        localDealer = await prisma.dealer.create({
          data: {
            placeId: dealer.placeId,
            name: dealer.name,
            city: dealer.city,
            address: dealer.address,
            phone: dealer.phone,
            workingHours: dealer.workingHours,
            supportedBrands: dealer.supportedBrands,
            rating: dealer.rating,
            lat: dealer.lat,
            lon: dealer.lon
          }
        });
      }
    } else {
      // Fallback for legacy seeded dummy dealers that have integer IDs
      localDealer = await prisma.dealer.findUnique({
        where: { id: parseInt(dealer.id || dealer, 10) }
      });
      if (!localDealer) {
        return res.status(404).json({ success: false, message: "Dealer not found." });
      }
    }

    const dealerId = localDealer.id;

    // Check if the slot is already booked by this user for the same date/time
    const existing = await prisma.testDriveBooking.findFirst({
      where: {
        userId: parseInt(userId, 10),
        dealerId: dealerId,
        date: date,
        timeSlot: timeSlot
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "You already have a booking for this time slot." });
    }

    const booking = await prisma.testDriveBooking.create({
      data: {
        userId: parseInt(userId, 10),
        dealerId: dealerId,
        carId: cIdStr,
        date,
        timeSlot,
        isPriority: isPriority || false,
        status: "CONFIRMED" // Automatically confirm for now
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: parseInt(userId, 10),
        activityType: "BOOKING_CREATED",
        carId: cIdStr,
        details: JSON.stringify({ bookingId: booking.id, carId: cIdStr, dealer: localDealer.name })
      }
    });

    return res.status(201).json({ success: true, message: "Test drive scheduled successfully!", data: booking });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error booking test drive." });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my/:userId
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const bookings = await prisma.testDriveBooking.findMany({
      where: { userId: parseInt(userId, 10) },
      include: {
        dealer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const displayDataService = require("../services/displayDataService");
    const enrichedBookings = bookings.map(b => {
      const car = displayDataService.getCarById(parseInt(b.carId, 10));
      return {
        ...b,
        carName: car ? `${car.brand} ${car.model} ${car.variant}` : "Unknown Car"
      };
    });

    return res.status(200).json({ success: true, data: enrichedBookings });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error fetching bookings." });
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required to cancel a booking." });
    }

    const booking = await prisma.testDriveBooking.findUnique({
      where: { id: parseInt(id, 10) }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (booking.userId !== parseInt(userId, 10)) {
      return res.status(403).json({ success: false, message: "You are not authorized to cancel this booking." });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({ success: false, message: "Booking is already cancelled." });
    }

    const updatedBooking = await prisma.testDriveBooking.update({
      where: { id: parseInt(id, 10) },
      data: { status: "CANCELLED" }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: parseInt(userId, 10),
        activityType: "BOOKING_CANCELLED",
        carId: booking.carId,
        details: JSON.stringify({ bookingId: booking.id, carId: booking.carId })
      }
    });

    return res.status(200).json({ success: true, message: "Booking cancelled successfully.", data: updatedBooking });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error cancelling booking." });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking };
