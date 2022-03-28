const express = require('express');

const Router = express.Router();

const recipeController = require('../controllers/recipeController.js');
const validation = require('../validations');

Router.get('/', recipeController.getAllRecipes)
  .get('/latest/', recipeController.getLatestRecipe)
  .get('/user/:id', recipeController.getRecipeByUser)
  .get('/:id', recipeController.getRecipeById)
  .post('/', validation.validate('recipe'), recipeController.createRecipe)
  .put('/:id', validation.validate('recipe'), recipeController.updateRecipe)
  .delete('/:id', recipeController.deleteRecipe);

module.exports = Router;
