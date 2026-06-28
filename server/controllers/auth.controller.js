const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Helper to send token in cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();

  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'strict'
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      user
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ApiError('Please provide name, email and password', 400));
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError('Email already registered', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  sendTokenResponse(user, 201, res);
});
