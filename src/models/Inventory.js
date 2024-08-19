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
    }, {
      tableName: 'Inventories'
    });
  
    Inventory.associate = function(models) {
      Inventory.belongsTo(models.User, { 
        foreignKey: { 
          name: 'userId',
          allowNull: false
        },
        as: 'user'
      });
      Inventory.belongsTo(models.Item, { 
        foreignKey: { 
          name: 'itemId',
          allowNull: false
        },
        as: 'item'
      });
    };
  
    return Inventory;
  };