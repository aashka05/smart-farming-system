const express = require('express');
const router = express.Router();
const { chat, getSuggestions, logChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', chat);
router.post('/log', protect, logChat);
router.get('/suggestions', getSuggestions);

module.exports = router;
