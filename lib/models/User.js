const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  friendCode: {
    type: String,
    required: true,
    unique: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.id;
    }
  }
});

schema.virtual('', {
  ref: '',
  localField: '',
  foreignField: ''
});

module.exports = mongoose.model('User', schema);
