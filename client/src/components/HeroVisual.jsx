// src/components/HeroVisual.jsx
import { motion } from 'framer-motion';

const floatVariant = (delay = 0) => ({
  animate: {
    y: [0, -8, 0],
    transition: { duration: 3, ease: 'easeInOut', repeat: Infinity, delay },
  },
});

const cards = [
  {
    icon: '🌤️',
    label: 'Weather',
    value: '32°C · Sunny',
    pos: { top: '8%', left: '0%' },
    delay: 0,
  },
  {
    icon: '📈',
    label: 'Rice Price',
    value: '₹2,100 / qtl',
    pos: { top: '32%', right: '-4%' },
    delay: 0.4,
  },
  {
    icon: '🌱',
    label: 'Best Crop',
    value: 'Grow Wheat',
    pos: { bottom: '18%', right: '0%' },
    delay: 0.8,
  },
  {
    icon: '💧',
    label: 'Soil Moisture',
    value: '68% · Optimal',
    pos: { bottom: '5%', left: '5%' },
    delay: 1.2,
  },
];

export default function HeroVisual() {
  return (
    <div className="hero-visual" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 520, aspectRatio: '1', position: 'relative' }}>

        {/* Background blob — matches .hbg */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '85%', aspectRatio: '1',
          background: 'linear-gradient(135deg, #f0fdf4, #fef3c7)',
          borderRadius: '50%',
          zIndex: 0,
        }} />

        {/* Central orb — matches .hmain */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '55%', aspectRatio: '1',
            background: 'linear-gradient(145deg, #4ade80, #14532d)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '5.5rem',
            zIndex: 1,
            boxShadow: '0 20px 60px rgba(26,71,49,0.3)',
          }}
        >
          🌾
        </motion.div>

        {/* Floating cards — matches .hfloat structure */}
        {cards.map((card) => (
          <motion.div
            key={card.label}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, delay: card.delay }}
            style={{
              position: 'absolute',
              ...card.pos,
              background: '#fff',
              borderRadius: 16,
              padding: '10px 14px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              zIndex: 2,
              minWidth: 155,
            }}
          >
            {/* Icon */}
            <span style={{ fontSize: '1.3rem' }}>{card.icon}</span>

            {/* Text — matches .hft / .hfl / .hfv */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontSize: '0.62rem',
                color: '#9ca3af',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {card.label}
              </span>
              <span style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1a1a2e',
              }}>
                {card.value}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Live pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            position: 'absolute',
            bottom: '28%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(20,83,45,0.88)',
            borderRadius: 99,
            padding: '5px 14px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(74,222,128,0.2)',
            whiteSpace: 'nowrap',
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#4ade80', boxShadow: '0 0 8px #4ade80',
              display: 'inline-block',
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
    </div>
  );
}