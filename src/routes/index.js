const express = require('express');

const Router = express.Router();

const homepageRoute = require('./homepage.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const recipeRoute = require('./recipe.route');
const commentRoute = require('./comment.route');
const likedRecipeRoute = require('./likedRecipe.route');
const savedRecipeRoute = require('./savedRecipe.route');

Router.use('/', homepageRoute);
Router.use('/auth', authRoute);
Router.use('/user', userRoute);
Router.use('/recipe', recipeRoute);
Router.use('/comment', commentRoute);
Router.use('/liked', likedRecipeRoute);
Router.use('/saved', savedRecipeRoute);

module.exports = Router;
