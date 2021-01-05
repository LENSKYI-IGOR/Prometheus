const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    minlength: 6,
    maxlength: 32,
  },

  password: {
    type: String,
    minlength: 8,
  },

  role: {
    type: String,
  },

  GoogleID: {
    type: Number,
  },

  TwitterID: {
    type: Number,
  },

  FacebookID: {
    type: Number,
  },

  AppleID: {
    type: Number,
  },

});

module.exports = mongoose.model('User', userSchema);
