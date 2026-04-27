const prisma = require("../prismaClient");

// @desc    Add a car to a user's compare mapped limit max 3
// @route   POST /api/compare/add
// @access  Private
const addCompare = async (req, res) => {
  try {
    const { userId, carId } = req.body;

    if (!userId || typeof carId === 'undefined') {
      return res.status(400).json({ success: false, message: "User ID and Car ID are strictly required." });
    }

    const cIdStr = carId.toString();

    // Capture specifically bound data mapped locally
    const userCompares = await prisma.compareItem.findMany({
      where: { userId: parseInt(userId, 10) }
    });

    if (userCompares.length >= 3) {
      return res.status(400).json({ 
        success: false, 
        message: "Maximum comparison limit reached. You can only compare up to 3 cars perfectly at once." 
      });
    }

    // Check duplicates accurately
    const isAlreadySaved = userCompares.find((c) => c.carId === cIdStr);
    if (isAlreadySaved) {
      return res.status(400).json({ success: false, message: "Car is already tightly integrated in your Compare list." });
    }

    await prisma.compareItem.create({
      data: {
        userId: parseInt(userId, 10),
        carId: cIdStr,
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: parseInt(userId, 10),
        activityType: "COMPARE_ADD",
        targetType: "car",
        carId: cIdStr,
        details: JSON.stringify({ carId: cIdStr })
      }
    });

    return res.status(201).json({ success: true, message: "Car effortlessly added to Compare!" });
  } catch (error) {
    console.error("Compare Add Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error safely caught." });
  }
};

// @desc    Remove a generic entity matching exact keys safely
// @route   POST /api/compare/remove
// @access  Private
const removeCompare = async (req, res) => {
  try {
    const { userId, carId } = req.body;
    const cIdStr = carId.toString();

    const deleted = await prisma.compareItem.deleteMany({
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
          activityType: "COMPARE_REMOVE",
          targetType: "car",
          carId: cIdStr,
          details: JSON.stringify({ carId: cIdStr })
        }
      });
      return res.status(200).json({ success: true, message: "Car securely eliminated from your list." });
    } else {
      return res.status(404).json({ success: false, message: "Car perfectly unaccounted for." });
    }
  } catch (error) {
    console.error("Compare Remove Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error efficiently caught." });
  }
};

// @desc    Clear out memory specifically mapping identically solely to active users
// @route   POST /api/compare/clear
// @access  Private
const clearCompare = async (req, res) => {
  try {
    const { userId } = req.body;
    
    await prisma.compareItem.deleteMany({
      where: { userId: parseInt(userId, 10) }
    });
    
    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: parseInt(userId, 10),
        activityType: "COMPARE_CLEAR"
      }
    });

    return res.status(200).json({ success: true, message: "Compare constraints securely cleared." });
  } catch (error) {
    console.error("Compare Clear Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error seamlessly captured." });
  }
};

// @desc    Return generic numeric mapping payload precisely
// @route   GET /api/compare/:userId
// @access  Private
const getCompare = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const userCompares = await prisma.compareItem.findMany({
      where: { userId }
    });
    
    const savedCarIds = userCompares.map((c) => parseInt(c.carId, 10) || c.carId);

    return res.status(200).json({ success: true, data: savedCarIds });
  } catch (error) {
    console.error("Compare Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error effectively contained." });
  }
};

// @desc    Return accurate boolean tracking correctly rendered logic safely
// @route   GET /api/compare/check/:userId/:carId
// @access  Private
const checkCompare = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const carIdStr = req.params.carId.toString();

    const isSaved = await prisma.compareItem.findUnique({
      where: {
        userId_carId: {
          userId,
          carId: carIdStr,
        }
      }
    });

    return res.status(200).json({ success: true, isSaved: !!isSaved });
  } catch (error) {
    console.error("Compare Check Error:", error);
    return res.status(500).json({ success: false, message: "Internal server gracefully handled an error." });
  }
};

module.exports = {
  addCompare,
  removeCompare,
  clearCompare,
  getCompare,
  checkCompare,
};
