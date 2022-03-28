const express = require('express');

const Router = express.Router();

const userRoute = require('./userRoute');
const recipeRoute = require('./recipeRoute');
const commentRoute = require('./commentRoute');
const likedRecipeRoute = require('./likedRecipeRoute');
const savedRecipeRoute = require('./savedRecipeRoute');

Router.use('/user', userRoute);
Router.use('/recipe', recipeRoute);
Router.use('/comment', commentRoute);
Router.use('/liked', likedRecipeRoute);
Router.use('/saved', savedRecipeRoute);

module.exports = Router;
