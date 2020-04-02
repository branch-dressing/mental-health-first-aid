const Positive = require('./Positive');

describe('Positive Model', () => {
  it('throws errors for missing info', () => {
    const positive = new Positive();
    const { errors } = positive.validateSync();

    expect(errors.message.message).toEqual('Path `message` is required.');
    expect(errors.user.message).toEqual('Path `user` is required.');
  }); 
});
