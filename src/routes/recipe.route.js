const express = require('express');

const Router = express.Router();

// Authentication
const middlewareAuth = require('../middlewares/auth');
// Redis
const middlewareRedis = require('../middlewares/redis');
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
  middlewareRedis.getAllRecipes,
  recipeController.getAllRecipes
)
  .get(
    '/user/:id',
    middlewareAuth.authentication,
    middlewareRedis.getRecipeByUser,
    recipeController.getRecipeByUser
  )
  .get(
    '/:id',
    middlewareAuth.authentication,
    middlewareRedis.getRecipeById,
    recipeController.getRecipeById
  )
  .post(
    '/',
    middlewareAuth.authentication,
    middlewareImage,
    recipeValidationRules(),
    validate,
    middlewareRedis.clearRecipe,
    recipeController.createRecipe
  )
  .put(
    '/:id',
    middlewareAuth.authentication,
    middlewareImage,
    recipeValidationRules(),
    validate,
    middlewareRedis.clearRecipe,
    recipeController.updateRecipe
  )
  .put(
    '/delete/:id',
    middlewareAuth.authentication,
    middlewareRedis.clearRecipe,
    recipeController.deleteRecipe
  )
  .delete(
    '/:id',
    middlewareAuth.authentication,
    middlewareRedis.clearRecipe,
    recipeController.deletePermanentRecipe
  );

module.exports = Router;
