const { Pet, Interaction } = require('../models');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class PetService {
  static async createPet(userId, petData) {
    return await Pet.create({ ...petData, userId });
  }

  static async getPet(userId) {
    const pet = await Pet.findOne({ where: { userId } });
    if (!pet) throw new Error('Pet not found');
    return pet;
  }

  static async interact(userId, { action, itemId }) {
    const pet = await this.getPet(userId);
    let interactionDetails;

    switch (action) {
      case 'feed':
        pet.hunger = Math.max(0, pet.hunger - 20);
        pet.mood = 'happy';
        interactionDetails = { foodItemId: itemId };
        break;
      case 'play':
        pet.energy = Math.max(0, pet.energy - 20);
        pet.mood = 'happy';
        pet.intelligence += 1;
        interactionDetails = { toyItemId: itemId };
        break;
      case 'sleep':
        pet.energy = Math.min(100, pet.energy + 50);
        interactionDetails = { duration: 'night' };
        break;
      case 'train':
        pet.intelligence += 5;
        pet.energy -= 10;
        interactionDetails = { skill: 'general' };
        break;
      default:
        throw new Error('Invalid action');
    }

    pet.experience += 10;
    if (pet.experience >= 100 * pet.level) {
      pet.level += 1;
      pet.experience = 0;
    }

    pet.lastInteraction = new Date();
    await pet.save();

    await Interaction.create({
      petId: pet.id,
      type: action,
      details: interactionDetails
    });

    return pet;
  }

  static async getStatus(userId) {
    const pet = await this.getPet(userId);
    const prompt = `You are ${pet.name}, a ${pet.species}. Your mood is ${pet.mood}. 
                    Give a short status update based on your current state.`;

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 50
    });

    return {
      ...pet.toJSON(),
      statusUpdate: response.choices[0].text.trim()
    };
  }
}

module.exports = PetService;