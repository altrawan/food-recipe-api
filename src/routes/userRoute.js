const express = require('express');

const Router = express.Router();

const userController = require('../controllers/userController');

Router.get('/', userController.getAllUsers)
  .get('/:id', userController.getUserById)
  .post('/', userController.createUser)
  .put('/:id', userController.updateUser)
  .delete('/:id', userController.deleteUser);

module.exports = Router;
