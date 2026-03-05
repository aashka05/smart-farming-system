require('dotenv').config({ path: '.env' });
const pool = require('./config/db');

async function test() {
  try {
    // Check table counts
    const farmers = await pool.query('SELECT COUNT(*) FROM farmers');
    const detections = await pool.query('SELECT COUNT(*) FROM disease_detections');
    const chats = await pool.query('SELECT COUNT(*) FROM chatbot_logs');
    
    console.log('farmers:', farmers.rows[0].count);
    console.log('detections:', detections.rows[0].count);
    console.log('chats:', chats.rows[0].count);
    
    // Check disease_detections columns
    const cols = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='disease_detections' ORDER BY ordinal_position"
    );
    console.log('disease_detections columns:', cols.rows.map(r => r.column_name).join(', '));
    
    // Check chatbot_logs columns
    const chatCols = await pool.query(
      "SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name='chatbot_logs' ORDER BY ordinal_position"
    );
    console.log('chatbot_logs columns:', chatCols.rows.map(r => `${r.column_name}(nullable:${r.is_nullable})`).join(', '));
    
    // Check if field_id is now nullable
    const fieldIdNull = await pool.query(
      "SELECT is_nullable FROM information_schema.columns WHERE table_name='disease_detections' AND column_name='field_id'"
    );
    console.log('field_id nullable:', fieldIdNull.rows[0]?.is_nullable);
    
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

test();
