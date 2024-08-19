module.exports = (sequelize, DataTypes) => {
    const Pet = sequelize.define('Pet', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      species: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mood: {
        type: DataTypes.ENUM('ecstatic', 'happy', 'neutral', 'sad', 'angry'),
        defaultValue: 'neutral'
      },
      health: {
        type: DataTypes.INTEGER,
        defaultValue: 100
      },
      hunger: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      energy: {
        type: DataTypes.INTEGER,
        defaultValue: 100
      },
      cleanliness: {
        type: DataTypes.INTEGER,
        defaultValue: 100
      },
      intelligence: {
        type: DataTypes.INTEGER,
        defaultValue: 50
      },
      experience: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      personality: {
        type: DataTypes.JSON,
        defaultValue: {}
      },
      abilities: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
      },
      lastInteraction: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    });
  
    return Pet;
  };
  