const db = require('../config/pg');

module.exports = {
  getAllRecipes: (key, search, sort, sortType, limit, offset) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM recipes WHERE ${key} ILIKE $1 ORDER BY ${sort} ${sortType} LIMIT $2 OFFSET $3`,
        [search, limit, offset],
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
  getRecipeById: (id) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM recipes WHERE id = $1`, [id], (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res);
      });
    }),
  getLatestRecipe: (limit) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM recipes ORDER BY created_at DESC LIMIT $1`,
        [limit],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          console.log(res);
          resolve(res);
        }
      );
    }),
  getRecipeByUser: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.id, recipes.title, recipes.image, recipes.ingredients, recipes.video, users.name 
        FROM recipes INNER JOIN users ON recipes.user_id = users.id WHERE recipes.user_id = $1`,
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
      const { id, title, image, ingredients, video, user_id } = data;
      db.query(
        `INSERT INTO recipes VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, title, image, ingredients, video, user_id],
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
      const { title, image, ingredients, video, user_id, updated_at } = data;
      db.query(
        `UPDATE recipes SET title = $1, image = $2, ingredients = $3, video = $4, user_id = $5, updated_at = $6 WHERE id = $7`,
        [title, image, ingredients, video, user_id, updated_at, id],
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
