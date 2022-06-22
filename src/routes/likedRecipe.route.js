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
    '/liked/user/:id',
    middlewareAuth.authentication,
    // middlewareRedis.getLikedRecipeById,
    likedRecipeController.getLikedRecipeByUser
  )
  .get(
    '/liked/:id',
    middlewareAuth.authentication,
    // middlewareRedis.getLikedRecipeByUser,
    likedRecipeController.getLikedRecipeById
  )
  .post(
    '/liked',
    middlewareAuth.authentication,
    // middlewareRedis.clearLikedRecipe,
    likedRecipeController.createLikedRecipe
  )
  .delete(
    '/liked/:id',
    middlewareAuth.authentication,
    // middlewareRedis.clearLikedRecipe,
    likedRecipeController.deleteLikedRecipe
  );

module.exports = Router;
