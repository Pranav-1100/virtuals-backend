module.exports = (sequelize, DataTypes) => {
    const Playdate = sequelize.define('Playdate', {
      petId1: {
        type: DataTypes.UUID,
        allowNull: false
      },
      petId2: {
        type: DataTypes.UUID,
        allowNull: false
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
        defaultValue: 'scheduled'
      }
    });
  
    return Playdate;
  };