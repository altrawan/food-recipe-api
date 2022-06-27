const { check } = require('express-validator');

const chat = [check('message', 'Message cannot be empty').not().isEmpty()];

module.exports = {
  chat,
};
