const express = require('express');

const Router = express.Router();

const authController = require('../controllers/auth.controller');
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require('../validations/auth.validation');

Router.post(
  '/login',
  loginValidationRules(),
  validate,
  authController.login
).post(
  '/register',
  registerValidationRules(),
  validate,
  authController.register
);

module.exports = Router;
