const express = require('express');
const { createClaim } = require('../controllers/claim.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createClaim);

module.exports = router;
