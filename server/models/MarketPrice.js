const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: true,
      trim: true,
    },
    market: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    minPrice: {
      type: Number,
      required: true,
    },
    maxPrice: {
      type: Number,
      required: true,
    },
    modalPrice: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: '₹/quintal',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      default: 'manual',
    },
  },
  { timestamps: true }
);

marketPriceSchema.index({ crop: 1, state: 1, date: -1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
