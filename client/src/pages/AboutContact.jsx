import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiLightBulb, HiEye, HiMail, HiPhone, HiLocationMarker, HiChat, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useTranslation } from '../utils/useTranslation';
import api from '../services/api';

const faqs = [
  { q: 'Is the platform free to use?', a: 'Yes! FarmLytics is completely free for all farmers. We believe technology should be accessible to every farmer regardless of their financial situation.' },
  { q: 'How accurate are the crop recommendations?', a: 'Our recommendations are based on agricultural research data and will be enhanced with ML models. Currently using validated agricultural practices for suggestions.' },
  { q: 'Can I use the platform in my local language?', a: 'Yes, we support English, Hindi (हिन्दी), and Gujarati (ગુજરાતી). More regional languages will be added soon.' },
  { q: 'How does the weather station integration work?', a: 'We support IoT weather stations using PIC18F16Q41 microcontroller with GSM modem. The station sends sensor data (temperature, humidity, soil moisture, etc.) in JSON format to our API endpoint.' },
  { q: 'Can I upload images for disease detection?', a: 'Yes! Once logged in, you can upload crop images in the Disease Prediction section. Our AI model will analyze the image and provide disease identification with treatment recommendations.' },
  { q: 'How often are market prices updated?', a: 'Market prices will be updated daily from government APMC data sources. Currently showing representative data that will be replaced with live API integration.' },
];

export default function AboutContact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const strings = useMemo(() => ({
    pageTitle: 'About',
    pageTitleHighlight: 'FarmLytics',
    pageSubtitle: 'Empowering Indian farmers with AI-driven technology for sustainable and profitable agriculture',
    missionTitle: 'Our Mission',
    mission1: 'Provide real-time, localized weather insights with farming-specific recommendations',
    mission2: 'Enable AI-powered crop disease detection and treatment guidance',
    mission3: 'Offer data-driven crop recommendations based on soil, climate, and market conditions',
    mission4: 'Bridge the information gap with live market prices from mandis',
    mission5: 'Build a smart irrigation advisory system powered by IoT weather stations',
    mission6: 'Create an AI farming assistant that speaks the farmer\'s language',
    visionTitle: 'Our Vision',
    vision1: 'Empower every Indian farmer with accessible, AI-driven agricultural intelligence',
    vision2: 'Reduce crop losses through early disease detection and proactive advisory systems',
    vision3: 'Promote sustainable farming practices with data-driven resource management',
    vision4: 'Democratize agricultural technology so no farmer is left behind',
    vision5: 'Connect farmers to real-time market data for fair and profitable trade',
    vision6: 'Build a resilient farming ecosystem that adapts to climate change challenges',
    contactTitle: '📞 Contact & Feedback',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const missions = [t.mission1, t.mission2, t.mission3, t.mission4, t.mission5, t.mission6];
  const visions = [t.vision1, t.vision2, t.vision3, t.vision4, t.vision5, t.vision6];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        {/* ===== ABOUT SECTION ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="section-title">{t.pageTitle} <span className="gradient-text">{t.pageTitleHighlight}</span></h1>
          <p className="section-subtitle">{t.pageSubtitle}</p>
        </motion.div>

        {/* Mission & Vision Cards — equal height, side-by-side */}
        <div className="grid lg:grid-cols-2 gap-10 mb-20 items-stretch">
          {/* Mission */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex">
            <div className="glass-card p-8 flex flex-col w-full">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-5">
                <HiLightBulb className="w-7 h-7 text-primary-600" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-5">{t.missionTitle}</h2>
              <ul className="space-y-4 flex-1">
                {missions.map((item, i) => (
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
              <h2 className="font-display font-bold text-2xl mb-5">{t.visionTitle}</h2>
              <ul className="space-y-4 flex-1">
                {visions.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                    <span className="text-blue-500 mt-1 flex-shrink-0">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

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
                    <p className="font-semibold text-gray-800 dark:text-white">support@farmlytics.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <HiLocationMarker className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.office}</p>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">FarmLytics Lab, Agricultural University, India</p>
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
