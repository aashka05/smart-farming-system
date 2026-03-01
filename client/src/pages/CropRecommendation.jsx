import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLightBulb, HiChartBar, HiCheckCircle } from 'react-icons/hi';

const soilTypes = ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay'];
const seasons = ['Kharif', 'Rabi', 'Zaid'];

const cropDatabase = {
  alluvial: { kharif: ['Rice', 'Maize', 'Sugarcane'], rabi: ['Wheat', 'Mustard', 'Barley'], zaid: ['Watermelon', 'Cucumber', 'Moong'] },
  black: { kharif: ['Cotton', 'Soybean', 'Pigeon Pea'], rabi: ['Wheat', 'Gram', 'Linseed'], zaid: ['Groundnut', 'Sunflower', 'Sesame'] },
  red: { kharif: ['Groundnut', 'Millet', 'Maize'], rabi: ['Potato', 'Wheat', 'Tomato'], zaid: ['Cucumber', 'Bitter Gourd', 'Pumpkin'] },
  laterite: { kharif: ['Rice', 'Rubber', 'Coconut'], rabi: ['Tea', 'Coffee', 'Cashew'], zaid: ['Pineapple', 'Tapioca', 'Pepper'] },
  sandy: { kharif: ['Bajra', 'Jowar', 'Groundnut'], rabi: ['Mustard', 'Cumin', 'Barley'], zaid: ['Watermelon', 'Muskmelon', 'Moth Bean'] },
  clay: { kharif: ['Rice', 'Jute', 'Sugarcane'], rabi: ['Wheat', 'Lentil', 'Gram'], zaid: ['Okra', 'Bottle Gourd', 'Ridge Gourd'] },
};

const reasons = {
  Rice: 'Thrives in waterlogged alluvial and clay soils with high rainfall.',
  Wheat: 'Ideal for cool temperatures during rabi season with moderate water.',
  Cotton: 'Black soil retains moisture well, perfect for cotton cultivation.',
  Maize: 'Versatile crop that grows well in well-drained soils with warm weather.',
  Sugarcane: 'Requires rich alluvial soil with consistent moisture and tropical climate.',
  Soybean: 'Black soil and kharif season provide ideal growing conditions.',
  Groundnut: 'Sandy and red soils with moderate rainfall are optimal.',
  Bajra: 'Drought-tolerant crop ideal for sandy soils with low rainfall.',
  Mustard: 'Cold-season crop perfect for sandy and alluvial soils.',
  Barley: 'Hardy rabi crop that tolerates alkaline and light soils well.',
};

export default function CropRecommendation() {
  const [soilType, setSoilType] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [temperature, setTemperature] = useState('');
  const [season, setSeason] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = (e) => {
    e.preventDefault();
    if (!soilType || !season) return;

    setLoading(true);
    setTimeout(() => {
      const soil = soilType.toLowerCase();
      const s = season.toLowerCase();
      const crops = cropDatabase[soil]?.[s] || cropDatabase['alluvial']['kharif'];

      const recommendations = crops.map((crop, idx) => ({
        crop,
        confidence: Math.max(95 - idx * 12, 60) + Math.floor(Math.random() * 5),
        reason: reasons[crop] || `${crop} is well-suited for ${soilType.toLowerCase()} soil during ${season.toLowerCase()} season.`,
      }));

      setResults(recommendations);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">🌱 Crop Recommendation</h1>
          <p className="section-subtitle">
            Enter your soil and weather conditions to get AI-powered crop suggestions
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                <HiLightBulb className="w-5 h-5 text-yellow-500" />
                Enter Farming Conditions
              </h3>
              <form onSubmit={handlePredict} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Soil Type *</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select Soil Type</option>
                    {soilTypes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Season *</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select Season</option>
                    {seasons.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Average Rainfall (mm)</label>
                  <input
                    type="number"
                    value={rainfall}
                    onChange={(e) => setRainfall(e.target.value)}
                    placeholder="e.g., 800"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Average Temperature (°C)</label>
                  <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="e.g., 30"
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <HiChartBar className="w-5 h-5" />
                      Predict Best Crops
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {results ? (
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5 text-primary-500" />
                  Top 3 Recommended Crops
                </h3>
                {results.map((r, idx) => (
                  <motion.div
                    key={r.crop}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="glass-card-hover p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-600">
                          #{idx + 1}
                        </div>
                        <h4 className="font-display font-bold text-xl text-gray-800 dark:text-white">{r.crop}</h4>
                      </div>
                      <span className={`badge ${r.confidence >= 85 ? 'badge-green' : r.confidence >= 70 ? 'badge-yellow' : 'badge-red'}`}>
                        {r.confidence}% match
                      </span>
                    </div>

                    {/* Confidence Bar */}
                    <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2.5 mb-3">
                      <motion.div
                        className="bg-gradient-to-r from-primary-400 to-primary-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${r.confidence}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.15 }}
                      />
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">{r.reason}</p>
                  </motion.div>
                ))}

                <div className="glass-card p-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-200/50 dark:border-primary-800/30">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
                    <span>ℹ️</span>
                    Recommendations are based on mock prediction logic. Will be replaced with ML model for higher accuracy.
                  </p>
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
                <span className="text-6xl mb-4">🌾</span>
                <h3 className="text-xl font-display font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Enter Your Conditions
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Fill in the form and click "Predict" to get personalized crop recommendations
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
