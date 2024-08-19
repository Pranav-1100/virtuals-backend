const { User } = require('../models');

class AuthService {
  static async register(userData) {
    const user = await User.create(userData);
    const token = user.generateToken();
    return { user, token };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      throw new Error('Invalid credentials');
    }
    const token = user.generateToken();
    return { user, token };
  }
}

module.exports = AuthService;