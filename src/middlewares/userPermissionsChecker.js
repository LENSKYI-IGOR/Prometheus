const jwt = require('jsonwebtoken');
const error = require('./errorHandler');

const User = require('../models/user.model');

/** Middleware for reading JWT accessToken from Header
 * (uses for secure routes)* */

// eslint-disable-next-line consistent-return
module.exports = async (req) => {
  try {
    const authHeader = req.get('Authorization');

    const permissions = jwt.verify(authHeader, process.env.JWT_SECRET);

    const candidate = await User.findOne({ _id: permissions.userId });
    if (candidate) {
      const temp1 = candidate._id.toString();
      const temp2 = permissions.userId.toString();
      if (temp1 === temp2) {
        return candidate;
      }
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      console.log(error.invalidToken);
    }
    if (e instanceof jwt.JsonWebTokenError) {
      console.log(error.invalidToken);
    }
  }
};
