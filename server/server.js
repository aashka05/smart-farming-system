const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables BEFORE importing db (pool reads process.env)
dotenv.config({ path: path.join(__dirname, '.env') });

const pool = require('./config/db');

// Test PostgreSQL connection (non-blocking)
pool.query('SELECT 1', (err) => {
  if (err) {
    console.log('⚠️  PostgreSQL connection test failed:', err.message);
  } else {
    console.log('✅ PostgreSQL connected successfully');
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

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Kill the other process or change PORT in .env`);
    console.error('   Run:  npx kill-port ' + PORT + '  OR  change PORT in .env');
  } else {
    console.error('❌ Server error:', err.message);
  }
  // Do NOT call process.exit — let nodemon handle restart
});
