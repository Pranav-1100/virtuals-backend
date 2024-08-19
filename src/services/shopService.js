const { Item, Inventory, User } = require('../models');

class ShopService {
  static async getShopItems() {
    return await Item.findAll();
  }

  static async buyItem(userId, itemId) {
    const user = await User.findByPk(userId);
    const item = await Item.findByPk(itemId);

    if (!user || !item) {
      throw new Error('User or item not found');
    }

    if (user.experience < item.price) {
      throw new Error('Not enough experience points to buy this item');
    }

    user.experience -= item.price;
    await user.save();

    const [inventoryItem, created] = await Inventory.findOrCreate({
      where: { userId, itemId },
      defaults: { quantity: 0 }
    });

    inventoryItem.quantity += 1;
    await inventoryItem.save();

    return { user, item, inventoryItem };
  }
}

module.exports = ShopService;