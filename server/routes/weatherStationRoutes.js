const express = require('express');
const router = express.Router();
const { receiveSensorData, simulateData, getLatestData, getDataHistory } = require('../controllers/weatherStationController');
const { protect } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/simulate', simulateData);
router.post('/data', receiveSensorData);

// Protected endpoints for viewing data
router.get('/:stationId/latest', protect, getLatestData);
router.get('/:stationId/history', protect, getDataHistory);

module.exports = router;
