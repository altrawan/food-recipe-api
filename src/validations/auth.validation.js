const { body, validationResult } = require('express-validator');
const { getUserByEmail, getUserByPhone } = require('../models/user.model');

const registerValidationRules = () => {
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
      .withMessage('Invalid E-mail address')
      .custom((value) => {
        return getUserByEmail(value).then((res) => {
          if (res.rowCount > 0) {
            throw new Error('E-mail already exist');
          }
        });
      }),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty')
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage('Only letter and number allowed')
      .isLength({ min: 8 })
      .withMessage('must be at least 8 chars long')
      .matches(/\d/)
      .withMessage('must contain a number')
      .not()
      .isUppercase()
      .withMessage('must contain a lower case')
      .not()
      .isLowercase()
      .withMessage('must contain a upper case'),
    // .isStrongPassword({
    //   minLength: 8,
    //   minLowercase: 1,
    //   minUppercase: 1,
    //   minNumbers: 1,
    // })
    // .withMessage(
    //   'Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number'
    // ),
    body('phone')
      .not()
      .isEmpty()
      .withMessage('Phone Number cannot be empty')
      .isNumeric()
      .withMessage('Only number allowed')
      .isLength({ min: 11, max: 13 })
      .withMessage('must be between 11 and 13 characters')
      .custom((value) => {
        return getUserByPhone(value).then((res) => {
          if (res.rowCount > 0) {
            throw new Error('Phone Number already in use');
          }
        });
      }),
    body('passwordConfirmation')
      .not()
      .isEmpty()
      .withMessage('Password confirmation cannot be empty')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }

        // Indicates the success of this synchronous custom validator
        return true;
      }),
  ];
};

const loginValidationRules = () => {
  return [
    body('email')
      .not()
      .isEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Invalid E-mail address'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty')
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage('Only letter and number allowed')
      .isLength({ min: 8 })
      .withMessage('must be at least 8 chars long')
      .matches(/\d/)
      .withMessage('must contain a number')
      .not()
      .isUppercase()
      .withMessage('must contain a lower case')
      .not()
      .isLowercase()
      .withMessage('must contain a upper case'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    status: 422,
    errors: extractedErrors,
  });
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  validate,
};
