const db = require('../config/pg');

module.exports = {
  getAllRecipe: (field, search, sort, sortType, limit, offset, level) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM recipes WHERE ${field} ILIKE ('%${search}%') ${
          level === 1 ? 'AND is_active = true' : ''
        } ORDER BY ${sort} ${sortType} LIMIT $1 OFFSET $2`,
        [limit, offset],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  getCountRecipe: () =>
    new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS total FROM recipes`, (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res.rows[0].total);
      });
    }),
  getLatestRecipe: (limit) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.id, recipes.title, recipes.image, recipes.ingredients, recipes.video, 
        recipes.user_id, users.name, users.photo, recipes.created_at AS date
        FROM recipes INNER JOIN users ON recipes.user_id = users.id ORDER BY date DESC LIMIT $1`,
        [limit],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  getRecipeById: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.id, recipes.title, recipes.image, recipes.ingredients, recipes.video, 
        recipes.user_id, users.name, users.photo, recipes.created_at AS date
        FROM recipes INNER JOIN users ON recipes.user_id = users.id WHERE recipes.id = $1`,
        [id],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  getRecipeByUser: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.id, recipes.title, recipes.image, recipes.ingredients, recipes.video, 
        recipes.user_id, users.name, users.photo, recipes.created_at AS date 
        FROM recipes INNER JOIN users ON recipes.user_id = users.id WHERE user_id = $1`,
        [id],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  createRecipe: (data) =>
    new Promise((resolve, reject) => {
      const { id, userId, title, photo, ingredients, video } = data;
      db.query(
        `INSERT INTO recipes (id, user_id, title, ingredients, image, video, is_active) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [id, userId, title, ingredients, photo, video, true],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(data);
        }
      );
    }),
  updateRecipe: (data, id) =>
    new Promise((resolve, reject) => {
      const { title, image, ingredients, video } = data;
      db.query(
        `UPDATE recipes SET title = $1, image = $2, ingredients = $3, video = $4, updated_at = $5 WHERE id = $6`,
        [title, image, ingredients, video, new Date(Date.now()), id],
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
  updateStatus: (status, id) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE recipes SET is_active = $1, updated_at = $2 WHERE id = $3`,
        [status, new Date(Date.now()), id],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          const data = {
            id,
            status: status === 1 ? 'active' : 'deactive',
          };
          resolve(data);
        }
      );
    }),
  deleteRecipe: (id) =>
    new Promise((resolve, reject) => {
      db.query(`DELETE FROM recipes WHERE id = $1`, [id], (err) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(id);
      });
    }),
};
