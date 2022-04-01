const express = require('express');

const Router = express.Router();

const homepageController = require('../controllers/homepage.controller');

Router.get('/latest', homepageController.getLatestRecipe);

module.exports = Router;
