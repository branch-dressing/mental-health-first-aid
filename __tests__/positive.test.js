require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Positive = require('../lib/models/Positive');
const User = require('../lib/models/User');

describe('POSITIVE ROUTES', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let userOne;
  let positiveOne;
  let userTwo;
  let positiveThree;

  beforeEach(async() => {
    userOne = await User.create({
      email: 'joel@joel.com',
      userName: 'Joel',
      password: '123'
    });

    positiveOne = await Positive.create({
      message: 'You are wonderful',
      friendCode: userOne.friendCode,
      author: 'Your friend',
      tags: ['wonderful', 'tag2']
    });

    userTwo = await User.create({
      email: 'dirt@dirt.com',
      userName: 'Dirt',
      password: '456'
    });

    await Positive.create({
      message: 'You are a hard worker',
      friendCode: userTwo.friendCode,
      author: 'your student',
      tags: ['work', 'dedicated']
    });

    positiveThree = await Positive.create({
      message: 'Hey beautiful',
      friendCode: userOne.friendCode,
      author: 'Joseph',
      tags: ['beautiful']
    });

  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a positive', async() => {
    return request(app)
      .post('/api/v1/positives')
      .send({
        message: 'You are wonderful',
        friendCode: userOne.friendCode,
        author: 'Your friend',
        tags: ['wonderful']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          message: 'You are wonderful',
          user: userOne._id.toString(),
          author: 'Your friend',
          tags: ['wonderful'],
          seen: false,
          timestamp: expect.any(String),
          __v: 0
        });
      });
  });

  it('cannot get positivies if not logged in', async() => {
    return request(app)
      .get('/api/v1/positives')
      .then(res => {
        expect(res.body).toEqual({ message: 'jwt must be provided', status: 500 });
      });
  });

  it('can get your own positives when logged in', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'joel@joel.com',
        password: '123',
      });

    return agent
      .get('/api/v1/positives')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),      
          message: 'You are wonderful',
          user: userOne._id.toString(),
          author: 'Your friend',
          tags: ['wonderful', 'tag2'],
          seen: false,
          timestamp: expect.any(String),
          __v: 0,
        },
        {
          _id: expect.any(String),
          message: 'Hey beautiful',
          user: userOne._id.toString(),
          author: 'Joseph',
          tags: ['beautiful'],
          seen: false,
          timestamp: expect.any(String),
          __v: 0
        }]);
      });
  });

  it('can get positives by tag', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'joel@joel.com',
        password: '123',
      });

    return agent
      .get(`/api/v1/positives/tag/${positiveOne.tags[0]}`)
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),      
          message: 'You are wonderful',
          user: userOne._id.toString(),
          author: 'Your friend',
          tags: ['wonderful', 'tag2'],
          seen: false,
          timestamp: expect.any(String),
          __v: 0,
        }]);
      });
  });

  it('can add a tag', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'joel@joel.com',
        password: '123',
      });

    return agent
      .patch(`/api/v1/positives/${positiveOne._id}`)
      .send({ tags: 'perfect' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),      
          message: 'You are wonderful',
          user: userOne._id.toString(),
          author: 'Your friend',
          tags: ['wonderful', 'tag2', 'perfect'],
          seen: false,
          timestamp: expect.any(String),
          __v: 0,
        });
      });
  });

  it.skip('can delete a positive', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'joel@joel.com',
        password: '123',
      });

    return agent
      .del(`/api/v1/positives/${positiveThree._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          message: 'Hey beautiful',
          user: userOne._id.toString(),
          author: 'Joseph',
          tags: ['beautiful'],
          seen: false,
          timestamp: expect.any(String),
          __v: 0
        });
      });

  });

});
