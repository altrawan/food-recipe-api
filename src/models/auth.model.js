const db = require('../config/pg');

module.exports = {
  register: (data) =>
    new Promise((resolve, reject) => {
      const { id, name, email, password, phone, verifyToken, photo } = data;
      db.query(
        `INSERT INTO users 
        (id, name, email, password, phone, level, photo, verify_token, is_verified, is_active) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          id,
          name,
          email.toLowerCase(),
          password,
          phone,
          1,
          photo,
          verifyToken,
          false,
          false,
        ],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(data);
        }
      );
    }),
  activateEmail: (token) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET verify_token = null, is_verified = true, is_active = true 
        WHERE verify_token = $1`,
        [token],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(token);
        }
      );
    }),
  updateCode: (code, id) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET verify_code = $1 WHERE id = $2`,
        [code, id],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          const newData = {
            id,
            code,
          };
          resolve(newData);
        }
      );
    }),
  updateToken: (token, id) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET verify_token = $1, verify_code = null WHERE id = $2`,
        [token, id],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          const newData = {
            id,
            token,
          };
          resolve(newData);
        }
      );
    }),
  resetPassword: (password, id) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET password = $1, verify_token = null WHERE id = $2`,
        [password, id],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          const newData = {
            id,
            password,
          };
          resolve(newData);
        }
      );
    }),
};
