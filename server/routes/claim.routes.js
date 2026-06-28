const express = require('express');
const { createClaim, getReceivedClaims, getSentClaims } = require('../controllers/claim.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createClaim);
router.get('/received', protect, getReceivedClaims);
router.get('/sent', protect, getSentClaims);

module.exports = router;
