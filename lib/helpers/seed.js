const chance = require('chance').Chance();

const User = require('../models/User');

module.exports = async({ user = 1 } = {}) => {

  await User.create([...Array(user)].map(() => ({
    name:
  })));

};
