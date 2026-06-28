const Claim = require('../models/Claim');
const Item = require('../models/Item');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Send a claim request for an item
// @route   POST /api/claims
// @access  Private
exports.createClaim = asyncHandler(async (req, res, next) => {
  const { item: itemId, message } = req.body;

  if (!itemId || !message) {
    return next(new ApiError('Please provide item ID and message', 400));
  }

  const item = await Item.findById(itemId);

  if (!item) {
    return next(new ApiError(`No item found with the id of ${itemId}`, 404));
  }

  // Prevent self-claim
  if (item.postedBy.toString() === req.user.id) {
    return next(new ApiError('You cannot claim your own item', 400));
  }

  // Prevent claiming already claimed/resolved items
  if (item.status !== 'active') {
    return next(new ApiError(`This item is already ${item.status}`, 400));
  }

  // Prevent duplicate claims
  const existingClaim = await Claim.findOne({ item: itemId, claimant: req.user.id });
  if (existingClaim) {
    return next(new ApiError('You have already submitted a claim for this item', 400));
  }

  const claim = await Claim.create({
    item: itemId,
    claimant: req.user.id,
    message
  });

  res.status(201).json({
    success: true,
    data: claim
  });
});
