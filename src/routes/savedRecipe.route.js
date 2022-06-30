const express = require('express');

const Router = express.Router();

const jwtAuth = require('../middlewares/jwtAuth');
const {
  isAdmin,
  isUser,
  savedRecipeOwner,
} = require('../middlewares/authorizations');
const {
  getAllSavedRecipe,
  getSavedRecipeById,
  clearSavedRecipe,
} = require('../middlewares/redis');
const {
  list,
  detail,
  store,
  destroy,
} = require('../controllers/savedRecipe.controller');

Router.get('/saved', jwtAuth, isAdmin, getAllSavedRecipe, list)
  .get('/saved/:id', jwtAuth, getSavedRecipeById, detail)
  .post('/saved', jwtAuth, isUser, clearSavedRecipe, store)
  .delete(
    '/saved/:id',
    jwtAuth,
    isUser,
    savedRecipeOwner,
    clearSavedRecipe,
    destroy
  );

module.exports = Router;
