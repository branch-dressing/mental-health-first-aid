const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const chance = require('chance').Chance();


const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  userName: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true
  },
  friendCode: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pbs.twimg.com/media/DhsRKlhUEAAc50O.jpg'
  },
  event: {
    title: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  collections: [{
    type: String,
    enum: ['Event', 'Positives'] 
  }]
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.id;
    }
  }
});

schema.pre('validate', function(next) {
  this.friendCode = `${chance.integer({ min: 100, max: 999 })}-${chance.integer({ min: 100, max: 999 })}-${chance.integer({ min: 100, max: 999 })}`;
  next();
});

schema.virtual('positive', {
  ref: 'Positive',
  localField: '_id',
  foreignField: 'user'
});

//IF ACTUALLY USE, CHANGE 4 TO 8? 12? I FORGOT...
schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 2);
});

function throwErrorForInvalidEmailOrPassword() {
  const err = new Error('Invalid Email/Password');
  err.status = 401;
  throw err;
}

schema.statics.authenticate = async function({ email, password }) {
  const user = await this.findOne({ email });
  if(!user) {
    throwErrorForInvalidEmailOrPassword();
  }

  const validPassword = bcrypt.compareSync(password, user.passwordHash);
  if(!validPassword) {
    throwErrorForInvalidEmailOrPassword();
  }
  return user;
};

schema.methods.authToken = function() {
  return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
    expiresIn: '24h'
  });
};

schema.statics.findByToken = function(token) {
  try {
    const tokenPayload = jwt.verify(token, process.env.APP_SECRET);
    return Promise.resolve(this.hydrate({
      _id: tokenPayload._id,
      email: tokenPayload.email,
      userName: tokenPayload.userName,
      friendCode: tokenPayload.friendCode
    }));
  } catch(err) {
    return Promise.reject(err);
  }
};

module.exports = mongoose.model('User', schema);
