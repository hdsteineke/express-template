const pool = require('../utils/pool');
const bcrypt = require('bcrypt');

module.exports = class User {
  id;
  email;
  #passwordHash;

constructor({ id, email, password_hash }) {
    this.id = id;
    this.email = email;
    this.#passwordHash = password_hash;
  }

  static async insert({ email, passwordHash }) {
    const { rows } = await pool.query(
      `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *
      `,
      [email, passwordHash]
      );

    return new User(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM users');

    return rows.map((row) => new User(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE id = $1`,
      [id]
    );
    return new User(rows[0]);
  }

  static async getByEmail(email)  {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  async isValidPassword(password) {
    return await bcrypt.compare(password, this.#passwordHash);
  }
}