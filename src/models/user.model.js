const db = require('../config/pg');

module.exports = {
  findBy: (field, search) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE ${field} = $1`,
        [search],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  getAllUser: (key, search, sort, sortType, limit, offset) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT id, name, email, phone, CASE WHEN level = 0 THEN 'Admin' ELSE 'User' END AS level, 
        CASE WHEN is_active = 0 THEN 'Not Active' ELSE 'Active' END AS status, photo,
        to_char(created_at, 'FMDay, DD FMMonth YYYY HH24:MI:SS') AS date 
        FROM users WHERE ${key} ILIKE $1 ORDER BY ${sort} ${sortType} LIMIT $2 OFFSET $3`,
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
  getDetailUser: (id) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE id = $1`, [id], (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res);
      });
    }),
  updateProfile: (data, id) =>
    new Promise((resolve, reject) => {
      const { name, email, phone, updated_at } = data;
      db.query(
        `UPDATE users SET name = $1, email = $2, phone = $3, updated_at = $4 WHERE id = $5`,
        [name, email, phone, updated_at, id],
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
  updateImage: (data, id) =>
    new Promise((resolve, reject) => {
      const { photo, updated_at } = data;
      db.query(
        `UPDATE users SET photo = $1, updated_at = $2 WHERE id = $3`,
        [photo, updated_at, id],
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
  updatePassword: (data, id) =>
    new Promise((resolve, reject) => {
      const { password, updated_at } = data;
      db.query(
        `UPDATE users SET password = $1, updated_at = $2 WHERE id = $3`,
        [password, updated_at, id],
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
  updateStatus: (is_active, id) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET is_active = $1, updated_at = $2 WHERE id = $3`,
        [is_active, new Date(Date.now()), id],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          const data = {
            id,
            status: is_active === 1 ? 'Active' : 'Not Active',
          };
          resolve(data);
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
