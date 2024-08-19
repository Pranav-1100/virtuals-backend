const express = require('express');
const InventoryService = require('../services/inventoryService');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const inventory = await InventoryService.getInventory(req.user.id);
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/use', auth, async (req, res) => {
  try {
    const result = await InventoryService.useItem(req.user.id, req.body.itemId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;