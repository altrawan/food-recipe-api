const express = require('express');

const Router = express.Router();

// Authentication
const middlewareAuth = require('../middlewares/auth');
// Redis
// const middlewareRedis = require('../middlewares/redis');
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
  '/user',
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  // middlewareRedis.getAllUsers,
  userController.getAllUsers
)
  .get(
    '/user/:id',
    middlewareAuth.authentication,
    // middlewareRedis.getUserById,
    userController.getUserById
  )
  .put(
    '/user/profile/:id',
    middlewareAuth.authentication,
    updateProfile(),
    validate,
    // middlewareRedis.clearUser,
    userController.updateProfile
  )
  .put(
    '/user/photo/:id',
    middlewareAuth.authentication,
    middlewareImage,
    // middlewareRedis.clearUser,
    userController.updateImage
  )
  .put(
    '/user/password/:id',
    middlewareAuth.authentication,
    updatePassword(),
    validate,
    // middlewareRedis.clearUser,
    userController.updatePassword
  )
  .put(
    '/user/status/:id',
    middlewareAuth.authentication,
    middlewareAuth.isAdmin,
    // middlewareRedis.clearUser,
    userController.updateStatus
  )
  .delete(
    '/user/:id',
    middlewareAuth.authentication,
    // middlewareRedis.clearUser,
    userController.deleteUser
  );

module.exports = Router;
