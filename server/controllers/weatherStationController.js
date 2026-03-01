const SensorData = require('../models/SensorData');

// -------------------------------------------------------
// In-memory storage for latest weather station reading
// -------------------------------------------------------
let latestStationData = null;

/** Getter so other controllers can read station data */
const getLatestStationData = () => latestStationData;

// -------------------------------------------------------
// @desc    Receive data from weather station (IoT ready)
// @route   POST /api/station/data
// @access  Public
// -------------------------------------------------------
const receiveSensorData = async (req, res) => {
  try {
    const {
      // New field names (spec)
      air_temperature,
      humidity,
      soil_temperature,
      soil_moisture,
      wind_speed,
      wind_direction,
      rainfall,
      timestamp,
      // Legacy field names (backward compat)
      stationId,
      temperature,
      soilTemperature,
      soilMoisture,
      windSpeed,
      windDirection,
      batteryLevel,
    } = req.body;

    // Normalise — accept either naming convention
    const data = {
      air_temperature: parseFloat(air_temperature ?? temperature) || null,
      humidity: parseFloat(humidity) || null,
      soil_temperature: parseFloat(soil_temperature ?? soilTemperature) || null,
      soil_moisture: parseFloat(soil_moisture ?? soilMoisture) || null,
      wind_speed: parseFloat(wind_speed ?? windSpeed) || null,
      wind_direction: wind_direction || windDirection || null,
      rainfall: parseFloat(rainfall) || 0,
      timestamp: timestamp || new Date().toISOString(),
    };

    // Store in memory
    latestStationData = { ...data, receivedAt: new Date().toISOString() };
    console.log('📡 Station data received:', JSON.stringify(latestStationData, null, 2));

    // Optionally persist to MongoDB (non-blocking, never crashes)
    try {
      await SensorData.create({
        stationId: stationId || 'default-station',
        temperature: data.air_temperature,
        humidity: data.humidity,
        soilTemperature: data.soil_temperature,
        soilMoisture: data.soil_moisture,
        windSpeed: data.wind_speed,
        windDirection: data.wind_direction,
        rainfall: data.rainfall,
        batteryLevel: batteryLevel || null,
        timestamp: data.timestamp,
      });
    } catch (dbErr) {
      console.log('⚠️  DB save skipped:', dbErr.message);
    }

    res.status(200).json({
      message: 'Sensor data received successfully',
      data: latestStationData,
    });
  } catch (error) {
    console.error('Station data error:', error.message);
    res.status(500).json({ message: 'Error processing sensor data', error: error.message });
  }
};

// -------------------------------------------------------
// @desc    Simulate weather station reading
// @route   GET /api/station/simulate
// @access  Public
// -------------------------------------------------------
const simulateData = (req, res) => {
  try {
    const rand = (min, max) => Math.round((Math.random() * (max - min) + min) * 10) / 10;

    const data = {
      air_temperature: rand(20, 38),
      humidity: rand(40, 85),
      soil_temperature: rand(18, 32),
      soil_moisture: rand(20, 60),
      wind_speed: rand(0, 20),
      wind_direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      rainfall: rand(0, 10),
      timestamp: new Date().toISOString(),
    };

    latestStationData = { ...data, receivedAt: new Date().toISOString(), simulated: true };
    console.log('🔄 Simulated station data:', JSON.stringify(latestStationData, null, 2));

    res.status(200).json({
      message: 'Simulated data generated',
      data: latestStationData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating simulation', error: error.message });
  }
};

// -------------------------------------------------------
// @desc    Get latest sensor data from a station
// @route   GET /api/weather-station/:stationId/latest
// @access  Private
// -------------------------------------------------------
const getLatestData = async (req, res) => {
  try {
    const { stationId } = req.params;
    let data = null;

    try {
      data = await SensorData.findOne({ stationId }).sort({ timestamp: -1 });
    } catch (_) {
      // DB not available — continue
    }

    if (!data) {
      return res.json(
        latestStationData || {
          stationId,
          temperature: 28.5,
          humidity: 72,
          soilTemperature: 24.3,
          soilMoisture: 45,
          windSpeed: 8.2,
          windDirection: 'NW',
          rainfall: 0,
          batteryLevel: 85,
          timestamp: new Date().toISOString(),
          source: 'mock',
        },
      );
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensor data', error: error.message });
  }
};

// -------------------------------------------------------
// @desc    Get sensor data history
// @route   GET /api/weather-station/:stationId/history
// @access  Private
// -------------------------------------------------------
const getDataHistory = async (req, res) => {
  try {
    const { stationId } = req.params;
    const { hours = 24 } = req.query;
    let data = [];

    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000);
      data = await SensorData.find({
        stationId,
        timestamp: { $gte: since },
      }).sort({ timestamp: 1 });
    } catch (_) {
      // DB not available — return empty
    }

    res.json({ stationId, period: `${hours}h`, data });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};

module.exports = {
  receiveSensorData,
  simulateData,
  getLatestData,
  getDataHistory,
  getLatestStationData,
};
