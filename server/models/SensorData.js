const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema(
  {
    stationId: {
      type: String,
      required: true,
      index: true,
    },
    temperature: {
      type: Number,
      comment: 'Air temperature from DHT11 in °C',
    },
    humidity: {
      type: Number,
      comment: 'Air humidity from DHT11 in %',
    },
    soilTemperature: {
      type: Number,
      comment: 'Soil temperature from DS18B20 in °C',
    },
    soilMoisture: {
      type: Number,
      comment: 'Soil moisture from 200SS sensor in %',
    },
    windSpeed: {
      type: Number,
      comment: 'Wind speed in km/h',
    },
    windDirection: {
      type: String,
      comment: 'Wind direction (N, NE, E, SE, S, SW, W, NW)',
    },
    rainfall: {
      type: Number,
      comment: 'Rainfall in mm from rain gauge',
    },
    batteryLevel: {
      type: Number,
      comment: 'Battery level of the weather station in %',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

sensorDataSchema.index({ stationId: 1, timestamp: -1 });

module.exports = mongoose.model('SensorData', sensorDataSchema);
