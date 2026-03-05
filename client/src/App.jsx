import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import Weather from './pages/Weather';
import DiseaseInfo from './pages/DiseaseInfo';
import CropRecommendation from './pages/CropRecommendation';
import MarketPrices from './pages/MarketPrices';
import Tutorials from './pages/Tutorials';
import AboutContact from './pages/AboutContact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Dashboard Pages
import Dashboard from './dashboard/Dashboard';
import CropHealth from './dashboard/CropHealth';
import IrrigationAdvisory from './dashboard/IrrigationAdvisory';
import AIChatbot from './dashboard/AIChatbot';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';

// Context
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // Admin users go to admin dashboard instead of farmer dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

// Redirect authenticated users away from login/register
const AuthRedirect = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
};

// Admin Route Wrapper — requires auth + admin role
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
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
      <ScrollToTop />
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
              <Route path="/about-contact" element={<AboutContact />} />
              <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
              <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/crop-health" element={<ProtectedRoute><CropHealth /></ProtectedRoute>} />
              <Route path="/dashboard/irrigation" element={<ProtectedRoute><IrrigationAdvisory /></ProtectedRoute>} />
              <Route path="/dashboard/chatbot" element={<ProtectedRoute><AIChatbot /></ProtectedRoute>} />

              {/* Admin Route */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
