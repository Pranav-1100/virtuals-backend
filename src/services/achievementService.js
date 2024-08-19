const { UserAchievement, Achievement } = require('../models');

class AchievementService {
  static async getUserAchievements(userId) {
    return await UserAchievement.findAll({
      where: { userId },
      include: [{ model: Achievement }]
    });
  }
  static async checkAchievements(userId) {
    const achievements = await Achievement.findAll();
    const userAchievements = await this.getUserAchievements(userId);
    const pet = await PetService.getPet(userId);
    const inventory = await InventoryService.getInventory(userId);

    const newAchievements = [];

    for (const achievement of achievements) {
      if (!userAchievements.some(ua => ua.achievementId === achievement.id)) {
        const criteriamet = this.checkCriteria(achievement.criteria, pet, inventory);
        if (criteriamet) {
          await UserAchievement.create({ userId, achievementId: achievement.id });
          newAchievements.push(achievement);
          
          // Apply rewards
          await this.applyRewards(userId, achievement.reward);
        }
      }
    }

    return newAchievements;
  }

  static checkCriteria(criteria, pet, inventory) {
    for (const [key, value] of Object.entries(criteria)) {
      switch (key) {
        case 'petLevel':
          if (pet.level < value) return false;
          break;
        case 'petMood':
          if (pet.mood !== value) return false;
          break;
        case 'petIntelligence':
          if (pet.intelligence < value) return false;
          break;
        case 'inventoryItemCount':
          const itemCount = inventory.reduce((sum, item) => sum + item.quantity, 0);
          if (itemCount < value) return false;
          break;
        case 'specificItemCount':
          const specificItem = inventory.find(item => item.Item.name === value.itemName);
          if (!specificItem || specificItem.quantity < value.count) return false;
          break;
        case 'consecutiveLogins':
          if (pet.User.consecutiveLogins < value) return false;
          break;
        case 'totalPlayTime':
          if (pet.User.totalPlayTime < value) return false;
          break;
        // Add more criteria checks as needed
      }
    }
    return true;
  }

  static async applyRewards(userId, reward) {
    const user = await User.findByPk(userId);
    const pet = await Pet.findOne({ where: { userId } });

    if (reward.item) {
      await InventoryService.addItem(userId, reward.item);
    }
    if (reward.petBoost) {
      await PetService.applyBoost(userId, reward.petBoost);
    }
    if (reward.userExperience) {
      await UserService.addExperience(userId, reward.userExperience);
    }

    if (reward.dimensionalRift) {
      pet.canOpenDimensionalRifts = true;
      await pet.save();
    }
    if (reward.timeManipulation) {
      user.canManipulateTime = true;
      await user.save();
    }
    if (reward.realityWarping) {
      pet.realityWarpingPower = (pet.realityWarpingPower || 0) + reward.realityWarping;
      await pet.save();
    }
    if (reward.cosmicAwareness) {
      pet.cosmicAwarenessLevel = (pet.cosmicAwarenessLevel || 0) + 1;
      await pet.save();
    }
    if (reward.quantumEntanglement) {
      const allPets = await Pet.findAll();
      const randomPet = allPets[Math.floor(Math.random() * allPets.length)];
      pet.quantumEntangledWith = randomPet.id;
      await pet.save();
    }
    if (reward.memeEvolution) {
      pet.memeCreationPower = (pet.memeCreationPower || 0) + reward.memeEvolution;
      await pet.save();
    }
    if (reward.realityGlitch) {
      user.glitchProbability = (user.glitchProbability || 0) + 0.01; // 1% chance to glitch reality
      await user.save();
    }

    console.log(`Rewards applied for user ${userId}`);
  }

}

module.exports = AchievementService;