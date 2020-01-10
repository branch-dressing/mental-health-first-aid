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
    required: true
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

schema.pre('validate', function(next) {
  this
    .model('User')
    .findOne({ friendCode: this.friendCode })
    .then(user => this.user = user)
    .then(next);
});

module.exports = mongoose.model('Positive', schema);
