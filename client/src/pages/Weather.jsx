import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import WeatherCard from '../components/WeatherCard';
import { HiSearch, HiExclamation, HiLightBulb, HiRefresh } from 'react-icons/hi';
import { WiRain, WiDaySunny, WiCloudy, WiThunderstorm } from 'react-icons/wi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from '../utils/useTranslation';

const defaultWeatherData = {
  city: 'Anand',
  temperature: { current: 0, min: 0, max: 0, unit: '°C' },
  humidity: 0,
  rainProbability: 0,
  windSpeed: 0,
  windDirection: 'N',
  condition: 'sunny',
  farmingInsight: 'Loading weather data...',
};

const weatherAlerts = [
  { severity: 'high', message: 'Heavy rain expected tomorrow. Protect harvested crops and ensure drainage.', time: '2 hours ago' },
  { severity: 'medium', message: 'Rain expected in 1 hour — Delay pesticide spraying.', time: '30 min ago' },
  { severity: 'low', message: 'Moderate humidity levels. Good conditions for transplanting seedlings.', time: '1 hour ago' },
];

const cities = ['Anand', 'Ahmedabad', 'Mumbai', 'Delhi', 'Jaipur', 'Lucknow', 'Pune', 'Nagpur', 'Bhopal', 'Surat', 'Rajkot'];

// Map city names to approximate coordinates
const cityCoords = {
  'ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'mumbai': { lat: 19.0760, lon: 72.8777 },
  'delhi': { lat: 28.7041, lon: 77.1025 },
  'jaipur': { lat: 26.9124, lon: 75.7873 },
  'lucknow': { lat: 26.8467, lon: 80.9462 },
  'pune': { lat: 18.5204, lon: 73.8567 },
  'nagpur': { lat: 21.1458, lon: 79.0882 },
  'bhopal': { lat: 23.2599, lon: 77.4126 },
  'surat': { lat: 21.1702, lon: 72.8311 },
  'rajkot': { lat: 22.3039, lon: 70.8022 },
  'anand': { lat: 22.5645, lon: 72.9289 },
  'vadodara': { lat: 22.3072, lon: 73.1812 },
};

function getFarmingInsight(temp, humidity, rain, wind) {
  if (rain > 5) return '🌧️ Heavy rainfall detected — Delay pesticide spraying and ensure field drainage.';
  if (rain > 1) return '🌦️ Light rain — Good time for transplanting seedlings. Avoid fertilizer application.';
  if (temp > 38) return '🔥 Extreme heat — Increase irrigation frequency. Irrigate early morning or late evening.';
  if (temp > 33) return '☀️ Hot conditions — Mulch around plants to retain soil moisture.';
  if (humidity > 80) return '💧 High humidity — Monitor crops for fungal diseases. Ensure proper ventilation.';
  if (humidity < 40) return '🏜️ Low humidity — Consider drip irrigation to minimize water loss.';
  if (wind > 15) return '💨 Strong winds — Support tall crops. Delay spraying operations.';
  return '🌱 Good farming conditions — Ideal time for field activities and crop management.';
}

function getCondition(temp, rain) {
  if (rain > 5) return 'rainy';
  if (rain > 1) return 'cloudy';
  if (temp > 33) return 'sunny';
  return 'partly-cloudy';
}

/**
 * Analyze 7-day forecast data and generate smart farming insights.
 */
function generateSmartInsights(forecastData) {
  if (!forecastData || forecastData.length === 0) return [];

  const insights = [];

  // Heavy rainfall expected
  const heavyRainDays = forecastData.filter((d) => d.rain > 70);
  if (heavyRainDays.length > 0) {
    insights.push({
      icon: '🌧️',
      title: 'Heavy Rainfall Expected',
      message: `Rain expected in coming days (${heavyRainDays.map((d) => d.day).join(', ')}). Reduce irrigation to avoid waterlogging.`,
      severity: 'high',
    });
  }

  // High temperature predicted
  const hotDays = forecastData.filter((d) => d.temp > 35);
  if (hotDays.length > 0) {
    insights.push({
      icon: '🔥',
      title: 'High Temperature Predicted',
      message: `High temperature predicted (${hotDays.map((d) => `${d.day}: ${d.temp}°C`).join(', ')}). Ensure adequate irrigation and crop protection.`,
      severity: 'high',
    });
  }

  // High humidity risk (moderate-to-high rain probability implies humidity)
  const humidDays = forecastData.filter((d) => d.rain >= 50 && d.rain <= 70);
  if (humidDays.length >= 2) {
    insights.push({
      icon: '💧',
      title: 'High Humidity Risk',
      message: 'High humidity may increase fungal disease risk. Monitor crops for signs of blight, mildew, or rot.',
      severity: 'medium',
    });
  }

  // Natural rainfall expected soon (next 3 days)
  const nearTermRain = forecastData.slice(0, 3).filter((d) => d.rain > 40);
  if (nearTermRain.length > 0 && heavyRainDays.length === 0) {
    insights.push({
      icon: '⏳',
      title: 'Natural Rainfall Expected Soon',
      message: 'Natural rainfall expected in the next few days. Delay irrigation scheduling to conserve water and resources.',
      severity: 'low',
    });
  }

  // Cold temperature alert
  const coldDays = forecastData.filter((d) => d.temp < 15);
  if (coldDays.length > 0) {
    insights.push({
      icon: '🥶',
      title: 'Cold Temperature Alert',
      message: `Low temperatures expected (${coldDays.map((d) => `${d.day}: ${d.temp}°C`).join(', ')}). Protect sensitive crops from frost damage.`,
      severity: 'medium',
    });
  }

  // Dry spell — minimal rain all week
  const dryDays = forecastData.filter((d) => d.rain < 20);
  if (dryDays.length >= 5) {
    insights.push({
      icon: '🏜️',
      title: 'Dry Spell Expected',
      message: 'Minimal rainfall predicted for most of the week. Plan irrigation schedules accordingly and conserve water.',
      severity: 'medium',
    });
  }

  // Favorable conditions fallback
  if (insights.length === 0) {
    insights.push({
      icon: '🌱',
      title: 'Favorable Farming Conditions',
      message: 'Weather conditions look favorable for farming activities over the next 7 days. Good time for field operations.',
      severity: 'low',
    });
  }

  return insights;
}

export default function Weather() {
  const [city, setCity] = useState('Anand');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(defaultWeatherData);
  const [forecastData, setForecastData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [source, setSource] = useState('');

  const wStrings = useMemo(() => ({
    title: 'Regional Weather Updates',
    subtitle: 'Real-time weather data with farming-specific insights',
    searchPlaceholder: 'Search city... (e.g., Ahmedabad, Mumbai)',
    search: 'Search', refresh: 'Refresh',
    farmingInsight: 'Farming Insight',
    irrigationSuggestion: 'Irrigation Suggestion',
    irrigationText: 'Best time to irrigate: Early morning (6-8 AM) — Low evaporation rate with current humidity levels.',
    forecast7Day: '7-Day Forecast', weatherAlerts: 'Weather Alerts',
    basedOn: 'Based on current conditions for',
  }), []);
  const { t: wt } = useTranslation(wStrings);

  const fetchWeather = async (targetCity) => {
    setLoading(true);
    try {
      const coords = cityCoords[targetCity.toLowerCase()];
      let url = '/weather';
      if (coords) {
        url += `?latitude=${coords.lat}&longitude=${coords.lon}`;
      } else {
        url += '?mode=auto';
      }

      const { data } = await api.get(url);

      // Map API response → component state
      const cur = data.current || {};
      const temp = cur.temp ?? 0;
      const humidity = cur.humidity ?? 0;
      const rain = cur.rainfall ?? 0;
      const wind = cur.wind ?? 0;
      const rainProb = data.forecast?.[0]?.rain_probability ?? 0;

      setWeatherData({
        city: targetCity,
        temperature: {
          current: Math.round(temp),
          min: data.forecast?.[0]?.min ?? Math.round(temp - 5),
          max: data.forecast?.[0]?.max ?? Math.round(temp + 5),
          unit: '°C',
        },
        humidity: Math.round(humidity),
        rainProbability: rainProb,
        windSpeed: Math.round(wind),
        windDirection: 'NW',
        condition: getCondition(temp, rain),
        farmingInsight: getFarmingInsight(temp, humidity, rain, wind),
      });

      // Map forecast for chart
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const icons = { sunny: '☀️', 'partly-cloudy': '⛅', cloudy: '☁️', rainy: '🌧️' };

      if (data.forecast && data.forecast.length > 0) {
        setForecastData(data.forecast.map((f) => {
          const d = new Date(f.date);
          const avgTemp = Math.round(((f.max || 0) + (f.min || 0)) / 2);
          const cond = getCondition(avgTemp, (f.rain_probability || 0) > 60 ? 3 : 0);
          return {
            day: days[d.getDay()],
            temp: avgTemp,
            rain: f.rain_probability ?? 0,
            icon: icons[cond] || '⛅',
          };
        }));
      }

      if (data.hourly && data.hourly.length > 0) {
        setHourlyData(data.hourly);
      }

      setSource(data.source || 'unknown');
    } catch (err) {
      console.error('Weather fetch error:', err);
      toast.error('Could not fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const target = searchInput.trim();
      setCity(target);
      fetchWeather(target);
    }
  };

  const handleCityClick = (c) => {
    setCity(c);
    setSearchInput(c);
    fetchWeather(c);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">🌤️ {wt.title}</h1>
          <p className="section-subtitle">{wt.subtitle}</p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={wt.searchPlaceholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap">{wt.search}</button>
          </form>
          <div className="flex flex-wrap gap-2 mt-3">
            {cities.slice(0, 6).map((c) => (
              <button
                key={c}
                onClick={() => handleCityClick(c)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                  city === c
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-primary-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="skeleton h-64 rounded-2xl" />
            <div className="skeleton h-64 rounded-2xl" />
          </div>
        ) : (
          <>
            {/* Current Weather + Farming Insight */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <WeatherCard data={weatherData} />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="glass-card p-6 h-full flex flex-col">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <HiLightBulb className="w-5 h-5 text-yellow-500" />
                    {wt.farmingInsight}
                  </h3>
                  <div className="flex-1 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-5 border border-yellow-200/50 dark:border-yellow-800/30">
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                      {weatherData.farmingInsight}
                    </p>
                    <p className="text-sm text-gray-500 mt-3">{wt.basedOn} {city}</p>
                  </div>

                  <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                    <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-1">💧 {wt.irrigationSuggestion}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {wt.irrigationText}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 7-Day Forecast Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 mb-10"
            >
              <h3 className="font-display font-semibold text-lg mb-6">📅 {wt.forecast7Day}</h3>

              {/* Day icons */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {forecastData.map((d) => (
                  <div key={d.day} className="text-center">
                    <p className="text-xs text-gray-500 mb-1">{d.day}</p>
                    <span className="text-2xl">{d.icon}</span>
                    <p className="text-sm font-semibold mt-1">{d.temp}°</p>
                  </div>
                ))}
              </div>

              {/* Temperature + Rainfall Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Area type="monotone" dataKey="temp" stroke="#22c55e" fill="url(#tempGradient)" strokeWidth={2} name="Temperature (°C)" />
                    <Area type="monotone" dataKey="rain" stroke="#3b82f6" fill="url(#rainGradient)" strokeWidth={2} name="Rain Probability (%)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Smart Farming Insights */}
            {forecastData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card p-6 mb-10"
              >
                <h3 className="font-display font-semibold text-lg mb-2 flex items-center gap-2">
                  <HiLightBulb className="w-5 h-5 text-green-500" />
                  🌾 Smart Farming Insights
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  Recommendations based on the 7-day weather forecast for {city}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {generateSmartInsights(forecastData).map((insight, i) => {
                    const severityStyles = {
                      high: 'border-red-400 bg-red-50 dark:bg-red-900/10',
                      medium: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10',
                      low: 'border-green-400 bg-green-50 dark:bg-green-900/10',
                    };
                    return (
                      <div key={i} className={`p-4 rounded-xl border-l-4 ${severityStyles[insight.severity]}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl shrink-0">{insight.icon}</span>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">{insight.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{insight.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Weather Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <HiExclamation className="w-5 h-5 text-orange-500" />
                {wt.weatherAlerts}
              </h3>
              <div className="space-y-3">
                {weatherAlerts.map((alert, i) => {
                  const severityStyles = {
                    high: 'border-red-400 bg-red-50 dark:bg-red-900/10',
                    medium: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10',
                    low: 'border-green-400 bg-green-50 dark:bg-green-900/10',
                  };
                  return (
                    <div key={i} className={`p-4 rounded-xl border-l-4 ${severityStyles[alert.severity]}`}>
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alert.message}</p>
                        <span className={`badge text-xs ml-3 ${
                          alert.severity === 'high' ? 'badge-red' : alert.severity === 'medium' ? 'badge-yellow' : 'badge-green'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
