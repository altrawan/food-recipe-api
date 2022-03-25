const express = require('express');

const Router = express.Router();

const userRoute = require('../../routes/userRoute');
const recipeRoute = require('../../routes/recipeRoute');
const commentRoute = require('../../routes/commentRoute');
const likedRecipeRoute = require('../../routes/likedRecipeRoute');
const savedRecipeRoute = require('../../routes/savedRecipeRoute');

Router.use('/user', userRoute);
Router.use('/recipe', recipeRoute);
Router.use('/comment', commentRoute);
Router.use('/liked', likedRecipeRoute);
Router.use('/saved', savedRecipeRoute);

module.exports = Router;
