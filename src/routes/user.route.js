const express = require('express');

const Router = express.Router();

const jwtAuth = require('../middlewares/jwtAuth');
const { isAdmin, mySelf } = require('../middlewares/authorizations');
const upload = require('../middlewares/upload');
const { update, password } = require('../validations/user.validation');
const validation = require('../middlewares/validation');
const {
  getAllUser,
  getUserById,
  getRecipeByUser,
  getLikedRecipeByUser,
  getSavedRecipeByUser,
  clearUser,
} = require('../middlewares/redis');
const {
  list,
  detail,
  updateProfile,
  updatePhoto,
  updatePassword,
  updateStatus,
  destroy,
  listRecipe,
  listLikedRecipe,
  listSavedRecipe,
} = require('../controllers/user.controller');

Router.get('/user', jwtAuth, isAdmin, getAllUser, list)
  .get('/user/:id', jwtAuth, getUserById, detail)
  .get('/user/recipe/:id', jwtAuth, getRecipeByUser, listRecipe)
  .get('/user/liked/:id', jwtAuth, getLikedRecipeByUser, listLikedRecipe)
  .get('/user/saved/:id', jwtAuth, getSavedRecipeByUser, listSavedRecipe)
  .put(
    '/user/:id',
    jwtAuth,
    update,
    validation,
    mySelf,
    clearUser,
    updateProfile
  )
  .put('/user/photo/:id', jwtAuth, upload, mySelf, clearUser, updatePhoto)
  .put(
    '/user/password/:id',
    jwtAuth,
    password,
    validation,
    mySelf,
    clearUser,
    updatePassword
  )
  .put('/user/status/:id', jwtAuth, isAdmin, clearUser, updateStatus)
  .delete('/user/:id', jwtAuth, mySelf, clearUser, destroy);

module.exports = Router;
