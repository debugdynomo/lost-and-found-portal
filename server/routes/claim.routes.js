const express = require('express');
const { createClaim, getReceivedClaims, getSentClaims, respondToClaim } = require('../controllers/claim.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createClaim);
router.get('/received', protect, getReceivedClaims);
router.get('/sent', protect, getSentClaims);
router.patch('/:id/respond', protect, respondToClaim);

module.exports = router;
