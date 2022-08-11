const bcrypt = require('bcrypt');
const User = require('../models/User');
const HttpError = require('../utils/HttpError');

module.exports = class UserService {
  static async create({ email, password }) {
    if (email.length <= 6) {
      throw new Error('Invalid email');
    }

    if (password.length <= 6) {
      throw new Error('Password must be at least 7 characters long');
    }

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      email,
      passwordHash,
    });
    return user;
  }

static async signIn({ email, password = '' }) {
  try {
    const user = await User.getByEmail(email);

    if (!user) throw new Error('Invalid email');



    return token;
  } catch (error) {
    error.status = 401;
    throw error;
  }
}
};