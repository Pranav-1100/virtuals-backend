const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const { sequelize } = require('../config/database');
const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Define associations that can't be defined in the model files
db.Pet.belongsTo(db.User);
// db.Inventory.belongsTo(db.User);
// db.Item.hasMany(db.Inventory);
// db.Inventory.belongsTo(db.Item);
db.Pet.hasMany(db.Playdate, { as: 'Playdates1', foreignKey: 'petId1' });
db.Pet.hasMany(db.Playdate, { as: 'Playdates2', foreignKey: 'petId2' });
db.Playdate.belongsTo(db.Pet, { as: 'Pet1', foreignKey: 'petId1' });
db.Playdate.belongsTo(db.Pet, { as: 'Pet2', foreignKey: 'petId2' });
db.Minigame.belongsTo(db.User);
db.Pet.hasMany(db.Minigame);
db.Minigame.belongsTo(db.Pet);
db.UserAchievement.belongsTo(db.User);
db.Achievement.hasMany(db.UserAchievement);
db.UserAchievement.belongsTo(db.Achievement);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;