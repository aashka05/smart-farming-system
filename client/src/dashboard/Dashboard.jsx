import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/useTranslation';
import {
  HiChartBar, HiBeaker, HiCloud, HiChatAlt2, HiExclamation,
  HiShieldCheck, HiTrendingUp, HiTrendingDown,
} from 'react-icons/hi';
import api from '../services/api';

const quickLinks = [
  { to: '/dashboard/crop-health', label: 'Disease Prediction', icon: '🦠', color: 'bg-green-50 dark:bg-green-900/20' },
  { to: '/dashboard/irrigation', label: 'Irrigation Advisory', icon: '💧', color: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { to: '/dashboard/chatbot', label: 'AI Chatbot', icon: '🤖', color: 'bg-purple-50 dark:bg-purple-900/20' },
];

const qlKeys = { 'Disease Prediction': 'diseasePrediction', 'Irrigation Advisory': 'irrigationAdvisory', 'AI Chatbot': 'aiChatbot' };

const severityConfig = {
  critical: {
    border: 'border-l-red-500',
    bg: 'bg-red-50 dark:bg-red-900/10',
    text: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    icon: '🔴',
  },
  warning: {
    border: 'border-l-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/10',
    text: 'text-yellow-600 dark:text-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    icon: '🟡',
  },
  safe: {
    border: 'border-l-green-500',
    bg: 'bg-green-50 dark:bg-green-900/10',
    text: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    icon: '🟢',
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dStrings = useMemo(() => ({
    welcomeBack: 'Welcome back,',
    subtitle: "Here's your FarmLytics intelligence dashboard",
    temperature: 'Temperature',
    cropHealth: 'Crop Health',
    price: 'Price',
    irrigation: 'Irrigation',
    diseasePrediction: 'Disease Prediction',
    irrigationAdvisory: 'Irrigation Advisory',
    aiChatbot: 'AI Chatbot',
    weatherSummary: 'Weather Summary',
    marketAlert: 'Market Alert',
    riskAlerts: 'Risk Alerts',
    irrigationAdvisoryPanel: 'Irrigation Advisory',
    humidity: 'Humidity',
    rainfall: 'Rainfall',
    windSpeed: 'Wind Speed',
    healthScore: 'Health Score',
    crop: 'Crop',
    diseaseRisk: 'Disease Risk',
    perQuintal: 'per quintal',
    topCrop: 'Top Crop',
    change: 'Change',
    soilMoisture: 'Soil Moisture',
    loadingDashboard: 'Loading your dashboard\u2026',
    dashboardError: 'Dashboard Error',
    retry: 'Retry',
    heatStress: 'Heat stress zone',
    warm: 'Warm',
    mild: 'Mild',
  }), []);
  const { t: dt } = useTranslation(dStrings);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: res } = await api.get('/dashboard');
        setData(res);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // ── Loading state ─────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-dark-card">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">{dt.loadingDashboard}</p>
        </motion.div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-dark-card">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center max-w-md">
          <span className="text-5xl block mb-4">⚠️</span>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{dt.dashboardError}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary inline-block"
          >
            {dt.retry}
          </button>
        </motion.div>
      </div>
    );
  }

  const { weather, cropHealth, market, irrigation, risks } = data;

  // Data for crop health mini bar chart
  const healthChartData = [
    { label: 'Health', value: cropHealth.healthScore, fill: cropHealth.healthScore >= 70 ? '#22c55e' : cropHealth.healthScore >= 40 ? '#eab308' : '#ef4444' },
    { label: 'Risk', value: 100 - cropHealth.healthScore, fill: '#e5e7eb' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        {/* ── Welcome Header ─────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl text-gray-800 dark:text-white">
            {dt.welcomeBack} <span className="gradient-text">{user?.name || 'Farmer'}</span> 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{dt.subtitle}</p>
        </motion.div>

        {/* ── Top Row: Summary Cards ─────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="🌡️"
            title={dt.temperature}
            value={weather.temp != null ? `${weather.temp.toFixed(1)}°C` : '--'}
            subtitle={weather.temp > 38 ? `⚠️ ${dt.heatStress}` : weather.temp > 30 ? `☀️ ${dt.warm}` : `🌤️ ${dt.mild}`}
            color="orange"
            delay={0}
          />
          <StatCard
            icon="🌱"
            title={dt.cropHealth}
            value={`${cropHealth.healthScore}%`}
            subtitle={cropHealth.cropName}
            color={cropHealth.healthScore >= 70 ? 'green' : cropHealth.healthScore >= 40 ? 'orange' : 'red'}
            delay={0.1}
          />
          <StatCard
            icon="💰"
            title={`${market.topCrop} ${dt.price}`}
            value={`₹${market.currentPrice.toLocaleString('en-IN')}/q`}
            subtitle={`${market.priceChange > 0 ? '↑' : '↓'} ${Math.abs(market.priceChange)}% this week`}
            color={market.priceChange > 0 ? 'blue' : 'red'}
            delay={0.2}
          />
          <StatCard
            icon="💧"
            title={dt.irrigation}
            value={irrigation.soilMoistureStatus}
            subtitle={irrigation.recommendation}
            color="cyan"
            delay={0.3}
          />
        </div>

        {/* ── Quick Links ────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {quickLinks.map((link, i) => (
            <motion.div key={link.to} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
              <Link to={link.to} className={`glass-card-hover p-5 flex items-center gap-4 ${link.color}`}>
                <span className="text-3xl">{link.icon}</span>
                <span className="font-semibold text-gray-800 dark:text-white">{dt[qlKeys[link.label]] || link.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Second Row: Detailed Panels ────────── */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* Weather Summary Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-5 flex items-center gap-2">
              <HiCloud className="w-5 h-5 text-blue-500" />
              {dt.weatherSummary}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10">
                <span className="text-sm text-gray-600 dark:text-gray-400">🌡️ {dt.temperature}</span>
                <span className="font-bold text-gray-800 dark:text-white">{weather.temp?.toFixed(1) ?? '--'}°C</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                <span className="text-sm text-gray-600 dark:text-gray-400">💧 {dt.humidity}</span>
                <span className="font-bold text-gray-800 dark:text-white">{weather.humidity?.toFixed(0) ?? '--'}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/10">
                <span className="text-sm text-gray-600 dark:text-gray-400">🌧️ {dt.rainfall}</span>
                <span className="font-bold text-gray-800 dark:text-white">{weather.rainfall?.toFixed(1) ?? '--'} mm</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                <span className="text-sm text-gray-600 dark:text-gray-400">💨 {dt.windSpeed}</span>
                <span className="font-bold text-gray-800 dark:text-white">{weather.wind?.toFixed(1) ?? '--'} m/s</span>
              </div>
            </div>
          </motion.div>

          {/* Crop Health Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-5 flex items-center gap-2">
              <HiBeaker className="w-5 h-5 text-green-500" />
              {dt.cropHealth}
            </h3>

            {/* Health Score Bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{dt.healthScore}</span>
                <span className={`text-2xl font-bold ${
                  cropHealth.healthScore >= 70 ? 'text-green-600' : cropHealth.healthScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {cropHealth.healthScore}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cropHealth.healthScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    cropHealth.healthScore >= 70 ? 'bg-green-500' : cropHealth.healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/10">
                <span className="text-sm text-gray-600 dark:text-gray-400">🌾 {dt.crop}</span>
                <span className="font-semibold text-gray-800 dark:text-white text-sm">{cropHealth.cropName}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/10">
                <span className="text-sm text-gray-600 dark:text-gray-400">🦠 {dt.diseaseRisk}</span>
                <span className={`font-semibold text-sm ${
                  cropHealth.diseaseRisk === 'None detected' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {cropHealth.diseaseRisk}
                </span>
              </div>
            </div>

            {/* Mini bar chart */}
            <div className="mt-4 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthChartData} layout="vertical" barCategoryGap={8}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={40} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {healthChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Market Alert Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-5 flex items-center gap-2">
              <HiChartBar className="w-5 h-5 text-blue-500" />
              {dt.marketAlert}
            </h3>

            <div className="text-center mb-5">
              <span className="text-4xl block mb-2">
                {market.priceChange > 3 ? '📈' : market.priceChange < -3 ? '📉' : '📊'}
              </span>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                ₹{market.currentPrice.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{dt.perQuintal}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                <span className="text-sm text-gray-600 dark:text-gray-400">🌾 {dt.topCrop}</span>
                <span className="font-semibold text-gray-800 dark:text-white">{market.topCrop}</span>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                market.priceChange > 0 ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'
              }`}>
                <span className="text-sm text-gray-600 dark:text-gray-400">📊 {dt.change}</span>
                <span className={`font-semibold flex items-center gap-1 ${
                  market.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {market.priceChange > 0 ? <HiTrendingUp className="w-4 h-4" /> : <HiTrendingDown className="w-4 h-4" />}
                  {Math.abs(market.priceChange)}%
                </span>
              </div>
            </div>

            <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              market.priceChange > 3
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                : market.priceChange < -3
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
            }`}>
              💡 {market.alert}
            </div>
          </motion.div>
        </div>

        {/* ── Third Row: Irrigation + Risk Alerts ── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* Irrigation Advisory Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-5 flex items-center gap-2">
              <HiShieldCheck className="w-5 h-5 text-cyan-500" />
              {dt.irrigationAdvisoryPanel}
            </h3>

            <div className="flex items-center gap-4 mb-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                irrigation.soilMoistureStatus === 'Low'
                  ? 'bg-red-100 dark:bg-red-900/20'
                  : irrigation.soilMoistureStatus === 'Good'
                    ? 'bg-green-100 dark:bg-green-900/20'
                    : 'bg-blue-100 dark:bg-blue-900/20'
              }`}>
                {irrigation.soilMoistureStatus === 'Low' ? '🏜️' : irrigation.recommendation === 'Delay irrigation' ? '🌧️' : '💧'}
              </div>
              <div>
                <p className={`text-xl font-bold ${
                  irrigation.soilMoistureStatus === 'Low' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {irrigation.recommendation}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dt.soilMoisture}: {irrigation.soilMoistureStatus}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/10 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{dt.humidity}</p>
                <p className="font-bold text-gray-800 dark:text-white">{weather.humidity?.toFixed(0) ?? '--'}%</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{dt.rainfall}</p>
                <p className="font-bold text-gray-800 dark:text-white">{weather.rainfall?.toFixed(1) ?? '--'} mm</p>
              </div>
            </div>
          </motion.div>

          {/* Risk Alerts Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-5 flex items-center gap-2">
              <HiExclamation className="w-5 h-5 text-orange-500" />
              {dt.riskAlerts}
            </h3>
            <div className="space-y-3">
              {risks.map((alert, i) => {
                const cfg = severityConfig[alert.severity] || severityConfig.safe;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`p-4 rounded-xl border-l-4 ${cfg.border} ${cfg.bg}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">{cfg.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{alert.type}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cfg.badge}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
