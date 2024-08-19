const express = require('express');
const AchievementService = require('../services/achievementService');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const achievements = await AchievementService.getUserAchievements(req.user.id);
    res.json(achievements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;