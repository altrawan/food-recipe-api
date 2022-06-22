const express = require('express');

const Router = express.Router();

// Authentication
const middlewareAuth = require('../middlewares/auth');
// Redis
// const middlewareRedis = require('../middlewares/redis');
// Validation
const {
  createComment,
  updateComment,
  validate,
} = require('../validations/comment.validation');
// Controller
const commentController = require('../controllers/comment.controller');

Router.get(
  '/comment',
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  // middlewareRedis.getAllComments,
  commentController.getAllComments
)
  .get(
    '/comment/recipe/:id',
    middlewareAuth.authentication,
    // middlewareRedis.getCommentByRecipe,
    commentController.getCommentByRecipe
  )
  .get(
    '/comment/:id',
    middlewareAuth.authentication,
    // middlewareRedis.getCommentById,
    commentController.getCommentById
  )
  .post(
    '/comment',
    middlewareAuth.authentication,
    createComment(),
    validate,
    // middlewareRedis.clearComment,
    commentController.createComment
  )
  .put(
    '/comment/:id',
    middlewareAuth.authentication,
    updateComment(),
    validate,
    // middlewareRedis.clearComment,
    commentController.updateComment
  )
  .delete(
    '/comment/:id',
    middlewareAuth.authentication,
    // middlewareRedis.clearComment,
    commentController.deleteComment
  );

module.exports = Router;
