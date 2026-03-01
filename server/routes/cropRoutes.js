const express = require('express');
const router = express.Router();
const { getCrops, getCropById, getRecommendation } = require('../controllers/cropController');

router.get('/', getCrops);
router.post('/recommend', getRecommendation);
router.get('/:id', getCropById);

module.exports = router;
