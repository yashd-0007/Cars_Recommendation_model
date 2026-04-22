// @desc    Get finance quote
// @route   POST /api/finance/quote
// @access  Private
const getQuote = async (req, res) => {
  return res.status(501).json({ success: false, message: "Finance quotes not implemented yet." });
};

module.exports = { getQuote };
