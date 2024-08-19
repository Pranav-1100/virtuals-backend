const express = require('express');
const ShopService = require('../services/shopService');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const items = await ShopService.getShopItems();
    res.json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/buy', auth, async (req, res) => {
  try {
    const result = await ShopService.buyItem(req.user.id, req.body.itemId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;