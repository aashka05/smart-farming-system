const express = require('express');
const router = express.Router();


const { getCrops, getCropById, getRecommendation, getCropDiseases } = require('../controllers/cropController');

router.get('/', getCrops);
router.post('/recommend', getRecommendation);
router.get('/diseases/:cropName', getCropDiseases);
router.get('/:id', getCropById);

module.exports = router;
