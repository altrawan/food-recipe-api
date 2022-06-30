const validUrl = require('valid-url');
const { failed } = require('../helpers/response');

module.exports = (req, res, next) => {
  try {
    const extractedErrors = [];

    if (req.body.video) {
      if (!validUrl.isUri(req.body.video)) {
        extractedErrors.push('Video url is not valid');
      }
    }

    if (extractedErrors.length) {
      return failed(res, {
        code: 422,
        message: 'Validation Failed',
        error: extractedErrors,
      });
    }

    next();
  } catch (error) {
    return failed(res, {
      code: 500,
      message: error.message,
      error: 'Internal Server Error',
    });
  }
};
