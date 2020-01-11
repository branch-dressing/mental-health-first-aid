const { Router } = require('express');
const Positive = require('../models/Positive');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', (req, res, next) => {
    Positive
      .create(req.body)
      .then(positive => {
        res.send(positive);
      })
      .catch(next);
  })
  
  .get('/', ensureAuth, (req, res, next) => {
    Positive
      .find({ user: req.user.id })
      .then(positive => res.send(positive))
      .catch(next);
  })
  .get('/:tag', ensureAuth, (req, res, next) => {
    Positive
      .find({ user: req.user.id, tags: { $all: [req.params.tag] } })
      .then(positive => res.send(positive))
      .catch(next);
  })
  
  .patch('/:id', ensureAuth, (req, res, next) => {
    Positive
      .findByIdAndUpdate(req.params.id, { $push: req.body }, { new: true })
      .then(positive => res.send(positive))
      .catch(next);
  })
  
  .delete('/:id', ensureAuth, (req, res, next) => {
    Positive
      .findByIdAndDelete(req.params.id)
      .then(positive => res.send(positive))
      .catch(next);
  });
