const express = require('express');

const { isVerified } = require('../middlewares/authorizations');
const {
  register,
  registers,
  login,
  forgot,
  reset,
} = require('../validations/auth.validation');
const validation = require('../middlewares/validation');
const {
  registerWorker,
  registerRecruiter,
  verifyEmail,
  loginAccount,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

const router = express.Router();

router
  .post('/auth/register-worker', register, validation, registerWorker)
  .post('/auth/register-recruiter', registers, validation, registerRecruiter)
  .get('/auth/activation/:token', verifyEmail)
  .post('/auth/login', isVerified, login, validation, loginAccount)
  .put('/auth/forgot', isVerified, forgot, validation, forgotPassword)
  .put('/auth/reset/:token', isVerified, reset, validation, resetPassword);

module.exports = router;

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
  '/auth/register',
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
