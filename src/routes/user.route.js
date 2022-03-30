const express = require('express');
const Router = express.Router();

const staticAuth = require('../middlewares/staticAuth');
const userController = require('../controllers/user.controller');
const {
  userValidationRules,
  validate,
} = require('../validations/user.validation');

Router.get('/', staticAuth, userController.getAllUsers)
  .get('/:id', userController.getUserById)
  .post('/', userValidationRules(), validate, userController.createUser)
  .put('/:id', userController.updateUser)
  .delete('/:id', userController.deleteUser);

module.exports = Router;
