module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('Item', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('food', 'toy', 'accessory'),
        allowNull: false
      },
      effect: {
        type: DataTypes.JSON,
        allowNull: false
      },
      rarity: {
        type: DataTypes.ENUM('common', 'uncommon', 'rare', 'legendary'),
        defaultValue: 'common'
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    return Item;
  };