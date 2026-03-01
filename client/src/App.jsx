import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Weather from './pages/Weather';
import DiseaseInfo from './pages/DiseaseInfo';
import CropRecommendation from './pages/CropRecommendation';
import MarketPrices from './pages/MarketPrices';
import Tutorials from './pages/Tutorials';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Pages
import Dashboard from './dashboard/Dashboard';
import CropHealth from './dashboard/CropHealth';
import YieldPrediction from './dashboard/YieldPrediction';
import IrrigationAdvisory from './dashboard/IrrigationAdvisory';
import AIChatbot from './dashboard/AIChatbot';

// Context
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">🔒 Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please login to access this feature.</p>
          <a href="/login" className="btn-primary inline-block">Go to Login</a>
        </div>
      </div>
    );
  }
  return children;
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sf_darkMode') === 'true';
    }
    return false;
  });

  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('sf_darkMode', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/disease-info" element={<DiseaseInfo />} />
              <Route path="/crop-recommendation" element={<CropRecommendation />} />
              <Route path="/market-prices" element={<MarketPrices />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/crop-health" element={<ProtectedRoute><CropHealth /></ProtectedRoute>} />
              <Route path="/dashboard/yield-prediction" element={<ProtectedRoute><YieldPrediction /></ProtectedRoute>} />
              <Route path="/dashboard/irrigation" element={<ProtectedRoute><IrrigationAdvisory /></ProtectedRoute>} />
              <Route path="/dashboard/chatbot" element={<ProtectedRoute><AIChatbot /></ProtectedRoute>} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
