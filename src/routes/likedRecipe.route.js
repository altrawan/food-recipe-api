const express = require('express');

const Router = express.Router();

// Authentication
const middlewareAuth = require('../middlewares/auth');
// Redis
// const middlewareRedis = require('../middlewares/redis');
// Controller
const likedRecipeController = require('../controllers/likedRecipe.controller');

Router.get(
  '/',
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  // middlewareRedis.getAllLikedRecipe,
  likedRecipeController.getAllLikedRecipe
)
  .get(
    '/user/:id',
    middlewareAuth.authentication,
    // middlewareRedis.getLikedRecipeById,
    likedRecipeController.getLikedRecipeByUser
  )
  .get(
    '/:id',
    middlewareAuth.authentication,
    // middlewareRedis.getLikedRecipeByUser,
    likedRecipeController.getLikedRecipeById
  )
  .post(
    '/',
    middlewareAuth.authentication,
    // middlewareRedis.clearLikedRecipe,
    likedRecipeController.createLikedRecipe
  )
  .delete(
    '/:id',
    middlewareAuth.authentication,
    // middlewareRedis.clearLikedRecipe,
    likedRecipeController.deleteLikedRecipe
  );

module.exports = Router;
