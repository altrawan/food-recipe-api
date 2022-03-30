const { failed } = require('../helpers/response');

const auth = (req, res, next) => {
  const { token } = req.headers;
  if (token && token === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9') {
    next();
  } else {
    failed(res, null, 'failed', 'invalid token');
  }
};

module.exports = auth;
