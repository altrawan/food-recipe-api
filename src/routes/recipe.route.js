const express = require('express');

const Router = express.Router();

// Authentication
const middlewareAuth = require('../middlewares/auth');
// Redis
// const middlewareRedis = require('../middlewares/redis');
// Upload image
const middlewareImage = require('../middlewares/imageRecipe');
// Validation
const {
  recipeValidationRules,
  validate,
} = require('../validations/recipe.validation');
// Controller
const recipeController = require('../controllers/recipe.controller');

Router.get(
  '/',
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  // middlewareRedis.getAllRecipes,
  recipeController.getAllRecipes
)
  .get('/list', recipeController.getListRecipe)
  .get('/latest', recipeController.getLatestRecipe)
  .get(
    '/user/:id',
    middlewareAuth.authentication,
    // middlewareAuth.isUser,
    // middlewareRedis.getRecipeByUser,
    recipeController.getRecipeByUser
  )
  .get(
    '/:id',
    // middlewareAuth.authentication,
    // middlewareRedis.getRecipeById,
    recipeController.getRecipeById
  )
  .post(
    '/',
    middlewareAuth.authentication,
    // middlewareAuth.isUser,
    middlewareImage,
    recipeValidationRules(),
    validate,
    // middlewareRedis.clearRecipe,
    recipeController.createRecipe
  )
  .put(
    '/:id',
    middlewareAuth.authentication,
    middlewareAuth.isUser,
    middlewareImage,
    recipeValidationRules(),
    validate,
    // middlewareRedis.clearRecipe,
    recipeController.updateRecipe
  )
  .put(
    '/status/:id',
    middlewareAuth.authentication,
    middlewareAuth.isAdmin,
    // middlewareRedis.clearRecipe,
    recipeController.updateStatus
  )
  .delete(
    '/:id',
    middlewareAuth.authentication,
    middlewareAuth.isUser,
    // middlewareRedis.clearRecipe,
    recipeController.deleteRecipe
  );

module.exports = Router;
