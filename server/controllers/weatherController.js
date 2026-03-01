const axios = require('axios');
const WeatherData = require('../models/WeatherData');
const { getLatestStationData } = require('./weatherStationController');

// Read from .env with sensible defaults
const OPEN_METEO_URL = process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com/v1/forecast';
const API_TIMEOUT = parseInt(process.env.WEATHER_API_TIMEOUT) || 10000;
const DEFAULT_LAT = parseFloat(process.env.DEFAULT_LATITUDE) || 22.3072;
const DEFAULT_LON = parseFloat(process.env.DEFAULT_LONGITUDE) || 73.1812;

// -------------------------------------------------------
// Helper: Generate mock weather data (last resort fallback)
// -------------------------------------------------------
function generateMockWeather(lat, lon, mode) {
  const forecast = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    forecast.push({
      date: d.toISOString().split('T')[0],
      max: Math.round((30 + Math.random() * 8) * 10) / 10,
      min: Math.round((20 + Math.random() * 6) * 10) / 10,
      rain_probability: Math.floor(Math.random() * 70),
    });
  }

  const hourly = [];
  const now = new Date();
  for (let h = 0; h < 24; h++) {
    const t = new Date(now);
    t.setHours(h, 0, 0, 0);
    hourly.push({
      time: t.toISOString(),
      temp: Math.round((24 + Math.sin(h / 4) * 6) * 10) / 10,
      soil_temp: Math.round((20 + Math.sin(h / 5) * 4) * 10) / 10,
    });
  }

  return {
    current: {
      temp: Math.round((28 + Math.random() * 6) * 10) / 10,
      humidity: Math.floor(55 + Math.random() * 25),
      wind: Math.round(Math.random() * 15 * 10) / 10,
      rainfall: Math.round(Math.random() * 5 * 10) / 10,
      soil_temp: Math.round((22 + Math.random() * 6) * 10) / 10,
      soil_moisture: Math.round((30 + Math.random() * 25) * 10) / 10,
    },
    forecast,
    hourly,
    location: { latitude: lat, longitude: lon, mode },
    source: 'mock',
  };
}

// -------------------------------------------------------
// @desc    Main weather endpoint (station → Open-Meteo → mock)
// @route   GET /api/weather
// @access  Public
// -------------------------------------------------------
const getWeather = async (req, res) => {
  try {
    const { latitude, longitude, mode } = req.query;

    // Resolve location
    let lat, lon, locationMode;

    if (mode === 'auto' || (!latitude && !longitude)) {
      lat = DEFAULT_LAT;
      lon = DEFAULT_LON;
      locationMode = 'auto';
    } else {
      lat = parseFloat(latitude) || DEFAULT_LAT;
      lon = parseFloat(longitude) || DEFAULT_LON;
      locationMode = 'manual';
    }

    // ── Priority 1: Live station data ──────────────────
    const stationData = getLatestStationData();

    if (stationData) {
      console.log('📡 Serving weather from station data');
      return res.status(200).json({
        current: {
          temp: stationData.air_temperature,
          humidity: stationData.humidity,
          wind: stationData.wind_speed,
          rainfall: stationData.rainfall,
          soil_temp: stationData.soil_temperature,
          soil_moisture: stationData.soil_moisture,
        },
        forecast: [],
        hourly: [],
        location: { latitude: lat, longitude: lon, mode: locationMode },
        source: 'station',
      });
    }

    // ── Priority 2: Open-Meteo API ─────────────────────
    try {
      console.log(`🌐 Fetching Open-Meteo for ${lat}, ${lon}`);

      const response = await axios.get(OPEN_METEO_URL, {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,soil_temperature_0cm,soil_moisture_0_to_1cm',
          hourly: 'temperature_2m,soil_temperature_0cm',
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
          timezone: 'auto',
          forecast_days: 7,
        },
        timeout: API_TIMEOUT,
      });

      const { data } = response;

      // Parse current weather
      const current = {
        temp: data.current?.temperature_2m ?? null,
        humidity: data.current?.relative_humidity_2m ?? null,
        wind: data.current?.wind_speed_10m ?? null,
        rainfall: data.current?.precipitation ?? null,
        soil_temp: data.current?.soil_temperature_0cm ?? null,
        soil_moisture: data.current?.soil_moisture_0_to_1cm ?? null,
      };

      // Parse daily forecast
      const forecast = (data.daily?.time || []).map((date, i) => ({
        date,
        max: data.daily.temperature_2m_max?.[i] ?? null,
        min: data.daily.temperature_2m_min?.[i] ?? null,
        rain_probability: data.daily.precipitation_probability_max?.[i] ?? null,
      }));

      // Parse hourly (next 24h)
      const hourly = (data.hourly?.time || []).slice(0, 24).map((time, i) => ({
        time,
        temp: data.hourly.temperature_2m?.[i] ?? null,
        soil_temp: data.hourly.soil_temperature_0cm?.[i] ?? null,
      }));

      return res.status(200).json({
        current,
        forecast,
        hourly,
        location: { latitude: lat, longitude: lon, mode: locationMode },
        source: 'open-meteo',
      });
    } catch (apiErr) {
      console.error('⚠️  Open-Meteo failed:', apiErr.message);
    }

    // ── Priority 3: Mock fallback ──────────────────────
    console.log('🔶 Serving mock weather data (no station, no Open-Meteo)');
    return res.status(200).json(generateMockWeather(lat, lon, locationMode));

  } catch (error) {
    console.error('Weather endpoint error:', error.message);
    // Absolute last resort — still return usable JSON, never crash
    return res.status(200).json(generateMockWeather(DEFAULT_LAT, DEFAULT_LON, 'auto'));
  }
};

// @desc    Get weather data for a city
// @route   GET /api/weather/:city
// @access  Public
const getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.params;
    let weather = null;

    try {
      weather = await WeatherData.findOne({ city: new RegExp(city, 'i') }).sort({ createdAt: -1 });
    } catch (_) {
      // DB not available — fall through to mock
    }

    if (!weather) {
      // Return mock data if no real data exists
      return res.json({
        city: city,
        temperature: { current: 32, min: 24, max: 38, unit: '°C' },
        humidity: 65,
        rainProbability: 40,
        windSpeed: 12,
        windDirection: 'NW',
        condition: 'partly-cloudy',
        forecast: generateMockForecast(),
        alerts: [
          { type: 'rain', message: 'Rain expected in 2 hours — Delay pesticide spraying.', severity: 'medium' },
        ],
        farmingInsight: 'Moderate humidity levels. Good time for transplanting seedlings.',
        source: 'mock',
      });
    }

    res.json(weather);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
};

// @desc    Get all weather alerts
// @route   GET /api/weather/alerts/all
// @access  Public
const getWeatherAlerts = async (req, res) => {
  try {
    let alerts = [];

    try {
      alerts = await WeatherData.find({ 'alerts.0': { $exists: true } })
        .select('city alerts')
        .sort({ createdAt: -1 })
        .limit(10);
    } catch (_) {
      // DB not available
    }

    res.json(alerts.length > 0 ? alerts : [
      { city: 'Ahmedabad', alerts: [{ type: 'heat', message: 'Heat wave expected. Increase irrigation frequency.', severity: 'high' }] },
      { city: 'Mumbai', alerts: [{ type: 'rain', message: 'Heavy rainfall expected. Protect harvested crops.', severity: 'critical' }] },
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
};

// Helper: Generate mock 7-day forecast
function generateMockForecast() {
  const conditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy', 'sunny', 'partly-cloudy', 'sunny'];
  const forecast = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    forecast.push({
      date: date.toISOString(),
      tempMin: 22 + Math.floor(Math.random() * 5),
      tempMax: 32 + Math.floor(Math.random() * 8),
      condition: conditions[i],
      rainProbability: Math.floor(Math.random() * 80),
    });
  }
  return forecast;
}

module.exports = { getWeather, getWeatherByCity, getWeatherAlerts };
