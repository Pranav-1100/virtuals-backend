module.exports = (sequelize, DataTypes) => {
    const Friendship = sequelize.define('Friendship', {
    }, {
      tableName: 'Friendships'
    });
  
    Friendship.associate = function(models) {
      models.User.belongsToMany(models.User, { 
        through: Friendship,
        as: 'Friends',
        foreignKey: 'userId',
        otherKey: 'friendId'
      });
    };
  
    return Friendship;
  };