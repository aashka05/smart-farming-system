// src/components/HeroVisual.jsx
import { motion } from 'framer-motion';

const cards = [
  {
    icon: '🌤️',
    label: 'Weather',
    value: '32°C · Sunny',
    sub: 'Ahmedabad, GJ',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    dot: '#22c55e',
    pos: { top: '2%', left: '4%' },
    delay: 0.2,
    floatDelay: 0,
  },
  {
    icon: '📈',
    label: 'Rice Price',
    value: '₹2,100 / qtl',
    sub: '↑ 3.2% this week',
    bg: '#fffbeb',
    border: '#fde68a',
    dot: '#f59e0b',
    pos: { top: '2%', right: '4%' },
    delay: 0.4,
    floatDelay: 0.6,
  },
  {
    icon: '🌱',
    label: 'Best Crop',
    value: 'Grow Wheat',
    sub: 'AI recommended',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    dot: '#16a34a',
    pos: { bottom: '2%', left: '4%' },
    delay: 0.6,
    floatDelay: 1.1,
  },
  {
    icon: '💧',
    label: 'Soil Moisture',
    value: '68% · Optimal',
    sub: 'No irrigation needed',
    bg: '#eff6ff',
    border: '#bfdbfe',
    dot: '#3b82f6',
    pos: { bottom: '2%', right: '4%' },
    delay: 0.8,
    floatDelay: 1.6,
  },
];

function FloatCard({ icon, label, value, sub, bg, border, dot, pos, delay, floatDelay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'absolute', zIndex: 10, ...pos }}
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.8, ease: 'easeInOut', repeat: Infinity, delay: floatDelay }}
        style={{
          background: bg,
          border: `1.5px solid ${border}`,
          borderRadius: 18,
          padding: '12px 16px',
          minWidth: 168,
          boxShadow: '0 8px 28px rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{
          width: 42, height: 42,
          borderRadius: 12,
          background: '#fff',
          border: `1.5px solid ${border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          {icon}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: dot, display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{
              fontSize: '0.6rem', fontWeight: 700, color: '#9ca3af',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              {label}
            </span>
          </div>
          <div style={{
            fontSize: '0.88rem', fontWeight: 800, color: '#14532d',
            fontFamily: "'Sora', sans-serif", lineHeight: 1.2,
          }}>
            {value}
          </div>
          <div style={{
            fontSize: '0.62rem', color: '#9ca3af', fontWeight: 500, marginTop: 2,
          }}>
            {sub}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroVisual() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 520,
      aspectRatio: '1',
      margin: '0 auto',
    }}>

      {/* Soft background blob */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '70%', height: '70%',
        background: 'radial-gradient(ellipse at 45% 40%, #dcfce7 0%, #fef9c3 55%, #d1fae5 100%)',
        borderRadius: '50%',
        filter: 'blur(4px)',
        zIndex: 0,
      }} />

      {/* Outer orbit ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 36, ease: 'linear', repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: '56%', height: '56%',
          marginTop: '-28%', marginLeft: '-28%',
          border: '1.5px dashed rgba(34,197,94,0.22)',
          borderRadius: '50%',
          zIndex: 1,
        }}
      >
        <div style={{
          position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)',
          width: 10, height: 10, borderRadius: '50%',
          background: '#22c55e', boxShadow: '0 0 10px rgba(34,197,94,0.7)',
        }} />
      </motion.div>

      {/* Inner orbit ring reverse */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: '38%', height: '38%',
          marginTop: '-19%', marginLeft: '-19%',
          border: '1px dashed rgba(251,191,36,0.28)',
          borderRadius: '50%',
          zIndex: 1,
        }}
      >
        <div style={{
          position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
          width: 8, height: 8, borderRadius: '50%',
          background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.7)',
        }} />
      </motion.div>

      {/* Central orb */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.2, ease: 'easeInOut', repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '26%', height: '26%',
          background: 'linear-gradient(145deg, #16a34a 0%, #14532d 100%)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          zIndex: 5,
          boxShadow: '0 20px 50px rgba(20,83,45,0.35), 0 0 0 8px rgba(34,197,94,0.1), 0 0 0 18px rgba(34,197,94,0.05)',
        }}
      >
        🌾
      </motion.div>

      {/* 4 data cards */}
      {cards.map((c) => <FloatCard key={c.label} {...c} />)}

      {/* Live pill */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{
          position: 'absolute',
          top: '58%', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(20,83,45,0.85)',
          borderRadius: 99, padding: '5px 14px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(74,222,128,0.2)',
          whiteSpace: 'nowrap',
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#4ade80', boxShadow: '0 0 8px #4ade80',
            display: 'block', flexShrink: 0,
          }}
        />
        <span style={{
          fontSize: '0.65rem', fontWeight: 700,
          color: '#bbf7d0', letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Live · AI Active
        </span>
      </motion.div>

    </div>
  );
}
