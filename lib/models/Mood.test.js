const Mood = require('./Mood');

describe('Mood Model', () => {
  it('throws errors for missing info', () => {
    const moods = new Mood();
    const { errors } = moods.validateSync();

    expect(errors.userId.message).toEqual('Path `userId` is required.');
    expect(errors.moodName.message).toEqual('Path `moodName` is required.');
  }); 
});
