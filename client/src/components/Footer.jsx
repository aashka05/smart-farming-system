import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { useMemo } from 'react';
import { useTranslation } from '../utils/useTranslation';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const strings = useMemo(() => ({
    brandDesc: 'AI-Powered FarmLytics Platform helping farmers make better decisions with weather insights, crop recommendations, and market intelligence.',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    weatherUpdates: 'Weather Updates',
    cropRecommendation: 'Crop Recommendation',
    diseaseInfo: 'Disease Info',
    marketPrices: 'Market Prices',
    tutorials: 'Tutorials',
    aboutContact: 'About & Contact',
    copyright: 'FarmLytics. Built with \u2764\uFE0F for Indian Farmers.',
  }), []);

  const { t } = useTranslation(strings);

  const quickLinks = [
    { to: '/weather', label: t.weatherUpdates },
    { to: '/crop-recommendation', label: t.cropRecommendation },
    { to: '/disease-info', label: t.diseaseInfo },
    { to: '/market-prices', label: t.marketPrices },
    { to: '/tutorials', label: t.tutorials },
    { to: '/about-contact', label: t.aboutContact },
  ];

  return (
    <footer className="bg-primary-900 dark:bg-dark-bg text-white border-t border-primary-800 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center text-center md:text-left">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-4">
              <span className="text-3xl">🌾</span>
              <span className="font-display font-bold text-xl tracking-tight">FarmLytics</span>
            </div>
            <p className="text-primary-200/80 text-sm leading-relaxed">
              {t.brandDesc}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4 text-white">{t.quickLinks}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-200/80 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4 text-white">{t.contactUs}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-200/80 text-sm">
                <HiMail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span>farmlyticswork@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-primary-200/80 text-sm">
                <HiPhone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span>9427107324</span>
              </li>
              <li className="flex items-start gap-3 text-primary-200/80 text-sm">
                <HiLocationMarker className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Birla Vishvakarma Mahavidyalaya, Gujarat, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700/50 mt-10 pt-6 text-center">
          <p className="text-primary-300/70 text-sm">
            © {currentYear} {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
