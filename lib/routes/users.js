const { Router } = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const Positive = require('../models/Positive');
const Image = require('../models/Image');
const ensureAuth = require('../middleware/ensure-auth');

function attachCookie(res, token) {
  res.cookie('session', token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    SameSite: false,
    Secure: true
  });
}

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create({ ...req.body, newUser: true })
      .then(user => {
        Event
          .create({ userId: user._id, title: 'Event', date: new Date() })
          .catch(next);
        return user;
      })
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

  .get('/verify', ensureAuth, (req, res, next) => {
    res.send(req.user)
      .catch(next);
  })

  .patch('/', ensureAuth, (req, res, next) => {
    User
      .findByIdAndUpdate(req.user._id, req.body, { new: true })
      .then(user => res.send(user))
      .catch(next);
  })
  
  .delete('/:id', ensureAuth, (req, res, next) => {
    Promise.all([
      Image
        .deleteMany({ user: req.user._id }),
      Positive
        .deleteMany({ user: req.user._id }),
      User
        .findByIdAndDelete(req.params.id)  
    ])
      .then(([images, positives, user]) => {
        res.send({ images, positives, user });
      })
      .catch(next);
  });
  
