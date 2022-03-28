const { body } = require('express-validator/check');

exports.validate = (method) => {
  switch (method) {
    case 'user': {
      return [
        body('name')
          .isLength({ min: 3, max: 50 })
          .withMessage('Name minimum 3 chars and maximum 50 chars')
          .matches(/^[A-Za-z ]+$/)
          .withMessage('Only letters allowed'),
        body('email', 'Email is not valid').isEmail(),
        body('password')
          .isLength({ min: 8 })
          .withMessage('must be at least 8 chars long')
          .matches(/\d/)
          .withMessage('must contain a number'),
        body('phone')
          .isLength({ min: 10, max: 13 })
          .withMessage('Phone minimum 10 digit and maximum 13 digit')
          .isNumeric()
          .withMessage('Only number allowed'),
      ];
    }
    case 'recipe': {
      return [
        body('title')
          .isLength({ min: 3 })
          .withMessage('must be at least 3 chars long')
          .matches(/^[A-Za-z ]+$/)
          .withMessage('Only letters allowed'),
        body('video', 'Only URL allowed').isURL(),
      ];
    }
  }
};
