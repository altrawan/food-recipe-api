const { body, validationResult } = require('express-validator');

const updateProfile = () => {
  return [
    body('name')
      .not()
      .isEmpty()
      .withMessage('Name cannot be empty')
      .matches(/^[A-Za-z ]+$/)
      .withMessage('Only letter allowed')
      .isLength({ min: 3, max: 50 })
      .withMessage('must be between 3 and 50 characters'),
    body('email')
      .not()
      .isEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Invalid E-mail address'),
    body('phone')
      .not()
      .isEmpty()
      .withMessage('Phone Number cannot be empty')
      .isNumeric()
      .withMessage('Only number allowed')
      .isLength({ min: 11, max: 13 })
      .withMessage('must be between 11 and 13 characters'),
  ];
};

const updatePassword = () => {
  return [
    body('newPassword')
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')
      .withMessage(
        'Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    body('passwordConfirmation')
      .not()
      .isEmpty()
      .withMessage('Password confirmation cannot be empty')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
      }),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));

  return res.status(422).json({
    code: 422,
    status: 'failed',
    errors: extractedErrors,
  });
};

module.exports = {
  updateProfile,
  updatePassword,
  validate,
};
