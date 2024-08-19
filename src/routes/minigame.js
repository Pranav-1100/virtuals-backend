const express = require('express');
const MinigameService = require('../services/minigameService');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/start', auth, async (req, res) => {
  try {
    const gameState = await MinigameService.startMinigame(req.user.id, req.body.gameType);
    res.json(gameState);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/submit', auth, async (req, res) => {
  try {
    const result = await MinigameService.submitMinigameResult(req.user.id, req.body.gameType, req.body.result);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;