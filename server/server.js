const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables BEFORE importing db (pool reads process.env)
dotenv.config({ path: path.join(__dirname, '.env') });

const pool = require('./config/db');

// Test PostgreSQL connection (non-blocking) & sync sequences
pool.query('SELECT 1', (err) => {
  if (err) {
    console.log('⚠️  PostgreSQL connection test failed:', err.message);
  } else {
    console.log('✅ PostgreSQL connected successfully');
    // Sync the farmers id sequence so auto-increment never collides with existing rows
    pool.query(
      `SELECT setval('farmers_id_seq', COALESCE((SELECT MAX(id) FROM farmers), 0) + 1, false)`,
      (seqErr) => {
        if (seqErr) console.log('⚠️  Could not sync farmers_id_seq:', seqErr.message);
        else console.log('✅ farmers_id_seq synced');
      }
    );

    // Ensure reset token columns exist (idempotent)
    pool.query(
      `ALTER TABLE farmers ADD COLUMN IF NOT EXISTS reset_token TEXT, ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMPTZ`,
      (colErr) => {
        if (colErr) console.log('⚠️  Could not ensure reset columns:', colErr.message);
        else console.log('✅ reset_token columns ready');
      }
    );
  }
});

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --------------- API Routes ---------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/tutorials', require('./routes/tutorialRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/weather-station', require('./routes/weatherStationRoutes'));
app.use('/api/station', require('./routes/weatherStationRoutes'));
app.use('/api/translate', require('./routes/translateRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/crop-health', require('./routes/cropHealthRoutes'));

// --------------- Health Check ---------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Smart Farming Platform API is running',
    timestamp: new Date().toISOString(),
  });
});

// --------------- 404 Handler ---------------
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// --------------- Global Error Handler ---------------
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// --------------- Start Server with Auto-Retry ---------------
const PREFERRED_PORT = parseInt(process.env.PORT, 10) || 5001;
const MAX_PORT_RETRIES = 5;

function startServer(port, retries) {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${port} is already in use.`);
      if (retries > 0) {
        const nextPort = port + 1;
        console.log(`   Trying port ${nextPort}...`);
        startServer(nextPort, retries - 1);
      } else {
        console.error(`❌ Could not find an available port after ${MAX_PORT_RETRIES} attempts.`);
        console.error(`   Kill the process using port ${PREFERRED_PORT}:  npx kill-port ${PREFERRED_PORT}`);
        console.error('   Or change PORT in your .env file.');
      }
    } else {
      console.error('❌ Server error:', err.message);
    }
  });
}

startServer(PREFERRED_PORT, MAX_PORT_RETRIES);
