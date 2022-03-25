const { body } = require('express-validator/check');

exports.validate = (method) => {
  switch (method) {
    case 'createUser': {
      return [
        body('name')
          .isLength({ min: 3, max: 50 })
          .withMessage('Name minimum 3 digit and maximum 50 digit')
          .isAlpha()
          .withMessage('Only letters allowed'),
        body('email', 'Email is not valid').isEmail()
        // body('phone').optional().isInt(),
        // body('status').optional().isIn(['enabled', 'disabled']),
      ];
    }
  }
};
