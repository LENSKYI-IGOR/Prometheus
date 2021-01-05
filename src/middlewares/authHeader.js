const jwt = require('jsonwebtoken');
const error = require('./errorHandler');

/** Middleware for reading JWT accessToken from Header
 * (uses for secure routes)* */

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    res.status(401).json({ message: error.invalidToken });
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'access') {
      res.status(401).json({ message: error.invalidToken });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: error.expiredToken });
    }
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: error.invalidToken });
    }
  }
  next();
};
