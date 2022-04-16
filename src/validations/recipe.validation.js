const { body, validationResult } = require('express-validator');

const recipeValidationRules = () => {
  return [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title cannot be empty')
      .matches(/^[A-Za-z ]+$/)
      .withMessage('Only letter allowed')
      .isLength({ min: 3, max: 50 })
      .withMessage('must be between 3 and 50 characters'),
    body('ingredients').not().isEmpty().withMessage('Ingredients cannot be empty'),
    body('video').isURL().withMessage('Only URL allowed')
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
  recipeValidationRules,
  validate,
};