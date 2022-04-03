const express = require('express');

const Router = express.Router();

// Redis
const middlewareRedis = require('../middlewares/redis');
// Controller
const homepageController = require('../controllers/homepage.controller');

Router.get(
  '/latest',
  middlewareRedis.getLatestRecipe,
  homepageController.getLatestRecipe
);

module.exports = Router;
