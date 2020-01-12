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
  const agent = request.agent(app);
  let image;

  beforeEach(async() => {
    userOne = await User.create({
      email: 'joel@joel.com',
      userName: 'Joel',
      password: '123'
    });

    let userTwo = await User.create({
      email: 'notJoel@Notjoel.com',
      userName: 'NotJoel',
      password: '321'
    });

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'joel@joel.com',
        password: '123',
      });

    image = await Image.create({
      name: 'Puppy',
      url: 'www.puppy.com',
      user: userOne._id,
      description: 'a cute puppy',
      tags: ['dog', 'puppy']
    });

    await Image.create({
      name: 'Kitty',
      url: 'www.kitty.com',
      user: userTwo._id,
      description: 'a cute cat',
      tags: ['cat', 'kitty']
    });
  });
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a image', async() => {
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

  it('can get all images connected to user', async() => {
    return agent
      .get('/api/v1/images')
      .then(res => {
        expect(res.body).toEqual([{
          _id: image._id.toString(),
          name: 'Puppy',
          url: 'www.puppy.com',
          user: userOne._id.toString(),
          description: 'a cute puppy',
          tags: ['dog', 'puppy'],
          __v: 0
        }]);
      });
  });

  it('can get a single image', async() => {
    return agent
      .get(`/api/v1/images/${image._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: image._id.toString(),
          name: 'Puppy',
          url: 'www.puppy.com',
          user: userOne._id.toString(),
          description: 'a cute puppy',
          tags: ['dog', 'puppy'],
          __v: 0
        });
      })
  })
});
