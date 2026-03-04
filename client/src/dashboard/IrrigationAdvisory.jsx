import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HiClock, HiBeaker } from 'react-icons/hi';
import { useTranslation } from '../utils/useTranslation';

const scheduleTemplate = [
  { time: '6:00 AM', duration: '30 min', zone: 'Zone A - Rice', type: 'Flood', status: 'scheduled' },
  { time: '7:00 AM', duration: '20 min', zone: 'Zone B - Wheat', type: 'Sprinkler', status: 'scheduled' },
  { time: '5:00 PM', duration: '25 min', zone: 'Zone C - Vegetables', type: 'Drip', status: 'scheduled' },
  { time: '6:00 PM', duration: '15 min', zone: 'Zone A - Rice', type: 'Flood', status: 'scheduled' },
];

const weeklyWater = [
  { day: 'Mon', amount: 450 },
  { day: 'Tue', amount: 380 },
  { day: 'Wed', amount: 520 },
  { day: 'Thu', amount: 400 },
  { day: 'Fri', amount: 350 },
  { day: 'Sat', amount: 480 },
  { day: 'Sun', amount: 410 },
];

export default function IrrigationAdvisory() {
  const [soilMoisture, setSoilMoisture] = useState('45');
  const [weatherCondition, setWeatherCondition] = useState('partly-cloudy');
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  const irStrings = useMemo(() => ({
    title: 'Irrigation Advisory',
    subtitle: 'Smart irrigation scheduling based on soil moisture and weather conditions',
    sensorInputs: 'Sensor Inputs',
    soilMoisture: 'Soil Moisture (%)',
    weatherCondition: 'Weather Condition',
    generateSchedule: 'Generate Schedule',
    weeklyWater: 'Weekly Water Usage (Liters)',
    irrigationAdvisory: 'Irrigation Advisory',
    totalWater: 'Total Water Needed',
    waterSaved: 'Water Saved',
    todaySchedule: "Today's Watering Schedule",
    smartIrrigation: 'Smart Irrigation',
    placeholderDesc: 'Adjust soil moisture and weather to get optimized irrigation schedule',
    dry: 'Dry (0%)',
    optimal: 'Optimal (50%)',
    wet: 'Wet (100%)',
  }), []);
  const { t: it } = useTranslation(irStrings);

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const moisture = parseInt(soilMoisture);
      let advice = '';
      let urgency = 'normal';

      if (moisture < 30) {
        advice = 'Soil moisture is critically low. Immediate irrigation recommended with extended duration.';
        urgency = 'critical';
      } else if (moisture < 50) {
        advice = 'Soil moisture is below optimal. Schedule irrigation within the next 6 hours.';
        urgency = 'moderate';
      } else if (moisture < 70) {
        advice = 'Soil moisture is at good levels. Maintain regular irrigation schedule.';
        urgency = 'normal';
      } else {
        advice = 'Soil moisture is high. Reduce irrigation to prevent waterlogging.';
        urgency = 'low';
      }

      if (weatherCondition === 'rainy') {
        advice += ' Rain is expected — consider skipping the next irrigation cycle.';
      }

      setSchedule({
        advice,
        urgency,
        items: scheduleTemplate.map((s) => ({
          ...s,
          duration: moisture < 30 ? '45 min' : moisture < 50 ? '30 min' : '20 min',
        })),
        totalWater: moisture < 30 ? 2800 : moisture < 50 ? 2200 : 1600,
        savedWater: moisture >= 50 ? 600 : 0,
      });
      setLoading(false);
    }, 1200);
  };

  const urgencyColors = {
    critical: 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400',
    moderate: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400',
    normal: 'border-green-500 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400',
    low: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50/50 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">💧 {it.title}</h1>
          <p className="section-subtitle">{it.subtitle}</p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                <HiBeaker className="w-5 h-5 text-cyan-500" />
                {it.sensorInputs}
              </h3>
              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {it.soilMoisture} — <span className="text-primary-500 font-bold">{soilMoisture}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soilMoisture}
                    onChange={(e) => setSoilMoisture(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{it.dry}</span>
                    <span>{it.optimal}</span>
                    <span>{it.wet}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{it.weatherCondition}</label>
                  <select value={weatherCondition} onChange={(e) => setWeatherCondition(e.target.value)} className="input-field">
                    <option value="sunny">☀️ Sunny</option>
                    <option value="partly-cloudy">⛅ Partly Cloudy</option>
                    <option value="cloudy">☁️ Cloudy</option>
                    <option value="rainy">🌧️ Rainy</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <HiClock className="w-5 h-5" />
                      {it.generateSchedule}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Weekly Water Usage Chart */}
            <div className="glass-card p-6">
              <h4 className="font-display font-semibold mb-4">📊 {it.weeklyWater}</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyWater}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="amount" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Water (L)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Schedule Output */}
          <div>
            {schedule ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {/* Advisory */}
                <div className={`glass-card p-5 border-l-4 ${urgencyColors[schedule.urgency]}`}>
                  <h4 className="font-semibold mb-1">🌊 {it.irrigationAdvisory}</h4>
                  <p className="text-sm">{schedule.advice}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 text-center">
                    <p className="text-sm text-gray-500">{it.totalWater}</p>
                    <p className="text-2xl font-bold text-cyan-600">{schedule.totalWater}L</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <p className="text-sm text-gray-500">{it.waterSaved}</p>
                    <p className="text-2xl font-bold text-green-600">{schedule.savedWater}L</p>
                  </div>
                </div>

                {/* Schedule Table */}
                <div className="glass-card p-5">
                  <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                    <HiClock className="w-5 h-5 text-primary-500" />
                    {it.todaySchedule}
                  </h4>
                  <div className="space-y-3">
                    {schedule.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-card rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-lg">
                            💧
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-800 dark:text-white">{item.zone}</p>
                            <p className="text-xs text-gray-500">{item.type} irrigation</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-gray-800 dark:text-white">{item.time}</p>
                          <p className="text-xs text-gray-500">{item.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
                <span className="text-6xl mb-4">💧</span>
                <h3 className="font-display font-semibold text-xl text-gray-600 dark:text-gray-400 mb-2">
                  {it.smartIrrigation}
                </h3>
                <p className="text-sm text-gray-500">{it.placeholderDesc}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
