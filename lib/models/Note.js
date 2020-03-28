const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Note', schema);
