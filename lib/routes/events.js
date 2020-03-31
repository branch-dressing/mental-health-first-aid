const { Router } = require('express');
const Event = require('../models/Event');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Event
      .create({ ...req.body, userId: req.user._id })
      .then(event => res.send(event))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Event
      .findOne({ userId: req.user._id })
      .then(event => res.send(event))
      .catch(next);
  })

  .patch('/', ensureAuth, (req, res, next) => {
    Event
      .findOneAndUpdate({ userId: req.user._id }, req.body, { new: true })
      .then(event => res.send(event))
      .catch(next);
  })

  .delete('/', ensureAuth, (req, res, next) => {
    Event
      .findOneAndDelete({ userId: req.user._id })
      .then(event => res.send(event))
      .catch(next);
  });
