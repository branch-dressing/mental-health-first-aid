require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Positive = require('../lib/models/Positive');

describe('USER ROUTES', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a user', async() => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ 
        email: 'joel@joel.com',
        userName: 'joel', 
        password: '1234',
        avatar: 'https://pbs.twimg.com/media/DhsRKlhUEAAc50O.jpg'
      })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'joel@joel.com',
          userName: 'joel',
          avatar: 'https://pbs.twimg.com/media/DhsRKlhUEAAc50O.jpg',
          passwordHash: expect.any(String),
          friendCode: expect.any(String),
          __v: 0
        });
      });
  });

  it('can login a user', async() => {
    await User.create({
      email: 'joel@joel.com',
      userName: 'joel', 
      password: '1234',
      avatar: 'https://pbs.twimg.com/media/DhsRKlhUEAAc50O.jpg'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'joel@joel.com',
        password: '1234',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'joel@joel.com',
          friendCode: expect.any(String),
          userName: 'joel',
          passwordHash: expect.any(String),
          avatar: 'https://pbs.twimg.com/media/DhsRKlhUEAAc50O.jpg',
          __v: 0
        });
      });
  });

  it('throws an error if login with wrong email', async() => {
    await User.create({
      email: 'joel@joel.com',
      userName: 'joel', 
      password: '1234'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'invalid@joel.com', password: '1234' })
      .then(res => expect(res.body).toEqual({
        message: 'Invalid Email/Password',
        status: 401
      }));
  });

  it('throws an error if login with wrong password', async() => {
    await User.create({
      email: 'joel@joel.com',
      userName: 'joel', 
      password: '1234'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'joel@joel.com', password: '4321' })
      .then(res => expect(res.body).toEqual({
        message: 'Invalid Email/Password',
        status: 401
      }));
  });

  it('can verify if a user is logged in', async() => {
    const user = await User.create({
      email: 'joel@joel.com',
      userName: 'joel', 
      password: '1234'
    });

    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'joel@joel.com', password: '1234' });

    return agent
      .get('/api/v1/auth/verify')
      .then(res => expect(res.body).toEqual({
        _id: user.id,
        email: 'joel@joel.com',
        userName: 'joel',
        friendCode: expect.any(String),
      }));
  });

  it('can delete a user', async() => {
    const user = await User.create({
      email: 'joel@joel.com',
      userName: 'joel', 
      password: '1234'
    });

    const agent = request.agent(app);

    await Positive.create({
      message: 'This is a test',
      friendCode: user.friendCode,
      author: 'joel',
      tags: ['tag 1', 'tag 2']
    });

    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'joel@joel.com', password: '1234' });

    return agent
      .delete(`/api/v1/auth/${user._id}`)
      .then(res => {
        expect(res.body).toEqual({
          positives: {
            deletedCount: 1,
            n: 1,
            ok: 1
          },
          images: {
            deletedCount: 0,
            n: 0,
            ok: 1
          },
          user: {
            _id: user._id.toString(),
            email: 'joel@joel.com',
            userName: 'joel',
            passwordHash: user.passwordHash,
            friendCode: user.friendCode,
            __v: 0
          }        
        });
      });
  });
});
