const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Failed: ${error.message}`);
    console.error('   Server will continue without database.');
    // Do NOT call process.exit(1) — let the server run without DB
  }
};

module.exports = connectDB;
