const { setupDb, signUpUser } = require('./utils.js');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'test@user.com',
  password: '1234567',
};

describe('users', () => {
  beforeEach(setupDb);

  it('should create a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });


  it('GET / should return a list of users', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    const res2 = await request(app).get('/api/v1/users');

    expect(res2.body).toEqual([{
      id: "1",
      email,
    }]);
  });


  it('GET /:id should return a specific user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    const res2 = await request(app).get('/api/v1/users/1');

    expect(res2.body).toEqual({
      id: "1",
      email,
    });
  });

  it('POST /login should sign in a user', async () => {
    // const res = await request(app).post('/api/v1/users').send(mockUser);

    const { agent, user, credentials } = await signUpUser();

// console.log('USERTEST', user);

//     expect(user).toEqual({
//       id: expect.any(String),
//       email: credentials.email,
//     });

    const { statusCode, body } = await agent.get('/api/v1/users/verify');
    expect(statusCode).toBe(200);
  });

});
