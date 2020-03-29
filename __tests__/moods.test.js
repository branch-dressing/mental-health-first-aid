require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('MOODS ROUTES', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let userOne;
  let moodOne;

  beforeEach(async() => {
    userOne = await User.create({
      email: 'moodsuser@moods.com',
      userName: 'Moods',
      password: '123'
    });

    moodOne = await request(app)
      .post('/api/v1/moods')
      .send({
        userId: userOne._id,
        moodName: 'Anxious',
        solution: [],
      })
      .then(res => res.body);
  
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a mood', async() => {
    return request(app)
      .post('/api/v1/moods')
      .send({
        userId: userOne._id,
        moodName: 'Anxious',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: userOne._id.toString(),
          moodName: 'Anxious',
          solutions: [],
          __v: 0
        });
      });
  });

  it('can get all your moods', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'moodsuser@moods.com',
        password: '123',
      });

    return agent
      .get('/api/v1/moods')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          userId: userOne._id.toString(),
          moodName: 'Anxious',
          solutions: [],
          __v: 0
        }]);
      });
  });

  it('can update a moods', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'moodsuser@moods.com',
        password: '123',
      });

    return agent
      .patch(`/api/v1/moods/${moodOne._id}`)
      .send({ moodName: 'Depressed' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: userOne._id.toString(),
          solutions: [],
          moodName: 'Depressed',
          __v: 0
        });
      });
  });

  it('can update the solutions', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'moodsuser@moods.com',
        password: '123',
      });

    await agent
      .patch(`/api/v1/moods/solution/${moodOne._id}`)
      .send({ solutions: 'Drink water' })
      .then(res => {
        return res.body;
      });

    return agent
      .patch(`/api/v1/moods/solution/${moodOne._id}`)
      .send({ solutions: 'Take slow breaths' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: userOne._id.toString(),
          solutions: ['Drink water', 'Take slow breaths'],
          moodName: 'Anxious',
          __v: 0
        });
      });
  });

  it('can delete a moods', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'moodsuser@moods.com',
        password: '123',
      });

    return agent
      .del(`/api/v1/moods/${moodOne._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: userOne._id.toString(),
          moodName: 'Anxious',
          solutions: [],
          __v: 0
        });
      });
  });

});
