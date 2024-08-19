module.exports = (sequelize, DataTypes) => {
    const Friendship = sequelize.define('Friendship', {
    }, {
      tableName: 'Friendships'
    });
  
    return Friendship;
  };