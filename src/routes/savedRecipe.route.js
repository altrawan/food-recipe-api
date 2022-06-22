const express = require('express');

const Router = express.Router();

// Authentication
const middlewareAuth = require('../middlewares/auth');
// Redis
// const middlewareRedis = require('../middlewares/redis');
// Controller
const savedRecipeController = require('../controllers/savedRecipe.controller');

Router.get(
  '/saved',
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  // middlewareRedis.getAllSavedRecipe,
  savedRecipeController.getAllSavedRecipe
)
  .get(
    '/saved/user/:id',
    middlewareAuth.authentication,
    // middlewareRedis.getSavedRecipeByUser,
    savedRecipeController.getSavedRecipeByUser
  )
  .get(
    '/saved/:id',
    middlewareAuth.authentication,
    // middlewareRedis.getSavedRecipeById,
    savedRecipeController.getSavedRecipeById
  )
  .post(
    '/saved',
    middlewareAuth.authentication,
    // middlewareRedis.clearSavedRecipe,
    savedRecipeController.createSavedRecipe
  )
  .delete(
    '/saved/:id',
    middlewareAuth.authentication,
    // middlewareRedis.clearSavedRecipe,
    savedRecipeController.deleteSavedRecipe
  );

module.exports = Router;
