const express = require('express');

const jwtAuth = require('../middlewares/jwtAuth');
const { isVerified } = require('../middlewares/authorizations');
const upload = require('../middlewares/upload');
const {
  register,
  login,
  code,
  forgot,
  reset,
} = require('../validations/auth.validation');
const validation = require('../middlewares/validation');
const {
  registeration,
  verifyEmail,
  loginAccount,
  forgotPassword,
  verifyCode,
  resetPassword,
  logout,
  refreshToken,
} = require('../controllers/auth.controller');

const router = express.Router();

router
  .post('/auth/register', upload, register, validation, registeration)
  .get('/auth/activation/:token', verifyEmail)
  .post('/auth/login', isVerified, login, validation, loginAccount)
  .post('/auth/forgot', isVerified, forgot, validation, forgotPassword)
  .post('/auth/verification', isVerified, code, validation, verifyCode)
  .post('/auth/reset/:token', isVerified, reset, validation, resetPassword)
  .post('/auth/logout', isVerified, jwtAuth, logout)
  .post('/auth/refresh', isVerified, jwtAuth, refreshToken);

module.exports = router;
