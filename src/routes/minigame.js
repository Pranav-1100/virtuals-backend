const express = require('express');
const MinigameService = require('../services/minigameService');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/start', auth, async (req, res) => {
  try {
    const { gameType } = req.body;
    const gameState = await MinigameService.startMinigame(req.user.id, gameType);
    res.json(gameState);
  } catch (error) {
    console.error('Error starting minigame:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/submit', auth, async (req, res) => {
  try {
    const { gameId, result } = req.body;
    const gameResult = await MinigameService.submitMinigameResult(req.user.id, gameId, result);
    res.json(gameResult);
  } catch (error) {
    console.error('Error submitting minigame result:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;