const express = require('express');
const router = express.Router();
const { getTutorials, getTutorialById } = require('../controllers/tutorialController');

router.get('/', getTutorials);
router.get('/:id', getTutorialById);

module.exports = router;
