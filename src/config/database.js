const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: (msg) => console.log('Sequelize:', msg)
  });
  
  const initDatabase = async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
  
      // Drop existing tables
      await sequelize.query('DROP TABLE IF EXISTS Inventories');
      await sequelize.query('DROP TABLE IF EXISTS Items');
      await sequelize.query('DROP TABLE IF EXISTS Users');
  
      // Create tables manually
      await sequelize.query(`
        CREATE TABLE Users (
          id UUID PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role TEXT DEFAULT 'user',
          experience INTEGER DEFAULT 0,
          lastLogin DATETIME,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL
        )
      `);
  
      await sequelize.query(`
        CREATE TABLE Items (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type TEXT NOT NULL,
          effect JSON NOT NULL,
          rarity TEXT DEFAULT 'common',
          price INTEGER NOT NULL,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL
        )
      `);
  
      await sequelize.query(`
        CREATE TABLE Inventories (
          id UUID PRIMARY KEY,
          quantity INTEGER DEFAULT 1,
          userId UUID NOT NULL,
          itemId UUID NOT NULL,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (userId) REFERENCES Users(id),
          FOREIGN KEY (itemId) REFERENCES Items(id)
        )
      `);
  
      console.log('Database tables created manually');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  };

module.exports = { sequelize, initDatabase };