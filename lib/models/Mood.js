const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  moodName: {
    type: String,
    required: true
  },
  solutions: [{
    type: String
  }]
});

module.exports = mongoose.model('Mood', schema);
