const Positive = require('./Positive');
const User = require('./User');

describe('Positive Model', () => {
  it('throws errors for missing info', () => {
    const positive = new Positive();
    const { errors } = positive.validateSync();

    expect(errors.message.message).toEqual('Path `message` is required.');
    expect(errors.user.message).toEqual('Path `user` is required.');
  });

  it('can create a new Postive', () => {
    const user = new User({
      email:'123@123.com',
      userName: '123',
      password: '123'
    });

    user.validate();

    const positive = new Positive({
      message: 'You\'re doing great!',
      friendCode: user.friendCode,
      author: 'Joel',
      tags: ['great', 'good']
    });

    positive
      .validate()
      .then(() =>{
        expect(positive.toJSON()).toEqual({
          _id: positive._id,
          message: 'You\'re doing great!',
          user: user._id,
          author: 'Joel',
          tags: ['great', 'good']
        });
      });

  });
});
