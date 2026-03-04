const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});
process.on('exit', (code) => {
  console.error('PROCESS EXIT with code:', code);
  console.trace('Exit trace');
});

console.log('Step 1: Loading express...');
const express = require('express');
const app = express();

console.log('Step 2: Loading routes...');
try {
  require('./routes/authRoutes');
  console.log('  authRoutes OK');
} catch(e) { console.error('  authRoutes FAIL:', e.message); }
try {
  require('./routes/weatherRoutes');
  console.log('  weatherRoutes OK');
} catch(e) { console.error('  weatherRoutes FAIL:', e.message); }
try {
  require('./routes/cropRoutes');
  console.log('  cropRoutes OK');
} catch(e) { console.error('  cropRoutes FAIL:', e.message); }
try {
  require('./routes/marketRoutes');
  console.log('  marketRoutes OK');
} catch(e) { console.error('  marketRoutes FAIL:', e.message); }
try {
  require('./routes/tutorialRoutes');
  console.log('  tutorialRoutes OK');
} catch(e) { console.error('  tutorialRoutes FAIL:', e.message); }
try {
  require('./routes/chatRoutes');
  console.log('  chatRoutes OK');
} catch(e) { console.error('  chatRoutes FAIL:', e.message); }
try {
  require('./routes/weatherStationRoutes');
  console.log('  weatherStationRoutes OK');
} catch(e) { console.error('  weatherStationRoutes FAIL:', e.message); }
try {
  require('./routes/translateRoutes');
  console.log('  translateRoutes OK');
} catch(e) { console.error('  translateRoutes FAIL:', e.message); }
try {
  require('./routes/dashboardRoutes');
  console.log('  dashboardRoutes OK');
} catch(e) { console.error('  dashboardRoutes FAIL:', e.message); }

console.log('Step 3: Starting listener...');
const server = app.listen(5002, () => {
  console.log('Step 4: Listening on port 5002');
});
server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
});

console.log('Step 5: Script end reached, event loop should keep running...');
