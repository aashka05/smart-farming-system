import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiChat, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import toast from 'react-hot-toast';

const faqs = [
  { q: 'Is the platform free to use?', a: 'Yes! The Smart Farming Platform is completely free for all farmers. We believe technology should be accessible to every farmer regardless of their financial situation.' },
  { q: 'How accurate are the crop recommendations?', a: 'Our recommendations are based on agricultural research data and will be enhanced with ML models. Currently using validated agricultural practices for suggestions.' },
  { q: 'Can I use the platform in my local language?', a: 'Yes, we support English, Hindi (हिन्दी), and Gujarati (ગુજરાતી). More regional languages will be added soon.' },
  { q: 'How does the weather station integration work?', a: 'We support IoT weather stations using PIC18F16Q41 microcontroller with GSM modem. The station sends sensor data (temperature, humidity, soil moisture, etc.) in JSON format to our API endpoint.' },
  { q: 'Can I upload images for disease detection?', a: 'Yes! Once logged in, you can upload crop images in the Crop Health section. Our AI model will analyze the image and provide disease identification with treatment recommendations.' },
  { q: 'How often are market prices updated?', a: 'Market prices will be updated daily from government APMC data sources. Currently showing representative data that will be replaced with live API integration.' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="section-title">📞 Contact & Support</h1>
          <p className="section-subtitle">We're here to help. Reach out to us anytime.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card p-7">
              <h2 className="font-display font-bold text-xl mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
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
                      Send Message
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
              <h3 className="font-display font-bold text-lg mb-5">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <HiPhone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Helpline (Toll Free)</p>
                    <p className="font-semibold text-gray-800 dark:text-white">1800-FARM-HELP</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <HiMail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email Support</p>
                    <p className="font-semibold text-gray-800 dark:text-white">support@smartfarm.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <HiLocationMarker className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Office</p>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">Smart Farming Lab, Agricultural University, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="glass-card p-6">
              <h3 className="font-display font-bold text-lg mb-5">❓ Frequently Asked Questions</h3>
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
