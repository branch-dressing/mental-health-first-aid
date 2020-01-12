require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Image = require('../lib/models/Image');
const User = require('../lib/models/User');

describe('IMAGE ROUTES', () => {
  beforeAll(() => {
    connect();
  });
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let userOne;
  beforeEach(async() => {
    userOne = await User.create({
      email: 'joel@joel.com',
      userName: 'Joel',
      password: '123'
    });
  });
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a image', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'joel@joel.com',
        password: '123',
      });

    return agent
      .post('/api/v1/images')
      .send({
        name: 'Puppy',
        url: 'www.puppy.com',
        description: 'a cute puppy',
        tags: ['dog', 'puppy']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Puppy',
          url: 'www.puppy.com',
          user: userOne._id.toString(),
          description: 'a cute puppy',
          tags: ['dog', 'puppy'],
          __v: 0
        });
      });
  });
})