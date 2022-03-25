const express = require('express');

const Router = express.Router();

const userController = require('../controllers/userController');
const userValidation = require('../validations/userValidation');

Router.get('/', userController.getAllUsers)
  .get('/:id', userController.getUserById)
  .post('/', userValidation.validate('createUser'), userController.createUser)
  .put('/:id', userController.updateUser)
  .delete('/:id', userController.deleteUser);

module.exports = Router;
