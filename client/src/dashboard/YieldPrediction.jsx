import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { HiChartBar, HiCalculator } from 'react-icons/hi';

const soilTypes = ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay'];

const yieldFactors = [
  { name: 'Soil Quality', value: 30, color: '#8b5e3c' },
  { name: 'Rainfall', value: 25, color: '#3b82f6' },
  { name: 'Temperature', value: 20, color: '#f97316' },
  { name: 'Crop Area', value: 15, color: '#22c55e' },
  { name: 'Other', value: 10, color: '#a855f7' },
];

export default function YieldPrediction() {
  const [cropArea, setCropArea] = useState('');
  const [soilType, setSoilType] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = (e) => {
    e.preventDefault();
    if (!cropArea || !soilType || !rainfall) return;

    setLoading(true);
    setTimeout(() => {
      const area = parseFloat(cropArea);
      const rain = parseFloat(rainfall);

      // Mock yield calculation
      const soilMultiplier = { alluvial: 1.2, black: 1.15, red: 0.95, laterite: 0.85, sandy: 0.75, clay: 1.05 };
      const mult = soilMultiplier[soilType.toLowerCase()] || 1;
      const baseYield = 25; // quintals per hectare
      const rainFactor = rain > 500 ? 1.1 : rain > 300 ? 1.0 : 0.8;
      const predictedYield = Math.round(area * baseYield * mult * rainFactor * 100) / 100;
      const revenue = Math.round(predictedYield * 2100); // avg price per quintal

      setResult({
        yield: predictedYield,
        unit: 'quintals',
        revenue,
        breakdown: [
          { factor: 'Crop Area', contribution: `${area} hectares` },
          { factor: 'Soil Type', contribution: `${soilType} (${mult}x multiplier)` },
          { factor: 'Rainfall', contribution: `${rain}mm (${rainFactor}x factor)` },
        ],
        comparison: [
          { name: 'Your Prediction', yield: predictedYield },
          { name: 'District Avg', yield: Math.round(predictedYield * 0.82) },
          { name: 'State Avg', yield: Math.round(predictedYield * 0.75) },
          { name: 'National Avg', yield: Math.round(predictedYield * 0.68) },
        ],
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">📊 Yield Prediction</h1>
          <p className="section-subtitle">Predict crop yield based on area, soil type, and rainfall data</p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <HiCalculator className="w-5 h-5 text-blue-500" />
              Input Parameters
            </h3>
            <form onSubmit={handlePredict} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Crop Area (Hectares) *</label>
                <input
                  type="number"
                  value={cropArea}
                  onChange={(e) => setCropArea(e.target.value)}
                  placeholder="e.g., 5"
                  className="input-field"
                  required
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Soil Type *</label>
                <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className="input-field" required>
                  <option value="">Select Soil Type</option>
                  {soilTypes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Average Rainfall (mm) *</label>
                <input
                  type="number"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  placeholder="e.g., 600"
                  className="input-field"
                  required
                  min="0"
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
                    Calculating...
                  </>
                ) : (
                  <>
                    <HiChartBar className="w-5 h-5" />
                    Predict Yield
                  </>
                )}
              </button>
            </form>

            {/* Yield Factors Pie Chart */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Factors Affecting Yield</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={yieldFactors} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {yieldFactors.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {result ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {/* Predicted Yield */}
                <div className="glass-card p-6 text-center bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Predicted Yield</h4>
                  <p className="text-4xl font-display font-extrabold gradient-text">{result.yield}</p>
                  <p className="text-gray-500 text-sm">{result.unit}</p>
                  <div className="mt-3 pt-3 border-t border-primary-200 dark:border-primary-800">
                    <p className="text-sm text-gray-500">Estimated Revenue</p>
                    <p className="text-2xl font-bold text-primary-600">₹{result.revenue.toLocaleString()}</p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="glass-card p-5">
                  <h4 className="font-display font-semibold mb-3">📋 Calculation Breakdown</h4>
                  {result.breakdown.map((b) => (
                    <div key={b.factor} className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border last:border-0 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{b.factor}</span>
                      <span className="font-medium text-gray-800 dark:text-white">{b.contribution}</span>
                    </div>
                  ))}
                </div>

                {/* Comparison Chart */}
                <div className="glass-card p-5">
                  <h4 className="font-display font-semibold mb-4">📊 Yield Comparison</h4>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.comparison}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="yield" fill="#22c55e" radius={[6, 6, 0, 0]} name="Yield (q)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
                <span className="text-6xl mb-4">📊</span>
                <h3 className="font-display font-semibold text-xl text-gray-600 dark:text-gray-400 mb-2">
                  Enter Parameters
                </h3>
                <p className="text-sm text-gray-500">Fill in crop area, soil type, and rainfall to predict yield</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
