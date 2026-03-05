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
  HiChat,
  HiChevronDown,
  HiShieldCheck,
} from "react-icons/hi";
import { GiPlantSeed, GiWateringCan } from "react-icons/gi";

const exploreLinks = [
  { to: "/weather", label: "Weather", icon: HiCloud },
  { to: "/market-prices", label: "Market Prices", icon: HiChartBar },
  { to: "/tutorials", label: "Tutorials", icon: HiAcademicCap },
];

const aiToolsLinks = [
  { to: "/dashboard/crop-health", label: "Disease Prediction", icon: HiShieldCheck },
  { to: "/dashboard/irrigation", label: "Irrigation Advisory", icon: GiWateringCan },
  { to: "/dashboard/chatbot", label: "AI Chatbot", icon: HiChat },
];

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "gu", label: "Gujarati" },
];

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [aiToolsOpen, setAiToolsOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [mobileAiToolsOpen, setMobileAiToolsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navStrings = useMemo(() => ({
    home: 'Home', weather: 'Weather', disease: 'Disease',
    crops: 'Crops', market: 'Market', tutorials: 'Tutorials',
    aboutUs: 'About Us', login: 'Login',
    explore: 'Explore', aiTools: 'AI Tools',
    marketPrices: 'Market Prices',
    diseasePrediction: 'Disease Prediction',
    irrigationAdvisory: 'Irrigation Advisory',
    aiChatbot: 'AI Chatbot',
  }), []);
  const { t } = useTranslation(navStrings);

  const labelMap = {
    '/': t.home, '/weather': t.weather, '/disease-info': t.disease,
    '/crop-recommendation': t.crops, '/market-prices': t.marketPrices || t.market,
    '/tutorials': t.tutorials, '/about-contact': t.aboutUs,
    '/dashboard/crop-health': t.diseasePrediction,
    '/dashboard/irrigation': t.irrigationAdvisory,
    '/dashboard/chatbot': t.aiChatbot,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-2xl">🌾</span>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              FarmLytics
            </span>
          </Link>

          {/* Desktop Nav Links - Grouped Dropdowns */}
          <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 mx-6">
            <div className="flex items-center gap-2">
              {/* Home */}
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-all duration-200 text-sm whitespace-nowrap ${
                    isActive ? activeLinkClass : linkClass
                  }`
                }
              >
                {t.home}
              </NavLink>

              {/* Explore Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setExploreOpen(!exploreOpen); setAiToolsOpen(false); }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-sm whitespace-nowrap ${linkClass}`}
                >
                  {t.explore}
                  <HiChevronDown className={`w-4 h-4 transition-transform ${exploreOpen ? 'rotate-180' : ''}`} />
                </button>
                {exploreOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setExploreOpen(false)} />
                    <div className="absolute left-0 mt-1 w-52 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-dark-border py-1 z-50">
                      {exploreLinks.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          onClick={() => setExploreOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              isActive
                                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border'
                            }`
                          }
                        >
                          <link.icon className="w-4 h-4" />
                          {labelMap[link.to] || link.label}
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* AI Tools Dropdown - Only when authenticated */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => { setAiToolsOpen(!aiToolsOpen); setExploreOpen(false); }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-sm whitespace-nowrap ${linkClass}`}
                  >
                    {t.aiTools}
                    <HiChevronDown className={`w-4 h-4 transition-transform ${aiToolsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {aiToolsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setAiToolsOpen(false)} />
                      <div className="absolute left-0 mt-1 w-52 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-dark-border py-1 z-50">
                        {aiToolsLinks.map((link) => (
                          <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setAiToolsOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                isActive
                                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border'
                              }`
                            }
                          >
                            <link.icon className="w-4 h-4" />
                            {labelMap[link.to] || link.label}
                          </NavLink>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* About Us */}
              <NavLink
                to="/about-contact"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition-all duration-200 text-sm whitespace-nowrap ${
                    isActive ? activeLinkClass : linkClass
                  }`
                }
              >
                {t.aboutUs}
              </NavLink>
            </div>
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language dropdown */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="hidden sm:block text-xs bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-md px-2 py-1.5 cursor-pointer focus:outline-none"
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

            {/* Auth Action - Profile Dropdown or Login */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-all"
                  >
                    <HiUser className="w-4 h-4" />
                    <span className="max-w-[80px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <HiChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-dark-border py-1 z-50">
                        <Link
                          to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                        >
                          <HiUser className="w-4 h-4" />
                          {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                        </Link>
                        <div className="border-t border-gray-100 dark:border-dark-border my-1" />
                        <button
                          onClick={() => { setProfileOpen(false); handleLogout(); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <HiLogout className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm whitespace-nowrap"
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border">
          <div className="px-4 py-3 space-y-1">
            {/* Home */}
            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl ${
                  isActive ? "bg-primary-50 text-primary-600" : "text-gray-700 dark:text-gray-300"
                }`
              }
            >
              <HiHome className="w-5 h-5" />
              {t.home}
            </NavLink>

            {/* Explore Section */}
            <div>
              <button
                onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300"
              >
                <span className="flex items-center gap-3">
                  <HiGlobe className="w-5 h-5" />
                  {t.explore}
                </span>
                <HiChevronDown className={`w-4 h-4 transition-transform ${mobileExploreOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileExploreOpen && (
                <div className="ml-6 space-y-1">
                  {exploreLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${
                          isActive ? "bg-primary-50 text-primary-600" : "text-gray-600 dark:text-gray-400"
                        }`
                      }
                    >
                      <link.icon className="w-4 h-4" />
                      {labelMap[link.to] || link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* AI Tools Section - Only when authenticated */}
            {isAuthenticated && (
              <div>
                <button
                  onClick={() => setMobileAiToolsOpen(!mobileAiToolsOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300"
                >
                  <span className="flex items-center gap-3">
                    <HiChat className="w-5 h-5" />
                    {t.aiTools}
                  </span>
                  <HiChevronDown className={`w-4 h-4 transition-transform ${mobileAiToolsOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileAiToolsOpen && (
                  <div className="ml-6 space-y-1">
                    {aiToolsLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${
                            isActive ? "bg-primary-50 text-primary-600" : "text-gray-600 dark:text-gray-400"
                          }`
                        }
                      >
                        <link.icon className="w-4 h-4" />
                        {labelMap[link.to] || link.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* About Us */}
            <NavLink
              to="/about-contact"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl ${
                  isActive ? "bg-primary-50 text-primary-600" : "text-gray-700 dark:text-gray-300"
                }`
              }
            >
              <HiInformationCircle className="w-5 h-5" />
              {t.aboutUs}
            </NavLink>

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
              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-card"
                  >
                    <HiUser className="w-5 h-5" />
                    {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <HiLogout className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
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
