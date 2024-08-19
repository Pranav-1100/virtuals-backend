const { Inventory, Item } = require('../models');
const PetService = require('./petService');

class InventoryService {
  static async getInventory(userId) {
    return await Inventory.findAll({
      where: { userId },
      include: [{ model: Item }]
    });
  }

  static async useItem(userId, itemId) {
    const inventoryItem = await Inventory.findOne({
      where: { userId, itemId },
      include: [{ model: Item }]
    });

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      throw new Error('Item not available in inventory');
    }

    const pet = await PetService.getPet(userId);
    const item = inventoryItem.Item;

    // Apply item effects
    Object.entries(item.effect).forEach(([stat, value]) => {
      if (pet[stat] !== undefined) {
        pet[stat] = Math.min(100, Math.max(0, pet[stat] + value));
      }
    });

    await pet.save();

    // Reduce item quantity
    inventoryItem.quantity -= 1;
    await inventoryItem.save();

    return { pet, inventoryItem };
  }
}

module.exports = InventoryService;