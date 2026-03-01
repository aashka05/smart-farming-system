const express = require('express');
const router = express.Router();
const { chat, getSuggestions } = require('../controllers/chatController');

router.post('/', chat);
router.get('/suggestions', getSuggestions);

module.exports = router;
