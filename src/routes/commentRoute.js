const express = require('express');

const Router = express.Router();

const commentController = require('../controllers/commentController');

Router
  .get('/', commentController.getAllComments)
  .get('/recipe/:id', commentController.getCommentByRecipe)
  .get('/:id', commentController.getCommentById)
  .post('/', commentController.createComment)
  .put('/:id', commentController.updateComment)
  .delete('/:id', commentController.deleteComment);

module.exports = Router;
