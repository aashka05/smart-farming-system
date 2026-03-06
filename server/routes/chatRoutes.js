const express = require('express');
const router = express.Router();
const { chat, getSuggestions, logChat, getChatHistory, createChatSession, getChatIds } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', chat);
router.post('/log', protect, logChat);
router.get('/suggestions', getSuggestions);
router.get('/history', protect, getChatHistory);
router.post('/session', protect, createChatSession);
router.get('/sessions', protect, getChatIds);

module.exports = router;
