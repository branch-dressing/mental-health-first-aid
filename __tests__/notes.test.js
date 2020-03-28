require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Note = require('../lib/models/Note');
const User = require('../lib/models/User');

describe('NOTE ROUTES', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let userOne;
  let noteOne;

  beforeEach(async() => {
    userOne = await User.create({
      email: 'notesuser@notes.com',
      userName: 'Notes',
      password: '123'
    });

    noteOne = await request(app)
      .post('/api/v1/notes')
      .send({
        userId: userOne._id,
        title: 'This is a Note!',
        text: 'Remember to breath.'
      })
      .then(res => res.body);
  
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a note', async() => {
    return request(app)
      .post('/api/v1/notes')
      .send({
        userId: userOne._id,
        title: 'This is a Note!',
        text: 'Remember to breath.'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          userId: userOne._id.toString(),
          title: expect.any(String),
          text: expect.any(String),
          __v: 0
        });
      });
  });

  it('can get all your notes', async() => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'notesuser@notes.com',
        password: '123',
      });

    return agent
      .get('/api/v1/notes')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          userId: userOne._id.toString(),
          title: 'This is a Note!',
          text: 'Remember to breath.',
          __v: 0
        }]);
      });
  });


});
