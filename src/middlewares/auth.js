const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../helpers/env');
const { failed } = require('../helpers/response');

module.exports = {
  authentication: (req, res, next) => {
    try {
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      
      if (!token) {
        return failed(res, 403, 'failed', 'Please login first');
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.APP_DATA = {
        tokenDecoded: decoded
      };
      
      return next();
    } catch (error) {
      return failed(res, 400, 'failed', 'Invalid token', error)
    }
  },
  isAdmin: (req, res, next) => {
    const token = req.APP_DATA.tokenDecoded;
    if (token.level === 0) {
      return next();
    }
    return failed(res, 403, 'failed', `You don't have access to this page`);
  },
};
