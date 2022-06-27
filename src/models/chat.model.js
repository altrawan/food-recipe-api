const db = require('../config/pg');

module.exports = {
  getListChat: (sender, receiver) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT 
        userSender.id AS sender_id,
        userReceiver.id AS receiver_id,
        chat.id, chat.message, chat.is_deleted, chat.created_at
        FROM chat 
        LEFT JOIN users AS userSender ON chat.sender = userSender.id
        LEFT JOIN users AS userReceiver ON chat.receiver = userReceiver.id
        WHERE (sender='${sender}' AND receiver='${receiver}')
        OR (sender='${receiver}' AND receiver='${sender}')
        ORDER BY chat.created_at`,
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  createChat: (data) =>
    new Promise((resolve, reject) => {
      const { id, sender, receiver, message } = data;
      db.query(
        `INSERT INTO chat (id, sender, receiver, message) VALUES ($1, $2, $3, $4)`,
        [id, sender, receiver, message],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(data);
        }
      );
    }),
  updateChat: (message, id) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE chat SET message = $1 WHERE id = $2`,
        [message, id],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve({
            id,
            message,
          });
        }
      );
    }),
  deleteChat: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE chat SET id_deleted = true WHERE id = $1`,
        [id],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(id);
        }
      );
    }),
};
