const express = require('express');
const { createItem, getItems } = require('../controllers/item.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, createItem);

module.exports = router;
