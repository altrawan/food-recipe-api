const express = require('express');

const Router = express.Router();

const likedRecipeController = require('../controllers/likedRecipeController');

Router.get('/user/:id', likedRecipeController.getLikedRecipeByUser)
  .get('/:id', likedRecipeController.getLikedRecipeById)
  .post('/', likedRecipeController.createLikedRecipe)
  .delete('/:id', likedRecipeController.deleteLikedRecipe);

module.exports = Router;
