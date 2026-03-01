const express = require('express');
const router = express.Router();
const { getWeather, getWeatherByCity, getWeatherAlerts } = require('../controllers/weatherController');

// Main weather endpoint (station → Open-Meteo)
router.get('/', getWeather);

router.get('/alerts/all', getWeatherAlerts);
router.get('/:city', getWeatherByCity);

module.exports = router;
