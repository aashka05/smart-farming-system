const Crop = require('../models/Crop');

// @desc    Get all crops
// @route   GET /api/crops
// @access  Public
const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find().select('-diseases');
    res.json(crops.length > 0 ? crops : getMockCrops());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching crops', error: error.message });
  }
};

// @desc    Get crop by ID with disease info
// @route   GET /api/crops/:id
// @access  Public
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching crop details', error: error.message });
  }
};

// @desc    Get crop recommendation based on inputs
// @route   POST /api/crops/recommend
// @access  Public
const getRecommendation = async (req, res) => {
  try {
    const { soilType, rainfall, temperature, season } = req.body;

    // Mock recommendation logic (to be replaced with ML model)
    const recommendations = generateRecommendation(soilType, rainfall, temperature, season);
    res.json({ recommendations, source: 'mock-model' });
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendation', error: error.message });
  }
};

// Mock recommendation engine
function generateRecommendation(soilType, rainfall, temperature, season) {
  const cropDatabase = {
    'alluvial': { kharif: ['Rice', 'Maize', 'Sugarcane'], rabi: ['Wheat', 'Mustard', 'Barley'] },
    'black': { kharif: ['Cotton', 'Soybean', 'Pigeon Pea'], rabi: ['Wheat', 'Gram', 'Linseed'] },
    'red': { kharif: ['Groundnut', 'Millet', 'Maize'], rabi: ['Potato', 'Wheat', 'Tomato'] },
    'laterite': { kharif: ['Rice', 'Rubber', 'Coconut'], rabi: ['Tea', 'Coffee', 'Cashew'] },
    'sandy': { kharif: ['Bajra', 'Jowar', 'Groundnut'], rabi: ['Mustard', 'Cumin', 'Barley'] },
    'clay': { kharif: ['Rice', 'Jute', 'Sugarcane'], rabi: ['Wheat', 'Lentil', 'Gram'] },
  };

  const soil = soilType?.toLowerCase() || 'alluvial';
  const s = season?.toLowerCase() || 'kharif';
  const crops = cropDatabase[soil]?.[s] || cropDatabase['alluvial']['kharif'];

  return crops.map((crop, idx) => ({
    crop,
    confidence: Math.max(95 - idx * 12, 60) - Math.floor(Math.random() * 5),
    reason: `${crop} grows well in ${soil} soil during ${s} season with ${rainfall || 'moderate'}mm rainfall and ${temperature || 'warm'} temperatures.`,
  }));
}

function getMockCrops() {
  return [
    { _id: '1', name: 'Rice', category: 'cereal', season: 'kharif', description: 'Major staple food crop' },
    { _id: '2', name: 'Wheat', category: 'cereal', season: 'rabi', description: 'Important rabi cereal crop' },
    { _id: '3', name: 'Cotton', category: 'cash-crop', season: 'kharif', description: 'Major cash crop' },
    { _id: '4', name: 'Maize', category: 'cereal', season: 'kharif', description: 'Versatile cereal crop' },
    { _id: '5', name: 'Sugarcane', category: 'cash-crop', season: 'kharif', description: 'Important sugar producing crop' },
  ];
}

module.exports = { getCrops, getCropById, getRecommendation };
