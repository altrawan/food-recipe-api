const { body, validationResult } = require('express-validator');

const createComment = () => {
  return [
    body('recipe_id').not().isEmpty().withMessage('Recipe ID cannot be empty'),
    body('comment_text').not().isEmpty().withMessage('Comment cannot be empty'),
  ];
};

const updateComment = () => {
  return [
    body('comment_text').not().isEmpty().withMessage('Comment cannot be empty'),
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
    code: 422,
    status: 'failed',
    errors: extractedErrors,
  });
};

module.exports = {
  createComment,
  updateComment,
  validate,
};
