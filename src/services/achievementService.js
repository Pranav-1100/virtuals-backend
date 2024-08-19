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
    //will work on this later
  }

  static async applyRewards(userId, reward) {
    if (reward.item) {
      await InventoryService.addItem(userId, reward.item);
    }
    if (reward.petBoost) {
      await PetService.applyBoost(userId, reward.petBoost);
    }
    if (reward.userExperience) {
      await UserService.addExperience(userId, reward.userExperience);
    }
  }
}

module.exports = AchievementService;