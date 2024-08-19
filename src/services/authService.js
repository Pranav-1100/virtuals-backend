const { User } = require('../models');
const { sequelize } = require('../config/database');

class AuthService {
  static async register(userData) {
    const t = await sequelize.transaction();
    try {
      const user = await User.create(userData, { transaction: t });
      await t.commit();
      const token = user.generateToken(); // Changed from generateAuthToken to generateToken
      return { user, token };
    } catch (error) {
      await t.rollback();
      console.error('Error during user creation:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Username or email already exists');
      }
      throw error;
    }
  }

  static async login(credentials) {
    const { email, password } = credentials;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      throw new Error('Invalid email or password');
    }
    const token = user.generateToken(); // Changed from generateAuthToken to generateToken
    return { user, token };
  }

  static async registerRaw(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const [results, metadata] = await sequelize.query(`
        INSERT INTO Users (id, username, email, password, role, experience, lastLogin, createdAt, updatedAt)
        VALUES (UUID(), :username, :email, :password, :role, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, {
        replacements: {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: userData.role || 'user'
        }
      });
      console.log('Raw insert result:', results, metadata);
      return results;
    } catch (error) {
      console.error('Error during raw user creation:', error);
      throw error;
    }
  }
}

module.exports = AuthService;