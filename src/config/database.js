const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false
});

const initDatabase = async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      await sequelize.sync({ force: true }); // This will drop and recreate all tables
      console.log('Database synchronized');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };

module.exports = { sequelize, initDatabase };