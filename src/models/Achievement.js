module.exports = (sequelize, DataTypes) => {
    const Achievement = sequelize.define('Achievement', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      criteria: {
        type: DataTypes.JSON,
        allowNull: false
      },
      reward: {
        type: DataTypes.JSON,
        allowNull: false
      }
    });
  
    return Achievement;
  };