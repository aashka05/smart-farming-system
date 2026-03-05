const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables BEFORE importing db (pool reads process.env)
dotenv.config({ path: path.join(__dirname, '.env') });

const pool = require('./config/db');

// Seed the default admin user (idempotent)
async function seedAdmin() {
  try {
    const email = 'farmlyticswork@gmail.com';
    const existing = await pool.query('SELECT id, role FROM farmers WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      // Ensure existing row has admin role
      if (existing.rows[0].role !== 'admin') {
        await pool.query('UPDATE farmers SET role = $1 WHERE email = $2', ['admin', email]);
        console.log('✅ Existing admin user role updated');
      } else {
        console.log('✅ Admin user already exists');
      }
      return;
    }
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash('farmlytics123', salt);
    await pool.query(
      `INSERT INTO farmers (full_name, email, phone, password_hash, role, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      ['FarmLytics Admin', email, '9427107324', hash, 'admin']
    );
    console.log('✅ Default admin user seeded (farmlyticswork@gmail.com / farmlytics123)');
  } catch (err) {
    console.log('⚠️  Could not seed admin user:', err.message);
  }
}

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

    // Ensure role column exists (idempotent), then seed admin
    pool.query(
      `ALTER TABLE farmers ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'farmer'`,
      (roleErr) => {
        if (roleErr) console.log('⚠️  Could not ensure role column:', roleErr.message);
        else {
          console.log('✅ role column ready');
          seedAdmin();
        }
      }
    );

    // Make disease_detections & chatbot_logs flexible for real-time logging
    pool.query(
      `ALTER TABLE disease_detections ALTER COLUMN field_id DROP NOT NULL;
       ALTER TABLE disease_detections ADD COLUMN IF NOT EXISTS farmer_id INTEGER;
       ALTER TABLE chatbot_logs ALTER COLUMN farmer_id DROP NOT NULL`,
      (flexErr) => {
        if (flexErr) console.log('⚠️  Could not alter detection/chat tables:', flexErr.message);
        else console.log('✅ disease_detections & chatbot_logs schema updated');
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
app.use('/api/admin', require('./routes/adminRoutes'));

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
