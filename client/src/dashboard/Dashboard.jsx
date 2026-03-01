import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { HiChartBar, HiBeaker, HiCloud, HiChatAlt2, HiExclamation } from 'react-icons/hi';
import api from '../services/api';

const cropHealthData = [
  { name: 'Healthy', value: 65, color: '#22c55e' },
  { name: 'At Risk', value: 25, color: '#eab308' },
  { name: 'Diseased', value: 10, color: '#ef4444' },
];

const riskAlerts = [
  { type: 'weather', message: 'Heavy rain expected in 48 hours. Protect standing crops.', severity: 'high', icon: '⛈️' },
  { type: 'pest', message: 'Brown planthopper activity reported in nearby regions.', severity: 'medium', icon: '🦗' },
  { type: 'price', message: 'Cotton prices dropped 3% this week. Consider holding stock.', severity: 'low', icon: '📉' },
];

const quickLinks = [
  { to: '/dashboard/crop-health', label: 'Crop Health', icon: '🔬', color: 'bg-green-50 dark:bg-green-900/20' },
  { to: '/dashboard/yield-prediction', label: 'Yield Prediction', icon: '📊', color: 'bg-blue-50 dark:bg-blue-900/20' },
  { to: '/dashboard/irrigation', label: 'Irrigation Advisory', icon: '💧', color: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { to: '/dashboard/chatbot', label: 'AI Chatbot', icon: '🤖', color: 'bg-purple-50 dark:bg-purple-900/20' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [temp, setTemp] = useState('--');
  const [humidity, setHumidity] = useState('--');
  const [soilMoisture, setSoilMoisture] = useState('--');
  const [weatherSource, setWeatherSource] = useState('');
  const [weeklyWeather, setWeeklyWeather] = useState([]);

  useEffect(() => {
    const fetchDashboardWeather = async () => {
      try {
        const { data } = await api.get('/weather?mode=auto');
        const cur = data.current || {};
        setTemp(cur.temp != null ? `${Math.round(cur.temp)}°C` : '--');
        setHumidity(cur.humidity != null ? `${Math.round(cur.humidity)}%` : '--');
        setSoilMoisture(cur.soil_moisture != null ? `${Math.round(cur.soil_moisture * 100)}%` : '--');
        setWeatherSource(data.source || '');

        // Map forecast to weekly chart data
        if (data.forecast && data.forecast.length > 0) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          setWeeklyWeather(data.forecast.map((f) => {
            const d = new Date(f.date);
            return {
              day: days[d.getDay()],
              temp: Math.round(((f.max || 0) + (f.min || 0)) / 2),
              humidity: f.rain_probability ?? 0,
            };
          }));
        }
      } catch (err) {
        console.error('Dashboard weather fetch error:', err);
      }
    };
    fetchDashboardWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        {/* Welcome Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl text-gray-800 dark:text-white">
            Welcome back, <span className="gradient-text">{user?.name || 'Farmer'}</span> 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your farming dashboard overview</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="🌡️" title="Temperature" value={temp} subtitle={weatherSource === 'station' ? '📡 Live Station' : weatherSource === 'open-meteo' ? '🌐 Open-Meteo' : 'Loading...'} color="orange" delay={0} />
          <StatCard icon="🌱" title="Crop Health" value="85%" subtitle="Good condition" color="green" delay={0.1} />
          <StatCard icon="💰" title="Rice Price" value="₹2,100/q" subtitle="↑ 3% this week" color="blue" delay={0.2} />
          <StatCard icon="💧" title="Soil Moisture" value={soilMoisture} subtitle={humidity !== '--' ? `Humidity: ${humidity}` : ''} color="cyan" delay={0.3} />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link, i) => (
            <motion.div key={link.to} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
              <Link to={link.to} className={`glass-card-hover p-5 flex items-center gap-4 ${link.color}`}>
                <span className="text-3xl">{link.icon}</span>
                <span className="font-semibold text-gray-800 dark:text-white">{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Weather Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <HiCloud className="w-5 h-5 text-blue-500" />
              Weekly Weather Summary
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyWeather}>
                  <defs>
                    <linearGradient id="dashTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dashHumid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="temp" stroke="#f97316" fill="url(#dashTemp)" strokeWidth={2} name="Temp (°C)" />
                  <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fill="url(#dashHumid)" strokeWidth={2} name="Humidity (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Crop Health Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <HiBeaker className="w-5 h-5 text-green-500" />
              Crop Health Status
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cropHealthData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                    {cropHealthData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {cropHealthData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Risk Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <HiExclamation className="w-5 h-5 text-orange-500" />
            Risk Alerts
          </h3>
          <div className="space-y-3">
            {riskAlerts.map((alert, i) => {
              const severityStyles = {
                high: 'border-l-red-500 bg-red-50 dark:bg-red-900/10',
                medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
                low: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10',
              };
              return (
                <div key={i} className={`p-4 rounded-xl border-l-4 ${severityStyles[alert.severity]}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{alert.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alert.message}</p>
                      <span className={`text-xs mt-1 inline-block ${
                        alert.severity === 'high' ? 'text-red-500' : alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-500'
                      }`}>
                        {alert.severity.toUpperCase()} Priority
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
