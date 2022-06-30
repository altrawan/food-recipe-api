const express = require('express');

const Router = express.Router();

const jwtAuth = require('../middlewares/jwtAuth');
const {
  isAdmin,
  isUser,
  recipeOwner,
} = require('../middlewares/authorizations');
const upload = require('../middlewares/upload');
const { insert } = require('../validations/recipe.validation');
const validation = require('../middlewares/validation');
const url = require('../validations/url.validation');
const {
  getAllRecipe,
  getRecipeById,
  getLatestRecipe,
  getCommentByRecipe,
  clearRecipe,
} = require('../middlewares/redis');
const {
  list,
  latest,
  detail,
  listComment,
  store,
  update,
  updateStatus,
  destroy,
} = require('../controllers/recipe.controller');

Router.get('/recipe', jwtAuth, getAllRecipe, list)
  .get('/recipe/latest', getLatestRecipe, latest)
  .get('/recipe/:id', jwtAuth, getRecipeById, detail)
  .get('/recipe/comment/:id', jwtAuth, getCommentByRecipe, listComment)
  .post(
    '/recipe',
    jwtAuth,
    isUser,
    upload,
    insert,
    validation,
    url,
    clearRecipe,
    store
  )
  .put(
    '/recipe/:id',
    jwtAuth,
    isUser,
    upload,
    insert,
    validation,
    url,
    clearRecipe,
    update
  )
  .put('/recipe/status/:id', jwtAuth, isAdmin, clearRecipe, updateStatus)
  .delete('/recipe/:id', jwtAuth, isUser, recipeOwner, clearRecipe, destroy);

module.exports = Router;
