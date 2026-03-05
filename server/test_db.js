require('dotenv').config({ path: '.env' });
const pool = require('./config/db');

(async () => {
  try {
    const r = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );
    console.log('Tables:', r.rows.map(row => row.table_name));

    for (const t of r.rows) {
      try {
        const c = await pool.query('SELECT COUNT(*) as cnt FROM ' + t.table_name);
        console.log('  ' + t.table_name + ': ' + c.rows[0].cnt + ' rows');
      } catch (e) {
        console.log('  ' + t.table_name + ': ERROR - ' + e.message);
      }
    }
    process.exit(0);
  } catch (e) {
    console.error('Connection error:', e.message);
    process.exit(1);
  }
})();
