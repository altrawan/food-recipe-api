const express = require('express');

const Router = express.Router();

const jwtAuth = require('../middlewares/jwtAuth');
const {
  isAdmin,
  isUser,
  likedRecipeOwner,
} = require('../middlewares/authorizations');
const {
  getAllLikedRecipe,
  getLikedRecipeById,
  clearLikedRecipe,
} = require('../middlewares/redis');
const {
  list,
  detail,
  store,
  destroy,
} = require('../controllers/likedRecipe.controller');

Router.get('/liked', jwtAuth, isAdmin, getAllLikedRecipe, list)
  .get('/liked/:id', jwtAuth, getLikedRecipeById, detail)
  .post('/liked', jwtAuth, isUser, clearLikedRecipe, store)
  .delete(
    '/liked/:id',
    jwtAuth,
    isUser,
    likedRecipeOwner,
    clearLikedRecipe,
    destroy
  );

module.exports = Router;
