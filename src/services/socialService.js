const { User, Pet, Friendship, Playdate } = require('../models');
const { Op } = require('sequelize');

class SocialService {
  static async getFriends(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: 'Friends',
          through: { attributes: [] },
          include: [{ model: Pet, attributes: ['id', 'name', 'species'] }]
        }
      ]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.Friends;
  }

  static async addFriend(userId, friendId) {
    const user = await User.findByPk(userId);
    const friend = await User.findByPk(friendId);

    if (!user || !friend) {
      throw new Error('User or friend not found');
    }

    if (userId === friendId) {
      throw new Error('Cannot add yourself as a friend');
    }

    const existingFriendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId }
        ]
      }
    });

    if (existingFriendship) {
      throw new Error('Friendship already exists');
    }

    await Friendship.create({ userId, friendId });
    return { user, friend };
  }

  static async removeFriend(userId, friendId) {
    const friendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId }
        ]
      }
    });

    if (!friendship) {
      throw new Error('Friendship not found');
    }

    await friendship.destroy();
    return { message: 'Friend removed successfully' };
  }

  static async getPetPlaydates(petId) {
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      throw new Error('Pet not found');
    }

    const upcomingPlaydates = await Playdate.findAll({
      where: {
        [Op.or]: [{ petId1: petId }, { petId2: petId }],
        scheduledAt: { [Op.gt]: new Date() }
      },
      include: [
        { model: Pet, as: 'Pet1', attributes: ['id', 'name', 'species'] },
        { model: Pet, as: 'Pet2', attributes: ['id', 'name', 'species'] }
      ],
      order: [['scheduledAt', 'ASC']]
    });

    return upcomingPlaydates;
  }

  static async schedulePetPlaydate(petId1, petId2, scheduledAt) {
    const pet1 = await Pet.findByPk(petId1);
    const pet2 = await Pet.findByPk(petId2);

    if (!pet1 || !pet2) {
      throw new Error('One or both pets not found');
    }

    if (petId1 === petId2) {
      throw new Error('A pet cannot have a playdate with itself');
    }

    const existingPlaydate = await Playdate.findOne({
      where: {
        [Op.or]: [
          { petId1, petId2 },
          { petId1: petId2, petId2: petId1 }
        ],
        scheduledAt
      }
    });

    if (existingPlaydate) {
      throw new Error('A playdate already exists for these pets at this time');
    }

    const playdate = await Playdate.create({ petId1, petId2, scheduledAt });
    return playdate;
  }

  static async getFriendSuggestions(userId) {
    const user = await User.findByPk(userId, {
      include: [{ model: User, as: 'Friends' }]
    });

    if (!user) {
      throw new Error('User not found');
    }

    const friendIds = user.Friends.map(friend => friend.id);
    friendIds.push(userId); // Include the user's own ID

    const suggestions = await User.findAll({
      where: {
        id: { [Op.notIn]: friendIds }
      },
      limit: 10,
      include: [{ model: Pet, attributes: ['id', 'name', 'species'] }]
    });

    return suggestions;
  }

  static async getPetSocialFeed(petId) {
    const pet = await Pet.findByPk(petId, {
      include: [{ model: User, include: [{ model: User, as: 'Friends' }] }]
    });

    if (!pet) {
      throw new Error('Pet not found');
    }

    const friendPetIds = pet.User.Friends.map(friend => friend.Pet.id);
    
    const socialFeed = await Pet.findAll({
      where: { id: { [Op.in]: friendPetIds } },
      include: [
        { model: User, attributes: ['id', 'username'] },
        { 
          model: Playdate,
          as: 'Playdates1',
          include: [{ model: Pet, as: 'Pet2', attributes: ['id', 'name', 'species'] }]
        },
        { 
          model: Playdate,
          as: 'Playdates2',
          include: [{ model: Pet, as: 'Pet1', attributes: ['id', 'name', 'species'] }]
        }
      ],
      order: [['updatedAt', 'DESC']],
      limit: 20
    });

    return socialFeed;
  }
}

module.exports = SocialService;