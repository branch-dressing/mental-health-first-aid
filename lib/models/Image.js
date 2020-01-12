const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 140
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: Array
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.id;
    }
  }
});

schema.virtual('something').set(function() {
  console.log(this);
});

// schema.pre('validate', function(next) {
//   this
//     .model('User')
//     .findOne({ friendCode: this._tempFriendCode })
//     .then(user => {
//       this.user = user._id; 
//     })
//     .then(next);
// });

module.exports = mongoose.model('Image', schema);
