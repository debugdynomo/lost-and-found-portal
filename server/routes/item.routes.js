const express = require('express');
const { createItem, getItems, getItem } = require('../controllers/item.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/:id')
  .get(getItem);

module.exports = router;
