const express = require('express');
const { createItem, getItems, getItem, updateItem, deleteItem, getMyItems } = require('../controllers/item.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/my-items')
  .get(protect, getMyItems);

router.route('/:id')
  .get(getItem)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
