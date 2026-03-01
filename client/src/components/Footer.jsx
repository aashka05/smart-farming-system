import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
              AI-Powered Smart Farming Platform helping farmers make better decisions
              with weather insights, crop recommendations, and market intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/weather', label: 'Weather Updates' },
                { to: '/crop-recommendation', label: 'Crop Recommendation' },
                { to: '/disease-info', label: 'Disease Info' },
                { to: '/market-prices', label: 'Market Prices' },
                { to: '/tutorials', label: 'Tutorials' },
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
            <h4 className="font-display font-semibold text-lg mb-4">Dashboard</h4>
            <ul className="space-y-2">
              {[
                { to: '/dashboard', label: 'Overview' },
                { to: '/dashboard/crop-health', label: 'Crop Health' },
                { to: '/dashboard/yield-prediction', label: 'Yield Prediction' },
                { to: '/dashboard/irrigation', label: 'Irrigation Advisory' },
                { to: '/dashboard/chatbot', label: 'AI Chatbot' },
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
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-200 text-sm">
                <HiMail className="w-5 h-5 flex-shrink-0" />
                support@smartfarm.in
              </li>
              <li className="flex items-center gap-3 text-primary-200 text-sm">
                <HiPhone className="w-5 h-5 flex-shrink-0" />
                1800-FARM-HELP (Toll Free)
              </li>
              <li className="flex items-start gap-3 text-primary-200 text-sm">
                <HiLocationMarker className="w-5 h-5 flex-shrink-0 mt-0.5" />
                Smart Farming Lab, Agricultural University, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 dark:border-dark-border mt-10 pt-8 text-center">
          <p className="text-primary-300 text-sm">
            © {currentYear} Smart Farming Platform. Built with ❤️ for Indian Farmers.
          </p>
        </div>
      </div>
    </footer>
  );
}
