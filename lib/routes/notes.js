const { Router } = require('express');
const Note = require('../models/Note');
const ensureAuth = require('../middleware/ensure-auth');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('testKey');

module.exports = Router()
  .post('/', (req, res, next) => {
    const encryptTitle = cryptr.encrypt(req.body.title);
    const encryptText = cryptr.encrypt(req.body.text);

    Note
      .create({ ...req.body, title: encryptTitle, text: encryptText })
      .then(note => {
        res.send(note);
      })
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Note
      .find({ userId: req.user._id })
      .then(notes => notes.map(note => ({ 
        ...note.toJSON(), 
        title: cryptr.decrypt(note.title),
        text: cryptr.decrypt(note.text)
      })))
      .then(notes => res.send(notes))
      .catch(next);
  });
