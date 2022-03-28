const express = require('express');

const Router = express.Router();

const userController = require('../controllers/userController');
const validation = require('../validations');

Router.get('/', userController.getAllUsers)
  .get('/:id', userController.getUserById)
  .post('/', validation.validate('user'), userController.createUser)
  .put('/:id', validation.validate('user'), userController.updateUser)
  .delete('/:id', userController.deleteUser);

module.exports = Router;
