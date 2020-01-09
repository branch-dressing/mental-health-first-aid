const User = require('./User');

describe('User Model', () => {
  it('throws errors for missing info', () => {
    const user = new User();
    const { errors } = user.validateSync();

    expect(errors.email.message).toEqual('Path `email` is required.');
    expect(errors.userName.message).toEqual('Path `userName` is required.');
    expect(errors.passwordHash.message).toEqual('Path `passwordHash` is required.');
    expect(errors.friendCode.message).toEqual('Path `friendCode` is required.');
  });

  it('needs a unique email', () => {

  });
  // it('needs a unique userName');
  // it('creates a passwordHash');
  // it('creates a friendCode');
});
