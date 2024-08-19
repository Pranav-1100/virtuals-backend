module.exports = (sequelize, DataTypes) => {
    const Friendship = sequelize.define('Friendship', {
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      friendId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    });
  
    return Friendship;
  };