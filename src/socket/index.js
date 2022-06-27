const { v4: uuidv4 } = require('uuid');
const chatModel = require('../models/chat.model');

module.exports = (io, socket) => {
  socket.on('join-room', (id) => {
    try {
      socket.join(id);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('chat-history', async (data) => {
    try {
      const { sender, receiver } = data;
      const listChat = await chatModel.getListChat(sender, receiver);
      io.to(sender).emit('send-message-response', listChat.rows);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('send-message', async (data) => {
    try {
      const { sender, receiver, message } = data;

      await chatModel.createChat({
        id: uuidv4(),
        sender,
        receiver,
        message,
      });

      const listChat = await chatModel.getListChat(sender, receiver);

      io.to(receiver).emit('send-message-response', listChat.rows);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('edit-message', async (data) => {
    try {
      const { id, sender, receiver, message } = data;

      await chatModel.updateChat(id, chat);

      const listChat = await chatModel.getListChat(sender, receiver);
      if (listChat.rows.length) {
        listChat.rows[0].noScroll = true;
      }

      io.to(sender).emit('send-message-response', listChat.rows);
      io.to(receiver).emit('send-message-response', listChat.rows);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('delete-message', async (data) => {
    try {
      const { id, sender, receiver } = data;

      await chatModel.deleteChat(id);

      const listChat = await chatModel.getListChat(sender, receiver);
      if (listChat.rows.length) {
        listChat.rows[0].noScroll = true;
      }

      io.to(sender).emit('send-message-response', listChat.rows);
      io.to(receiver).emit('send-message-response', listChat.rows);
    } catch (error) {
      console.log(error);
    }
  });
};
