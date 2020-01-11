const { Router } = require('express');
const User = require('../models/User');
const Positive = require('../models/Positive');
const ensureAuth = require('../middleware/ensure-auth');

function attachCookie(res, token) {
  res.cookie('session', token, {
    maxAge: 24 * 60 * 60 * 1000
  });
}

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => {
        attachCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    User
      .authenticate(req.body)
      .then(user => {
        attachCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  })
  
  .delete('/:id', ensureAuth, (req, res, next) => {
    Promise.all([
      Positive
        .deleteMany({ user: req.user._id }),
      User
        .findByIdAndDelete(req.params.id)  
    ])
      .then(([positives, user]) => {
        res.send({ positives, user });
      })
      .catch(next);

  });
  
