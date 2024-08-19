module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define('Inventory', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      itemId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    });
  
    return Inventory;
  };