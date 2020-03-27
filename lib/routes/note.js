const { Router } = require('express');
const Note = require('../models/Note');
const ensureAuth = require('../middleware/ensure-auth');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('testKey');

module.exports = Router()
  .post('/', (req, res, next) => {
    Note
      .create(req.body)
      .then(note => {
        res.send(note);
      })
      .catch(next);
  });
