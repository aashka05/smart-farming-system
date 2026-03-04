const express = require('express');
const router = express.Router();
const { identifyCropDisease } = require('../controllers/cropHealthController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/crop-health/identify — analyze crop image for diseases
router.post('/identify', protect, identifyCropDisease);

module.exports = router;
