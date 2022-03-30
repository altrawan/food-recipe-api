const db = require('../config/pg');

module.exports = {
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE email = $1`, [email], (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res);
      });
    }),
  getUserByPhone: (phone) =>
    new Promise((resolve, reject) => {
      
    }),
  register: (data) =>
    new Promise((resolve, reject) => {
      const { id, name, email, password, phone } = data;
      db.query(
        `INSERT INTO users(id, name, email, password, phone) VALUES ($1, $2, $3, $4, $5)`,
        [id, name, email, password, phone],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(data);
        }
      );
    }),
};
