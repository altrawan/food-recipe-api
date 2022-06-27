const { v4: uuidv4 } = require('uuid');
const chatModel = require('../models/chat.model');
const { success, failed } = require('../helpers/response');

module.exports = {
  initialChat: async (req, res) => {
    try {
      const { sender, receiver, message } = req.body;

      const result = await chatModel.createChat({
        id: uuidv4(),
        sender,
        receiver,
        message,
      });

      return success(res, {
        code: 201,
        message: `Create initial chat success`,
        data: result,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
