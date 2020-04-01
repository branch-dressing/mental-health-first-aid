const { Router } = require('express');
const Positive = require('../models/Positive');
const ensureAuth = require('../middleware/ensure-auth');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

module.exports = Router()
  .post('/', (req, res, next) => {
    const encryptMessage = cryptr.encrypt(req.body.message);

    Positive
      .create({ ...req.body, message: encryptMessage })
      .then(positive => {
        res.send(positive);
      })
      .catch(next);
  })
  
  .get('/', ensureAuth, (req, res, next) => {
    Positive
      .find({ user: req.user._id })
      .then(positives => positives.map(positive => ({ ...positive.toJSON(), message: cryptr.decrypt(positive.message) })
      ))
      .then(positives => res.send(positives))
      .catch(next);
  })

  .get('/tag/:tag', ensureAuth, (req, res, next) => {
    Positive
      .find({ user: req.user.id, tags: { $all: [req.params.tag] } })
      .then(positives => positives.map(positive => ({ ...positive.toJSON(), message: cryptr.decrypt(positive.message) })
      ))
      .then(positive => res.send(positive))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Positive
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(positive => res.send(positive))
      .catch(next);
  })
  
  .patch('/tag/:id', ensureAuth, (req, res, next) => {
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
