const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../helpers/env');
const { failed } = require('../helpers/response');
const redis = require('../config/redis');

module.exports = {
  authentication: async (req, res, next) => {
    try {
      let token = req.headers.authorization;

      if (!token) {
        return failed(res, 403, 'failed', 'Please login first');
      }

      token = token.split(' ')[1];
      
      const result = await redis.get(`accessToken:${token}`);
      if (result) {
        return failed(
          res,
          403,
          'failed',
          `Your token is destroyed please login again`
        );
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.APP_DATA = {
        tokenDecoded: decoded,
      };

      return next();
    } catch (error) {
      return failed(res, 400, 'failed', 'Invalid token', error);
    }
  },
  isAdmin: (req, res, next) => {
    const token = req.APP_DATA.tokenDecoded;
    if (token.level === 0) {
      return next();
    }
    return failed(res, 403, 'failed', `You don't have access to this page`);
  },
  isUser: (req, res, next) => {
    const token = req.APP_DATA.tokenDecoded;
    if (token.level === 1) {
      return next();
    }
    return failed(res, 403, 'failed', `You don't have access to this page`);
  },
};
