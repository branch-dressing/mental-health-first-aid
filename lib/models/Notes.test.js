const Note = require('./Note');

describe('Note Model', () => {
  it('throws errors for missing info', () => {
    const notes = new Note();
    const { errors } = notes.validateSync();

    expect(errors.message.message).toEqual('Path `message` is required.');
    expect(errors.user.message).toEqual('Path `user` is required.');
  }); 
});
