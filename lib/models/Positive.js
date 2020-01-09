const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  author: String,
  tags: Array
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.id;
    }
  }
});

module.exports = mongoose.model('Positive', schema);
