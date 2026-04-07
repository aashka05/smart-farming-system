const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Ensure search_path is set for every new client connection
pool.on('connect', (client) => {
  client.query('SET search_path TO public');
});

// Handle idle-client errors so the process doesn't crash
pool.on('error', (err) => {
  console.error('⚠️  Unexpected PostgreSQL pool error:', err.message);
});

module.exports = pool;