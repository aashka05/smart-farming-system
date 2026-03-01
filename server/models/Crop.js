const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    scientificName: String,
    category: {
      type: String,
      enum: ['cereal', 'pulse', 'oilseed', 'cash-crop', 'vegetable', 'fruit', 'spice'],
    },
    season: {
      type: String,
      enum: ['kharif', 'rabi', 'zaid', 'all-season'],
    },
    soilTypes: [String],
    optimalTemperature: {
      min: Number,
      max: Number,
    },
    optimalRainfall: {
      min: Number,
      max: Number,
    },
    growthDuration: {
      type: Number,
      comment: 'Duration in days',
    },
    diseases: [
      {
        name: String,
        symptoms: [String],
        causes: [String],
        remedies: [String],
        prevention: [String],
        severity: { type: String, enum: ['low', 'medium', 'high'] },
      },
    ],
    imageUrl: String,
    description: String,
  },
  { timestamps: true }
);

cropSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Crop', cropSchema);
