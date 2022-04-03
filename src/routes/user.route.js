const express = require('express');

const Router = express.Router();

// Authentication
const middlewareAuth = require('../middlewares/auth');
// Redis
const middlewareRedis = require('../middlewares/redis');
// Upload image
const middlewareImage = require('../middlewares/imageUser');
// Validation
const {
  updateProfile,
  updatePassword,
  validate,
} = require('../validations/user.validation');
// Controller
const userController = require('../controllers/user.controller');

Router.get(
  '/',
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.getAllUsers,
  userController.getAllUsers
)
  .get(
    '/:id',
    middlewareAuth.authentication,
    middlewareRedis.getUserById,
    userController.getUserById
  )
  .put(
    '/profile/:id',
    middlewareAuth.authentication,
    updateProfile(),
    validate,
    middlewareRedis.clearUser,
    userController.updateProfile
  )
  .put(
    '/image/:id',
    middlewareAuth.authentication,
    middlewareImage,
    middlewareRedis.clearUser,
    userController.updateImage
  )
  .put(
    '/password/:id',
    middlewareAuth.authentication,
    updatePassword(),
    validate,
    middlewareRedis.clearUser,
    userController.updatePassword
  )
  .put(
    '/delete/:id',
    middlewareAuth.authentication,
    middlewareAuth.isAdmin,
    middlewareRedis.clearUser,
    userController.deleteUser
  )
  .delete(
    '/:id',
    middlewareAuth.authentication,
    middlewareRedis.clearUser,
    userController.deletePermanentUser
  );

module.exports = Router;
