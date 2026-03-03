import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiLightBulb, HiGlobe, HiHeart, HiCode, HiMail, HiPhone, HiLocationMarker, HiChat, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiTailwindcss, SiVite } from 'react-icons/si';
import toast from 'react-hot-toast';
import { useTranslation } from '../utils/useTranslation';

const techStack = [
  { name: 'MongoDB', icon: SiMongodb, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { name: 'Express.js', icon: SiExpress, color: 'text-gray-800 dark:text-gray-200', bg: 'bg-gray-50 dark:bg-gray-800/30' },
  { name: 'React', icon: SiReact, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { name: 'TailwindCSS', icon: SiTailwindcss, color: 'text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { name: 'Vite', icon: SiVite, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
];

const faqs = [
  { q: 'Is the platform free to use?', a: 'Yes! The Smart Farming Platform is completely free for all farmers. We believe technology should be accessible to every farmer regardless of their financial situation.' },
  { q: 'How accurate are the crop recommendations?', a: 'Our recommendations are based on agricultural research data and will be enhanced with ML models. Currently using validated agricultural practices for suggestions.' },
  { q: 'Can I use the platform in my local language?', a: 'Yes, we support English, Hindi (हिन्दी), and Gujarati (ગુજરાતી). More regional languages will be added soon.' },
  { q: 'How does the weather station integration work?', a: 'We support IoT weather stations using PIC18F16Q41 microcontroller with GSM modem. The station sends sensor data (temperature, humidity, soil moisture, etc.) in JSON format to our API endpoint.' },
  { q: 'Can I upload images for disease detection?', a: 'Yes! Once logged in, you can upload crop images in the Crop Health section. Our AI model will analyze the image and provide disease identification with treatment recommendations.' },
  { q: 'How often are market prices updated?', a: 'Market prices will be updated daily from government APMC data sources. Currently showing representative data that will be replaced with live API integration.' },
];

export default function AboutContact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const strings = useMemo(() => ({
    pageTitle: 'About',
    pageTitleHighlight: 'Smart Farming Platform',
    pageSubtitle: 'Empowering Indian farmers with AI-driven technology for sustainable and profitable agriculture',
    motivationTitle: 'Our Motivation',
    motivationP1: 'Indian agriculture employs over 50% of the workforce but faces critical challenges — unpredictable weather patterns, increasing crop diseases, lack of real-time market information, and water scarcity. Small and marginal farmers are the most affected.',
    motivationP2: 'We believe technology can bridge this gap. By combining AI, IoT weather stations, and accessible interfaces, we aim to democratize agricultural intelligence and put expert-level insights in every farmer\'s hands.',
    missionTitle: 'Our Mission',
    mission1: 'Provide real-time, localized weather insights with farming-specific recommendations',
    mission2: 'Enable AI-powered crop disease detection and treatment guidance',
    mission3: 'Offer data-driven crop recommendations based on soil, climate, and market conditions',
    mission4: 'Bridge the information gap with live market prices from mandis',
    mission5: 'Build a smart irrigation advisory system powered by IoT weather stations',
    mission6: 'Create an AI farming assistant that speaks the farmer\'s language',
    techTitle: 'Technology Stack',
    techSubtitle: 'Built with modern, production-ready technologies',
    futureTitle: 'Future Integrations',
    contactTitle: '📞 Contact & Support',
    contactSubtitle: 'We\'re here to help. Reach out to us anytime.',
    sendMessage: 'Send us a Message',
    fullName: 'Full Name',
    enterName: 'Enter your name',
    emailLabel: 'Email Address',
    emailPlaceholder: 'your@email.com',
    messageLabel: 'Message',
    messagePlaceholder: 'How can we help you?',
    sendBtn: 'Send Message',
    getInTouch: 'Get in Touch',
    helpline: 'Helpline (Toll Free)',
    emailSupport: 'Email Support',
    office: 'Office',
    faqTitle: '❓ Frequently Asked Questions',
  }), []);

  const { t } = useTranslation(strings);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const missions = [t.mission1, t.mission2, t.mission3, t.mission4, t.mission5, t.mission6];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        {/* ===== ABOUT SECTION ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="section-title">{t.pageTitle} <span className="gradient-text">{t.pageTitleHighlight}</span></h1>
          <p className="section-subtitle">{t.pageSubtitle}</p>
        </motion.div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="glass-card p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-5">
                <HiLightBulb className="w-7 h-7 text-primary-600" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-4">{t.motivationTitle}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{t.motivationP1}</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t.motivationP2}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="glass-card p-8 h-full">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
                <HiHeart className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-4">{t.missionTitle}</h2>
              <ul className="space-y-4">
                {missions.map((item, i) => (
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
            <h2 className="font-display font-bold text-2xl mb-2">{t.techTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t.techSubtitle}</p>
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
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="glass-card p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 mx-auto">
              <HiGlobe className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-4">{t.futureTitle}</h2>
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

        {/* ===== CONTACT SECTION ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="section-title">{t.contactTitle}</h2>
          <p className="section-subtitle">{t.contactSubtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card p-7">
              <h2 className="font-display font-bold text-xl mb-6">{t.sendMessage}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.fullName}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.enterName}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.emailLabel}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.emailPlaceholder}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.messageLabel}</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.messagePlaceholder}
                    rows={5}
                    className="input-field resize-none"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <HiChat className="w-5 h-5" />
                      {t.sendBtn}
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info + FAQ */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Contact Info Cards */}
            <div className="glass-card p-6">
              <h3 className="font-display font-bold text-lg mb-5">{t.getInTouch}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <HiPhone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.helpline}</p>
                    <p className="font-semibold text-gray-800 dark:text-white">1800-FARM-HELP</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <HiMail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.emailSupport}</p>
                    <p className="font-semibold text-gray-800 dark:text-white">support@smartfarm.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <HiLocationMarker className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.office}</p>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">Smart Farming Lab, Agricultural University, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="glass-card p-6">
              <h3 className="font-display font-bold text-lg mb-5">{t.faqTitle}</h3>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-gray-100 dark:border-dark-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-card transition-colors"
                    >
                      <span className="font-medium text-sm text-gray-800 dark:text-white pr-4">{faq.q}</span>
                      {openFaq === i ? (
                        <HiChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <HiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
