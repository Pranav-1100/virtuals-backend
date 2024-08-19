const { Pet, User } = require('../models');

class MinigameService {
  static async startMinigame(userId, gameType) {
    const pet = await PetService.getPet(userId);


    const gameState = this.initializeGameState(gameType, pet);

    return gameState;
  }

  static async submitMinigameResult(userId, gameType, result) {
    const pet = await PetService.getPet(userId);
    const user = await User.findByPk(userId);

    pet.experience += result.petExperience;
    user.experience += result.userExperience;

    await pet.save();
    await user.save();

    return { pet, user, result };
  }

  static initializeGameState(gameType, pet) {
    return {
      gameType,
      petStats: {
        intelligence: pet.intelligence,
        energy: pet.energy
      },
    };
  }
}

module.exports = MinigameService;