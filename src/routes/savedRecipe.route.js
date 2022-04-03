const express = require('express');

const Router = express.Router();

// Authentication
const middlewareAuth = require('../middlewares/auth');
// Redis
const middlewareRedis = require('../middlewares/redis');
// Controller
const savedRecipeController = require('../controllers/savedRecipe.controller');

Router.get(
  '/',
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.getAllSavedRecipe,
  savedRecipeController.getAllSavedRecipe
)
  .get(
    '/user/:id',
    middlewareAuth.authentication,
    middlewareRedis.getSavedRecipeByUser,
    savedRecipeController.getSavedRecipeByUser
  )
  .get(
    '/:id',
    middlewareAuth.authentication,
    middlewareRedis.getSavedRecipeById,
    savedRecipeController.getSavedRecipeById
  )
  .post(
    '/',
    middlewareAuth.authentication,
    middlewareRedis.clearSavedRecipe,
    savedRecipeController.createSavedRecipe
  )
  .delete(
    '/:id',
    middlewareAuth.authentication,
    middlewareRedis.clearSavedRecipe,
    savedRecipeController.deleteSavedRecipe
  );

module.exports = Router;
