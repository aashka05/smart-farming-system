import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiMenu, HiX, HiSun, HiMoon, HiUser, HiLogout,
  HiHome, HiCloud, HiBeaker, HiChartBar, HiAcademicCap,
  HiInformationCircle, HiPhone, HiGlobe,
} from 'react-icons/hi';
import { GiPlantSeed, GiWheat } from 'react-icons/gi';

const navLinks = [
  { to: '/', label: 'Home', icon: HiHome },
  { to: '/weather', label: 'Weather', icon: HiCloud },
  { to: '/disease-info', label: 'Disease Info', icon: HiBeaker },
  { to: '/crop-recommendation', label: 'Crop Recommendation', icon: GiPlantSeed },
  { to: '/market-prices', label: 'Market Prices', icon: HiChartBar },
  { to: '/tutorials', label: 'Tutorials', icon: HiAcademicCap },
  { to: '/about', label: 'About', icon: HiInformationCircle },
  { to: '/contact', label: 'Contact', icon: HiPhone },
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'gu', label: 'ગુજરાતી' },
];

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const activeLinkClass = 'text-primary-600 dark:text-primary-400 font-semibold';
  const linkClass =
    'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-[15px]';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <span className="text-3xl group-hover:animate-bounce-slow">🌾</span>
            <span className="font-display font-bold text-xl gradient-text hidden sm:block">
              SmartFarm
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive ? activeLinkClass + ' bg-primary-50 dark:bg-primary-900/20' : linkClass
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="hidden sm:block text-sm bg-transparent border border-gray-300 dark:border-dark-border rounded-lg px-2 py-1.5
                         text-gray-700 dark:text-gray-300 focus:ring-primary-400 focus:border-primary-400 cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5 text-gray-600" />}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium text-sm hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                >
                  <HiUser className="w-4 h-4" />
                  {user?.name?.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Logout"
                >
                  <HiLogout className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/20">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-card'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              );
            })}

            <hr className="border-gray-200 dark:border-dark-border my-2" />

            {/* Mobile Language */}
            <div className="flex items-center gap-3 px-4 py-3">
              <HiGlobe className="w-5 h-5 text-gray-500" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="flex-1 bg-transparent border border-gray-300 dark:border-dark-border rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Mobile Auth */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20"
                >
                  <HiUser className="w-5 h-5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <HiLogout className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 px-4 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 rounded-xl border-2 border-primary-200 text-primary-600 font-semibold">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 rounded-xl bg-primary-500 text-white font-semibold shadow-md">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
