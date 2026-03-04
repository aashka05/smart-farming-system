import { motion } from 'framer-motion';
import { HiLightBulb, HiEye } from 'react-icons/hi';

export default function About() {
  const missionPoints = [
    'Provide real-time, localized weather insights with farming-specific recommendations',
    'Enable AI-powered crop disease detection and treatment guidance',
    'Offer data-driven crop recommendations based on soil, climate, and market conditions',
    'Bridge the information gap with live market prices from mandis',
    'Build a smart irrigation advisory system powered by IoT weather stations',
    'Create an AI farming assistant that speaks the farmer\'s language',
  ];

  const visionPoints = [
    'Empower every Indian farmer with accessible, AI-driven agricultural intelligence',
    'Reduce crop losses through early disease detection and proactive advisory systems',
    'Promote sustainable farming practices with data-driven resource management',
    'Democratize agricultural technology so no farmer is left behind',
    'Connect farmers to real-time market data for fair and profitable trade',
    'Build a resilient farming ecosystem that adapts to climate change challenges',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="section-title">About <span className="gradient-text">FarmLytics</span></h1>
          <p className="section-subtitle">
            Empowering Indian farmers with AI-driven technology for sustainable and profitable agriculture
          </p>
        </motion.div>

        {/* Mission & Vision Cards — equal height, side-by-side */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* Mission */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex">
            <div className="glass-card p-8 flex flex-col w-full">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-5">
                <HiLightBulb className="w-7 h-7 text-primary-600" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-5">Our Mission</h2>
              <ul className="space-y-4 flex-1">
                {missionPoints.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                    <span className="text-primary-500 mt-1 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex">
            <div className="glass-card p-8 flex flex-col w-full">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5">
                <HiEye className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-5">Our Vision</h2>
              <ul className="space-y-4 flex-1">
                {visionPoints.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                    <span className="text-blue-500 mt-1 flex-shrink-0">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
