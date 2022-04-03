const express = require('express');

const Router = express.Router();

// Authentication
const middlewareAuth = require('../middlewares/auth');
// Redis
const middlewareRedis = require('../middlewares/redis');
// Validation
const {
  createComment,
  updateComment,
  validate,
} = require('../validations/comment.validation');
// Controller
const commentController = require('../controllers/comment.controller');

Router.get(
  '/',
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.getAllComments,
  commentController.getAllComments
)
  .get(
    '/recipe/:id',
    middlewareAuth.authentication,
    middlewareRedis.getCommentByRecipe,
    commentController.getCommentByRecipe
  )
  .get(
    '/:id',
    middlewareAuth.authentication,
    middlewareRedis.getCommentById,
    commentController.getCommentById
  )
  .post(
    '/',
    middlewareAuth.authentication,
    createComment(),
    validate,
    middlewareRedis.clearComment,
    commentController.createComment
  )
  .put(
    '/:id',
    middlewareAuth.authentication,
    updateComment(),
    validate,
    middlewareRedis.clearComment,
    commentController.updateComment
  )
  .delete(
    '/:id',
    middlewareAuth.authentication,
    middlewareRedis.clearComment,
    commentController.deleteComment
  );

module.exports = Router;
