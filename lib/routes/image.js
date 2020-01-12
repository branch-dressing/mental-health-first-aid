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
  });
