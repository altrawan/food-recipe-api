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
