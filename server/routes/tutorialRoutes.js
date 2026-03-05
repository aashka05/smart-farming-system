const express = require('express');
const router = express.Router();
const { getTutorials, getTutorialById, getPlaylistVideos } = require('../controllers/tutorialController');

router.get('/playlist', getPlaylistVideos);
router.get('/', getTutorials);
router.get('/:id', getTutorialById);

module.exports = router;
