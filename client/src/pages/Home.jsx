import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FeatureCard from '../components/FeatureCard';
import {
  HiCloudDownload, HiLightBulb, HiShieldCheck, HiChatAlt2,
  HiCurrencyRupee, HiBeaker, HiArrowRight, HiUserAdd,
  HiSearchCircle, HiTrendingUp
} from 'react-icons/hi';

const features = [
  { icon: '🌤️', title: 'Weather Forecast', description: 'Real-time weather updates with farming-specific insights and alerts for your region.' },
  { icon: '🌱', title: 'Crop Recommendation', description: 'AI-powered crop suggestions based on soil type, rainfall, temperature and season.' },
  { icon: '🔬', title: 'Plant Disease Detection', description: 'Identify crop diseases from images with treatment recommendations and prevention tips.' },
  { icon: '🤖', title: 'AI Farming Chatbot', description: 'Ask any farming question and get instant expert advice powered by artificial intelligence.' },
  { icon: '📊', title: 'Market Price Insights', description: 'Live market prices for crops across mandis with trend analysis and price alerts.' },
  { icon: '💧', title: 'Irrigation Advisory', description: 'Smart irrigation scheduling based on soil moisture, weather data and crop requirements.' },
];

const problems = [
  { icon: '⛈️', title: 'Unpredictable Weather', desc: 'Sudden weather changes destroy crops and reduce yield without timely warnings.' },
  { icon: '🦠', title: 'Crop Diseases', desc: 'Late identification of diseases causes massive crop losses every season.' },
  { icon: '📉', title: 'Market Price Uncertainty', desc: 'Farmers sell at low prices due to lack of real-time market information.' },
];

const solutions = [
  { icon: '🔔', title: 'Weather Alerts', desc: 'Get real-time weather notifications with farming-specific action recommendations.' },
  { icon: '🤖', title: 'AI Farming Assistant', desc: 'AI chatbot that answers farming questions and provides expert guidance 24/7.' },
  { icon: '🌾', title: 'Crop Recommendation', desc: 'Data-driven crop suggestions that match your soil, weather, and market conditions.' },
  { icon: '💰', title: 'Market Insights', desc: 'Live mandi prices with trends so you can sell crops at the best time and price.' },
];

const steps = [
  { step: '01', icon: <HiUserAdd className="w-8 h-8" />, title: 'Register', desc: 'Create your free account in seconds. No complexity.' },
  { step: '02', icon: <HiSearchCircle className="w-8 h-8" />, title: 'Ask Questions or View Insights', desc: 'Browse weather, crop info, market prices, or ask our AI assistant.' },
  { step: '03', icon: <HiTrendingUp className="w-8 h-8" />, title: 'Improve Farming Decisions', desc: 'Make data-driven decisions to increase yield and reduce losses.' },
];

export default function Home() {
  return (
    <div>
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-earth-50 dark:from-dark-bg dark:via-dark-bg dark:to-dark-card min-h-[90vh] flex items-center">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-earth-200/30 dark:bg-earth-900/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] opacity-[0.03] select-none">🌾</div>
        </div>

        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="badge-green text-sm mb-6 inline-block">
                🚀 AI-Powered Agriculture Technology
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6">
                <span className="gradient-text">AI Powered</span>
                <br />
                Smart Farming
                <br />
                Platform
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
                Helping farmers overcome <strong className="text-gray-800 dark:text-gray-200">unpredictable weather</strong>,{' '}
                <strong className="text-gray-800 dark:text-gray-200">crop diseases</strong>, and{' '}
                <strong className="text-gray-800 dark:text-gray-200">lack of market information</strong>{' '}
                with intelligent technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary flex items-center gap-2">
                  Get Started <HiArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/about" className="btn-secondary">
                  Learn More
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-10 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-primary-500">✓</span> Free to Use
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-500">✓</span> AI Powered
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-500">✓</span> For Indian Farmers
                </div>
              </div>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="w-full h-[500px] bg-gradient-to-br from-primary-100 to-earth-100 dark:from-primary-900/30 dark:to-earth-900/30 rounded-3xl flex items-center justify-center overflow-hidden">
                  <div className="text-center animate-float">
                    <div className="text-[8rem] mb-4">🌾</div>
                    <div className="flex gap-6 justify-center text-5xl">
                      <span className="animate-bounce" style={{ animationDelay: '0s' }}>☀️</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌧️</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🌡️</span>
                    </div>
                  </div>
                  {/* Floating cards */}
                  <div className="absolute top-8 right-8 glass-card p-3 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>🌤️</span> 32°C Sunny
                    </div>
                  </div>
                  <div className="absolute bottom-12 left-8 glass-card p-3 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>📊</span> Rice ₹2,100/q
                    </div>
                  </div>
                  <div className="absolute top-1/2 right-4 glass-card p-3 animate-float" style={{ animationDelay: '3s' }}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>🌱</span> Grow Wheat
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ PROBLEM vs SOLUTION ============ */}
      <section className="section-container">
        <h2 className="section-title">
          The <span className="gradient-text">Problem</span> We Solve
        </h2>
        <p className="section-subtitle">
          Indian farmers face critical challenges that can be solved with technology
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 border-l-4 border-red-400"
            >
              <span className="text-3xl mb-3 block">{p.icon}</span>
              <h3 className="font-display font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <h3 className="text-2xl font-display font-bold text-center mb-8">
          Our <span className="gradient-text">Solutions</span>
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6 border-l-4 border-primary-400"
            >
              <span className="text-3xl mb-3 block">{s.icon}</span>
              <h3 className="font-display font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ KEY FEATURES ============ */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-dark-card dark:to-dark-bg">
        <div className="section-container">
          <h2 className="section-title">
            Key <span className="gradient-text">Features</span>
          </h2>
          <p className="section-subtitle">
            Everything a modern farmer needs, powered by technology
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section-container">
        <h2 className="section-title">
          How It <span className="gradient-text">Works</span>
        </h2>
        <p className="section-subtitle">
          Get started in three simple steps
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-primary-500/30">
                {s.icon}
              </div>
              <span className="text-xs font-bold text-primary-500 mb-2 block">STEP {s.step}</span>
              <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-primary-200 dark:border-primary-800" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900">
        <div className="section-container text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of smart farmers using AI-powered insights to increase yield,
              reduce losses, and make better decisions every day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-primary-700 font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Create Free Account
              </Link>
              <Link
                to="/dashboard/chatbot"
                className="border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Try AI Chatbot
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
