const User = require('./User');

describe('User Model', () => {
  it('throws errors for missing info', () => {
    const user = new User();
    const { errors } = user.validateSync();

    expect(errors.email.message).toEqual('Path `email` is required.');
    expect(errors.userName.message).toEqual('Path `userName` is required.');
    expect(errors.passwordHash.message).toEqual('Path `passwordHash` is required.');
  });

  it('can create user', () => {
    const user = new User({
      email:'123@123.com',
      userName: '123',
      password: '123'
    });

    user.validate();

    expect(user.toJSON()).toEqual({
      _id: user._id,
      email:'123@123.com',
      userName: '123',
      newUser: true,
      friendCode: expect.any(String)
    });
  });

});
