const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const { sequelize } = require('../config/database');
const db = {};

// Read all model files
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Define additional associations
db.Pet.belongsTo(db.User);
db.User.hasMany(db.Pet);

db.Inventory.belongsTo(db.User, { foreignKey: 'userId' });
db.Inventory.belongsTo(db.Item, { foreignKey: 'itemId' });
db.User.hasMany(db.Inventory, { foreignKey: 'userId' });
db.Item.hasMany(db.Inventory, { foreignKey: 'itemId' });

db.Pet.hasMany(db.Playdate, { as: 'Playdates1', foreignKey: 'petId1' });
db.Pet.hasMany(db.Playdate, { as: 'Playdates2', foreignKey: 'petId2' });
db.Playdate.belongsTo(db.Pet, { as: 'Pet1', foreignKey: 'petId1' });
db.Playdate.belongsTo(db.Pet, { as: 'Pet2', foreignKey: 'petId2' });

db.Minigame.belongsTo(db.User);
db.User.hasMany(db.Minigame);
db.Pet.hasMany(db.Minigame);
db.Minigame.belongsTo(db.Pet);

db.UserAchievement.belongsTo(db.User);
db.Achievement.hasMany(db.UserAchievement);
db.UserAchievement.belongsTo(db.Achievement);

// Add Friendship associations
db.User.belongsToMany(db.User, { 
  as: 'Friendships',
  through: db.Friendship,
  foreignKey: 'userId',
  otherKey: 'friendId'
});

db.User.belongsToMany(db.User, {
  as: 'FriendOf',
  through: db.Friendship,
  foreignKey: 'friendId',
  otherKey: 'userId'
});

// Add Sequelize instance to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;