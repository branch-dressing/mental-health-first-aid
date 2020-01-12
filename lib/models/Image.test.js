const Image = require('./Image');

describe('Image Model', () => {
  it('throws errors for missing info', () => {
    const image = new Image();
    const { errors } = image.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
    expect(errors.url.message).toEqual('Path `url` is required.');
  });
});
