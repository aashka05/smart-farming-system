import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { useMemo } from 'react';
import { useTranslation } from '../utils/useTranslation';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const strings = useMemo(() => ({
    brandDesc: 'AI-Powered Smart Farming Platform helping farmers make better decisions with weather insights, crop recommendations, and market intelligence.',
    quickLinks: 'Quick Links',
    dashboard: 'Dashboard',
    contactUs: 'Contact Us',
    weatherUpdates: 'Weather Updates',
    cropRecommendation: 'Crop Recommendation',
    diseaseInfo: 'Disease Info',
    marketPrices: 'Market Prices',
    tutorials: 'Tutorials',
    aboutContact: 'About & Contact',
    overview: 'Overview',
    cropHealth: 'Crop Health',
    yieldPrediction: 'Yield Prediction',
    irrigationAdvisory: 'Irrigation Advisory',
    aiChatbot: 'AI Chatbot',
    copyright: 'Smart Farming Platform. Built with \u2764\uFE0F for Indian Farmers.',
  }), []);

  const { t } = useTranslation(strings);

  return (
    <footer className="bg-primary-900 dark:bg-dark-bg text-white border-t border-primary-800 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌾</span>
              <span className="font-display font-bold text-xl">SmartFarm</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              {t.brandDesc}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t.quickLinks}</h4>
            <ul className="space-y-2">
              {[
                { to: '/weather', label: t.weatherUpdates },
                { to: '/crop-recommendation', label: t.cropRecommendation },
                { to: '/disease-info', label: t.diseaseInfo },
                { to: '/market-prices', label: t.marketPrices },
                { to: '/tutorials', label: t.tutorials },
                { to: '/about-contact', label: t.aboutContact },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-200 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t.dashboard}</h4>
            <ul className="space-y-2">
              {[
                { to: '/dashboard', label: t.overview },
                { to: '/dashboard/crop-health', label: t.cropHealth },
                { to: '/dashboard/yield-prediction', label: t.yieldPrediction },
                { to: '/dashboard/irrigation', label: t.irrigationAdvisory },
                { to: '/dashboard/chatbot', label: t.aiChatbot },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-200 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t.contactUs}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-200 text-sm">
                <HiMail className="w-5 h-5 flex-shrink-0" />
                support@smartfarm.in
              </li>
              <li className="flex items-center gap-3 text-primary-200 text-sm">
                <HiPhone className="w-5 h-5 flex-shrink-0" />
                9XXXXXXXXX (Toll Free)
              </li>
              <li className="flex items-start gap-3 text-primary-200 text-sm">
                <HiLocationMarker className="w-5 h-5 flex-shrink-0 mt-0.5" />
                Birla Vishvakarma Mahavidyalaya, Gujarat, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 dark:border-dark-border mt-10 pt-8 text-center">
          <p className="text-primary-300 text-sm">
            © {currentYear} {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
