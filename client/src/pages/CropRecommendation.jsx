import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiLightBulb, HiChartBar, HiCheckCircle, HiLocationMarker, HiBeaker } from 'react-icons/hi';
import { useTranslation } from '../utils/useTranslation';
import axios from 'axios';
import MapSelector from '../components/MapSelector';

export default function CropRecommendation() {
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [ph, setPh] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

  const cStrings = useMemo(() => ({
    title: 'Crop Recommendation',
    subtitle: 'Enter your soil and weather conditions to get AI-powered crop suggestions',
    enterConditions: 'Enter Farming Conditions',
    soilType: 'Soil Type', selectSoil: 'Select Soil Type',
    seasonLabel: 'Season', selectSeason: 'Select Season',
    avgRainfall: 'Average Rainfall (mm)', avgTemp: 'Average Temperature (°C)',
    predicting: 'Analyzing...', predictBtn: 'Get Crop Recommendation',
    topCrops: 'AI Recommended Crops', match: 'match',
    enterYour: 'Enter Your Conditions',
    fillForm: 'Fill in your soil and weather details to get ML-powered crop recommendations',
  }), []);
  const { t: ct } = useTranslation(cStrings);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!nitrogen || !phosphorus || !potassium || !temperature || !humidity || !ph || !rainfall) {
      setError('Please fill in all required fields (N, P, K, Temperature, Humidity, pH, Rainfall).');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const params = new URLSearchParams({
        N: parseFloat(nitrogen),
        P: parseFloat(phosphorus),
        K: parseFloat(potassium),
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        ph: parseFloat(ph),
        rainfall: parseFloat(rainfall),
      });
      const { data } = await axios.get(`${AI_SERVICE_URL}/api/crop/predict?${params}`);

      if (data.error) {
        setError(data.error);
      } else {
        // Transform probabilities into a sorted top-3 list for display
        console.log(data) ; 
        const top3 = data.probabilities
          ? Object.entries(data.probabilities)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([crop, prob]) => ({ crop: crop.charAt(0).toUpperCase() + crop.slice(1), confidence: Math.round(prob * 100) }))
          : [];
        setResults({ ...data, top3 });
      }
    } catch (err) {
      console.error('Crop prediction error:', err);
      setError('Could not fetch prediction. Please ensure the AI service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">🌱 {ct.title}</h1>
          <p className="section-subtitle">{ct.subtitle}</p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* ── Unified Input Form ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                <HiLightBulb className="w-5 h-5 text-yellow-500" />
                {ct.enterConditions}
              </h3>
              <form onSubmit={handlePredict} className="space-y-5">
                {/* Soil Nutrient Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nitrogen (N) <span className="text-xs text-gray-400">kg/ha</span> *
                    </label>
                    <input type="number" value={nitrogen} onChange={(e) => setNitrogen(e.target.value)}
                      placeholder="e.g., 50" className="input-field" min="0" max="200" step="any" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phosphorus (P) <span className="text-xs text-gray-400">kg/ha</span> *
                    </label>
                    <input type="number" value={phosphorus} onChange={(e) => setPhosphorus(e.target.value)}
                      placeholder="e.g., 40" className="input-field" min="0" max="200" step="any" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Potassium (K) <span className="text-xs text-gray-400">kg/ha</span> *
                    </label>
                    <input type="number" value={potassium} onChange={(e) => setPotassium(e.target.value)}
                      placeholder="e.g., 45" className="input-field" min="0" max="300" step="any" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Humidity <span className="text-xs text-gray-400">%</span> *
                    </label>
                    <input type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)}
                      placeholder="e.g., 65" className="input-field" min="0" max="100" step="any" required />
                  </div>
                </div>

                {/* Environment Inputs */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Temperature <span className="text-xs text-gray-400">°C</span> *
                    </label>
                    <input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)}
                      placeholder="e.g., 30" className="input-field" step="any" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Soil pH *
                    </label>
                    <input type="number" value={ph} onChange={(e) => setPh(e.target.value)}
                      placeholder="e.g., 6.5" className="input-field" min="0" max="14" step="any" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rainfall <span className="text-xs text-gray-400">mm</span> *
                    </label>
                    <input type="number" value={rainfall} onChange={(e) => setRainfall(e.target.value)}
                      placeholder="e.g., 200" className="input-field" min="0" step="any" required />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {ct.predicting}
                    </>
                  ) : (
                    <>
                      <HiChartBar className="w-5 h-5" />
                      {ct.predictBtn}
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* ── Results Panel ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {results ? (
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5 text-primary-500" />
                  {ct.topCrops}
                </h3>

                {results.top3 && results.top3.length > 0 ? (
                  results.top3.map((item, idx) => (
                    <motion.div
                      key={item.crop || idx}
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
                          <h4 className="font-display font-bold text-xl text-gray-800 dark:text-white">{item.crop}</h4>
                        </div>
                        <span className={`badge ${item.confidence >= 70 ? 'badge-green' : item.confidence >= 40 ? 'badge-yellow' : 'badge-red'}`}>
                          {item.confidence}% {ct.match}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2.5 mb-3">
                        <motion.div
                          className="bg-gradient-to-r from-primary-400 to-primary-600 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(item.confidence, 100)}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.15 }}
                        />
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      )}
                    </motion.div>
                  ))
                ) : results.predicted_crop ? (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card-hover p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-600">#1</div>
                      <h4 className="font-display font-bold text-xl text-gray-800 dark:text-white capitalize">{results.predicted_crop}</h4>
                    </div>
                    {results.confidence != null && (
                      <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2.5 mb-2">
                        <motion.div
                          className="bg-gradient-to-r from-primary-400 to-primary-600 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(results.confidence * 100)}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    )}
                  </motion.div>
                ) : null}

                {results.input && (
                  <div className="glass-card p-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-200/50 dark:border-primary-800/30">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
                      <span>ℹ️</span>
                      ML prediction based on N={results.input.N}, P={results.input.P}, K={results.input.K},
                      Humidity={results.input.humidity}%, pH={results.input.ph}, Temp={results.input.temperature}°C, Rainfall={results.input.rainfall}mm
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
                <span className="text-6xl mb-4">🌾</span>
                <h3 className="text-xl font-display font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  {ct.enterYour}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {ct.fillForm}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ════════  MAP-BASED ML RECOMMENDATION  ════════ */}
        <MapBasedRecommendation />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Map-based crop recommendation sub-component
   ───────────────────────────────────────────── */
function MapBasedRecommendation() {
  const [position, setPosition] = useState(null);
  const [mlResult, setMlResult] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState('');

  const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

  const handleGetRecommendation = async () => {
    if (!position) return;
    setMlLoading(true);
    setMlError('');
    setMlResult(null);

    try {
      const { data } = await axios.post(`${AI_SERVICE_URL}/api/crop/recommend`, {
        latitude: position.lat,
        longitude: position.lng,
      });

      if (data.error) {
        setMlError(data.error);
      } else {
        // Normalize: API returns top_3_recommended_crops, map to top3
        const crops = data.top_3_recommended_crops || data.top3 || [];
        setMlResult({ ...data, top3: crops });
      }
    } catch (err) {
      console.error('ML crop recommendation error:', err);
      setMlError('Could not fetch crop recommendation. Please ensure the AI service is running.');
    } finally {
      setMlLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-16"
    >
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 flex items-center justify-center gap-2">
          <HiLocationMarker className="w-7 h-7 text-primary-500" />
          🗺️ Map-Based Crop Recommendation
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Click on the map to select your farm location. Our ML model will analyze soil, climate, and rainfall data for that region and recommend the best crops.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
        {/* Map (3 cols) */}
        <div className="lg:col-span-3">
          <div className="glass-card p-4">
            <MapSelector position={position} setPosition={setPosition} />
          </div>

          {/* Selected Coordinates */}
          {position && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Selected Location</h4>
                <p className="text-lg font-display font-bold text-gray-800 dark:text-white">
                  Latitude: <span className="text-primary-600 dark:text-primary-400">{position.lat}</span>
                  &nbsp;&nbsp;·&nbsp;&nbsp;
                  Longitude: <span className="text-primary-600 dark:text-primary-400">{position.lng}</span>
                </p>
              </div>
              <button
                onClick={handleGetRecommendation}
                disabled={mlLoading}
                className="btn-primary whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
              >
                {mlLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <HiChartBar className="w-5 h-5" />
                    Get Crop Recommendation
                  </>
                )}
              </button>
            </motion.div>
          )}

          {!position && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
              👆 Click anywhere on the map to select a location
            </p>
          )}
        </div>

        {/* Result Panel (2 cols) */}
        <div className="lg:col-span-2">
          {mlError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 border-l-4 border-red-400 bg-red-50 dark:bg-red-900/10">
              <p className="text-sm text-red-700 dark:text-red-400">{mlError}</p>
            </motion.div>
          )}

          {mlResult && !mlError && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <HiCheckCircle className="w-5 h-5 text-primary-500" />
                ML Recommendation Results
              </h3>

              {/* Top recommended crops */}
              {mlResult.top3 && mlResult.top3.length > 0 ? (
                mlResult.top3.map((item, idx) => (
                  <motion.div
                    key={item.crop || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.12 }}
                    className="glass-card-hover p-5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-600">
                          #{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-xl text-gray-800 dark:text-white">
                            {item.crop}
                          </h4>
                          {item.crop_group && (
                            <span className="text-xs text-gray-400 capitalize">{item.crop_group}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {item.ranking_basis && (
                      <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">{item.ranking_basis}</p>
                    )}
                    {item.historical_data && (
                      <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="bg-gray-50 dark:bg-dark-border/30 rounded-lg p-2 text-center">
                          <p className="font-semibold text-gray-700 dark:text-gray-300">{item.historical_data.avg_yield_kg_per_ha}</p>
                          <p>Yield kg/ha</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-border/30 rounded-lg p-2 text-center">
                          <p className="font-semibold text-gray-700 dark:text-gray-300">{item.historical_data.avg_area_ha}</p>
                          <p>Area (ha)</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-border/30 rounded-lg p-2 text-center">
                          <p className="font-semibold text-gray-700 dark:text-gray-300">{item.historical_data.avg_production_tonnes}</p>
                          <p>Prod. (t)</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : mlResult.recommended_crop ? (
                /* Fallback for simple { recommended_crop, description } response */
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card-hover p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-600">
                      #1
                    </div>
                    <h4 className="font-display font-bold text-xl text-gray-800 dark:text-white">
                      {mlResult.recommended_crop}
                    </h4>
                  </div>
                  {mlResult.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{mlResult.description}</p>
                  )}
                </motion.div>
              ) : (
                <div className="glass-card p-6 text-center">
                  <p className="text-sm text-gray-500">No recommendation data returned.</p>
                </div>
              )}

              {/* District info if available */}
              {mlResult.district && (
                <div className="glass-card p-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-200/50 dark:border-primary-800/30">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📍 District: <span className="font-semibold text-gray-800 dark:text-gray-200">{mlResult.district}</span>
                    {mlResult.state && <> · State: <span className="font-semibold text-gray-800 dark:text-gray-200">{mlResult.state}</span></>}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {!mlResult && !mlError && (
            <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
              <span className="text-6xl mb-4">📍</span>
              <h3 className="text-xl font-display font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Select a Location
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Click on the map and press &quot;Get Crop Recommendation&quot; to receive AI-powered suggestions
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
