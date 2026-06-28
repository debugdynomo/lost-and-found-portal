const express = require('express');
const { createItem, getItems, getItem, updateItem, deleteItem, getMyItems } = require('../controllers/item.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, upload.array('images', 5), createItem);

router.route('/my-items')
  .get(protect, getMyItems);

router.route('/:id')
  .get(getItem)
  .put(protect, upload.array('images', 5), updateItem)
  .delete(protect, deleteItem);

module.exports = router;
