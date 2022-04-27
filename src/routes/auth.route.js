const express = require('express');

const Router = express.Router();

// Authentication
const middlewareAuth = require('../middlewares/auth');
// Upload image
const middlewareImage = require('../middlewares/imageUser');
// Validations
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  validate,
} = require('../validations/auth.validation');
// Controller
const authController = require('../controllers/auth.controller');

Router.post(
  '/register',
  middlewareImage,
  register(),
  validate,
  authController.register
)
  .get('/verify-email', authController.verifyEmail)
  .post('/login', login(), validate, authController.login)
  .post('/refresh', middlewareAuth.authentication, authController.refreshToken)
  .post('/logout', middlewareAuth.authentication, authController.logout)
  .get('/forgot-password', authController.verifyEmail)
  .get('/forgot-password', authController.verifyEmail);

module.exports = Router;
