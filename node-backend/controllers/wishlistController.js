const prisma = require("../prismaClient");

// @desc    Add a car tightly to a user's wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addCar = async (req, res) => {
  try {
    const { userId, carId } = req.body;

    if (!userId || typeof carId === 'undefined') {
      return res.status(400).json({ success: false, message: "User ID and Car ID are required." });
    }

    const cIdStr = carId.toString();

    // Check for duplicates
    const isAlreadySaved = await prisma.wishlistItem.findUnique({
      where: {
        userId_carId: {
          userId: parseInt(userId, 10),
          carId: cIdStr,
        }
      }
    });

    if (isAlreadySaved) {
      return res.status(400).json({ success: false, message: "Car is strictly already inside your wishlist." });
    }

    await prisma.wishlistItem.create({
      data: {
        userId: parseInt(userId, 10),
        carId: cIdStr,
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: parseInt(userId, 10),
        action: "WISHLIST_ADD",
        details: JSON.stringify({ carId: cIdStr })
      }
    });

    return res.status(201).json({ success: true, message: "Car securely added to your wishlist!" });
  } catch (error) {
    console.error("Wishlist Add Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error safely caught." });
  }
};

// @desc    Remove a car dynamically from a user's wishlist
// @route   POST /api/wishlist/remove
// @access  Private
const removeCar = async (req, res) => {
  try {
    const { userId, carId } = req.body;

    if (!userId || typeof carId === 'undefined') {
      return res.status(400).json({ success: false, message: "User ID and Car ID are required." });
    }

    const cIdStr = carId.toString();

    // Try deleting
    const deleted = await prisma.wishlistItem.deleteMany({
      where: {
        userId: parseInt(userId, 10),
        carId: cIdStr,
      }
    });

    if (deleted.count > 0) {
      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: parseInt(userId, 10),
          action: "WISHLIST_REMOVE",
          details: JSON.stringify({ carId: cIdStr })
        }
      });
      return res.status(200).json({ success: true, message: "Car correctly removed from wishlist." });
    } else {
      return res.status(404).json({ success: false, message: "Car not found inside your valid wishlist parameters." });
    }
  } catch (error) {
    console.error("Wishlist Remove Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error safely caught." });
  }
};

// @desc    Fetch all saved car IDs mapped securely to an exclusive User ID
// @route   GET /api/wishlist/:userId
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    
    const userWishlist = await prisma.wishlistItem.findMany({
      where: { userId }
    });
    
    // Returning solely array of car IDs intelligently bridging payload size limitation
    // Ensure we send back numbers if the frontend expects numbers
    const savedCarIds = userWishlist.map((w) => parseInt(w.carId, 10) || w.carId);

    return res.status(200).json({ success: true, data: savedCarIds });
  } catch (error) {
    console.error("Wishlist Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error safely caught." });
  }
};

// @desc    Optimised boolean check verifying specific entity existence dynamically
// @route   GET /api/wishlist/check/:userId/:carId
// @access  Private
const checkSaved = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const carIdStr = req.params.carId.toString();

    const isSaved = await prisma.wishlistItem.findUnique({
      where: {
        userId_carId: {
          userId,
          carId: carIdStr,
        }
      }
    });

    return res.status(200).json({ success: true, isSaved: !!isSaved });
  } catch (error) {
    console.error("Wishlist Check Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error safely caught." });
  }
};

module.exports = {
  addCar,
  removeCar,
  getWishlist,
  checkSaved,
};
