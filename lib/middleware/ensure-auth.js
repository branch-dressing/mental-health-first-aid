const User = require('../models/User');

module.exports = (req, res, next) => {
  const token = req.cookies.session;
  User
    .findByToken(token)
    .then(user => {
      console.log('Ensure: ', user.avatar);
      req.user = user;
      next();
    })
    .catch(next);
};
