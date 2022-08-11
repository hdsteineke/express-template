const { setupDb } = require('./utils.js');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'test@user.com',
  password: '1234567',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...mockUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('users', () => {
  beforeEach(setupDb);

  it('should create a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    console.log('resCREATE', res.body);
    const { email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });


  it('should return a list of users', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    const res2 = await request(app).get('/api/v1/users');

    expect(res2.body).toEqual([{
      id: "1",
      email,
    }]);
  });


  it('should return a specific user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;
    console.log('mockUser', mockUser);

    const res2 = await request(app).get('/api/v1/users/1');
    console.log('res2.body', res2.body);

    expect(res2.body).toEqual({
      id: "1",
      email,
    });
  });



});
