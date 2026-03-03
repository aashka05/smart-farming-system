// src/components/IntroAnimation.jsx
import { motion } from 'framer-motion';

const COLORS = {
  bg: '#f0fdf4',       // Light Mint Sage
  plant: '#16a34a',    // Strong Organic Green
  leafSoft: '#4ade80', // Lighter Green for detail
  accent: '#22c55e',   
};

export default function IntroAnimation() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: COLORS.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Stem - Growing from bottom */}
          <motion.path
            d="M50 80C50 80 50 65 50 45"
            stroke={COLORS.plant}
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Left Leaf - Organic Teardrop Shape */}
          <motion.path
            d="M50 55C50 55 20 55 20 35C20 20 50 45 50 45"
            fill={COLORS.leafSoft}
            fillOpacity="0.2"
            stroke={COLORS.plant}
            strokeWidth="2.5"
            strokeLinejoin="round"
            initial={{ pathLength: 0, scale: 0, opacity: 0 }}
            animate={{ pathLength: 1, scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "backOut" }}
            style={{ transformOrigin: '50px 55px' }}
          />

          {/* Right Leaf - Organic Teardrop Shape */}
          <motion.path
            d="M50 55C50 55 80 55 80 35C80 20 50 45 50 45"
            fill={COLORS.leafSoft}
            fillOpacity="0.2"
            stroke={COLORS.plant}
            strokeWidth="2.5"
            strokeLinejoin="round"
            initial={{ pathLength: 0, scale: 0, opacity: 0 }}
            animate={{ pathLength: 1, scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "backOut" }}
            style={{ transformOrigin: '50px 55px' }}
          />

          {/* Bud / New Growth at top */}
          <motion.circle
            cx="50"
            cy="40"
            r="3.5"
            fill={COLORS.plant}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
          />
        </svg>

        {/* Subtle breathing glow under the plant */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '50%',
            width: 60,
            height: 20,
            marginLeft: -30,
            background: `radial-gradient(ellipse, ${COLORS.leafSoft} 0%, transparent 70%)`,
            zIndex: -1,
          }}
        />
      </div>

      {/* Modern, discreet loading status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '12%',
          color: COLORS.plant,
          fontFamily: 'sans-serif',
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}
      >
        Syncing Fields
      </motion.div>
    </motion.div>
  );
}