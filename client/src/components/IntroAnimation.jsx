// src/components/IntroAnimation.jsx
// Full-screen intro that plays once per session (~3.8s)
// Uses only framer-motion + inline styles — no extra dependencies

import { motion } from 'framer-motion';

/* ─── One wheat stalk rendered as SVG paths ─── */
function WheatStalk({ x, delay, height = 110, lean = 0, scale = 1 }) {
  const stemH = height;
  const grainCount = 5;

  return (
    <motion.g
      transform={`translate(${x}, 0) scale(${scale})`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.2 }}
    >
      {/* Stem grows upward */}
      <motion.line
        x1="0" y1="0" x2={lean} y2={-stemH}
        stroke="#4ade80"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.7, ease: 'easeOut' }}
        style={{ originY: '100%' }}
      />

      {/* Grain head — appears after stem */}
      {Array.from({ length: grainCount }).map((_, i) => {
        const gy = -stemH + i * 13;
        const gx = lean * (i / grainCount);
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <motion.g key={i} transform={`translate(${gx},${gy})`}>
            {/* Left grain */}
            <motion.ellipse
              cx={-7 * side} cy={-3} rx={5} ry={2.5}
              fill="#22c55e"
              transform={`rotate(${-30 * side})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: delay + 0.55 + i * 0.06, duration: 0.25, ease: 'backOut' }}
              style={{ transformOrigin: '0 0' }}
            />
            {/* Right grain */}
            <motion.ellipse
              cx={7 * side} cy={-3} rx={5} ry={2.5}
              fill="#16a34a"
              transform={`rotate(${30 * side})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: delay + 0.6 + i * 0.06, duration: 0.25, ease: 'backOut' }}
              style={{ transformOrigin: '0 0' }}
            />
          </motion.g>
        );
      })}

      {/* Tip grain */}
      <motion.ellipse
        cx={lean} cy={-stemH - 10} rx={4} ry={7}
        fill="#15803d"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 1.0, duration: 0.3, ease: 'backOut' }}
        style={{ transformOrigin: `${lean}px ${-stemH - 10}px` }}
      />

      {/* Gentle sway after growing */}
      <motion.g
        animate={{ rotate: [0, lean > 0 ? 2 : -2, 0, lean > 0 ? -1 : 1, 0] }}
        transition={{ delay: delay + 1.1, duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
        style={{ transformOrigin: `${x}px 0px` }}
      />
    </motion.g>
  );
}

/* ─── Ground line with rising grass tufts ─── */
function Ground({ width }) {
  return (
    <g>
      {/* Soil gradient bar */}
      <motion.rect
        x={0} y={0} width={width} height={18}
        fill="url(#soilGrad)"
        rx={0}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ transformOrigin: '50% 0%' }}
      />
      {/* Ground line */}
      <motion.line
        x1={-20} y1={0} x2={width + 20} y2={0}
        stroke="#166534"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </g>
  );
}

/* ─── Floating particle (dust / pollen) ─── */
function Particle({ cx, cy, delay, r = 2 }) {
  return (
    <motion.circle
      cx={cx} cy={cy} r={r}
      fill="#bbf7d0"
      opacity={0}
      animate={{
        opacity: [0, 0.7, 0],
        cy: [cy, cy - 40, cy - 80],
        cx: [cx, cx + (Math.random() > 0.5 ? 15 : -15), cx + (Math.random() > 0.5 ? 25 : -25)],
      }}
      transition={{ delay, duration: 2.2, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.5 }}
    />
  );
}

/* ─── Sun rising ─── */
function Sun() {
  return (
    <motion.g>
      <motion.circle
        cx={340} cy={-60} r={36}
        fill="url(#sunGrad)"
        initial={{ cy: -60, opacity: 0 }}
        animate={{ cy: 60, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Rays */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        return (
          <motion.line
            key={i}
            x1={340 + Math.cos(angle) * 44}
            y1={60 + Math.sin(angle) * 44}
            x2={340 + Math.cos(angle) * 58}
            y2={60 + Math.sin(angle) * 58}
            stroke="#fde68a"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: 1.6 + i * 0.05, duration: 0.3 }}
            style={{ transformOrigin: '340px 60px' }}
          />
        );
      })}
    </motion.g>
  );
}

/* ─── App name reveal ─── */
function AppNameReveal() {
  const letters = 'AgroSense'.split('');
  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 0, right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {/* Letter-by-letter reveal */}
      <div style={{ display: 'flex', gap: 1 }}>
        {letters.map((l, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + i * 0.07, duration: 0.4, ease: 'easeOut' }}
            style={{
              fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
              fontSize: '2.4rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              textShadow: '0 4px 24px rgba(0,0,0,0.25)',
            }}
          >
            {l}
          </motion.span>
        ))}
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '0.85rem',
          fontWeight: 500,
          color: '#86efac',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        AI-Powered Smart Farming
      </motion.p>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.3 }}
        style={{ marginTop: 16, width: 120, height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 2.5, duration: 1.1, ease: 'easeInOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #4ade80, #22c55e)', borderRadius: 2 }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Stalk configuration ─── */
const stalks = [
  { x: 30,  delay: 0.3,  height: 90,  lean: -6,  scale: 0.85 },
  { x: 70,  delay: 0.5,  height: 115, lean: 4,   scale: 1.0  },
  { x: 110, delay: 0.2,  height: 100, lean: -3,  scale: 0.9  },
  { x: 150, delay: 0.65, height: 125, lean: 6,   scale: 1.05 },
  { x: 190, delay: 0.1,  height: 108, lean: -5,  scale: 0.95 },
  { x: 230, delay: 0.45, height: 118, lean: 3,   scale: 1.0  },
  { x: 270, delay: 0.35, height: 130, lean: -4,  scale: 1.1  },
  { x: 310, delay: 0.55, height: 105, lean: 5,   scale: 0.92 },
  { x: 355, delay: 0.25, height: 120, lean: -6,  scale: 1.0  },
  { x: 395, delay: 0.7,  height: 95,  lean: 4,   scale: 0.88 },
];

const particles = [
  { cx: 80,  cy: -80, delay: 1.5, r: 2 },
  { cx: 160, cy: -95, delay: 2.0, r: 1.5 },
  { cx: 240, cy: -75, delay: 1.8, r: 2.5 },
  { cx: 320, cy: -85, delay: 2.3, r: 1.5 },
  { cx: 200, cy: -60, delay: 2.6, r: 2 },
];

/* ─── Main export ─── */
export default function IntroAnimation() {
  const W = 420;
  const groundY = 200; // y coordinate of ground within SVG viewbox (0-320)

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(170deg, #052e16 0%, #14532d 45%, #166534 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial glow behind field */}
      <div style={{
        position: 'absolute',
        bottom: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: 600, height: 300,
        background: 'radial-gradient(ellipse, rgba(74,222,128,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* SVG scene */}
      <svg
        viewBox={`0 0 ${W} 320`}
        width="100%"
        style={{ maxWidth: 520, position: 'absolute', bottom: '15%' }}
        overflow="visible"
      >
        <defs>
          <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#166534" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#14532d" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* Sun */}
        <Sun />

        {/* Ground */}
        <g transform={`translate(0, ${groundY})`}>
          <Ground width={W} />
        </g>

        {/* Stalks — rendered below ground line, growing upward */}
        <g transform={`translate(0, ${groundY})`}>
          {stalks.map((s, i) => (
            <WheatStalk key={i} {...s} />
          ))}
          {/* Floating pollen particles */}
          {particles.map((p, i) => (
            <Particle key={i} {...p} />
          ))}
        </g>
      </svg>

      {/* App name + tagline + progress bar */}
      <AppNameReveal />
    </motion.div>
  );
}
