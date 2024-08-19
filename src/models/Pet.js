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
        type: DataTypes.STRING,
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
        type: DataTypes.TEXT,
        defaultValue: '{}'
      },
      abilities: {
        type: DataTypes.TEXT,
        defaultValue: '[]'
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
  
    Pet.associate = function(models) {
      Pet.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Pet;
  };
  