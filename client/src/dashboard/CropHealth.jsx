import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiUpload, HiPhotograph, HiShieldCheck, HiExclamation } from 'react-icons/hi';
import { useTranslation } from '../utils/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function CropHealth() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  const chStrings = useMemo(() => ({
    title: 'Disease Prediction',
    subtitle: 'Upload an image of a crop leaf to detect possible plant diseases using AI',
    uploadTitle: 'Upload Crop Image',
    uploadPrompt: 'Click to upload crop image',
    uploadHint: 'JPG, PNG up to 10MB',
    analyzeBtn: 'Analyze Crop',
    analyzing: 'Analyzing crop image...',
    detectedDisease: 'Detected Disease',
    confidence: 'Confidence',
    healthScore: 'Health Score',
    treatment: 'Recommended Treatment',
    description: 'Description',
    errorMsg: 'Unable to analyze crop image. Please try again.',
    healthy: 'Healthy',
    healthyMsg: 'Your crop appears to be healthy! No diseases detected.',
    cropDetected: 'Crop Detected',
    placeholder: 'Upload & Analyze',
    placeholderDesc: 'Upload a crop leaf image to detect diseases and get treatment advice',
  }), []);
  const { t: ct } = useTranslation(chStrings);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      // Convert file to base64 for the backend proxy
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });

      const { data } = await api.post('/crop-health/identify', { image: base64, language });
      setResult(data);
    } catch (err) {
      console.error('Crop health analysis error:', err);
      setError(err.response?.data?.message || ct.errorMsg);
    } finally {
      setLoading(false);
    }
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
          <h1 className="section-title">🦠 {ct.title}</h1>
          <p className="section-subtitle">{ct.subtitle}</p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <HiPhotograph className="w-5 h-5 text-primary-500" />
              {ct.uploadTitle}
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
                  <p className="text-gray-600 dark:text-gray-400 font-medium">{ct.uploadPrompt}</p>
                  <p className="text-xs text-gray-400 mt-1">{ct.uploadHint}</p>
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
                  {ct.analyzing}
                </>
              ) : (
                <>
                  <HiShieldCheck className="w-5 h-5" />
                  {ct.analyzeBtn}
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div>
            {result ? (
              result.isHealthy ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 text-center h-full flex flex-col items-center justify-center">
                  <span className="text-6xl mb-4">✅</span>
                  <h3 className="text-2xl font-display font-bold text-green-600 dark:text-green-400 mb-2">{ct.healthy}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{ct.healthyMsg}</p>
                  {result.crop && (
                    <p className="mt-3 text-sm text-gray-400">🌾 {ct.cropDetected}: <span className="font-semibold">{result.crop}</span></p>
                  )}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  {/* Disease Detection */}
                  <div className="glass-card p-5">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">{ct.detectedDisease}</h4>
                    <p className="text-2xl font-display font-bold text-red-500">{result.disease}</p>
                    {result.crop && (
                      <p className="text-sm text-gray-400 mt-1">🌾 {ct.cropDetected}: {result.crop}</p>
                    )}
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-5 text-center">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">{ct.confidence}</h4>
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
                      <h4 className="text-sm font-medium text-gray-500 mb-2">{ct.healthScore}</h4>
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

                  {/* Description */}
                  {result.description && (
                    <div className="glass-card p-5">
                      <h4 className="font-display font-semibold mb-2">📋 {ct.description}</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.description}</p>
                    </div>
                  )}

                  {/* Treatment */}
                  {result.treatment && result.treatment.length > 0 && (
                    <div className="glass-card p-5">
                      <h4 className="font-display font-semibold mb-3">💊 {ct.treatment}</h4>
                      <ul className="space-y-2">
                        {result.treatment.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="text-primary-500 mt-0.5 flex-shrink-0">✓</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )
            ) : error ? (
              <div className="glass-card p-8 text-center h-full flex flex-col items-center justify-center">
                <HiExclamation className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            ) : (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
                <span className="text-6xl mb-4">🌿</span>
                <h3 className="font-display font-semibold text-xl text-gray-600 dark:text-gray-400 mb-2">
                  {ct.placeholder}
                </h3>
                <p className="text-sm text-gray-500">{ct.placeholderDesc}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
