const { Pet, User, Minigame } = require('../models');
const PetService = require('./petService');

class MinigameService {
  static async startMinigame(userId, gameType) {
    const pet = await PetService.getPet(userId);
    const gameState = this.initializeGameState(gameType, pet);
    
    const minigame = await Minigame.create({
      userId,
      petId: pet.id,
      gameType,
      state: gameState,
      status: 'in_progress'
    });

    return { gameId: minigame.id, gameState };
  }

  static async submitMinigameResult(userId, gameId, result) {
    const minigame = await Minigame.findOne({ where: { id: gameId, userId } });
    if (!minigame) {
      throw new Error('Minigame not found');
    }

    const pet = await PetService.getPet(userId);
    const user = await User.findByPk(userId);

    const gameResult = this.processGameResult(minigame.gameType, result, pet);

    // Update pet stats
    pet.experience += gameResult.petExperience;
    pet.intelligence += gameResult.intelligenceGain;
    pet.energy = Math.max(0, pet.energy - gameResult.energyCost);

    // Update user experience
    user.experience += gameResult.userExperience;

    // Update minigame status
    minigame.status = 'completed';
    minigame.result = gameResult;

    await pet.save();
    await user.save();
    await minigame.save();

    return { pet, user, gameResult };
  }

  static initializeGameState(gameType, pet) {
    switch (gameType) {
      case 'puzzleSolver':
        return {
          gameType,
          difficulty: Math.floor(pet.intelligence / 20) + 1,
          timeLimit: 60,
          puzzleElements: this.generatePuzzleElements(pet.intelligence)
        };
      case 'memoryMaster':
        return {
          gameType,
          gridSize: Math.min(6, Math.floor(pet.intelligence / 15) + 2),
          pairs: Math.min(18, Math.floor(pet.intelligence / 10) + 6),
          timeLimit: 120
        };
      case 'agilityChallenge':
        return {
          gameType,
          obstacles: Math.min(10, Math.floor(pet.energy / 10) + 3),
          speed: Math.min(5, Math.floor(pet.energy / 20) + 1),
          timeLimit: 60
        };
      case 'vocabBuilder':
        return {
          gameType,
          wordCount: Math.min(20, Math.floor(pet.intelligence / 5) + 5),
          difficulty: Math.floor(pet.intelligence / 25) + 1,
          timeLimit: 90
        };
      default:
        throw new Error('Invalid game type');
    }
  }

  static processGameResult(gameType, result, pet) {
    let gameResult = {
      success: result.success,
      score: result.score,
      petExperience: 0,
      userExperience: 0,
      intelligenceGain: 0,
      energyCost: 0
    };

    switch (gameType) {
      case 'puzzleSolver':
        gameResult.petExperience = result.success ? 50 : 10;
        gameResult.userExperience = result.success ? 25 : 5;
        gameResult.intelligenceGain = result.success ? 2 : 1;
        gameResult.energyCost = 10;
        break;
      case 'memoryMaster':
        gameResult.petExperience = Math.floor(result.score / 2);
        gameResult.userExperience = Math.floor(result.score / 4);
        gameResult.intelligenceGain = Math.floor(result.score / 50);
        gameResult.energyCost = 15;
        break;
      case 'agilityChallenge':
        gameResult.petExperience = result.success ? 60 : 15;
        gameResult.userExperience = result.success ? 30 : 8;
        gameResult.energyCost = 20;
        break;
      case 'vocabBuilder':
        gameResult.petExperience = result.score * 3;
        gameResult.userExperience = result.score;
        gameResult.intelligenceGain = Math.floor(result.score / 10);
        gameResult.energyCost = 12;
        break;
      default:
        throw new Error('Invalid game type');
    }

    return gameResult;
  }

  static generatePuzzleElements(intelligence) {
    return Array(Math.floor(intelligence / 10) + 5).fill().map(() => ({
      type: ['shape', 'color', 'number'][Math.floor(Math.random() * 3)],
      value: Math.floor(Math.random() * 10)
    }));
  }

  static async getMinigameHistory(userId) {
    return await Minigame.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
  }
}

module.exports = MinigameService;