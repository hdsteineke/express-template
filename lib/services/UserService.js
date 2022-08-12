const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    if (email.length <= 6) {
      throw new Error('Invalid email');
    }

    if (password.length <= 6) {
      throw new Error('Password must be at least 7 characters long');
    }
    //this is where the password gets hashed
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    //user email and hashed password are inserted into database as a new row
    const user = await User.insert({
      email,
      passwordHash,
    });
    return user;
  }
//signs a user in---maybe I'm missing something that I can do with the password argument?
static async signIn({ email, password = '' }) {
  try {
    //retrieves user by finding a matching email in the databse
    const user = await User.getByEmail(email);

    if (!user) throw new Error('Invalid email');

    return token;
  } catch (error) {
    error.status = 401;
    throw error;
  }
}
};