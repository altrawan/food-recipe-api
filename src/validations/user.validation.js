const { check } = require('express-validator');

const update = [
  // name
  check('name', 'Name cannot be empty').not().isEmpty(),
  check('name', 'Name only can contains alphabet').isAlpha('en-US', {
    ignore: ' ',
  }),
  check('name', 'Name maximum length is 50 characters').isLength({ max: 50 }),
  // phone
  check('phone', 'Phone Number cannot be empty').not().isEmpty(),
  check('phone', 'Phone Number only number allowed').isNumeric(),
  check('phone', 'Phone Number must be between 11 and 13 characters').isLength({
    min: 11,
    max: 13,
  }),
];

const password = [
  // password
  check('password', 'Password cannot be empty').not().isEmpty(),
  check('password', 'Password require 8 or more characters').isLength({
    min: 8,
  }),
  check(
    'password',
    'Password must include one lowercase character, one uppercase character, a number, and a special character'
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
  check('password', "Password can't above 100 characters").isLength({
    max: 100,
  }),
  // confirm password
  check('passwordConfirmation', 'Password confirmation cannot be empty')
    .not()
    .isEmpty(),
  check('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
];

module.exports = { update, password };

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
