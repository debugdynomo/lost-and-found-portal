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

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
exports.getItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate({
    path: 'postedBy',
    select: 'name email avatar'
  });

  if (!item) {
    return next(new ApiError(`No item found with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = asyncHandler(async (req, res, next) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ApiError(`No item found with the id of ${req.params.id}`, 404));
  }

  // Make sure user is item owner
  if (item.postedBy.toString() !== req.user.id) {
    return next(new ApiError(`User ${req.user.id} is not authorized to update this item`, 403));
  }

  item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ApiError(`No item found with the id of ${req.params.id}`, 404));
  }

  // Make sure user is item owner
  if (item.postedBy.toString() !== req.user.id) {
    return next(new ApiError(`User ${req.user.id} is not authorized to delete this item`, 403));
  }

  // Will add Cloudinary image deletion logic here later

  await item.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current user's items
// @route   GET /api/items/my-items
// @access  Private
exports.getMyItems = asyncHandler(async (req, res, next) => {
  const items = await Item.find({ postedBy: req.user.id }).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});
