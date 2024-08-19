module.exports = (sequelize, DataTypes) => {
    const Minigame = sequelize.define('Minigame', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      petId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      gameType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      state: {
        type: DataTypes.JSON,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('in_progress', 'completed', 'abandoned'),
        defaultValue: 'in_progress'
      },
      result: {
        type: DataTypes.JSON,
        allowNull: true
      }
    });
  
    return Minigame;
  };