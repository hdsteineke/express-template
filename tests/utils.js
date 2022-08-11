const pool = require('../lib/utils/pool.js');
const { readFileSync } = require('node:fs');
const sql = readFileSync('./sql/setup.sql', 'utf-8');
const request = require('supertest');
const app = require('../lib/app');

function setupDb() {
  return pool.query(sql);
}

function closeAll() {
  return pool.end();
}

afterAll(closeAll);

const mockUser = {
  email: 'new@user.com',
  password: '1234567',
};

async function signUpUser(credentials = mockUser) {
  const res = await request(app).post('/api/v1/users').send(mockUser);

  const agent = request.agent(app);
  const res2 = await agent
    .post('/api/v1/users/login')
    .send(credentials);
  return { agent, user: res2.body, res2, credentials };
}

module.exports = {
  setupDb,
  signUpUser,
};