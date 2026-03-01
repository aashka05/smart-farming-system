const express = require('express');
const router = express.Router();
const { getMarketPrices, getPriceTrends } = require('../controllers/marketController');

router.get('/', getMarketPrices);
router.get('/trends/:crop', getPriceTrends);

module.exports = router;
