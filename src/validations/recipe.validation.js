const { check } = require('express-validator');

const insert = [
  // title
  check('title', 'Title required').not().isEmpty(),
  check('title', 'Title only can contains alphabet and number').isAlphanumeric(
    'en-US',
    { ignore: ' ' }
  ),
  check('title', 'Title maximum length is 100 characters').isLength({
    max: 100,
  }),
  // ingredients
  check('ingredients', 'Ingredients required').not().isEmpty(),
];

module.exports = { insert };
