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
      await sequelize.query('DROP TABLE IF EXISTS Minigames');
      await sequelize.query('DROP TABLE IF EXISTS UserAchievements');
      await sequelize.query('DROP TABLE IF EXISTS Achievements');
      await sequelize.query('DROP TABLE IF EXISTS Playdates');
      await sequelize.query('DROP TABLE IF EXISTS Inventories');
      await sequelize.query('DROP TABLE IF EXISTS Items');
      await sequelize.query('DROP TABLE IF EXISTS Pets');
      await sequelize.query('DROP TABLE IF EXISTS Users');
      await sequelize.query('DROP TABLE IF EXISTS Friendships');
  
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
        CREATE TABLE Pets (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          species VARCHAR(255) NOT NULL,
          mood TEXT DEFAULT 'neutral',
          health INTEGER DEFAULT 100,
          hunger INTEGER DEFAULT 0,
          energy INTEGER DEFAULT 100,
          cleanliness INTEGER DEFAULT 100,
          intelligence INTEGER DEFAULT 50,
          experience INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          personality TEXT DEFAULT '{}',
          abilities TEXT DEFAULT '[]',
          lastInteraction DATETIME,
          userId UUID NOT NULL,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (userId) REFERENCES Users(id)
        )
      `);
  
      await sequelize.query(`
        CREATE TABLE Items (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type TEXT NOT NULL,
          effect TEXT NOT NULL,
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
  
      await sequelize.query(`
        CREATE TABLE Playdates (
          id UUID PRIMARY KEY,
          petId1 UUID NOT NULL,
          petId2 UUID NOT NULL,
          status TEXT DEFAULT 'pending',
          scheduledTime DATETIME,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (petId1) REFERENCES Pets(id),
          FOREIGN KEY (petId2) REFERENCES Pets(id)
        )
      `);
  
      await sequelize.query(`
        CREATE TABLE Achievements (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          criteria TEXT,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL
        )
      `);
  
      await sequelize.query(`
        CREATE TABLE UserAchievements (
          id UUID PRIMARY KEY,
          userId UUID NOT NULL,
          achievementId UUID NOT NULL,
          unlockedAt DATETIME NOT NULL,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (userId) REFERENCES Users(id),
          FOREIGN KEY (achievementId) REFERENCES Achievements(id)
        )
      `);
  
      await sequelize.query(`
        CREATE TABLE Minigames (
          id UUID PRIMARY KEY,
          userId UUID NOT NULL,
          petId UUID NOT NULL,
          gameType VARCHAR(255) NOT NULL,
          state TEXT NOT NULL,
          status VARCHAR(20) DEFAULT 'in_progress',
          result TEXT,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (userId) REFERENCES Users(id),
          FOREIGN KEY (petId) REFERENCES Pets(id)
        )
      `);

      await sequelize.query(`
      CREATE TABLE Friendships (
        id UUID PRIMARY KEY,
        userId UUID NOT NULL,
        friendId UUID NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id),
        FOREIGN KEY (friendId) REFERENCES Users(id)
      )
    `);

    await sequelize.query(`
        CREATE TABLE Interactions (
          id UUID PRIMARY KEY,
          petId UUID NOT NULL,
          type VARCHAR(255) NOT NULL,
          details TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (petId) REFERENCES Pets(id)
        )
      `);
  
      console.log('Database tables created manually');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  };
  
  module.exports = { sequelize, initDatabase };