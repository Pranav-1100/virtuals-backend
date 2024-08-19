const express = require('express');
const SocialService = require('../services/socialService');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/friends', auth, async (req, res) => {
  try {
    const friends = await SocialService.getFriends(req.user.id);
    res.json(friends);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/friends/add', auth, async (req, res) => {
  try {
    const result = await SocialService.addFriend(req.user.id, req.body.friendId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/pet/playdates', auth, async (req, res) => {
  try {
    const pet = await PetService.getPet(req.user.id);
    const playdates = await SocialService.getPetPlaydates(pet.id);
    res.json(playdates);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;