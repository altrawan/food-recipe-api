const { check } = require('express-validator');

const insert = [
  // commentText
  check('commentText', 'Comment Text required').not().isEmpty(),
  check(
    'commentText',
    'Comment Text maximum length is 500 characters'
  ).isLength({ max: 500 }),
];

module.exports = { insert };
