module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define('Inventory', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    });
  
    Inventory.associate = function(models) {
      Inventory.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
          allowNull: false
        }
      });
      Inventory.belongsTo(models.Item, {
        foreignKey: {
          name: 'itemId',
          type: DataTypes.UUID,
          allowNull: false
        }
      });
    };
  
    return Inventory;
  };