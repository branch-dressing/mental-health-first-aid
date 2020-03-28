const Note = require('./Note');

describe('Note Model', () => {
  it('throws errors for missing info', () => {
    const notes = new Note();
    const { errors } = notes.validateSync();

    expect(errors.userId.message).toEqual('Path `userId` is required.');
    expect(errors.title.message).toEqual('Path `title` is required.');
    expect(errors.text.message).toEqual('Path `text` is required.');
  }); 
});
