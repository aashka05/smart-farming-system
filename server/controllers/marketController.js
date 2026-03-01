const MarketPrice = require('../models/MarketPrice');

// @desc    Get market prices with filters
// @route   GET /api/market
// @access  Public
const getMarketPrices = async (req, res) => {
  try {
    const { state, district, crop, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (state) filter.state = new RegExp(state, 'i');
    if (district) filter.district = new RegExp(district, 'i');
    if (crop) filter.crop = new RegExp(crop, 'i');

    const prices = await MarketPrice.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await MarketPrice.countDocuments(filter);

    if (prices.length === 0) {
      return res.json({
        prices: getMockMarketPrices(state, district, crop),
        total: 15,
        page: 1,
        source: 'mock',
      });
    }

    res.json({ prices, total, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market prices', error: error.message });
  }
};

// @desc    Get price trends for a crop
// @route   GET /api/market/trends/:crop
// @access  Public
const getPriceTrends = async (req, res) => {
  try {
    const { crop } = req.params;
    const trends = await MarketPrice.find({ crop: new RegExp(crop, 'i') })
      .sort({ date: -1 })
      .limit(30)
      .select('crop modalPrice date market');

    res.json(trends.length > 0 ? trends : []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price trends', error: error.message });
  }
};

function getMockMarketPrices(state, district, crop) {
  const data = [
    { crop: 'Rice', market: 'Ahmedabad APMC', state: 'Gujarat', district: 'Ahmedabad', minPrice: 1800, maxPrice: 2200, modalPrice: 2000, unit: '₹/quintal' },
    { crop: 'Wheat', market: 'Rajkot APMC', state: 'Gujarat', district: 'Rajkot', minPrice: 2100, maxPrice: 2500, modalPrice: 2300, unit: '₹/quintal' },
    { crop: 'Cotton', market: 'Surat APMC', state: 'Gujarat', district: 'Surat', minPrice: 5500, maxPrice: 6200, modalPrice: 5800, unit: '₹/quintal' },
    { crop: 'Maize', market: 'Indore Mandi', state: 'Madhya Pradesh', district: 'Indore', minPrice: 1400, maxPrice: 1800, modalPrice: 1600, unit: '₹/quintal' },
    { crop: 'Sugarcane', market: 'Pune APMC', state: 'Maharashtra', district: 'Pune', minPrice: 280, maxPrice: 350, modalPrice: 310, unit: '₹/quintal' },
    { crop: 'Soybean', market: 'Nagpur APMC', state: 'Maharashtra', district: 'Nagpur', minPrice: 4200, maxPrice: 4800, modalPrice: 4500, unit: '₹/quintal' },
    { crop: 'Groundnut', market: 'Junagadh APMC', state: 'Gujarat', district: 'Junagadh', minPrice: 4800, maxPrice: 5500, modalPrice: 5200, unit: '₹/quintal' },
    { crop: 'Bajra', market: 'Jodhpur Mandi', state: 'Rajasthan', district: 'Jodhpur', minPrice: 2000, maxPrice: 2400, modalPrice: 2200, unit: '₹/quintal' },
    { crop: 'Rice', market: 'Lucknow Mandi', state: 'Uttar Pradesh', district: 'Lucknow', minPrice: 1900, maxPrice: 2300, modalPrice: 2100, unit: '₹/quintal' },
    { crop: 'Wheat', market: 'Bhopal Mandi', state: 'Madhya Pradesh', district: 'Bhopal', minPrice: 2050, maxPrice: 2450, modalPrice: 2250, unit: '₹/quintal' },
    { crop: 'Tomato', market: 'Nashik APMC', state: 'Maharashtra', district: 'Nashik', minPrice: 800, maxPrice: 1500, modalPrice: 1100, unit: '₹/quintal' },
    { crop: 'Onion', market: 'Lasalgaon APMC', state: 'Maharashtra', district: 'Nashik', minPrice: 1200, maxPrice: 2000, modalPrice: 1600, unit: '₹/quintal' },
    { crop: 'Potato', market: 'Agra Mandi', state: 'Uttar Pradesh', district: 'Agra', minPrice: 600, maxPrice: 1000, modalPrice: 800, unit: '₹/quintal' },
    { crop: 'Cotton', market: 'Guntur APMC', state: 'Andhra Pradesh', district: 'Guntur', minPrice: 5600, maxPrice: 6400, modalPrice: 6000, unit: '₹/quintal' },
    { crop: 'Mustard', market: 'Jaipur Mandi', state: 'Rajasthan', district: 'Jaipur', minPrice: 4800, maxPrice: 5400, modalPrice: 5100, unit: '₹/quintal' },
  ];

  return data.filter((d) => {
    if (state && !d.state.toLowerCase().includes(state.toLowerCase())) return false;
    if (district && !d.district.toLowerCase().includes(district.toLowerCase())) return false;
    if (crop && !d.crop.toLowerCase().includes(crop.toLowerCase())) return false;
    return true;
  });
}

module.exports = { getMarketPrices, getPriceTrends };
