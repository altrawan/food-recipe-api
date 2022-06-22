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
  .get('/auth/verify-email', authController.verifyEmail)
  .post('/auth/login', login(), validate, authController.login)
  .post(
    '/auth/refresh',
    middlewareAuth.authentication,
    authController.refreshToken
  )
  .post('/auth/logout', middlewareAuth.authentication, authController.logout)
  .get('/auth/forgot-password', authController.verifyEmail)
  .get('/auth/forgot-password', authController.verifyEmail);

module.exports = Router;
