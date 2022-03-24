const express = require('express');

const router = express.Router();

const userRoute = require('../../routes/userRoute');
const recipeRoute = require('../../routes/recipeRoute');
const commentRoute = require('../../routes/commentRoute');

router.use('/user', userRoute);
router.use('/recipe', recipeRoute);
router.use('/comment', commentRoute);

module.exports = router;
