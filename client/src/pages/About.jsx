import { motion } from 'framer-motion';
import { HiLightBulb, HiGlobe, HiHeart, HiCode } from 'react-icons/hi';
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiTailwindcss, SiVite } from 'react-icons/si';

const techStack = [
  { name: 'MongoDB', icon: SiMongodb, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { name: 'Express.js', icon: SiExpress, color: 'text-gray-800 dark:text-gray-200', bg: 'bg-gray-50 dark:bg-gray-800/30' },
  { name: 'React', icon: SiReact, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { name: 'TailwindCSS', icon: SiTailwindcss, color: 'text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { name: 'Vite', icon: SiVite, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="section-title">About <span className="gradient-text">Smart Farming Platform</span></h1>
          <p className="section-subtitle">
            Empowering Indian farmers with AI-driven technology for sustainable and profitable agriculture
          </p>
        </motion.div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="glass-card p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-5">
                <HiLightBulb className="w-7 h-7 text-primary-600" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-4">Our Motivation</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Indian agriculture employs over 50% of the workforce but faces critical challenges — 
                unpredictable weather patterns, increasing crop diseases, lack of real-time market 
                information, and water scarcity. Small and marginal farmers are the most affected.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We believe technology can bridge this gap. By combining AI, IoT weather stations, 
                and accessible interfaces, we aim to democratize agricultural intelligence and put 
                expert-level insights in every farmer's hands.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="glass-card p-8 h-full">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
                <HiHeart className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-4">Our Mission</h2>
              <ul className="space-y-4">
                {[
                  'Provide real-time, localized weather insights with farming-specific recommendations',
                  'Enable AI-powered crop disease detection and treatment guidance',
                  'Offer data-driven crop recommendations based on soil, climate, and market conditions',
                  'Bridge the information gap with live market prices from mandis',
                  'Build a smart irrigation advisory system powered by IoT weather stations',
                  'Create an AI farming assistant that speaks the farmer\'s language',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                    <span className="text-primary-500 mt-1 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Technology Stack */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 mx-auto">
              <HiCode className="w-7 h-7 text-purple-600" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-2">Technology Stack</h2>
            <p className="text-gray-600 dark:text-gray-400">Built with modern, production-ready technologies</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card-hover p-6 text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl ${tech.bg} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-7 h-7 ${tech.color}`} />
                  </div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-white">{tech.name}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Future Integrations */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="glass-card p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 mx-auto">
              <HiGlobe className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-4">Future Integrations</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { emoji: '🌐', title: 'Weather APIs', desc: 'OpenWeatherMap, IMD integration' },
                { emoji: '🤖', title: 'LangChain + LangGraph', desc: 'Advanced AI farming assistant' },
                { emoji: '📡', title: 'IoT Weather Stations', desc: 'PIC18F16Q41 + GSM real-time data' },
                { emoji: '🧠', title: 'ML Models', desc: 'Crop disease detection & yield prediction' },
              ].map((item) => (
                <div key={item.title} className="p-4 bg-gray-50 dark:bg-dark-card rounded-xl">
                  <span className="text-3xl mb-2 block">{item.emoji}</span>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
