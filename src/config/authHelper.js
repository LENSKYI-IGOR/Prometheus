const jwt = require('jsonwebtoken');
const uuid = require('uniqid');

const Token = require('../models/token.model');

const tokens = {
  jwt: {
    secret: process.env.JWT_SECRET,
    tokens: {
      access: {
        type: 'access',
        expiresIn: '10m',
      },
      refresh: {
        type: 'refresh',
        expiresIn: '15m',
      },
    },
  },
};

const generateAccessToken = (userId) => {
  const payload = {
    userId,
    type: tokens.jwt.tokens.access.type,
  };
  const options = { expiresIn: tokens.jwt.tokens.access.expiresIn };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const generateRefreshToken = () => {
  const payload = {
    id: uuid(),
    type: tokens.jwt.tokens.refresh.type,
  };
  const options = { expiresIn: tokens.jwt.tokens.refresh.expiresIn };

  return {
    id: payload.id,
    token: jwt.sign(payload, process.env.JWT_SECRET, options),
  };
};

const replaceDbRefreshToken = async (tokenId, userId) => await Token.findOneAndRemove({ userId })
  .exec()
  // eslint-disable-next-line no-return-await
  .then(async () => await Token.create({ tokenId, userId }));

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  replaceDbRefreshToken,
};
