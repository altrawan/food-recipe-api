const express = require('express');

const Router = express.Router();

const savedRecipeController = require('../controllers/savedRecipeController');

Router.get('/user/:id', savedRecipeController.getSavedRecipeByUser)
  .get('/:id', savedRecipeController.getSavedRecipeById)
  .post('/', savedRecipeController.createSavedRecipe)
  .delete('/:id', savedRecipeController.deleteSavedRecipe);

module.exports = Router;
