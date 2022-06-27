const express = require('express');

const jwtAuth = require('../middlewares/jwtAuth');
const { chat } = require('../validations/chat.validation');
const validation = require('../middlewares/validation');
const { initialChat } = require('../controllers/chat.controller');

const router = express.Router();
router.post('/chat', jwtAuth, chat, validation, initialChat);

module.exports = router;
