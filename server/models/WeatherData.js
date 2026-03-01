const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    temperature: {
      current: Number,
      min: Number,
      max: Number,
      unit: { type: String, default: '°C' },
    },
    humidity: {
      type: Number,
      min: 0,
      max: 100,
    },
    rainProbability: {
      type: Number,
      min: 0,
      max: 100,
    },
    windSpeed: {
      type: Number,
      min: 0,
    },
    windDirection: String,
    condition: {
      type: String,
      enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy', 'partly-cloudy', 'windy'],
    },
    forecast: [
      {
        date: Date,
        tempMin: Number,
        tempMax: Number,
        condition: String,
        rainProbability: Number,
      },
    ],
    alerts: [
      {
        type: { type: String },
        message: String,
        severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
      },
    ],
    farmingInsight: String,
    source: {
      type: String,
      default: 'manual',
    },
  },
  { timestamps: true }
);

weatherDataSchema.index({ city: 1, createdAt: -1 });

module.exports = mongoose.model('WeatherData', weatherDataSchema);
