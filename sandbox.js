require('dotenv').config();
require('./lib/utils/connect')();
const User = require('./lib/models/User');

User.create({
  email:'123@123.com',
  userName: '123',
  password: '123',
})
  .then(console.log);
  