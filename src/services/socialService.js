const { User, Pet } = require('../models');

class SocialService {
  static async getFriends(userId) {
    const user = await User.findByPk(userId, {
      include: [{ model: User, as: 'Friends' }]
    });
    return user.Friends;
  }

  static async addFriend(userId, friendId) {
    const user = await User.findByPk(userId);
    const friend = await User.findByPk(friendId);

    if (!user || !friend) {
      throw new Error('User or friend not found');
    }

    await user.addFriend(friend);
    return { user, friend };
  }

  static async getPetPlaydates(petId) {
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      throw new Error('Pet not found');
    }
    return [];
  }
}

module.exports = SocialService;