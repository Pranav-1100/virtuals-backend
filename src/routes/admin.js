const express = require('express');
const { Achievement } = require('../models');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Add a new achievement
router.post('/achievements', auth, adminAuth, async (req, res) => {
  try {
    const { name, description, criteria, reward } = req.body;
    const achievement = await Achievement.create({
      name,
      description,
      criteria: JSON.stringify(criteria),
      reward: JSON.stringify(reward)
    });
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all achievements
router.get('/achievements', auth, adminAuth, async (req, res) => {
  try {
    const achievements = await Achievement.findAll();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an achievement
router.put('/achievements/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, description, criteria, reward } = req.body;
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    achievement.name = name;
    achievement.description = description;
    achievement.criteria = JSON.stringify(criteria);
    achievement.reward = JSON.stringify(reward);
    await achievement.save();
    res.json(achievement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an achievement
router.delete('/achievements/:id', auth, adminAuth, async (req, res) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    await achievement.destroy();
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;