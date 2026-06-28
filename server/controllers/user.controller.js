const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const cloudinary = require('../config/cloudinary');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    phone: req.body.phone
  };

  // Handle avatar upload if any
  if (req.files && req.files.length > 0) {
    const file = req.files[0];
    
    // Convert buffer to base64
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "lost-and-found/avatars",
      resource_type: "auto"
    });
    
    fieldsToUpdate.avatar = result.secure_url;
  }

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => {
    if (fieldsToUpdate[key] === undefined) {
      delete fieldsToUpdate[key];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get dashboard statistics
// @route   GET /api/users/stats
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalItems = await Item.countDocuments({ postedBy: req.user.id });
  
  const resolvedItems = await Item.countDocuments({ 
    postedBy: req.user.id,
    status: { $in: ['claimed', 'resolved'] }
  });
  
  const activeClaims = await Claim.countDocuments({
    claimant: req.user.id,
    status: 'pending'
  });

  res.status(200).json({
    success: true,
    data: {
      totalItems,
      resolvedItems,
      activeClaims
    }
  });
});
