const mongoose = require('mongoose');

const user = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  DOB: {
    type: String
  }, 
  createdAt: {
    type: String
  }, 
});
module.exports.user = mongoose.model('user', user);

