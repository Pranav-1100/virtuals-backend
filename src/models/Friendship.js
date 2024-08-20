module.exports = (sequelize, DataTypes) => {
    const Friendship = sequelize.define('Friendship', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      friendId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    }, {
      tableName: 'Friendships'
    });
  
    return Friendship;
  };