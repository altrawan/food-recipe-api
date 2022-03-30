const db = require('../config/pg');

module.exports = {
  getAllUsers: (key, search, sort, sortType, limit, offset) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE ${key} ILIKE $1 ORDER BY ${sort} ${sortType} LIMIT $2 OFFSET $3`,
        [search, limit, offset],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  getCountUser: () =>
    new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS total FROM users`, (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res.rows[0].total);
      });
    }),
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
      db.query(`SELECT * FROM users WHERE phone = $1`, [phone], (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res);
      });
    }),
  getUserById: (id) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE id = $1`, [id], (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res);
      });
    }),
  createUser: (data) =>
    new Promise((resolve, reject) => {
      const { id, name, email, password, phone, photo } = data;
      db.query(
        `INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, name, email, password, phone, photo],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(data);
        }
      );
    }),
  updateUser: (data, id) =>
    new Promise((resolve, reject) => {
      const { name, email, password, phone, photo, updated_at } = data;
      db.query(
        `UPDATE users SET name = $1, email = $2, password = $3, phone = $4, photo = $5, updated_at = $6 WHERE id = $7`,
        [name, email, password, phone, photo, updated_at, id],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          const newRes = {
            id,
            ...data,
          };
          resolve(newRes);
        }
      );
    }),
  deleteUser: (id) =>
    new Promise((resolve, reject) => {
      db.query(`DELETE FROM users WHERE id = $1`, [id], (err) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(id);
      });
    }),
};
