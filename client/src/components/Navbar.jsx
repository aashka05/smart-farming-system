import { useState, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../utils/useTranslation";
import {
  HiMenu,
  HiX,
  HiSun,
  HiMoon,
  HiUser,
  HiLogout,
  HiHome,
  HiCloud,
  HiBeaker,
  HiChartBar,
  HiAcademicCap,
  HiInformationCircle,
  HiGlobe,
} from "react-icons/hi";
import { GiPlantSeed } from "react-icons/gi";

const navLinks = [
  { to: "/", label: "Home", icon: HiHome },
  { to: "/weather", label: "Weather", icon: HiCloud },
  { to: "/disease-info", label: "Disease", icon: HiBeaker },
  { to: "/crop-recommendation", label: "Crops", icon: GiPlantSeed },
  { to: "/market-prices", label: "Market", icon: HiChartBar },
  { to: "/tutorials", label: "Tutorials", icon: HiAcademicCap },
  { to: "/about-contact", label: "About Us", icon: HiInformationCircle },
];

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "gu", label: "Gujarati" },
];

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navStrings = useMemo(() => ({
    home: 'Home', weather: 'Weather', disease: 'Disease',
    crops: 'Crops', market: 'Market', tutorials: 'Tutorials',
    aboutUs: 'About Us', login: 'Login',
  }), []);
  const { t } = useTranslation(navStrings);

  const labelMap = {
    '/': t.home, '/weather': t.weather, '/disease-info': t.disease,
    '/crop-recommendation': t.crops, '/market-prices': t.market,
    '/tutorials': t.tutorials, '/about-contact': t.aboutUs,
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const activeLinkClass =
    "text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-900/20";
  const linkClass =
    "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-card";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-2xl">🌾</span>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent hidden xl:block">
              SmartFarm
            </span>
          </Link>

          {/* Desktop Nav Links - Optimized for single line */}
          <div className="hidden lg:flex items-center justify-center flex-1 min-w-0">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-2.5 py-2 rounded-lg transition-all duration-200 text-[13px] xl:text-[14px] whitespace-nowrap ${
                      isActive ? activeLinkClass : linkClass
                    }`
                  }
                >
                  {labelMap[link.to] || link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Language dropdown */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="hidden sm:block text-xs bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-md px-1 py-1 cursor-pointer focus:outline-none"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            >
              {darkMode ? (
                <HiSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <HiMoon className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* Auth Action - Only Login or User Icon */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-all"
                  >
                    <HiUser className="w-4 h-4" />
                    <span className="max-w-[80px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <HiLogout className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm"
                >
                  {t.login}
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card"
            >
              {mobileOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Remains consistent */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 dark:text-gray-300"
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                {labelMap[link.to] || link.label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-gray-100 dark:border-dark-border space-y-3">
              {/* Mobile language selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-sm bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl px-4 py-2.5 cursor-pointer focus:outline-none"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-3 bg-primary-600 text-white rounded-xl font-bold"
                >
                  {t.login}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
