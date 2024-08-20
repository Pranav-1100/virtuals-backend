const express = require('express');
const PetService = require('../services/petService');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const pet = await PetService.createPet(req.user.id, req.body);
    res.status(201).json(pet);
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const pet = await PetService.getPet(req.user.id);
    res.json(pet);
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(404).json({ error: error.message });
  }
});

router.post('/interact', auth, async (req, res) => {
  try {
    const result = await PetService.interact(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error interacting with pet:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/status', auth, async (req, res) => {
  try {
    const status = await PetService.getStatus(req.user.id);
    res.json(status);
  } catch (error) {
    console.error('Error getting pet status:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;