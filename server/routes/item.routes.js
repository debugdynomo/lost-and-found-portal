const express = require('express');
const { createItem } = require('../controllers/item.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createItem);

module.exports = router;
