const Item = require('../models/Item');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create new item
// @route   POST /api/items
// @access  Private
exports.createItem = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.postedBy = req.user.id;

  const item = await Item.create(req.body);

  res.status(201).json({
    success: true,
    data: item
  });
});

// @desc    Get all items
// @route   GET /api/items
// @access  Public
exports.getItems = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['search', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Finding resource
  if (req.query.search) {
    query = Item.find({
      $text: { $search: req.query.search },
      ...JSON.parse(queryStr)
    });
  } else {
    query = Item.find(JSON.parse(queryStr));
  }

  // Populate user
  query = query.populate({
    path: 'postedBy',
    select: 'name email avatar'
  });

  // Sort
  if (req.query.sort === 'oldest') {
    query = query.sort('createdAt');
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const total = await Item.countDocuments(query.getFilter());

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const items = await query;

  res.status(200).json({
    success: true,
    count: items.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    },
    data: items
  });
});
