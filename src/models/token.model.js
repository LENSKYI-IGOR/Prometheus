const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  tokenId: String,
  userId: String,
});

module.exports = mongoose.model('refreshToken', TokenSchema);
