const express = require('express');
const { updateProfile, getDashboardStats } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.put('/profile', protect, upload.any(), updateProfile);
router.get('/stats', protect, getDashboardStats);

module.exports = router;
