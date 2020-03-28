const { Router } = require('express');
const Image = require('../models/Image');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Image
      .create({
        ...req.body,
        user: req.user._id
      })
      .then(image => {
        res.send(image);
      })
      .catch(next);
  })
  
  .get('/', ensureAuth, (req, res, next) => {
    Image
      .find({ user: req.user._id })
      .then(images => res.send(images))
      .catch(next);
  })
  
  .get('/:id', ensureAuth, (req, res, next) => {
    Image
      .findById(req.params.id)
      .then(image => res.send(image))
      .catch(next);
  })
  
  .get('/tag/:tag', ensureAuth, (req, res, next) => {
    Image
      .find({ user: req.user.id, tags: { $all: [req.params.tag] } })
      .then(images => res.send(images))
      .catch(next);
  })
  
  .patch('/:id', ensureAuth, (req, res, next) => {
    Image
      .findByIdAndUpdate(req.params.id,
        { $push: { tags: req.body.tags },
          name: req.body.name,
          url: req.body.url,
          description: req.body.description
        },
        { new: true,
          omitUndefined: true })
      .then(image => res.send(image))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Image
      .findByIdAndDelete(req.params.id)
      .then(image => res.send(image))
      .catch(next);
  });
