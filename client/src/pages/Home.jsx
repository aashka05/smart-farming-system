import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiArrowRight, HiUserAdd, 
  HiSearchCircle, HiTrendingUp 
} from 'react-icons/hi';

import FeatureCard from '../components/FeatureCard';
import HeroVisual from '../components/HeroVisual';
import IntroAnimation from '../components/IntroAnimation';
import { useTranslation } from '../utils/useTranslation';

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
  const [loading, setLoading] = useState(true);

  const strings = useMemo(() => ({
    heroLine1: 'AI Powered', heroLine2: 'Smart Farming', heroLine3: 'Platform',
    heroDesc: "Farming shouldn't depend on guesswork. Our platform helps farmers predict weather changes, detect crop diseases early, and make better market decisions using simple AI-powered tools.",
    getStarted: 'Get Started', learnMore: 'Learn More',
    freeToUse: 'Free to Use', aiPowered: 'AI Powered', forFarmers: 'For Indian Farmers',
    problemTitle: 'The Problem We Solve',
    problemSubtitle: 'Indian farmers face critical challenges that can be solved with technology',
    solutionsTitle: 'Our Solutions',
    prob0t: 'Unpredictable Weather', prob0d: 'Sudden weather changes destroy crops and reduce yield without timely warnings.',
    prob1t: 'Crop Diseases', prob1d: 'Late identification of diseases causes massive crop losses every season.',
    prob2t: 'Market Price Uncertainty', prob2d: 'Farmers sell at low prices due to lack of real-time market information.',
    sol0t: 'Weather Alerts', sol0d: 'Get real-time weather notifications with farming-specific action recommendations.',
    sol1t: 'AI Farming Assistant', sol1d: 'AI chatbot that answers farming questions and provides expert guidance 24/7.',
    sol2t: 'Crop Recommendation', sol2d: 'Data-driven crop suggestions that match your soil, weather, and market conditions.',
    sol3t: 'Market Insights', sol3d: 'Live mandi prices with trends so you can sell crops at the best time and price.',
    featTitle: 'Key Features', featSubtitle: 'Everything a modern farmer needs, powered by technology',
    f0t: 'Weather Forecast', f0d: 'Real-time weather updates with farming-specific insights and alerts for your region.',
    f1t: 'Crop Recommendation', f1d: 'AI-powered crop suggestions based on soil type, rainfall, temperature and season.',
    f2t: 'Plant Disease Detection', f2d: 'Identify crop diseases from images with treatment recommendations and prevention tips.',
    f3t: 'AI Farming Chatbot', f3d: 'Ask any farming question and get instant expert advice powered by artificial intelligence.',
    f4t: 'Market Price Insights', f4d: 'Live market prices for crops across mandis with trend analysis and price alerts.',
    f5t: 'Irrigation Advisory', f5d: 'Smart irrigation scheduling based on soil moisture, weather data and crop requirements.',
    howTitle: 'How It Works', howSubtitle: 'Get started in three simple steps',
    s0t: 'Register', s0d: 'Create your free account in seconds. No complexity.',
    s1t: 'Ask Questions or View Insights', s1d: 'Browse weather, crop info, market prices, or ask our AI assistant.',
    s2t: 'Improve Farming Decisions', s2d: 'Make data-driven decisions to increase yield and reduce losses.',
    ctaTitle: 'Ready to Transform Your Farming?',
    ctaDesc: 'Join thousands of smart farmers using AI-powered insights to increase yield, reduce losses, and make better decisions every day.',
    ctaBtn1: 'Create Free Account', ctaBtn2: 'Try AI Chatbot',
  }), []);

  const { t } = useTranslation(strings);

  const tProblems = problems.map((p, i) => ({ ...p, title: t[`prob${i}t`] || p.title, desc: t[`prob${i}d`] || p.desc }));
  const tSolutions = solutions.map((s, i) => ({ ...s, title: t[`sol${i}t`] || s.title, desc: t[`sol${i}d`] || s.desc }));
  const tFeatures = features.map((f, i) => ({ ...f, title: t[`f${i}t`] || f.title, description: t[`f${i}d`] || f.description }));
  const tSteps = steps.map((s, i) => ({ ...s, title: t[`s${i}t`] || s.title, desc: t[`s${i}d`] || s.desc }));

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('agro_intro_played');
    if (hasVisited) {
      setLoading(false);
    } else {
      // 3.8s — matches the full animation sequence duration
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('agro_intro_played', 'true');
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="relative">
      {/* Intro Animation Overlay */}
      <AnimatePresence>
        {loading && <IntroAnimation key="intro" />}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-earth-50 dark:from-dark-bg dark:via-dark-bg dark:to-dark-card min-h-[90vh] flex items-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-earth-200/30 dark:bg-earth-900/20 rounded-full blur-3xl" />
          </div>

          <div className="section-container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left: Copy */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={!loading ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                  
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6">
                  <span className="gradient-text">{t.heroLine1}</span>
                  <br />
                  {t.heroLine2}
                  <br />
                  {t.heroLine3}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
                  {t.heroDesc}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/register" className="btn-primary flex items-center gap-2">
                    {t.getStarted} <HiArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/about-contact" className="btn-secondary">
                    {t.learnMore}
                  </Link>
                </div>
                <div className="flex items-center gap-6 mt-10 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2"><span className="text-primary-500">✓</span> {t.freeToUse}</div>
                  <div className="flex items-center gap-2"><span className="text-primary-500">✓</span> {t.aiPowered}</div>
                  <div className="flex items-center gap-2"><span className="text-primary-500">✓</span> {t.forFarmers}</div>
                </div>
              </motion.div>

              {/* Right: Hero Visual */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={!loading ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="hidden lg:block"
              >
                {!loading && <HeroVisual />}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============ PROBLEM vs SOLUTION ============ */}
        <section className="section-container">
          <h2 className="section-title">{t.problemTitle}</h2>
          <p className="section-subtitle">{t.problemSubtitle}</p>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {tProblems.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 border-l-4 border-red-400">
                <span className="text-3xl mb-3 block">{p.icon}</span>
                <h3 className="font-display font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
          <h3 className="text-2xl font-display font-bold text-center mb-8">{t.solutionsTitle}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tSolutions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6 border-l-4 border-primary-400">
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
            <h2 className="section-title">{t.featTitle}</h2>
            <p className="section-subtitle">{t.featSubtitle}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tFeatures.map((f, i) => (
                <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className="section-container">
          <h2 className="section-title">{t.howTitle}</h2>
          <p className="section-subtitle">{t.howSubtitle}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {tSteps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center relative">
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t.ctaTitle}</h2>
              <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
                {t.ctaDesc}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="bg-white text-primary-700 font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                  {t.ctaBtn1}
                </Link>
                <Link to="/dashboard/chatbot" className="border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-all duration-300">
                  {t.ctaBtn2}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
