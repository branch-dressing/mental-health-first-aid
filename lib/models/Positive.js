const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now()
  },
  seen: {
    type: Boolean,
    required: true,
    default: false
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

schema.virtual('friendCode').set(function(friendCode) {
  this._tempFriendCode = friendCode;
});

schema.pre('validate', function(next) {
  this
    .model('User')
    .findOne({ friendCode: this._tempFriendCode })
    .then(user => {
      this.user = user._id; 
    })
    .then(next);
});

module.exports = mongoose.model('Positive', schema);
