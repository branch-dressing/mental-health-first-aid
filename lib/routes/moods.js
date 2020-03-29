const { Router } = require('express');
const Mood = require('../models/Mood');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Mood
      .create({ ...req.body, userId: req.user._id })
      .then(mood => {
        res.send(mood);
      })
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Mood
      .find({ userId: req.user._id })
      .then(moods => res.send(moods))
      .catch(next);
  })
  
  .patch('/:id', ensureAuth, (req, res, next) => {
    Mood
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(mood => res.send(mood))
      .catch(next);
  })

  .patch('/solution/:id', ensureAuth, (req, res, next) => {
    Mood
      .findByIdAndUpdate(req.params.id, { $push: req.body }, { new: true })
      .then(mood => res.send(mood))
      .catch(next);
  })
  
  .delete('/:id', ensureAuth, (req, res, next) => {
    Mood
      .findByIdAndDelete(req.params.id)
      .then(mood => res.send(mood))
      .catch(next);
  });
