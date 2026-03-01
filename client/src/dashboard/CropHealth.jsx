import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUpload, HiPhotograph, HiShieldCheck } from 'react-icons/hi';

const mockResult = {
  disease: 'Leaf Blight',
  confidence: 87,
  healthScore: 62,
  treatment: [
    'Apply Mancozeb 75% WP at 2.5g/L water',
    'Spray Propiconazole 25% EC at 1ml/L',
    'Remove and destroy severely infected leaves',
    'Ensure proper spacing for air circulation',
    'Apply potassium-rich fertilizer to boost immunity',
  ],
};

export default function CropHealth() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!image) return;
    setLoading(true);
    setTimeout(() => {
      setResult(mockResult);
      setLoading(false);
    }, 2000);
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBg = (score) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">🔬 Crop Health Analysis</h1>
          <p className="section-subtitle">Upload a crop image to detect diseases and get treatment recommendations</p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <HiPhotograph className="w-5 h-5 text-primary-500" />
              Upload Crop Image
            </h3>

            <div
              onClick={() => document.getElementById('cropImage').click()}
              className="border-2 border-dashed border-gray-300 dark:border-dark-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all"
            >
              {preview ? (
                <img src={preview} alt="Crop preview" className="max-h-60 mx-auto rounded-xl object-cover" />
              ) : (
                <div>
                  <HiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Click to upload crop image</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>
            <input id="cropImage" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <HiShieldCheck className="w-5 h-5" />
                  Analyze Image
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div>
            {result ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {/* Disease Detection */}
                <div className="glass-card p-5">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Detected Disease</h4>
                  <p className="text-2xl font-display font-bold text-red-500">{result.disease}</p>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-5 text-center">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Confidence</h4>
                    <p className="text-3xl font-bold text-primary-600">{result.confidence}%</p>
                    <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2 mt-2">
                      <motion.div
                        className="bg-primary-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  <div className="glass-card p-5 text-center">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Health Score</h4>
                    <p className={`text-3xl font-bold ${getHealthColor(result.healthScore)}`}>{result.healthScore}%</p>
                    <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2 mt-2">
                      <motion.div
                        className={`bg-gradient-to-r ${getHealthBg(result.healthScore)} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.healthScore}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Treatment */}
                <div className="glass-card p-5">
                  <h4 className="font-display font-semibold mb-3">💊 Recommended Treatment</h4>
                  <ul className="space-y-2">
                    {result.treatment.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-primary-500 mt-0.5 flex-shrink-0">✓</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  ℹ️ Results based on mock data. ML model integration coming soon.
                </p>
              </motion.div>
            ) : (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
                <span className="text-6xl mb-4">🌿</span>
                <h3 className="font-display font-semibold text-xl text-gray-600 dark:text-gray-400 mb-2">
                  Upload & Analyze
                </h3>
                <p className="text-sm text-gray-500">Upload a crop leaf image to detect diseases and get treatment advice</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
