const express = require('express');

const Router = express.Router();

// Authentication
const middlewareAuth = require('../middlewares/auth');
// Validations
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require('../validations/auth.validation');
// Controller
const authController = require('../controllers/auth.controller');

Router.post(
  '/register',
  registerValidationRules(),
  validate,
  authController.register
)
  .put('/confirm/:token', authController.verifyEmail)
  .post('/login', loginValidationRules(), validate, authController.login)
  .post('/refresh', authController.refreshToken)
  .post('/logout', middlewareAuth.authentication, authController.logout);

module.exports = Router;
