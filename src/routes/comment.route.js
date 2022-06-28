const express = require('express');

const Router = express.Router();

const jwtAuth = require('../middlewares/jwtAuth');
const {
  isAdmin,
  isUser,
  commentOwner,
} = require('../middlewares/authorizations');
const upload = require('../middlewares/upload');
const { insert } = require('../validations/comment.validation');
const validation = require('../middlewares/validation');
const { getAllComment, clearComment } = require('../middlewares/redis');
const {
  list,
  detail,
  store,
  update,
  updateStatus,
  destroy,
} = require('../controllers/comment.controller');

Router.get('/comment', jwtAuth, isAdmin, getAllComment, list)
  .get('/comment/:id', jwtAuth, getCommentById, detail)
  .post('/comment', jwtAuth, isUser, insert, validation, clearComment, store)
  .put(
    '/comment/:id',
    jwtAuth,
    isUser,
    commentOwner,
    insert,
    validation,
    clearComment,
    update
  )
  .delete('/comment/:id', jwtAuth, isUser, commentOwner, clearComment, destroy);

module.exports = Router;
