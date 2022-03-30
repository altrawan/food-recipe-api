const express = require('express');

const Router = express.Router();

const recipeController = require('../controllers/recipe.controller');

Router.get('/', recipeController.getAllRecipes)
  .get('/latest/', recipeController.getLatestRecipe)
  .get('/user/:id', recipeController.getRecipeByUser)
  .get('/:id', recipeController.getRecipeById)
  .post('/', recipeController.createRecipe)
  .put('/:id', recipeController.updateRecipe)
  .delete('/:id', recipeController.deleteRecipe);

module.exports = Router;
